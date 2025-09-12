// app/dashboard/tasks/page.tsx
"use client";
import { useEffect, useState } from "react";
import TaskManager from "@/components/TaskManager";

export default function TasksPage() {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(()=> {
    (async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const d = await res.json();
        setUserId(d?.user?.id ?? null);
      }
    })();
  }, []);
  return (
    <div className="container">
      <h1>Tasks</h1>
      <TaskManager userId={userId} />
    </div>
  );
}
