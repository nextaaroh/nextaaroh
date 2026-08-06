import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, project_url } = body;
  if (!title) {
    return NextResponse.json({ error: { code: "validation_error", message: "Title ज़रूरी है" } }, { status: 400 });
  }

  const { error } = await supabase.from("profile_projects").insert({
    profile_id: user.id,
    title,
    description: description || null,
    project_url: project_url || null,
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
