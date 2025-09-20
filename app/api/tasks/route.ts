// app/api/tasks/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

interface TaskPayload {
  user_id: string
  category_id?: string | null
  title: string
  descript?: string | null
  due_date?: string | null
  status?: string | null
}

export async function POST(req: Request) {
  try {
    const {
      user_id,
      category_id,
      title,
      descript,
      due_date,
      status,
    } = (await req.json()) as TaskPayload

    if (!user_id || !title) {
      return NextResponse.json(
        { error: 'user_id and title required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert([
        { user_id, category_id, title, descript, due_date, status },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('user_id')
    const categoryId = url.searchParams.get('category_id')

    let query = supabaseAdmin.from('tasks').select('*')
    if (userId) query = query.eq('user_id', userId)
    if (categoryId) query = query.eq('category_id', categoryId)

    const { data, error } = await query.order('created_at', {
      ascending: false,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
