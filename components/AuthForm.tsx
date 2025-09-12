// components/AuthForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
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
        setMsg(data.error || "Error");
      } else {
        setMsg(mode === "register" ? "Registered! Redirecting to login..." : "Login success!");
        if (mode === "register") {
          setTimeout(() => router.push("/auth/login"), 900);
        } else {
          // login success: redirect to categories
          setTimeout(() => router.push("/dashboard/categories"), 400);
        }
      }
    } catch (err: any) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "16px auto" }}>
      <h2 style={{ textAlign: "center" }}>{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={submit} className="flex flex-col" style={{ gap: 8 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 border"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="p-2 border"
          required
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded" disabled={loading}>
            {loading ? "..." : mode === "login" ? "Login" : "Register"}
          </button>
        </div>
      </form>
      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
    </div>
  );
}
