import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: [] });
  }

  const admin = createAdminClient();
  const { data: sessions } = await admin
    .from("video_watch_sessions")
    .select("video_id, created_at")
    .eq("profile_id", user.id)
    .not("video_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(20);

  const uniqueVideoIds: string[] = [];
  for (const session of sessions ?? []) {
    if (session.video_id && !uniqueVideoIds.includes(session.video_id)) {
      uniqueVideoIds.push(session.video_id);
    }
    if (uniqueVideoIds.length >= 5) break;
  }

  if (uniqueVideoIds.length === 0) {
    return NextResponse.json({ data: [] });
  }

  const { data: videos } = await admin.from("learning_videos").select("id, title, thumbnail_url").in("id", uniqueVideoIds);

  const ordered = uniqueVideoIds.map((id) => videos?.find((v) => v.id === id)).filter(Boolean);

  return NextResponse.json({ data: ordered });
}
