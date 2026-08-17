"use client";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  house_no: string;
  road_area: string;
  pincode: string;
  city: string;
  state: string;
  final_price_paise: number;
  promo_code: string | null;
  status: string;
  created_at: string;
  books: { title: string; meesho_link: string; commission_percent: number } | null;
};

export default function AdminShopOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    const res = await fetch("/api/v1/admin/shop/orders");
    const data = await res.json();
    if (res.ok) setOrders(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleMarkOrdered(order: Order) {
    if (order.books?.meesho_link) {
      window.open(order.books.meesho_link, "_blank");
    }
    setMarking(order.id);
    await fetch(`/api/v1/admin/shop/orders/${order.id}/mark-ordered`, { method: "POST" });
    setMarking(null);
    loadOrders();
  }

  const statusLabel: Record<string, string> = {
    pending: "नया Order",
    ordered_on_meesho: "Meesho पर Order हो गया",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const statusColor: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700",
    ordered_on_meesho: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-bold mb-4">Shop Orders ({orders.length})</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      <div className="space-y-3">
        {orders.map((o) => {
          return (
            <div key={o.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold">{o.books?.title ?? "—"}</p>
                <span className={`text-[10px] px-2 py-1 rounded-full whitespace-nowrap ${statusColor[o.status]}`}>
                  {statusLabel[o.status] ?? o.status}
                </span>
              </div>
              <p className="text-xs text-gray-600">{o.buyer_name} · {o.buyer_phone}</p>
              <p className="text-xs text-gray-500 mt-1">
                {o.house_no}, {o.road_area}, {o.city}, {o.state} - {o.pincode}
              </p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-bold">₹{(o.final_price_paise / 100).toFixed(0)}</p>
                {o.promo_code ? <p className="text-[10px] text-gray-400">Promo: {o.promo_code}</p> : null}
              </div>
              {o.status === "pending" ? (
                <button
                  type="button"
                  onClick={() => handleMarkOrdered(o)}
                  disabled={marking === o.id}
                  className="w-full mt-3 bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
                >
                  {marking === o.id ? "Processing..." : "Meesho खोलो & Order Mark करो"}
                </button>
              ) : null}
              <a
                href={`https://wa.me/91${o.buyer_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`नमस्ते ${o.buyer_name}, आपका order (${o.books?.title}) ₹${(o.final_price_paise / 100).toFixed(0)} confirm हो गया है। Address: ${o.house_no}, ${o.road_area}, ${o.city}, ${o.state} - ${o.pincode}`)}`}
                target="_blank"
                className="w-full mt-2 border border-green-500 text-green-600 text-sm font-medium py-2 rounded-lg text-center block"
              >
                WhatsApp पर Message भेजो
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
