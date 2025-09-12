// components/CalendarView.tsx
"use client";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView({ userId }: { userId: string | null }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(()=> {
    if (!userId) return;
    (async () => {
      const res = await fetch(`/api/tasks?user_id=${userId}`);
      const data = await res.json();
      setTasks(data || []);
    })();
  }, [userId]);

  const tasksFor = (d: Date) => {
    const key = d.toISOString().slice(0,10);
    return tasks.filter(t => t.due_date === key);
  };

  return (
    <div className="card" style={{ display: "flex", gap: 16 }}>
      <Calendar value={date} onChange={d => setDate(new Date(d as Date))} />
      <div style={{ flex: 1 }}>
        <h4>Tasks on {date.toISOString().slice(0,10)}</h4>
        <ul>
          {tasksFor(date).length === 0 && <li>No tasks</li>}
          {tasksFor(date).map(t => (
            <li key={t.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              <div style={{ fontSize: 12 }}>{t.descript}</div>
              <div style={{ fontSize: 12 }}>{t.status ? "Done" : "Pending"}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
