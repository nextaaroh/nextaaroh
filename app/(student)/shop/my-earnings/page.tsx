"use client";
import { useEffect, useState } from "react";

type Commission = {
  id: string;
  amount_paise: number;
  status: string;
  unlock_at: string;
  created_at: string;
  book_orders: { books: { title: string } | null } | null;
};

export default function MyEarningsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [pendingPaise, setPendingPaise] = useState(0);
  const [trackedPaise, setTrackedPaise] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/shop/my-earnings")
      .then((res) => res.json())
      .then((data) => {
        setCommissions(data.data ?? []);
        setPendingPaise(data.pending_paise ?? 0);
        setTrackedPaise(data.tracked_paise ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">My Earnings</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
          <p className="text-xs text-orange-600">Pending</p>
          <p className="text-lg font-bold">₹{(pendingPaise / 100).toFixed(0)}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-xs text-green-600">Tracked (Wallet में)</p>
          <p className="text-lg font-bold">₹{(trackedPaise / 100).toFixed(0)}</p>
        </div>
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {!loading && commissions.length === 0 ? (
        <p className="text-sm text-gray-500">अभी कोई earning नहीं है — books share करके कमाना शुरू करो!</p>
      ) : null}

      <div className="space-y-2">
        {commissions.map((c) => {
          return (
            <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{c.book_orders?.books?.title ?? "—"}</p>
                <p className="text-xs text-gray-400">
                  {c.status === "pending" ? `Unlock: ${new Date(c.unlock_at).toLocaleDateString("hi-IN")}` : "Wallet में जुड़ गया"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">₹{(c.amount_paise / 100).toFixed(0)}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === "pending" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                  {c.status === "pending" ? "Pending" : "Tracked"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
