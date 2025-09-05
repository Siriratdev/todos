// pages/categories.tsx
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

type Category = {
  id: string
  name: string
  created_at: string
}

export default function CategoriesPage() {
  const router = useRouter()
  const [user, setUser]         = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName]   = useState('')
  const [msg, setMsg]           = useState('')

  // โหลด session + categories
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session
      if (!s) return router.push('/auth')
      setUser(s.user)
      fetchCategories(s.user.id)
    })
  }, [])

  const fetchCategories = async (userId: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) setMsg(error.message)
    else setCategories(data)
  }

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newName, user_id: user.id }])
    if (error) setMsg(error.message)
    else {
      setNewName('')
      fetchCategories(user.id)
    }
  }

  const handleUpdate = async (id: string) => {
    const name = prompt('New name:')
    if (!name || !user) return
    const { error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) setMsg(error.message)
    else fetchCategories(user.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?') || !user) return
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) setMsg(error.message)
    else fetchCategories(user.id)
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <form onSubmit={handleCreate} style={{ marginBottom: 12 }}>
        <input
          placeholder="New category"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />{' '}
        <button type="submit">Create</button>{' '}
        <button type="button" onClick={() => user && fetchCategories(user.id)}>
          Refresh
        </button>
      </form>

      {msg && <p>{msg}</p>}

      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {c.name}{' '}
            <button onClick={() => handleUpdate(c.id)}>Edit</button>{' '}
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
