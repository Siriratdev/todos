// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import TaskManager from "@/components/TaskManager";
import CategoryForm from "@/components/CategoryForm";
import CalendarView from "@/components/CalendarView";

type Section = "tasks" | "categories" | "calendar";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>("tasks");
  const router = useRouter();

  // เพิ่ม confirm ก่อน logout
  async function handleLogout() {
    const ok = window.confirm("แน่ใจหรือไม่ว่าต้องการออกจากระบบ?");
    if (!ok) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      router.push("/auth/login");
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <button
          onClick={() => setActiveSection("tasks")}
          className={`mb-4 px-4 py-2 text-left rounded w-full ${
            activeSection === "tasks"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          สิ่งที่ต้องทำ
        </button>

        <button
          onClick={() => setActiveSection("categories")}
          className={`mb-4 px-4 py-2 text-left rounded w-full ${
            activeSection === "categories"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          หมวดหมู่
        </button>

        <button
          onClick={() => setActiveSection("calendar")}
          className={`mb-4 px-4 py-2 text-left rounded w-full ${
            activeSection === "calendar"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          ปฏิทิน
        </button>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded w-full hover:bg-gray-100 text-red-600 text-left"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main content centered */}
      <main className="flex-1 flex justify-center overflow-auto p-6">
        <div className="w-full max-w-4xl">
          {activeSection === "tasks" && (
            <>
              <h1 className="text-2xl font-semibold mb-4">งาน</h1>
              <TaskManager />
            </>
          )}

          {activeSection === "categories" && (
            <>
              <h1 className="text-2xl font-semibold mb-4">หมวดหมู่</h1>
              <CategoryForm />
            </>
          )}

          {activeSection === "calendar" && (
            <>
              <h1 className="text-2xl font-semibold mb-4">ปฏิทิน</h1>
              <CalendarView userId={null} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
