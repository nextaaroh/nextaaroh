import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const admin = createAdminClient();

  const [users, pendingProducts, publishedProducts, pendingOpportunities, openReports, totalOrders] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("marketplace_products").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("marketplace_products").select("id", { count: "exact", head: true }).eq("status", "published"),
    admin.from("opportunities").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("content_reports").select("id", { count: "exact", head: true }).eq("status", "open"),
    admin.from("orders").select("id", { count: "exact", head: true }).eq("status", "paid"),
  ]);

  return NextResponse.json({
    total_users: users.count ?? 0,
    pending_products: pendingProducts.count ?? 0,
    published_products: publishedProducts.count ?? 0,
    pending_opportunities: pendingOpportunities.count ?? 0,
    open_reports: openReports.count ?? 0,
    completed_orders: totalOrders.count ?? 0,
  });
}
