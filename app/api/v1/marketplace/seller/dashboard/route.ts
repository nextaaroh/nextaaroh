import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PLATFORM_FEE_PERCENT = 35;

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: products } = await admin
    .from("marketplace_products")
    .select("id, title, status, price_paise, cover_image_url")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  const productIds = (products ?? []).map((p) => p.id);

  let orders: { id: string; product_id: string; amount_paise: number; created_at: string }[] = [];
  if (productIds.length > 0) {
    const { data: orderRows } = await admin
      .from("orders")
      .select("id, product_id, amount_paise, created_at")
      .in("product_id", productIds)
      .eq("status", "paid");
    orders = orderRows ?? [];
  }

  const totalSales = orders.length;
  const grossRevenuePaise = orders.reduce((sum, o) => sum + o.amount_paise, 0);
  const platformFeePaise = Math.round((grossRevenuePaise * PLATFORM_FEE_PERCENT) / 100);
  const netEarningsPaise = grossRevenuePaise - platformFeePaise;

  const { data: profile } = await admin.from("profiles").select("wallet_balance_paise").eq("id", user.id).single();

  const salesByProduct: Record<string, number> = {};
  for (const order of orders) {
    salesByProduct[order.product_id] = (salesByProduct[order.product_id] ?? 0) + 1;
  }

  const productsWithSales = (products ?? []).map((p) => ({
    ...p,
    sales_count: salesByProduct[p.id] ?? 0,
  }));

  return NextResponse.json({
    products: productsWithSales,
    total_sales: totalSales,
    gross_revenue_paise: grossRevenuePaise,
    platform_fee_percent: PLATFORM_FEE_PERCENT,
    platform_fee_paise: platformFeePaise,
    net_earnings_paise: netEarningsPaise,
    wallet_balance_paise: profile?.wallet_balance_paise ?? 0,
  });
}
