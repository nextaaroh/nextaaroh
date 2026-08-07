import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false }, { status: 200 });
  }

  const body = await req.json();
  const { content_type, content_id } = body;
  if (!content_type || !content_id) {
    return NextResponse.json({ success: false }, { status: 200 });
  }

  await supabase.from("apply_clicks").insert({ profile_id: user.id, content_type, content_id: String(content_id) });
  return NextResponse.json({ success: true });
}
