"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReportButton from "@/components/ReportButton";

type Product = {
  id: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  price_paise: number;
  category: string;
};

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetch("/api/v1/marketplace/" + params.slug)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProduct(data))
      .catch(() => setProduct(null));
  }, [params.slug]);

  async function handleBuy() {
    if (!product) return;
    setBuying(true);
    try {
      const res = await fetch("/api/v1/marketplace/" + product.id + "/checkout", { method: "POST" });
      const data = await res.json();
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      // silently ignore for now
    } finally {
      setBuying(false);
    }
  }

  if (!product) {
    return <p className="text-center text-gray-400 text-sm py-8">Loading...</p>;
  }

  const priceRupees = (product.price_paise / 100).toFixed(0);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
        {product.cover_image_url ? (
          <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <span className="text-4xl">📄</span>
        )}
      </div>

      <h1 className="text-lg font-bold mb-1">{product.title}</h1>
      {product.price_paise === 0 ? (
        <p className="text-green-600 font-bold text-xl mb-3">Free</p>
      ) : (
        <p className="text-orange-600 font-bold text-xl mb-3">₹{priceRupees}</p>
      )}
      <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{product.description}</p>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 mb-4">
        Payment सिर्फ NextAaroh Payment Gateway से होगी। Seller से सीधे UPI/bank details ना मांगें — यह platform rules के खिलाफ है।
      </div>

      <button type="button" onClick={handleBuy} disabled={buying} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50 mb-3">
        {buying ? "Processing..." : product.price_paise === 0 ? "Download Free" : "Buy Now"}
      </button>

      <ReportButton contentType="marketplace_product" contentId={product.id} />
    </div>
  );
}