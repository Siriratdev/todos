// components/Layout.tsx
import Link from 'next/link'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <nav style={{ marginBottom: 20 }}>
        <Link href="/auth">Auth</Link> |{' '}
        <Link href="/categories">Categories</Link> |{' '}
        <Link href="/tasks">Tasks</Link>
      </nav>
      {children}
    </div>
  )
}
