"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const body = await res.json();

    if (res.ok && body.userId) {
      localStorage.setItem("userId", body.userId);
      router.push("/dashboard");
    } else {
      alert(body.error || "เข้าสู่ระบบไม่สำเร็จ");
    }
  }

  return (
    <div className="login-container">
      <h1 className="todo-outside">TODO</h1>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <p className="switch-link">
          ยังไม่มีบัญชี? <Link href="/auth/register">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  );
}
