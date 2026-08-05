import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string | null;
  price_paise: number;
  category: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const isFree = product.price_paise === 0;
  const priceRupees = (product.price_paise / 100).toFixed(0);

  return (
    <Link href={"/marketplace/" + product.slug} className="block border border-gray-200 rounded-xl overflow-hidden">
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center relative">
        {product.cover_image_url ? (
          <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">📄</span>
        )}
        {isFree ? (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            FREE
          </span>
        ) : null}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium line-clamp-2">{product.title}</p>
        <p className="text-xs text-gray-400 capitalize mt-1">{product.category.replace(/_/g, " ")}</p>
        {isFree ? (
          <p className="text-green-600 font-bold text-sm mt-1">Free</p>
        ) : (
          <p className="text-orange-600 font-bold text-sm mt-1">₹{priceRupees}</p>
        )}
      </div>
    </Link>
  );
}