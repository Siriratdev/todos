// app/api/categories/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

interface CategoryPayload {
  user_id: string
  name: string
  color?: string | null
}

export async function POST(req: Request) {
  try {
    const { user_id, name, color } = (await req.json()) as CategoryPayload
    if (!user_id || !name) {
      return NextResponse.json(
        { error: 'user_id and name required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([{ user_id, name, color }])
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

    let query = supabaseAdmin.from('categories').select('*')
    if (userId) query = query.eq('user_id', userId)

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
