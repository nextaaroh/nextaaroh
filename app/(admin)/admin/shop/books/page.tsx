"use client";
import { useEffect, useState } from "react";
import { uploadToImgbb } from "@/lib/imgbb/uploadImage";

const CATEGORY_OPTIONS = [
  { value: "books", label: "Books" },
  { value: "dictionary", label: "Dictionary" },
];

type Book = {
  id: string;
  title: string;
  cover_image_url: string | null;
  price_paise: number;
  discount_percent: number;
  commission_percent: number;
  is_active: boolean;
};

export default function AdminShopBooksPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("books");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [pages, setPages] = useState("");
  const [publisher, setPublisher] = useState("");
  const [meeshoLink, setMeeshoLink] = useState("");
  const [commission, setCommission] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverFile2, setCoverFile2] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [books, setBooks] = useState<Book[]>([]);

  async function handleDelete(id: string) {
    if (!confirm("क्या आप वाकई इस book को delete करना चाहते हैं?")) return;
    await fetch(`/api/v1/admin/shop/books/${id}`, { method: "DELETE" });
    loadBooks();
  }

  async function loadBooks() {
    const res = await fetch("/api/v1/admin/shop/books");
    const data = await res.json();
    if (res.ok) setBooks(data.data ?? []);
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleSubmit() {
    setMessage("");
    if (!title.trim() || !meeshoLink.trim() || !price.trim()) {
      setMessage("Title, Meesho link, Price ज़रूरी हैं");
      return;
    }

    setSubmitting(true);
    try {
      let coverImageUrl: string | null = null;
      let coverImageUrl2: string | null = null;
      if (coverFile) {
        setProgress("Cover image upload हो रही है...");
        coverImageUrl = await uploadToImgbb(coverFile);
      }
      if (coverFile2) {
        coverImageUrl2 = await uploadToImgbb(coverFile2);
      }

      setProgress("Book add हो रही है...");
      const res = await fetch("/api/v1/admin/shop/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          cover_image_url: coverImageUrl,
          cover_image_url_2: coverImageUrl2,
          price_paise: Math.round(Number(price) * 100),
          discount_percent: discount && price ? Math.round((Number(discount) / Number(price)) * 100) : 0,
          pages: pages ? Number(pages) : null,
          publisher,
          meesho_link: meeshoLink,
          commission_percent: commission && price ? Math.round((Number(commission) / Number(price)) * 100) : 0,
          author,
          description,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setMessage("Book add हो गई!");
      setTitle("");
      setPrice("");
      setDiscount("");
      setPages("");
      setPublisher("");
      setMeeshoLink("");
      setCommission("");
      setAuthor("");
      setDescription("");
      setLanguage("Hindi");
      setCoverFile(null);
      setCoverFile2(null);
      loadBooks();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "कुछ गलत हो गया");
    } finally {
      setSubmitting(false);
      setProgress("");
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-bold mb-4">Shop — Books (Admin)</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map((c) => {
            return <option key={c.value} value={c.value}>{c.label}</option>;
          })}
        </select>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Discount ₹ (कितना कम करना है)" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Pages" value={pages} onChange={(e) => setPages(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Meesho Product Link" value={meeshoLink} onChange={(e) => setMeeshoLink(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="Hindi">Hindi</option>
          <option value="English">English</option>
          <option value="Hinglish">Hinglish</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Sanskrit">Sanskrit</option>
        </select>
        <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Commission ₹ (per sale कितना देना है)" value={commission} onChange={(e) => setCommission(e.target.value)} />

        <div>
          <label className="text-xs font-medium block mb-1">Cover Image</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          {coverFile ? <p className="text-xs text-green-600 mt-1">✓ {coverFile.name}</p> : null}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1">Cover Image 2 (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverFile2(e.target.files?.[0] ?? null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          {coverFile2 ? <p className="text-xs text-green-600 mt-1">✓ {coverFile2.name}</p> : null}
        </div>

        {progress ? <p className="text-xs text-blue-600">{progress}</p> : null}
        {message ? <p className="text-xs text-orange-600">{message}</p> : null}
        <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
          {submitting ? "Adding..." : "Add Book"}
        </button>
      </div>

      <h2 className="text-sm font-bold mt-6 mb-2">Existing Books ({books.length})</h2>
      <div className="space-y-2">
        {books.map((b) => {
          return (
            <div key={b.id} className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{b.title}</p>
                <p className="text-xs text-gray-500">₹{(b.price_paise / 100).toFixed(0)} · {b.discount_percent}% off · Commission {b.commission_percent}%</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${b.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {b.is_active ? "Active" : "Inactive"}
              </span>
              <button type="button" onClick={() => handleDelete(b.id)} className="text-xs text-red-500 ml-2">Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
