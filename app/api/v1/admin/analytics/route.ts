import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const admin = createAdminClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    totalUsers,
    pendingProducts,
    publishedProducts,
    pendingOpportunities,
    openReports,
    completedOrders,
    visitsToday,
    visits7Days,
    visitsMonth,
    loggedInVisitsToday,
    paidOrdersAll,
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("marketplace_products").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("marketplace_products").select("id", { count: "exact", head: true }).eq("status", "published"),
    admin.from("opportunities").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("content_reports").select("id", { count: "exact", head: true }).eq("status", "open"),
    admin.from("orders").select("id", { count: "exact", head: true }).eq("status", "paid"),
    admin.from("site_visits").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    admin.from("site_visits").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    admin.from("site_visits").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    admin.from("site_visits").select("id", { count: "exact", head: true }).gte("created_at", todayStart).not("profile_id", "is", null),
    admin.from("orders").select("amount_paise").eq("status", "paid"),
  ]);

  const totalGrossRevenuePaise = (paidOrdersAll.data ?? []).reduce((sum, o) => sum + o.amount_paise, 0);
  const platformRevenuePaise = Math.round(totalGrossRevenuePaise * 0.35);

  const visitsTodayCount = visitsToday.count ?? 0;
  const loggedInToday = loggedInVisitsToday.count ?? 0;
  const nonUsersToday = Math.max(visitsTodayCount - loggedInToday, 0);

  return NextResponse.json({
    total_users: totalUsers.count ?? 0,
    pending_products: pendingProducts.count ?? 0,
    published_products: publishedProducts.count ?? 0,
    pending_opportunities: pendingOpportunities.count ?? 0,
    open_reports: openReports.count ?? 0,
    completed_orders: completedOrders.count ?? 0,
    traffic: {
      today: visitsTodayCount,
      today_logged_in: loggedInToday,
      today_non_users: nonUsersToday,
      last_7_days: visits7Days.count ?? 0,
      this_month: visitsMonth.count ?? 0,
    },
    earnings: {
      total_gross_paise: totalGrossRevenuePaise,
      platform_revenue_paise: platformRevenuePaise,
    },
  });
}
