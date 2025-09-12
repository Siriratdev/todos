// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { user_id, category_id, title, descript, due_date, status } = await req.json();
    if (!user_id || !title) return NextResponse.json({ error: "user_id and title required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .insert([{ user_id, category_id, title, descript, due_date, status }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  const categoryId = url.searchParams.get("category_id");

  try {
    let q: any = supabaseAdmin.from("tasks").select("*");
    if (userId) q = q.eq("user_id", userId);
    if (categoryId) q = q.eq("category_id", categoryId);
    const { data, error } = await q.order ? await q.order("created_at", { ascending: false }) : await q;
    // if order method not available, just return data
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
