import { NextRequest, NextResponse } from "next/server";
import { requireEducator } from "@/lib/auth/requireEducator";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized, userId } = await requireEducator();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Educator access ज़रूरी है" } }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data } = await admin.from("meetings").select("id, title, description, scheduled_at, cover_image_url").eq("created_by", userId).order("scheduled_at", { ascending: false }).limit(20);
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { authorized, userId } = await requireEducator();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Educator access ज़रूरी है" } }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, scheduled_at, cover_image_url } = body;
  if (!title || !scheduled_at) {
    return NextResponse.json({ error: { code: "validation_error", message: "Title और date/time ज़रूरी है" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("meetings").insert({ title, description: description ?? null, scheduled_at, cover_image_url: cover_image_url ?? null, created_by: userId });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
