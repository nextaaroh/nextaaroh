"use client";
import { useEffect, useState } from "react";

type Reward = {
  id: string;
  milestone: number;
  reward_description: string;
  status: string;
  achieved_at: string;
  sent_at: string | null;
  profiles: { full_name: string | null; username: string | null; mobile_number: string | null } | null;
};

export default function AdminCreatorRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  async function loadRewards() {
    setLoading(true);
    const res = await fetch("/api/v1/admin/creator-club/rewards");
    const data = await res.json();
    if (res.ok) setRewards(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadRewards();
  }, []);

  async function handleMarkSent(id: string) {
    setProcessing(id);
    await fetch(`/api/v1/admin/creator-club/rewards/${id}/mark-sent`, { method: "POST" });
    setProcessing(null);
    loadRewards();
  }

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-bold mb-4">Creator Rewards</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      <div className="space-y-3">
        {rewards.map((r) => {
          return (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold">{r.profiles?.full_name ?? r.profiles?.username}</p>
              <p className="text-xs text-gray-500">{r.profiles?.mobile_number}</p>
              <p className="text-sm font-medium mt-1">{r.milestone}+ Books → {r.reward_description}</p>
              <span className={`text-[10px] px-2 py-1 rounded-full inline-block mt-2 ${r.status === "sent" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                {r.status === "sent" ? `Sent (${new Date(r.sent_at!).toLocaleDateString("hi-IN")})` : "Pending — भेजना बाकी है"}
              </span>
              {r.status === "pending" ? (
                <button
                  type="button"
                  onClick={() => handleMarkSent(r.id)}
                  disabled={processing === r.id}
                  className="w-full mt-3 bg-green-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
                >
                  {processing === r.id ? "Processing..." : "Mark as Sent"}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
