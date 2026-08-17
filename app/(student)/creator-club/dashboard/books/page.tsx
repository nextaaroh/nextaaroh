"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Book = {
  id: string;
  title: string;
  cover_image_url: string | null;
  price_paise: number;
  discount_percent: number;
  commission_percent: number;
};

type CreatorLink = {
  id: string;
  ref_code: string;
  video_label: string | null;
  click_count: number;
  signup_count: number;
  book_id: string | null;
  books: { title: string; cover_image_url: string | null; commission_percent: number } | null;
};

export default function BookLinksDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [links, setLinks] = useState<CreatorLink[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function loadLinks() {
    const res = await fetch("/api/v1/creator-club/links");
    const data = await res.json();
    if (res.ok) setLinks((data.data ?? []).filter((l: CreatorLink) => l.book_id));
  }

  useEffect(() => {
    fetch("/api/v1/shop/books")
      .then((res) => res.json())
      .then((data) => setBooks(data.data ?? []));
    loadLinks();
  }, []);

  async function handleCreate() {
    if (!selectedBook) return;
    setCreating(true);
    await fetch("/api/v1/creator-club/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_label: label, link_type: "book", book_id: selectedBook.id }),
    });
    setLabel("");
    setSelectedBook(null);
    setCreating(false);
    loadLinks();
  }

  async function handleCopy(link: CreatorLink) {
    const url = `${window.location.origin}/go/${link.ref_code}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Link href="/creator-club/dashboard" className="text-xs text-gray-400 mb-2 inline-block">← Main Dashboard</Link>
      <h1 className="text-lg font-bold mb-1">Book Promotion Links</h1>
      <p className="text-sm text-gray-500 mb-4">कोई भी book चुनो, link बनाओ, share करो</p>

      {!selectedBook ? (
        <>
          <p className="text-sm font-semibold mb-2">एक Book चुनो</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {books.map((b) => {
              const discountedPaise = Math.round(b.price_paise * (1 - b.discount_percent / 100));
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBook(b)}
                  className="border border-gray-200 rounded-xl overflow-hidden text-left"
                >
                  {b.cover_image_url ? (
                    <img src={b.cover_image_url} alt={b.title} className="w-full h-32 object-contain bg-gray-50" />
                  ) : (
                    <div className="w-full h-32 bg-gray-100" />
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-2">{b.title}</p>
                    <p className="text-sm font-bold mt-1">₹{(discountedPaise / 100).toFixed(0)}</p>
                    <p className="text-[10px] text-green-600 mt-0.5">{b.commission_percent}% commission</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          {selectedBook.cover_image_url ? (
            <img src={selectedBook.cover_image_url} alt={selectedBook.title} className="w-full h-48 object-contain bg-gray-50" />
          ) : null}
          <div className="p-4">
            <p className="text-sm font-bold">{selectedBook.title}</p>
            <p className="text-sm text-gray-500">₹{(selectedBook.price_paise / 100).toFixed(0)}</p>
            <p className="text-xs text-green-600 mt-1">इसे share करके {selectedBook.commission_percent}% कमाओ</p>

            <label className="text-xs text-gray-500 block mt-4 mb-1">Video Label (सिर्फ आपके लिए)</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3" placeholder="e.g. Book Review Video" value={label} onChange={(e) => setLabel(e.target.value)} />

            <div className="flex gap-2">
              <button type="button" onClick={() => setSelectedBook(null)} className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium py-2.5 rounded-lg">
                वापस
              </button>
              <button type="button" onClick={handleCreate} disabled={creating} className="flex-1 bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50">
                {creating ? "बना रहे हैं..." : "Link बनाओ"}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-sm font-semibold mb-2">आपके Book Links ({links.length})</p>
      <div className="space-y-3">
        {links.map((link) => {
          return (
            <div key={link.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex">
                {link.books?.cover_image_url ? (
                  <img src={link.books.cover_image_url} alt="" className="w-20 h-24 object-contain bg-gray-50" />
                ) : (
                  <div className="w-20 h-24 bg-gray-100" />
                )}
                <div className="p-3 flex-1">
                  <p className="text-xs font-medium line-clamp-1">{link.video_label || link.books?.title}</p>
                  <p className="text-[10px] text-gray-400">{link.books?.title}</p>
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>👆 {link.click_count} clicks</span>
                    <span>🛒 {link.signup_count} orders</span>
                  </div>
                  <p className="text-[10px] text-green-600 mt-0.5">{link.books?.commission_percent}% commission</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(link)}
                className="w-full border-t border-gray-200 text-orange-600 text-xs font-medium py-2"
              >
                {copiedId === link.id ? "✓ Copied!" : `Copy Link — /go/${link.ref_code}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
