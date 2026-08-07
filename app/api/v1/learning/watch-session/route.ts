import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false }, { status: 200 });
  }

  const body = await req.json();
  const { video_id, seconds_watched } = body;

  await supabase.from("video_watch_sessions").insert({
    profile_id: user.id,
    video_id: video_id || null,
    seconds_watched: Math.min(seconds_watched ?? 0, 3600),
  });

  return NextResponse.json({ success: true });
}
