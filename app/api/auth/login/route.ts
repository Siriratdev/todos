import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // ดึง user+hash
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

  // ตรวจ bcrypt
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json(
      { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  return NextResponse.json({ userId: user.id });
}
