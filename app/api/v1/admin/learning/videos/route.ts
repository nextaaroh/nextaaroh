import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data } = await admin.from("learning_videos").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { authorized, profile } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const body = await req.json();
  const { title, youtube_url, category } = body;

  const videoId = extractYoutubeId(youtube_url ?? "");
  if (!title || !videoId) {
    return NextResponse.json({ error: { code: "validation_error", message: "सही title और YouTube link डालें" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("learning_videos").insert({
    title,
    youtube_url,
    youtube_video_id: videoId,
    thumbnail_url: "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg",
    category: category || null,
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
