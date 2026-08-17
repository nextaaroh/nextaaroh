import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { ref } = await req.json();
  if (!ref) {
    return NextResponse.json({ error: { code: "validation_error", message: "ref ज़रूरी है" } }, { status: 400 });
  }
  const admin = createAdminClient();
  const { data: link } = await admin.from("creator_links").select("id, click_count").eq("ref_code", ref).single();
  if (link) {
    await admin.from("creator_links").update({ click_count: (link.click_count ?? 0) + 1 }).eq("id", link.id);
  }
  return NextResponse.json({ success: true });
}
