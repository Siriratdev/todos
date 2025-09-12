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

function toLocalYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarView({
  filterCategoryId,
}: {
  filterCategoryId?: string | null;
}) {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const key = toLocalYMD(date);
    let query = supabase
      .from("tasks")
      .select("id, title, descript, due_date, status")
      .eq("due_date", key)
      .order("due_date", { ascending: true });

    if (filterCategoryId) {
      query = query.eq("category_id", filterCategoryId);
    }

    query.then(({ data }) => {
      setTasks(data ?? []);
    });
  }, [date, filterCategoryId]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendar picker */}
      <Calendar
        className="shadow-lg rounded-lg"
        value={date}
        onChange={(d) => {
          const picked = Array.isArray(d) ? d[0] : d;
          setDate(
            new Date(
              picked.getFullYear(),
              picked.getMonth(),
              picked.getDate()
            )
          );
        }}
      />

      {/* Task list */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow max-h-[520px] overflow-auto">
        <h4 className="text-lg font-semibold mb-4">
          งานวันที่ {toLocalYMD(date)}
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
                สถานะ: {t.status ? "เสร็จสิ้น" : "รอดำเนินการ"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
