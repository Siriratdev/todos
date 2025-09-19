// components/CategoryForm.tsx
'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryFormProps {
  userId: string;
  onSelect?: (id: string, name: string, color: string) => void;
}

export default function CategoryForm({ userId, onSelect }: CategoryFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#0ea5e9');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#0ea5e9');

  useEffect(() => {
    if (!userId) return;
    fetchCategories();
  }, [userId]);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, color')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) {
      console.error('fetchCategories:', error);
      return;
    }
    setCategories(data || []);
  }

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const { error } = await supabase
      .from('categories')
      .insert({ name: name.trim(), color, user_id: userId });

    if (error) {
      console.error('createCategory:', error);
      return;
    }

    setName('');
    setColor('#0ea5e9');
    fetchCategories();
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return;

    const { error } = await supabase
      .from('categories')
      .update({ name: editName.trim(), color: editColor })
      .eq('id', editingId)
      .eq('user_id', userId);

    if (error) {
      console.error('saveEdit:', error);
      return;
    }

    setEditingId(null);
    fetchCategories();
  }

  async function removeCategory(id: string) {
    if (!confirm('ลบหมวดนี้?')) return;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('removeCategory:', error);
      return;
    }

    fetchCategories();
  }

  return (
    <div className="card p-6 bg-white rounded-lg shadow max-w-lg mx-auto">
      <h3 className="text-lg font-semibold mb-4">หมวดหมู่</h3>

      {editingId ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveEdit();
          }}
          className="flex gap-2 mb-6"
        >
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="ชื่อหมวดหมู่"
            required
          />
          <input
            type="color"
            value={editColor}
            onChange={(e) => setEditColor(e.target.value)}
            className="w-10 h-10 p-0 border-0 rounded"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            บันทึก
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            ยกเลิก
          </button>
        </form>
      ) : (
        <form onSubmit={createCategory} className="flex gap-2 mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-2 border rounded"
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
      )}

      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between p-3 rounded cursor-pointer"
            style={{ backgroundColor: c.color }}
            onClick={() => onSelect?.(c.id, c.name, c.color)}
          >
            <span className="text-white font-medium">{c.name}</span>
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
          </li>
        ))}
      </ul>
    </div>
);
}
