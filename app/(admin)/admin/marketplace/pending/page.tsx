"use client";
import { useEffect, useState, useCallback } from "react";

type Product = {
  id: string;
  title: string;
  category: string;
  price_paise: number;
  description: string;
  status: string;
};

export default function AdminMarketplacePendingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/v1/admin/marketplace/pending")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setProducts(data?.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(id: string) {
    await fetch("/api/v1/admin/marketplace/" + id + "/approve", { method: "POST" });
    load();
  }

  async function handleReject(id: string) {
    await fetch("/api/v1/admin/marketplace/" + id + "/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setRejectingId(null);
    setReason("");
    load();
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Marketplace Approvals</h1>

      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : null}
      {!loading && products.length === 0 ? <p className="text-gray-400 text-sm">कोई pending listing नहीं है 🎉</p> : null}

      <div className="space-y-3">
        {products.map((product) => {
          return (
            <div key={product.id} className="border border-gray-200 bg-white rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{product.category.replace(/_/g, " ")}</p>
                  <p className="text-xs text-gray-400">₹{(product.price_paise / 100).toFixed(0)}</p>
                </div>
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{product.status}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{product.description}</p>

              {rejectingId === product.id ? (
                <div className="mt-3 space-y-2">
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Reject करने की वजह लिखें"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleReject(product.id)} className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg">
                      Confirm Reject
                    </button>
                    <button type="button" onClick={() => setRejectingId(null)} className="text-gray-500 text-xs px-3 py-1.5">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-3">
                  <button type="button" onClick={() => handleApprove(product.id)} className="bg-green-600 text-white text-xs px-4 py-1.5 rounded-lg">
                    ✓ Approve
                  </button>
                  <button type="button" onClick={() => setRejectingId(product.id)} className="bg-red-500 text-white text-xs px-4 py-1.5 rounded-lg">
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
