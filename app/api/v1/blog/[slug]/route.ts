import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: post, error } = await admin
    .from("blog_posts")
    .select("title, body, cover_image_url, category")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    return NextResponse.json({ error: { code: "not_found", message: "Post नहीं मिला" } }, { status: 404 });
  }

  const { data: comments } = await admin
    .from("blog_comments")
    .select("id, body, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return NextResponse.json({ ...post, comments: comments ?? [] });
}
