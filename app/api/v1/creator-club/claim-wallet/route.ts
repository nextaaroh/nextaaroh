import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }
  const admin = createAdminClient();

  const { data: claimable } = await admin
    .from("book_commissions")
    .select("id, amount_paise")
    .eq("user_id", user.id)
    .eq("status", "tracked")
    .eq("claimed", false);

  const totalPaise = (claimable ?? []).reduce((s, c) => s + c.amount_paise, 0);

  if (totalPaise === 0) {
    return NextResponse.json({ error: { code: "nothing_to_claim", message: "Claim करने के लिए कुछ नहीं है" } }, { status: 400 });
  }

  const { data: profile } = await admin.from("profiles").select("wallet_balance_paise").eq("id", user.id).single();
  const newBalance = (profile?.wallet_balance_paise ?? 0) + totalPaise;

  await admin.from("profiles").update({ wallet_balance_paise: newBalance }).eq("id", user.id);
  await admin.from("book_commissions").update({ claimed: true }).eq("user_id", user.id).eq("status", "tracked").eq("claimed", false);

  return NextResponse.json({ success: true, amount_paise: totalPaise });
}
