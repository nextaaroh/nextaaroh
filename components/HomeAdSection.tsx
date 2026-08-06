"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Video = { id: string; title: string; thumbnail_url: string };
type Product = { id: string; slug: string; title: string; cover_image_url: string | null; price_paise: number };

export default function HomeAdSection() {
  const [video, setVideo] = useState<Video | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/v1/learning/videos")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setVideo(data?.data?.[0] ?? null))
      .catch(() => setVideo(null));

    fetch("/api/v1/marketplace")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setProduct(data?.data?.[0] ?? null))
      .catch(() => setProduct(null));
  }, []);

  if (!video && !product) return null;

  return (
    <div className="px-4 my-4 grid grid-cols-2 gap-3">
      {video ? (
        <Link href="/learning" className="relative rounded-xl overflow-hidden aspect-[4/5] block">
          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 p-3">
            <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">🎬 Learning</span>
            <p className="text-white text-xs font-medium mt-1 line-clamp-2">{video.title}</p>
          </div>
        </Link>
      ) : null}

      {product ? (
        <Link href={"/marketplace/" + product.slug} className="relative rounded-xl overflow-hidden aspect-[4/5] block bg-gray-100">
          {product.cover_image_url ? (
            <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">📄</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 p-3">
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">🛍️ Marketplace</span>
            <p className="text-white text-xs font-medium mt-1 line-clamp-2">{product.title}</p>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
