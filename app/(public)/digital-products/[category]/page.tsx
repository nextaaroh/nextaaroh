"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  id: string;
  title: string;
  description: string | null;
  pricing_type: string;
  price_paise: number;
  cover_image_url: string | null;
  file_url: string | null;
  external_link: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  ebooks_guides: "E-Books & Guides",
  templates: "Templates",
  ai_prompts: "AI Prompts",
  study_materials: "Study Materials",
  career_resources: "Career Resources",
  skill_workbooks: "Skill Workbooks",
  planners_trackers: "Planners & Trackers",
  courses: "Courses & Mini Courses",
  tools_calculators: "Tools & Calculators",
  bundles_kits: "Bundles & Kits",
};

export default function DigitalProductsCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [pricingType, setPricingType] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = pricingType ? `&pricing_type=${pricingType}` : "";
    fetch(`/api/v1/digital-products?category=${category}${query}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.data ?? []))
      .finally(() => setLoading(false));
  }, [category, pricingType]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">{CATEGORY_LABELS[category] ?? category}</h1>

      <div className="flex gap-2 mb-4">
        {[
          { value: "", label: "All" },
          { value: "free", label: "Free" },
          { value: "paid", label: "Paid" },
        ].map((t) => {
          const isActive = pricingType === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setPricingType(t.value)}
              className={isActive ? "text-xs font-medium bg-orange-500 text-white rounded-full px-4 py-1.5" : "text-xs font-medium bg-gray-100 text-gray-600 rounded-full px-4 py-1.5"}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
      {!loading && products.length === 0 ? <p className="text-sm text-gray-500">अभी कोई product उपलब्ध नहीं है</p> : null}

      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => {
          return (
            <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden">
              {p.cover_image_url ? (
                <img src={p.cover_image_url} alt={p.title} className="w-full h-32 object-contain bg-gray-50" />
              ) : (
                <div className="w-full h-32 bg-gray-100" />
              )}
              <div className="p-2">
                <p className="text-xs font-medium line-clamp-2">{p.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.pricing_type === "free" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {p.pricing_type === "free" ? "Free" : `₹${(p.price_paise / 100).toFixed(0)}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
