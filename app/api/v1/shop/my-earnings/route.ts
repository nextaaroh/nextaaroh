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
    .from("book_commissions")
    .select("*, book_orders(book_id, books(title))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: { code: "fetch_failed", message: error.message } }, { status: 400 });
  }

  const pendingPaise = (data ?? []).filter((c) => c.status === "pending").reduce((s, c) => s + c.amount_paise, 0);
  const trackedPaise = (data ?? []).filter((c) => c.status === "tracked").reduce((s, c) => s + c.amount_paise, 0);

  return NextResponse.json({ data, pending_paise: pendingPaise, tracked_paise: trackedPaise });
}
