import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

interface CategoryPayload {
  user_id: string;
}

export async function POST(req: Request) {
  const payload: CategoryPayload = await req.json();

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert([{ user_id: payload.user_id }])
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
