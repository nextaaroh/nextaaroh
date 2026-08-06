import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: product } = await admin.from("marketplace_products").select("file_url, seller_id, status").eq("id", id).single();

  if (!product) {
    return NextResponse.json({ error: { code: "not_found", message: "Product नहीं मिला" } }, { status: 404 });
  }

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  const isOwner = product.seller_id === user.id;
  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin" || profile?.role === "moderator";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: { code: "forbidden", message: "Access नहीं है" } }, { status: 403 });
  }

  const { data: signedUrlData, error } = await admin.storage.from("marketplace-files").createSignedUrl(product.file_url, 300);

  if (error || !signedUrlData) {
    return NextResponse.json({ error: { code: "signing_failed", message: error?.message ?? "Download link नहीं बन पाया" } }, { status: 400 });
  }

  return NextResponse.json({ download_url: signedUrlData.signedUrl });
}
