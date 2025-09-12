// components/CategoryForm.tsx
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

interface Category {
  id: string;
  name: string;
  color: string; // hex, e.g. "#0ea5e9"
}

export default function CategoryForm({
  onSelect,
}: {
  onSelect?: (id: string, name: string) => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0ea5e9");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#0ea5e9");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id,name,color")
      .order("name", { ascending: true });
    setCategories(data ?? []);
  }

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await supabase.from("categories").insert({ name: name.trim(), color });
    setName("");
    setColor("#0ea5e9");
    fetchCategories();
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    await supabase
      .from("categories")
      .update({ name: editName.trim(), color: editColor })
      .eq("id", id);
    setEditingId(null);
    fetchCategories();
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function removeCategory(id: string) {
    if (!confirm("แน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?")) return;
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  }

  return (
    <div className="card p-6 bg-white rounded-lg shadow max-w-lg mx-auto">
      <h3 className="text-lg font-semibold mb-4">หมวดหมู่</h3>

      {/* Create form */}
      <form onSubmit={createCategory} className="flex gap-2 mb-6">
        <input
          className="flex-1 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อหมวดหมู่"
          required
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 p-0 border-0 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          เพิ่ม
        </button>
      </form>

      {/* Category list */}
      <ul className="space-y-2">
        {categories.map((c) => {
          const isEditing = editingId === c.id;
          return (
            <li
              key={c.id}
              className="flex items-center justify-between p-3 rounded cursor-pointer"
              style={{
                backgroundColor: c.color, 
              }}
              onClick={() => !isEditing && onSelect?.(c.id, c.name)}
            >
              {isEditing ? (
                // Edit mode
                <div className="flex-1 flex items-center gap-2">
                  <input
                    className="flex-1 p-2 border rounded bg-white"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-10 h-10 p-0 border-0 rounded"
                  />
                  <button
                    onClick={() => saveEdit(c.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    ยกเลิก
                  </button>
                </div>
              ) : (
                // View mode
                <div className="flex-1 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full" />
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(c);
                      }}
                      className="underline text-white text-sm"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCategory(c.id);
                      }}
                      className="underline text-white text-sm"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}