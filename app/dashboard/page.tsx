"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import TaskManager from "@/components/TaskManager";
import CategoryForm from "@/components/CategoryForm";
import CalendarView from "@/components/CalendarView";

type Section = "tasks" | "categories" | "calendar";

interface CategoryInfo {
  id: string;
  name: string;
  color: string;
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>("tasks");
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);
  const router = useRouter();

  async function handleLogout() {
    if (!confirm("แน่ใจหรือไม่ว่าต้องการออกจากระบบ?")) return;
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setActiveSection("tasks");
          }}
          className={`mb-4 text-left px-4 py-2 rounded w-full ${
            activeSection === "tasks" && !selectedCategory
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          สิ่งที่ต้องทำ
        </button>
        <button
          onClick={() => setActiveSection("categories")}
          className={`mb-4 text-left px-4 py-2 rounded w-full ${
            activeSection === "categories"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          หมวดหมู่
        </button>
        <button
          onClick={() => setActiveSection("calendar")}
          className={`mb-4 text-left px-4 py-2 rounded w-full ${
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
            className="text-red-600 hover:bg-gray-100 px-4 py-2 rounded w-full text-left"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Tasks */}
        {activeSection === "tasks" && (
          <div className="max-w-4xl mx-auto">
            {selectedCategory ? (
              <h1
                className="text-2xl font-semibold mb-4 p-3 rounded text-white"
                style={{ backgroundColor: selectedCategory.color }}
              >
                งานหมวด: {selectedCategory.name}
              </h1>
            ) : (
              <h1 className="text-2xl font-semibold mb-4">งานทั้งหมด</h1>
            )}

            <TaskManager
              filterCategoryId={selectedCategory?.id}
              defaultCategory={selectedCategory}
            />
          </div>
        )}

        {/* Categories */}
        {activeSection === "categories" && (
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-semibold mb-4">หมวดหมู่</h1>
            <CategoryForm
              onSelect={(id, name, color) => {
                setSelectedCategory({ id, name, color });
                setActiveSection("tasks");
              }}
            />
          </div>
        )}

        {/* Calendar */}
        {activeSection === "calendar" && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">ปฏิทิน</h1>
            <CalendarView />
          </div>
        )}
      </main>
    </div>
  );
}
