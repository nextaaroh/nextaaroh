"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Traffic = { today: number; today_logged_in: number; today_non_users: number; last_7_days: number; this_month: number };
type Earnings = { total_gross_paise: number; platform_revenue_paise: number };

type Stats = {
  total_users: number;
  pending_products: number;
  published_products: number;
  pending_opportunities: number;
  open_reports: number;
  completed_orders: number;
  traffic: Traffic;
  earnings: Earnings;
};

const QUICK_LINKS = [
  { href: "/admin/marketplace/pending", label: "Marketplace Approvals", emoji: "🛍️" },
  { href: "/admin/marketplace/all", label: "All Products", emoji: "📦" },
  { href: "/admin/marketplace/post", label: "Post to Marketplace", emoji: "➕" },
  { href: "/admin/shop/books", label: "Shop — Books", emoji: "📚" },
  { href: "/admin/shop/orders", label: "Shop — Orders", emoji: "📦" },
  { href: "/admin/shop/promo", label: "Shop — Promo Codes", emoji: "🎟️" },
  { href: "/admin/creator-club/applications", label: "Creator Club Applications", emoji: "🎥" },
  { href: "/admin/creator-club/payouts", label: "Creator Payouts", emoji: "💰" },
  { href: "/admin/creator-club/rewards", label: "Creator Rewards", emoji: "🎁" },
  { href: "/admin/digital-products", label: "Digital Products", emoji: "🛒" },
  { href: "/admin/opportunities/pending", label: "Opportunity Approvals", emoji: "🎯" },
  { href: "/admin/learning", label: "Learning Videos", emoji: "🎬" },
  { href: "/admin/quiz", label: "Quiz Manager", emoji: "📝" },
  { href: "/admin/question-bank", label: "Question Bank", emoji: "🗂️" },
  { href: "/admin/website-requests", label: "Website Requests", emoji: "🌐" },
  { href: "/admin/reports", label: "Reports", emoji: "🚩" },
  { href: "/admin/users", label: "Users", emoji: "👥" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Admin Dashboard — Insights</h1>

      {!stats ? <p className="text-gray-400 text-sm mb-6">Stats loading...</p> : null}

      {stats ? (
        <>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Traffic</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-600">{stats.traffic.today}</p>
              <p className="text-[10px] text-gray-500">Today</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-600">{stats.traffic.last_7_days}</p>
              <p className="text-[10px] text-gray-500">Last 7 Days</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-600">{stats.traffic.this_month}</p>
              <p className="text-[10px] text-gray-500">This Month</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-600">{stats.traffic.today_non_users}</p>
              <p className="text-[10px] text-gray-500">Non-Users Today</p>
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Users & Content</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-orange-600">{stats.total_users}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-yellow-600">{stats.pending_products}</p>
              <p className="text-xs text-gray-500">Pending Products</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-red-600">{stats.open_reports}</p>
              <p className="text-xs text-gray-500">Open Reports</p>
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Earnings</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-600">₹{(stats.earnings.total_gross_paise / 100).toFixed(0)}</p>
              <p className="text-[10px] text-gray-500">Total Gross Sales</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-700">₹{(stats.earnings.platform_revenue_paise / 100).toFixed(0)}</p>
              <p className="text-[10px] text-gray-500">Platform Revenue (35%)</p>
            </div>
          </div>
        </>
      ) : null}

      <p className="text-sm font-medium text-gray-500 mb-2">Quick Actions</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {QUICK_LINKS.map((link) => {
          return (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
              <span className="text-2xl">{link.emoji}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
