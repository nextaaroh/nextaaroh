"use client";
import { useEffect, useState } from "react";

type Payout = {
  id: string;
  users_count: number;
  amount_paise: number;
  status: string;
  requested_at: string;
  creator_links: {
    video_label: string | null;
    ref_code: string;
    profiles: { full_name: string | null; username: string | null; mobile_number: string | null } | null;
  } | null;
};

export default function AdminCreatorPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  async function loadPayouts() {
    setLoading(true);
    const res = await fetch("/api/v1/admin/creator-club/payouts");
    const data = await res.json();
    if (res.ok) setPayouts(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPayouts();
  }, []);

  async function handleApprove(id: string) {
    setProcessing(id);
    await fetch(`/api/v1/admin/creator-club/payouts/${id}/approve`, { method: "POST" });
    setProcessing(null);
    loadPayouts();
  }

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-bold mb-4">Creator Payouts</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      <div className="space-y-3">
        {payouts.map((p) => {
          return (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold">{p.creator_links?.profiles?.full_name ?? p.creator_links?.profiles?.username}</p>
              <p className="text-xs text-gray-500">{p.creator_links?.profiles?.mobile_number}</p>
              <p className="text-xs text-gray-600 mt-1">{p.creator_links?.video_label || p.creator_links?.ref_code}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{p.users_count} signups</span>
                <span className="text-sm font-bold">₹{(p.amount_paise / 100).toFixed(0)}</span>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full inline-block mt-2 ${p.status === "tracked" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                {p.status === "tracked" ? "Approved & Paid" : "Pending"}
              </span>
              {p.status === "requested" ? (
                <button
                  type="button"
                  onClick={() => handleApprove(p.id)}
                  disabled={processing === p.id}
                  className="w-full mt-3 bg-green-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
                >
                  {processing === p.id ? "Processing..." : "Approve & Pay"}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
