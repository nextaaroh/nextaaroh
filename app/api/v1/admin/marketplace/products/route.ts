import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string) {
  return text.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") + "-" + Date.now().toString(36);
}

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json();
  const { title, description, category, price_paise, cover_image_url, file_url } = body;

  if (!title || !description || !category) {
    return NextResponse.json({ error: { code: "validation_error", message: "Title, description, category ज़रूरी हैं" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("marketplace_products").insert({
    seller_id: user!.id,
    title,
    slug: slugify(title),
    description,
    category,
    price_paise: price_paise ?? 0,
    cover_image_url: cover_image_url ?? null,
    file_url: file_url ?? "pending-upload",
    file_sha256: "admin-post-" + Date.now(),
    originality_declared: true,
    status: "published",
    is_admin_post: true,
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
