import Link from "next/link";

const CATEGORIES = [
  { value: "books", label: "Books", emoji: "📚" },
  { value: "dictionary", label: "Dictionary", emoji: "📖" },
];

export default function ShopPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">Shop</h1>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((c) => {
          return (
            <Link
              key={c.value}
              href={`/shop/${c.value}`}
              className="border border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition-colors"
            >
              <p className="text-3xl mb-2">{c.emoji}</p>
              <p className="text-sm font-semibold">{c.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
