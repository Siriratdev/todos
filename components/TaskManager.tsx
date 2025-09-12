// components/TaskManager.tsx
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function TaskManager({
  filterCategoryId,
}: {
  filterCategoryId?: string | null;
}) {
  const [title, setTitle] = useState("");
  const [descript, setDescript] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    descript: "",
    due_date: "",
    category_id: "",
  });

  // refetch ทุกครั้งที่หมวดเปลี่ยน
  useEffect(() => {
    fetchAll();
  }, [filterCategoryId]);

  async function fetchAll() {
    // เตรียม query
    let query = supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true });

    // ถ้ามี filterCategoryId ให้ .eq("category_id", filterCategoryId)
    if (filterCategoryId) {
      query = query.eq("category_id", filterCategoryId);
    }

    const [{ data: cats }, { data: ts }] = await Promise.all([
      supabase.from("categories").select("*"),
      query,
    ]);
    setCategories(cats ?? []);
    setTasks(ts ?? []);
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("tasks").insert({
      category_id: categoryId,
      title,
      descript,
      due_date: dueDate || null,
      status: false,
    });
    setTitle("");
    setDescript("");
    setDueDate("");
    setCategoryId(null);
    fetchAll();
  }

  async function toggleStatus(id: string, current: boolean) {
    await supabase.from("tasks").update({ status: !current }).eq("id", id);
    fetchAll();
  }

  async function removeTask(id: string) {
    if (!confirm("แน่ใจหรือไม่ว่าต้องการลบงานนี้?")) return;
    await supabase.from("tasks").delete().eq("id", id);
    fetchAll();
  }

  function startEdit(task: any) {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      descript: task.descript,
      due_date: task.due_date || "",
      category_id: task.category_id || "",
    });
  }

  async function saveEdit(id: string) {
    await supabase
      .from("tasks")
      .update({
        title: editForm.title,
        descript: editForm.descript,
        due_date: editForm.due_date || null,
        category_id: editForm.category_id || null,
      })
      .eq("id", id);
    setEditingId(null);
    fetchAll();
  }

  return (
    <div className="card p-6 bg-white rounded-lg shadow max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">เพิ่มรายการ TODO</h3>
      <form onSubmit={createTask} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ชื่อเรื่อง"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={descript}
          onChange={(e) => setDescript(e.target.value)}
          placeholder="รายละเอียด"
          className="w-full p-2 border rounded"
          rows={3}
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value || null)}
            className="flex-1 p-2 border rounded"
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border rounded"
          />
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            เพิ่มด่วน
          </button>
        </div>
      </form>

      <h4 className="mt-8 mb-3 text-lg font-semibold">รายการสิ่งต้องทำ</h4>
      <ul className="divide-y divide-gray-200">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="py-3 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            {editingId === t.id ? (
              <div className="w-full flex flex-col gap-4">
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <textarea
                  value={editForm.descript}
                  onChange={(e) =>
                    setEditForm({ ...editForm, descript: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <div
                    className={`font-semibold ${
                      t.status ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {t.title}
                  </div>
                  <div className="text-sm text-gray-700">{t.descript}</div>
                  <div className="text-xs text-gray-500">
                    กำหนด: {t.due_date || "-"}{" "}
                    {t.category_id &&
                      `• ${
                        categories.find((c) => c.id === t.category_id)?.name
                      }`}
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() => toggleStatus(t.id, t.status)}
                    className={`px-3 py-1 rounded-full text-white ${
                      t.status
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {t.status ? "ยังไม่เสร็จ" : "สำเร็จ"}
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    className="px-3 py-1 rounded text-blue-600 hover:bg-blue-50"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="px-3 py-1 rounded text-red-600 hover:bg-red-50"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
