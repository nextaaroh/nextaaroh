import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function calculateSlab(usersCount: number): number {
  if (usersCount >= 100) return 59900;
  if (usersCount >= 50) return 40000;
  if (usersCount >= 40) return 35000;
  if (usersCount >= 20) return 20000;
  return 0;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const { link_id } = await req.json();
  const admin = createAdminClient();

  const { data: link } = await admin.from("creator_links").select("*").eq("id", link_id).eq("user_id", user.id).single();
  if (!link) {
    return NextResponse.json({ error: { code: "not_found", message: "Link नहीं मिला" } }, { status: 404 });
  }

  const { count } = await admin.from("creator_signups").select("*", { count: "exact", head: true }).eq("creator_link_id", link_id);
  const usersCount = count ?? 0;
  const amountPaise = calculateSlab(usersCount);

  if (amountPaise === 0) {
    return NextResponse.json({ error: { code: "not_eligible", message: "कम से कम 20 signups चाहिए payout के लिए" } }, { status: 400 });
  }

  const { error } = await admin.from("creator_payouts").insert({
    creator_link_id: link_id,
    users_count: usersCount,
    amount_paise: amountPaise,
    status: "requested",
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true, amount_paise: amountPaise });
}
