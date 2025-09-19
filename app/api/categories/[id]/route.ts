import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

function extractId(req: NextRequest) {
  const segments = req.nextUrl.pathname.split("/");
  const id = segments.at(-1);
  if (!id) throw new Error("Missing category ID");
  return id;
}

export async function GET(req: NextRequest) {
  const id = extractId(req);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) { /* … */ }
export async function DELETE(req: NextRequest) { /* … */ }
