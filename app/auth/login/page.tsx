"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import supabase from "d:/myprojex/todo-list/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/dashboard/tasks");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Login</h2>

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

        <button type="submit" className="btn">Login</button>

        <p className="switch-link">
          ยังไม่มีบัญชี? <Link href="/auth/register">สมัครสมาชิก</Link>
        </p>
      </form>
    </div>
  );
}
