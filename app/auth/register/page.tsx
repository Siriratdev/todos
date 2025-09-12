"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/auth/login");
    } else {
      alert("Register failed");
    }
  };


  return (
    <div className="login-container">
      <h1 className="todo-outside">TODO</h1>
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Register</h2>

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn">Signup</button>

        <p className="switch-link">
          มีบัญชีเรียบร้อย? <Link href="/auth/login">เข้าสู่ระบบ</Link>
        </p>
      </form>
    </div>
  );
}
