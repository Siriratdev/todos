import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

interface TaskPayload {
  user_id: string;
  title: string;
}

export async function POST(req: Request) {
  const payload: TaskPayload = await req.json();

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .insert([payload])
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
