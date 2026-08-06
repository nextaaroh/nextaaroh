import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(text: string) {
  return text.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") + "-" + Date.now().toString(36);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, category, price_paise, originality_declared, file_path } = body;

  if (!title || !description || !category || !originality_declared || !file_path) {
    return NextResponse.json({ error: { code: "validation_error", message: "सारी ज़रूरी fields भरें" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("marketplace_products").insert({
    seller_id: user.id,
    title,
    slug: slugify(title),
    description,
    category,
    price_paise: price_paise ?? 0,
    file_url: file_path,
    file_sha256: "sha-pending-" + Date.now(),
    originality_declared: true,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
