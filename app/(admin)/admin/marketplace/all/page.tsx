"use client";
import { useEffect, useState, useCallback } from "react";

type Product = {
  id: string;
  title: string;
  category: string;
  price_paise: number;
  status: string;
  cover_image_url: string | null;
  is_admin_post: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  removed: "bg-gray-200 text-gray-500",
  changes_requested: "bg-orange-100 text-orange-700",
};

export default function AdminMarketplaceAllPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/v1/admin/marketplace/all")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setProducts(data?.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRemove(id: string) {
    await fetch("/api/v1/admin/marketplace/" + id + "/remove", { method: "POST" });
    setConfirmingId(null);
    load();
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">All Marketplace Products</h1>

      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : null}
      {!loading && products.length === 0 ? <p className="text-gray-400 text-sm">कोई product नहीं है</p> : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((product) => {
          return (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="w-full aspect-video bg-gray-100">
                {product.cover_image_url ? (
                  <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">📄</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">{product.category.replace(/_/g, " ")}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={"text-[10px] px-2 py-0.5 rounded-full " + (STATUS_COLORS[product.status] ?? "bg-gray-100 text-gray-600")}>
                    {product.status}
                  </span>
                  {product.status !== "removed" ? (
                    confirmingId === product.id ? (
                      <div className="flex gap-1">
                        <button type="button" onClick={() => handleRemove(product.id)} className="text-[10px] bg-red-600 text-white px-2 py-1 rounded">
                          Confirm
                        </button>
                        <button type="button" onClick={() => setConfirmingId(null)} className="text-[10px] text-gray-400 px-2 py-1">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setConfirmingId(product.id)} className="text-[10px] text-red-600">
                        Remove
                      </button>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
