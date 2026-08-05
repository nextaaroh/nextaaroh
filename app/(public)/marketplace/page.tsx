"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/features/marketplace/components/ProductCard";
import CategoryFilter from "@/features/marketplace/components/CategoryFilter";

type Product = {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string | null;
  price_paise: number;
  category: string;
};

export default function MarketplacePage() {
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = category ? "?category=" + category : "";
    fetch("/api/v1/marketplace" + query)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setProducts(data?.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-lg font-bold">Marketplace</h1>
        <Link href="/marketplace/sell" className="text-sm text-orange-500 font-medium">
          + Sell
        </Link>
      </div>
      <CategoryFilter active={category} onChange={setCategory} />
      

      {loading && <p className="text-center text-gray-400 text-sm py-8">Loading...</p>}
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">
          अभी कोई listing नहीं है — सबसे पहले आप कुछ बेचिए!
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 px-4 pt-2 pb-4">
        {products.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}