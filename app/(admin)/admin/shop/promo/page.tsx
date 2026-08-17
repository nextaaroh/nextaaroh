"use client";
import { useEffect, useState } from "react";

type Promo = {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  source: string | null;
  expiry_date: string | null;
  is_active: boolean;
};

export default function AdminPromoPage() {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [source, setSource] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [promos, setPromos] = useState<Promo[]>([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadPromos() {
    const res = await fetch("/api/v1/admin/shop/promo");
    const data = await res.json();
    if (res.ok) setPromos(data.data ?? []);
  }

  useEffect(() => {
    loadPromos();
  }, []);

  async function handleSubmit() {
    setMessage("");
    if (!code.trim() || !discountValue.trim()) {
      setMessage("Code और value ज़रूरी हैं");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/v1/admin/shop/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discount_type: discountType,
        discount_value: Number(discountValue),
        source,
        expiry_date: expiryDate || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error?.message ?? "कुछ गलत हो गया");
    } else {
      setMessage("Promo code add हो गया!");
      setCode("");
      setDiscountValue("");
      setSource("");
      setExpiryDate("");
      loadPromos();
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-bold mb-4">Promo Codes (Admin)</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Code (e.g. INS202627)" value={code} onChange={(e) => setCode(e.target.value)} />
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
          <option value="percent">Percent %</option>
          <option value="flat">Flat ₹</option>
        </select>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Discount Value" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Source (Instagram/YouTube)" value={source} onChange={(e) => setSource(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        {message ? <p className="text-xs text-orange-600">{message}</p> : null}
        <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
          {submitting ? "Adding..." : "Add Promo Code"}
        </button>
      </div>

      <h2 className="text-sm font-bold mt-6 mb-2">Active Codes ({promos.length})</h2>
      <div className="space-y-2">
        {promos.map((p) => {
          return (
            <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-mono font-semibold">{p.code}</p>
                <p className="text-xs text-gray-500">
                  {p.discount_type === "percent" ? `${p.discount_value}% off` : `₹${p.discount_value} off`} · {p.source ?? "—"}
                </p>
              </div>
              <p className="text-[10px] text-gray-400">{p.expiry_date ? new Date(p.expiry_date).toLocaleDateString("hi-IN") : "No expiry"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
