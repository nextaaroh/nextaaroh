import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  let classSegment = "graduation_pg";
  if (user) {
    const { data: profile } = await admin.from("profiles").select("class_segment").eq("id", user.id).single();
    if (profile?.class_segment) classSegment = profile.class_segment;
  }

  const { data } = await admin
    .from("daily_learning")
    .select("title, body")
    .eq("class_segment", classSegment)
    .eq("publish_date", today)
    .maybeSingle();

  if (data) {
    return NextResponse.json(data);
  }

  return NextResponse.json({
    title: "आज सीखें: Time Management",
    body: "अपना दिन शुरू करने से पहले, दिन के 3 सबसे ज़रूरी काम लिख लें और उन्हें पहले पूरा करें। यह आदत आपको धीरे-धीरे बहुत आगे ले जाएगी।",
  });
}
