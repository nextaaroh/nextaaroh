"use client";
import { useEffect, useState } from "react";

type Application = {
  id: string;
  status: string;
  social_handle: string | null;
  platform: string | null;
  applied_at: string;
  profiles: { full_name: string | null; username: string | null; mobile_number: string | null } | null;
};

export default function AdminCreatorApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  async function loadApps() {
    setLoading(true);
    const res = await fetch("/api/v1/admin/creator-club/applications");
    const data = await res.json();
    if (res.ok) setApps(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadApps();
  }, []);

  async function handleReview(id: string, decision: "approved" | "rejected") {
    setProcessing(id);
    await fetch(`/api/v1/admin/creator-club/applications/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setProcessing(null);
    loadApps();
  }

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-bold mb-4">Creator Club Applications</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      <div className="space-y-3">
        {apps.map((a) => {
          return (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold">{a.profiles?.full_name ?? a.profiles?.username ?? "—"}</p>
              <p className="text-xs text-gray-500">{a.profiles?.mobile_number}</p>
              <p className="text-xs text-gray-600 mt-1">{a.platform}: {a.social_handle}</p>
              <span className={`text-[10px] px-2 py-1 rounded-full inline-block mt-2 ${
                a.status === "approved" ? "bg-green-100 text-green-700" :
                a.status === "rejected" ? "bg-gray-100 text-gray-500" : "bg-orange-100 text-orange-700"
              }`}>
                {a.status}
              </span>
              {a.status === "pending" ? (
                <div className="flex gap-2 mt-3">
                  <button type="button" onClick={() => handleReview(a.id, "approved")} disabled={processing === a.id} className="flex-1 bg-green-500 text-white text-xs font-medium py-2 rounded-lg disabled:opacity-50">
                    Approve
                  </button>
                  <button type="button" onClick={() => handleReview(a.id, "rejected")} disabled={processing === a.id} className="flex-1 bg-red-500 text-white text-xs font-medium py-2 rounded-lg disabled:opacity-50">
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
