import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const supabase = getSupabaseAdmin();

  // เช็คซ้ำ
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Username นี้ถูกใช้แล้ว" },
      { status: 400 }
    );
  }

  // hash แล้ว insert
  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert({ username, password: hashedPassword })
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ userId: data[0].id }, { status: 201 });
}
