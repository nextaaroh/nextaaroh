import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function randomCode() {
  return Math.random().toString(36).slice(2, 8);
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }
  const admin = createAdminClient();
  const { data: links } = await admin.from("creator_links").select("*, books(title, commission_percent)").eq("user_id", user.id).order("created_at", { ascending: false });

  const linksWithSignups = await Promise.all(
    (links ?? []).map(async (link) => {
      if (link.link_type === "book" && link.book_id) {
        const { count } = await admin
          .from("book_orders")
          .select("*", { count: "exact", head: true })
          .eq("referred_by", user.id)
          .eq("book_id", link.book_id);
        return { ...link, signup_count: count ?? 0 };
      }
      const { count } = await admin.from("creator_signups").select("*", { count: "exact", head: true }).eq("creator_link_id", link.id);
      return { ...link, signup_count: count ?? 0 };
    })
  );

  return NextResponse.json({ data: linksWithSignups });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("is_approved_creator, username").eq("id", user.id).single();
  if (!profile?.is_approved_creator) {
    return NextResponse.json({ error: { code: "forbidden", message: "आप approved creator नहीं हैं" } }, { status: 403 });
  }

  const body = await req.json();
  const { video_label, link_type, book_id } = body;

  if (link_type === "book" && !book_id) {
    return NextResponse.json({ error: { code: "validation_error", message: "Book चुनना ज़रूरी है" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const refCode = `${(profile.username ?? "user").slice(0, 8)}-${randomCode()}`;

  const { data, error } = await admin
    .from("creator_links")
    .insert({ user_id: user.id, video_label: video_label ?? null, ref_code: refCode, click_count: 0, link_type: link_type ?? "signup", book_id: link_type === "book" ? book_id : null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ data });
}
