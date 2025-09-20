import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // ตรวจว่าซ้ำไหม
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

  // hash + insert
  const hashed = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert({ username, password: hashed })
    .select("id");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { userId: data![0].id },
    { status: 201 }
  );
}
