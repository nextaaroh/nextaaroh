"use client";
import { useEffect, useState } from "react";

type Stats = {
  total_users: number;
  pending_products: number;
  published_products: number;
  pending_opportunities: number;
  open_reports: number;
  completed_orders: number;
};

const CARDS: { key: keyof Stats; label: string; emoji: string }[] = [
  { key: "total_users", label: "Total Users", emoji: "👥" },
  { key: "pending_products", label: "Pending Products", emoji: "⏳" },
  { key: "published_products", label: "Published Products", emoji: "🛍️" },
  { key: "pending_opportunities", label: "Pending Opportunities", emoji: "🎯" },
  { key: "open_reports", label: "Open Reports", emoji: "🚩" },
  { key: "completed_orders", label: "Completed Orders", emoji: "💰" },
];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Analytics</h1>
      {!stats ? <p className="text-gray-400 text-sm">Loading...</p> : null}
      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CARDS.map((card) => {
            return (
              <div key={card.key} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-2xl mb-1">{card.emoji}</p>
                <p className="text-2xl font-bold text-orange-600">{stats[card.key]}</p>
                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
