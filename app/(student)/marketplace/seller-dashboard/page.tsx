"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  status: string;
  price_paise: number;
  cover_image_url: string | null;
  sales_count: number;
};

type DashboardData = {
  products: Product[];
  total_sales: number;
  gross_revenue_paise: number;
  platform_fee_percent: number;
  platform_fee_paise: number;
  net_earnings_paise: number;
  wallet_balance_paise: number;
};

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  removed: "bg-gray-200 text-gray-500",
  changes_requested: "bg-orange-100 text-orange-700",
};

export default function SellerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/v1/marketplace/seller/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => setData(result))
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <p className="text-center text-gray-400 text-sm py-8">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">Seller Dashboard</h1>

      <div className="bg-gradient-to-br from-[#0a1a3a] to-[#132a5c] text-white rounded-xl p-4 mb-4">
        <p className="text-xs text-white/60 mb-1">Total Earnings (आपका हिस्सा)</p>
        <p className="text-2xl font-bold text-green-400">₹{(data.net_earnings_paise / 100).toFixed(2)}</p>
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-sm font-bold">{data.total_sales}</p>
            <p className="text-[10px] text-white/60">Sales</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-sm font-bold">₹{(data.gross_revenue_paise / 100).toFixed(0)}</p>
            <p className="text-[10px] text-white/60">Gross Revenue</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-sm font-bold">₹{(data.platform_fee_paise / 100).toFixed(0)}</p>
            <p className="text-[10px] text-white/60">Platform Fee ({data.platform_fee_percent}%)</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-400 mb-1">Aaroh Wallet Balance</p>
        <p className="text-xl font-bold text-orange-600 mb-3">₹{(data.wallet_balance_paise / 100).toFixed(2)}</p>
        <Link href="/me" className="block text-center bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg">
          💸 Withdraw from Profile → Wallet
        </Link>
        <p className="text-[10px] text-gray-400 mt-2 text-center">हर sale की कमाई अपने आप आपके Aaroh Wallet में आ जाती है — Withdraw करने के लिए Profile page पर जाएं</p>
      </div>

      <p className="text-sm font-semibold mb-2">My Products ({data.products.length})</p>
      <div className="space-y-2">
        {data.products.length === 0 ? <p className="text-sm text-gray-400">अभी कोई listing नहीं है</p> : null}
        {data.products.map((product) => {
          return (
            <div key={product.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
              <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                {product.cover_image_url ? (
                  <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">📄</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                <span className={"text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 " + (STATUS_COLORS[product.status] ?? "bg-gray-100 text-gray-600")}>
                  {product.status}
                </span>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-orange-600">{product.sales_count}</p>
                <p className="text-[10px] text-gray-400">sold</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
