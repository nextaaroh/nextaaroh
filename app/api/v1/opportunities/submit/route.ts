import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const { title, organization, description, eligibility, last_date, apply_link, category } = body;

  if (!title || !organization || !last_date || !apply_link || !category) {
    return NextResponse.json({ error: { code: "validation_error", message: "सारी ज़रूरी fields भरें" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("opportunities").insert({
    submitted_by: user.id,
    title,
    organization,
    description: description ?? "",
    eligibility: eligibility ?? "",
    last_date,
    apply_link,
    category,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
