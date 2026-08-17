"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Book = {
  id: string;
  title: string;
  cover_image_url: string | null;
  price_paise: number;
  discount_percent: number;
  author: string | null;
  commission_percent: number;
};

export default function ShopCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/shop/books?category=${category}`)
      .then((res) => res.json())
      .then((data) => setBooks(data.data ?? []))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4 capitalize">{category}</h1>
      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {!loading && books.length === 0 ? <p className="text-sm text-gray-500">अभी कोई book उपलब्ध नहीं है</p> : null}
      <div className="grid grid-cols-2 gap-3">
        {books.map((b) => {
          const discountedPaise = Math.round(b.price_paise * (1 - b.discount_percent / 100));
          return (
            <Link key={b.id} href={`/shop/book/${b.id}`} className="border border-gray-200 rounded-xl overflow-hidden">
              {b.cover_image_url ? (
                <img src={b.cover_image_url} alt={b.title} className="w-full h-36 object-contain bg-gray-50" />
              ) : (
                <div className="w-full h-36 bg-gray-100" />
              )}
              <div className="p-2">
                <p className="text-xs font-medium line-clamp-2">{b.title}</p>
                {b.author ? <p className="text-[10px] text-gray-400">{b.author}</p> : null}
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-sm font-bold">₹{(discountedPaise / 100).toFixed(0)}</p>
                  {b.discount_percent > 0 ? (
                    <p className="text-[10px] text-gray-400 line-through">₹{(b.price_paise / 100).toFixed(0)}</p>
                  ) : null}
                </div>
                {b.commission_percent > 0 ? (
                  <p className="text-[10px] text-green-600 mt-0.5">Earn {b.commission_percent}% share</p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
