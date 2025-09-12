// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) return NextResponse.json({ error: "username/password required" }, { status: 400 });

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // NOTE: This demo does not issue JWT session. Return user object for UI.
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
