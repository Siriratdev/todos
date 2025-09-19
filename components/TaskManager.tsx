'use client'

import { useEffect, useState, useCallback } from 'react'
import supabase from '../lib/supabaseClient'

interface Category {
  id: string
  name: string
}

interface TaskItem {
  id: string
  title: string
  descript: string
  due_date: string | null
  status: boolean
  category_id: string | null
}

interface TaskManagerProps {
  userId: string
  filterCategoryId?: string | null
  defaultCategory?: { id: string; name: string; color: string } | null
}

export default function TaskManager({
  userId,
  filterCategoryId,
  defaultCategory,
}: TaskManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [tasks, setTasks] = useState<TaskItem[]>([])

  const [title, setTitle] = useState('')
  const [descript, setDescript] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(
    defaultCategory?.id || null
  )

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    descript: '',
    due_date: '',
    category_id: '',
  })

  // ห่อ fetchAll ด้วย useCallback แล้วใส่ userId, filterCategoryId, defaultCategory
  const fetchAll = useCallback(async () => {
    // ดึง categories
    const { data: cats, error: catErr } = await supabase
      .from('categories')
      .select('id,name')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (catErr) {
      console.error('fetchCategories error:', catErr)
    } else {
      setCategories(cats ?? [])
    }

    // ดึง tasks
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true })

    if (filterCategoryId) {
      query = query.eq('category_id', filterCategoryId)
    }

    const { data: ts, error: taskErr } = await query
    if (taskErr) {
      console.error('fetchTasks error:', taskErr)
    } else {
      setTasks(ts ?? [])
    }

    // เซ็ต default category
    setCategoryId(defaultCategory?.id || null)
  }, [userId, filterCategoryId, defaultCategory])

  // เรียก fetchAll เมื่อ userId หรือ filterCategoryId หรือ defaultCategory เปลี่ยน
  useEffect(() => {
    if (!userId) return
    fetchAll()
  }, [userId, filterCategoryId, defaultCategory, fetchAll])

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const { error } = await supabase.from('tasks').insert({
      title,
      descript,
      due_date: dueDate || null,
      category_id: categoryId,
      status: false,
      user_id: userId,
    })

    if (error) {
      console.error('createTask error:', error)
      return
    }

    setTitle('')
    setDescript('')
    setDueDate('')
    setCategoryId(defaultCategory?.id || null)
    fetchAll()
  }

  async function toggleStatus(id: string, current: boolean) {
    await supabase
      .from('tasks')
      .update({ status: !current })
      .eq('id', id)
      .eq('user_id', userId)
    fetchAll()
  }

  async function removeTask(id: string) {
    if (!confirm('ลบงานนี้?')) return
    await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    fetchAll()
  }

  function startEdit(task: TaskItem) {
    setEditingId(task.id)
    setEditForm({
      title: task.title,
      descript: task.descript,
      due_date: task.due_date ?? '',
      category_id: task.category_id ?? '',
    })
  }

  async function saveEdit(id: string) {
    await supabase
      .from('tasks')
      .update({
        title: editForm.title,
        descript: editForm.descript,
        due_date: editForm.due_date || null,
        category_id: editForm.category_id || null,
      })
      .eq('id', id)
      .eq('user_id', userId)

    setEditingId(null)
    fetchAll()
  }

  return (
    <div className="card p-6 bg-white rounded-lg shadow max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">เพิ่มรายการ TODO</h3>
      <form onSubmit={createTask} className="space-y-4">
        <input
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
            value={categoryId || ''}
            onChange={(e) =>
              setCategoryId(e.target.value || null)
            }
            className="flex-1 p-2 border rounded"
          >
            <option value="">
              {defaultCategory
                ? `หมวด: ${defaultCategory.name}`
                : 'เลือกหมวดหมู่'}
            </option>
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
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            เพิ่ม
          </button>
        </div>
      </form>

      <h4 className="mt-8 mb-3 text-lg font-semibold">
        รายการสิ่งต้องทำ
      </h4>
      <ul className="divide-y divide-gray-200">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="py-3 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            {editingId === t.id ? (
              // Edit Form
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
                <div className="flex flex-wrap gap-2">
                  <select
                    value={editForm.category_id}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        category_id: e.target.value,
                      })
                    }
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
                    value={editForm.due_date}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        due_date: e.target.value,
                      })
                    }
                    className="p-2 border rounded"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <div
                    className={`font-semibold ${
                      t.status ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {t.title}
                  </div>
                  <div className="text-sm text-gray-700">
                    {t.descript}
                  </div>
                  <div className="text-xs text-gray-500">
                    กำหนด: {t.due_date || '-'}{' '}
                    {t.category_id &&
                      `• ${
                        categories.find((c) => c.id === t.category_id)
                          ?.name
                      }`}
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() => toggleStatus(t.id, t.status)}
                    className={`px-3 py-1 rounded-full text-white ${
                      t.status
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {t.status ? 'ยังไม่เสร็จ' : 'สำเร็จ'}
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
  )
}
