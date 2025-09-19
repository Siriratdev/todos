import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

function extractTaskId(req: NextRequest) {
  const segments = req.nextUrl.pathname.split("/");
  const id = segments.at(-1);
  if (!id) throw new Error("Missing task ID");
  return id;
}

export async function GET(req: NextRequest) { /* … */ }
export async function PUT(req: NextRequest) { /* … */ }
export async function DELETE(req: NextRequest) { /* … */ }
