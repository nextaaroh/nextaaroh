import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("book_orders")
    .select("*, books(title, cover_image_url)")
    .eq("buyer_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: { code: "fetch_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ data });
}
