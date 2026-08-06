"use client";
import { useEffect, useState, useCallback } from "react";

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: string;
  last_date: string;
  apply_link: string;
};

export default function AdminOpportunitiesPendingPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/v1/admin/opportunities/pending")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setItems(data?.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(id: string) {
    await fetch("/api/v1/admin/opportunities/" + id + "/approve", { method: "POST" });
    load();
  }

  async function handleReject(id: string) {
    await fetch("/api/v1/admin/opportunities/" + id + "/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Admin rejected" }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Opportunity Approvals</h1>
      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : null}
      {!loading && items.length === 0 ? <p className="text-gray-400 text-sm">कोई pending opportunity नहीं है 🎉</p> : null}
      <div className="space-y-3">
        {items.map((item) => {
          return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-gray-400">{item.organization} · {item.category}</p>
              <p className="text-xs text-gray-400">Last date: {item.last_date}</p>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => handleApprove(item.id)} className="bg-green-600 text-white text-xs px-4 py-1.5 rounded-lg">
                  ✓ Approve
                </button>
                <button type="button" onClick={() => handleReject(item.id)} className="bg-red-500 text-white text-xs px-4 py-1.5 rounded-lg">
                  ✕ Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
