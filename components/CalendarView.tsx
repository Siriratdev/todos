// components/CalendarView.tsx
"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import supabase from "../lib/supabaseClient";

interface Task {
  id: string;
  title: string;
  descript: string;
  due_date: string | null;
  status: boolean;
}

export default function CalendarView() {
  // วันปัจจุบันบนปฏิทิน
  const [date, setDate] = useState<Date>(new Date());
  // งานที่กำหนดในวันนั้น
  const [tasks, setTasks] = useState<Task[]>([]);

  // ดึงงานใหม่ทุกครั้งที่เราเปลี่ยน date
  useEffect(() => {
    const key = date.toISOString().slice(0, 10); // yyyy-mm-dd
    supabase
      .from("tasks")
      .select("id, title, descript, due_date, status")
      .eq("due_date", key)
      .order("due_date", { ascending: true })
      .then(({ data }) => {
        setTasks(data ?? []);
      });
  }, [date]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* ปฏิทิน */}
      <Calendar
        className="shadow-lg rounded-lg"
        value={date}
        onChange={(d) => setDate(new Date(d as Date))}
      />

      {/* รายการงานบนวันที่เลือก */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow max-h-[520px] overflow-auto">
        <h4 className="text-lg font-semibold mb-4">
          งานวันที่ {date.toISOString().slice(0, 10)}
        </h4>

        <ul className="divide-y divide-gray-200">
          {tasks.length === 0 && (
            <li className="py-2 text-gray-500">ไม่มีงานในวันนี้</li>
          )}
          {tasks.map((t) => (
            <li key={t.id} className="py-2">
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-gray-700">{t.descript}</div>
              <div className="text-xs text-gray-500">
                สถานะ: {t.status ? "เสร็จแล้ว" : "รอดำเนินการ"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
