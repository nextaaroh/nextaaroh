"use client";
import { useEffect, useState } from "react";
import { uploadToImgbb } from "@/lib/imgbb/uploadImage";

const CATEGORIES = [
  { value: "ebooks_guides", label: "E-Books & Guides" },
  { value: "templates", label: "Templates" },
  { value: "ai_prompts", label: "AI Prompts" },
  { value: "study_materials", label: "Study Materials" },
  { value: "career_resources", label: "Career Resources" },
  { value: "skill_workbooks", label: "Skill Workbooks" },
  { value: "planners_trackers", label: "Planners & Trackers" },
  { value: "courses", label: "Courses & Mini Courses" },
  { value: "tools_calculators", label: "Tools & Calculators" },
  { value: "bundles_kits", label: "Bundles & Kits" },
];

type Product = {
  id: string;
  title: string;
  category: string;
  pricing_type: string;
  price_paise: number;
};

export default function AdminDigitalProductsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [pricingType, setPricingType] = useState("free");
  const [price, setPrice] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  async function loadProducts() {
    const res = await fetch("/api/v1/admin/digital-products");
    const data = await res.json();
    if (res.ok) setProducts(data.data ?? []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("क्या आप वाकई इस product को delete करना चाहते हैं?")) return;
    await fetch(`/api/v1/admin/digital-products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  async function handleSubmit() {
    setMessage("");
    if (!title.trim()) {
      setMessage("Title ज़रूरी है");
      return;
    }
    setSubmitting(true);
    try {
      let coverImageUrl: string | null = null;
      if (coverFile) {
        setProgress("Cover image upload हो रही है...");
        coverImageUrl = await uploadToImgbb(coverFile);
      }
      setProgress("Product add हो रही है...");
      const res = await fetch("/api/v1/admin/digital-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          pricing_type: pricingType,
          price_paise: price ? Math.round(Number(price) * 100) : 0,
          cover_image_url: coverImageUrl,
          file_url: fileUrl,
          external_link: externalLink,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setMessage("Product add हो गया!");
      setTitle("");
      setDescription("");
      setPrice("");
      setFileUrl("");
      setExternalLink("");
      setCoverFile(null);
      loadProducts();
    } finally {
      setSubmitting(false);
      setProgress("");
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-bold mb-4">Digital Products (Admin)</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={pricingType} onChange={(e) => setPricingType(e.target.value)}>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
        {pricingType === "paid" ? (
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
        ) : null}
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="File URL (download link, अगर हो)" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="External Link (अगर हो)" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} />
        <div>
          <label className="text-xs font-medium block mb-1">Cover Image</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          {coverFile ? <p className="text-xs text-green-600 mt-1">✓ {coverFile.name}</p> : null}
        </div>
        {progress ? <p className="text-xs text-blue-600">{progress}</p> : null}
        {message ? <p className="text-xs text-orange-600">{message}</p> : null}
        <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </div>

      <h2 className="text-sm font-bold mt-6 mb-2">Existing Products ({products.length})</h2>
      <div className="space-y-2">
        {products.map((p) => {
          return (
            <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-gray-500">{p.category} · {p.pricing_type === "free" ? "Free" : `₹${(p.price_paise / 100).toFixed(0)}`}</p>
              </div>
              <button type="button" onClick={() => handleDelete(p.id)} className="text-xs text-red-500">Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
