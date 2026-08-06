import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error || !profile) {
    return NextResponse.json({ error: { code: "not_found", message: "Profile नहीं मिली" } }, { status: 404 });
  }

  const { data: certificates } = await supabase.from("profile_certificates").select("*").eq("profile_id", user.id).order("created_at", { ascending: false });
  const { data: projects } = await supabase.from("profile_projects").select("*").eq("profile_id", user.id).order("created_at", { ascending: false });

  return NextResponse.json({ ...profile, certificates: certificates ?? [], projects: projects ?? [] });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const allowedFields = ["bio", "dream", "photo_url", "cover_image_url", "language_code", "profile_public", "skills", "instagram_url", "linkedin_url"];
  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) updates[field] = body[field];
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) {
    return NextResponse.json({ error: { code: "update_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
