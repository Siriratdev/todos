// pages/tasks.tsx
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

type Category = { id: string; name: string }
type Task = {
  id: string
  title: string
  description: string
  category_id: string
  created_at: string
}

export default function TasksPage() {
  const router = useRouter()
  const [user, setUser]         = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tasks, setTasks]       = useState<Task[]>([])
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [catId, setCatId]       = useState('')
  const [msg, setMsg]           = useState('')

  // โหลด session + data
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session
      if (!s) return router.push('/auth')
      setUser(s.user)
      fetchData(s.user.id)
    })
  }, [])

  const fetchData = async (userId: string) => {
    const [cRes, tRes] = await Promise.all([
      supabase
        .from('categories')
        .select('id,name')
        .eq('user_id', userId),
      supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    ])
    setCategories(cRes.data || [])
    setTasks(tRes.data || [])
  }

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    const { error } = await supabase
      .from('tasks')
      .insert([{ title, description: desc, category_id: catId, user_id: user.id }])
    if (error) setMsg(error.message)
    else {
      setTitle(''); setDesc(''); setCatId('')
      fetchData(user.id)
    }
  }

  const handleUpdate = async (id: string) => {
    const newTitle = prompt('New title:')
    const newDesc  = prompt('New description:')
    if (!newTitle || !newDesc || !user) return
    const { error } = await supabase
      .from('tasks')
      .update({ title: newTitle, description: newDesc })
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) setMsg(error.message)
    else fetchData(user.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?') || !user) return
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) setMsg(error.message)
    else fetchData(user.id)
  }

  return (
    <Layout>
      <h1>Tasks</h1>
      <form onSubmit={handleCreate} style={{ marginBottom: 12 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />{' '}
        <input
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />{' '}
        <select value={catId} onChange={e => setCatId(e.target.value)}>
          <option value="">Choose category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>{' '}
        <button type="submit">Create</button>{' '}
        <button type="button" onClick={() => user && fetchData(user.id)}>
          Refresh
        </button>
      </form>

      {msg && <p>{msg}</p>}

      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <strong>{t.title}</strong> – {t.description} (Cat: {t.category_id}){' '}
            <button onClick={() => handleUpdate(t.id)}>Edit</button>{' '}
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
