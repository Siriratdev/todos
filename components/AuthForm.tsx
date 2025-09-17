"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "เกิดข้อผิดพลาด");
      } else {
        if (mode === "register") {
          setMsg("สมัครสมาชิกสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ...");
          setTimeout(() => router.push("/auth/login"), 1000);
        } else {
          // login สำเร็จ: เก็บ userId แล้วไป Dashboard
          if (data.userId) {
            localStorage.setItem("userId", data.userId);
          }
          setMsg("เข้าสู่ระบบสำเร็จ! กำลังไปหน้า Dashboard...");
          setTimeout(() => router.push("/dashboard"), 500);
        }
      }
    } catch (err) {
      setMsg("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
      </h2>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 border rounded"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading
            ? "กำลังดำเนินการ..."
            : mode === "login"
            ? "เข้าสู่ระบบ"
            : "สมัครสมาชิก"}
        </button>
      </form>
      {msg && <p className="mt-4 text-center text-sm">{msg}</p>}
    </div>
  );
}
