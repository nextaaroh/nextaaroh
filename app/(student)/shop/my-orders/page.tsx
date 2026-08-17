"use client";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  final_price_paise: number;
  created_at: string;
  house_no: string;
  road_area: string;
  city: string;
  state: string;
  pincode: string;
  books: { title: string; cover_image_url: string | null } | null;
};

const STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "ordered_on_meesho", label: "Ordered from Warehouse" },
  { key: "delivered", label: "Delivered" },
];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/shop/my-orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  function stepIndex(status: string) {
    if (status === "cancelled") return -1;
    return STEPS.findIndex((s) => s.key === status);
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">My Orders</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {!loading && orders.length === 0 ? <p className="text-sm text-gray-500">अभी कोई order नहीं है</p> : null}

      <div className="space-y-4">
        {orders.map((o) => {
          const currentStep = stepIndex(o.status);
          return (
            <div key={o.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex gap-3 mb-3">
                {o.books?.cover_image_url ? (
                  <img src={o.books.cover_image_url} alt="" className="w-14 h-18 object-contain bg-gray-50 rounded" />
                ) : null}
                <div>
                  <p className="text-sm font-medium">{o.books?.title}</p>
                  <p className="text-xs text-gray-500">₹{(o.final_price_paise / 100).toFixed(0)} · {new Date(o.created_at).toLocaleDateString("hi-IN")}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{o.house_no}, {o.road_area}, {o.city} - {o.pincode}</p>
                </div>
              </div>

              {o.status === "cancelled" ? (
                <p className="text-xs text-red-500 font-medium">Order Cancelled</p>
              ) : (
                <div className="flex items-center">
                  {STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    return (
                      <div key={step.key} className="flex-1 flex flex-col items-center relative">
                        {i > 0 ? (
                          <div className={`absolute top-2 right-1/2 w-full h-0.5 ${i <= currentStep ? "bg-green-500" : "bg-gray-200"}`} />
                        ) : null}
                        <div className={`w-4 h-4 rounded-full z-10 ${done ? "bg-green-500" : "bg-gray-200"}`} />
                        <p className={`text-[9px] mt-1 text-center ${done ? "text-green-600 font-medium" : "text-gray-400"}`}>{step.label}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
