import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const supabase = getSupabaseAdmin();

  // ดึง user + hashed password
  const { data: user, error } = await supabase
    .from("users")
    .select("id, password")
    .eq("username", username)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  // ตรวจสอบ bcrypt
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  return NextResponse.json({ userId: user.id });
}
