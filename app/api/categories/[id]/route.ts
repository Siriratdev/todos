// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

async function extractId(req: NextRequest) {
  // req.nextUrl.pathname เช่น "/api/categories/123"
  const segments = req.nextUrl.pathname.split("/");
  const id = segments.at(-1);
  if (!id) throw new Error("Missing category ID");
  return id;
}

export async function GET(req: NextRequest) {
  try {
    const id = await extractId(req);

    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = await extractId(req);
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = await extractId(req);

    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Deleted" }
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}