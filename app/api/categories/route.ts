// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { user_id, name, color } = await req.json();
    if (!user_id || !name) return NextResponse.json({ error: "user_id and name required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([{ user_id, name, color }])
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
  try {
    let q = supabaseAdmin.from("categories").select("*");
    if (userId) q = q.eq("user_id", userId);
    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
