"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  total_users: number;
  pending_products: number;
  published_products: number;
  pending_opportunities: number;
  open_reports: number;
  completed_orders: number;
};

const QUICK_LINKS = [
  { href: "/admin/marketplace/pending", label: "Marketplace Approvals", emoji: "🛍️" },
  { href: "/admin/marketplace/post", label: "Post to Marketplace", emoji: "➕" },
  { href: "/admin/opportunities/pending", label: "Opportunity Approvals", emoji: "🎯" },
  { href: "/admin/learning", label: "Learning Videos", emoji: "🎬" },
  { href: "/admin/quiz", label: "Quiz Manager", emoji: "📝" },
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
      <h1 className="text-lg font-bold mb-4">Admin Dashboard</h1>

      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-orange-600">{stats.total_users}</p>
            <p className="text-xs text-gray-500">Users</p>
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
      ) : (
        <p className="text-gray-400 text-sm mb-6">Stats loading...</p>
      )}

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
