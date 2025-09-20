import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const segments = req.nextUrl.pathname.split("/");
  const id = segments.at(-1);
  if (!id) {
    return NextResponse.json(
      { error: "Missing category ID" },
      { status: 400 }
    );
  }

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
}

export async function PUT(req: NextRequest) {
  const segments = req.nextUrl.pathname.split("/");
  const id = segments.at(-1)!;
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("categories")
    .update(body)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const segments = req.nextUrl.pathname.split("/");
  const id = segments.at(-1)!;

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

  return NextResponse.json({ message: "Deleted" });
}
