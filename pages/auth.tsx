import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg]           = useState('')

  // ใช้ domain คงที่ผูกกับ username เพื่อสร้าง email
  const makeEmail = (u: string) => `${u}@app.local`

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    const email = makeEmail(username)

    // Register
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) setMsg(error.message)
    else {
      setMsg('สมัครเรียบร้อยแล้ว! Login ด้วย username/รหัสผ่านได้เลย')
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    const email = makeEmail(username)

    // Login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMsg(error.message)
    } else {
      setMsg('ล็อกอินสำเร็จ! กำลังไปหน้าหมวดหมู่…')
      router.push('/categories')
    }
  }

  return (
    <Layout>
      <h1>Auth (username only)</h1>
      <form onSubmit={handleRegister} style={{ marginBottom: 12 }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
        />{' '}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{' '}
        <button type="submit">Register</button>
      </form>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
        />{' '}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{' '}
        <button type="submit">Login</button>
      </form>

      {msg && <p>{msg}</p>}
    </Layout>
  )
}
