// app/dashboard/calendar/page.tsx
"use client";
import { useEffect, useState } from "react";
import CalendarView from "@/components/CalendarView";

export default function CalendarPage() {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(()=> {
    (async () => {
      const res = await fetch("/api/dashboard/calendar");
      if (res.ok) {
        const d = await res.json();
        setUserId(d?.user?.id ?? null);
      }
    })();
  }, []);
  return (
    <div className="container">
      <h1>Calendar</h1>
      <CalendarView userId={userId} />
    </div>
  );
}
