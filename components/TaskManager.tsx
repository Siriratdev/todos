// components/TaskManager.tsx
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function TaskManager() {
  // ฟอร์มสร้างงานใหม่
  const [title, setTitle] = useState("");
  const [descript, setDescript] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // data
  const [categories, setCategories] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // track task ที่กำลังแก้ไข
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    descript: "",
    due_date: "",
    category_id: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [{ data: cats }, { data: ts }] = await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("tasks").select("*").order("due_date", { ascending: true }),
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
    if (!confirm("Delete task?")) return;
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
    <div className="card">
      {/* ฟอร์มสร้างงานใหม่ */}
      <h3>Create Task</h3>
      <form onSubmit={createTask} className="flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="p-2 border"
          required
        />
        <textarea
          value={descript}
          onChange={(e) => setDescript(e.target.value)}
          placeholder="Description"
          className="p-2 border"
        />
        <div className="flex gap-2">
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value || null)}
            className="p-2 border"
          >
            <option value="">No category</option>
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
            className="p-2 border"
          />
          <button className="bg-green-600 text-white p-2 rounded">Add</button>
        </div>
      </form>

      {/* รายการงาน */}
      <h4 className="mt-3">Tasks</h4>
      <ul className="list-none p-0">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex flex-col border-b border-gray-200 p-2"
          >
            {editingId === t.id ? (
              // 🔹 ฟอร์มแก้ไข (แยกออกจากฟอร์ม create)
              <div className="flex flex-col gap-2">
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="p-1 border"
                />
                <textarea
                  value={editForm.descript}
                  onChange={(e) =>
                    setEditForm({ ...editForm, descript: e.target.value })
                  }
                  className="p-1 border"
                />
                <div className="flex gap-2">
                  <select
                    value={editForm.category_id ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category_id: e.target.value })
                    }
                    className="p-1 border"
                  >
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={editForm.due_date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, due_date: e.target.value })
                    }
                    className="p-1 border"
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // 🔹 โหมดแสดงปกติ
              <div className="flex justify-between items-center">
                <div>
                  <div
                    className={`font-semibold ${
                      t.status ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {t.title}
                  </div>
                  <div className="text-xs text-gray-700">{t.descript}</div>
                  <div className="text-xs text-gray-500">
                    Due: {t.due_date || "-"}{" "}
                    {t.category_id
                      ? `• ${
                          categories.find((c) => c.id === t.category_id)?.name
                        }`
                      : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(t.id, t.status)}>
                    {t.status ? "Undo" : "Done"}
                  </button>
                  <button onClick={() => startEdit(t)}>Edit</button>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="text-red-500"
                  >
                    Delete
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
