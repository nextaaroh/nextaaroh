"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Book = {
  id: string;
  title: string;
  cover_image_url: string | null;
  price_paise: number;
  discount_percent: number;
  pages: number | null;
  publisher: string | null;
  author: string | null;
  description: string | null;
  cover_image_url_2: string | null;
  language: string | null;
  commission_percent: number;
};

export default function BookDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookId = params.id as string;
  const referredBy = searchParams.get("ref");

  const [book, setBook] = useState<Book | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [roadArea, setRoadArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount_type: string; discount_value: number } | null>(null);
  const [promoMessage, setPromoMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    fetch(`/api/v1/shop/books/${bookId}`)
      .then((res) => res.json())
      .then((data) => setBook(data.data ?? null));
  }, [bookId]);

  if (!book) {
    return <div className="max-w-md mx-auto p-4 text-sm text-gray-500">Loading...</div>;
  }

  const priceAfterDiscount = Math.round(book.price_paise * (1 - book.discount_percent / 100));

  let promoDiscountPaise = 0;
  if (promoApplied) {
    promoDiscountPaise =
      promoApplied.discount_type === "percent"
        ? Math.round(priceAfterDiscount * (promoApplied.discount_value / 100))
        : promoApplied.discount_value * 100;
  }
  const finalPricePaise = Math.max(priceAfterDiscount - promoDiscountPaise, 0);

  async function handleCopyLink() {
    const link = `${window.location.origin}/shop/book/${book?.id}?ref=${userId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function applyPromo() {
    setPromoMessage("");
    if (!promoInput.trim()) return;
    const res = await fetch(`/api/v1/shop/promo/${promoInput.trim()}`);
    const data = await res.json();
    if (!res.ok) {
      setPromoMessage(data.error?.message ?? "Invalid code");
      setPromoApplied(null);
      return;
    }
    setPromoApplied(data.data);
    setPromoMessage("✓ Promo code apply हो गया!");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!name.trim() || !phone.trim() || !houseNo.trim() || !roadArea.trim() || !pincode.trim() || !city.trim() || !state.trim()) {
      setMessage("सारी details भरना ज़रूरी है");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/shop/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: book.id,
          referred_by: referredBy ?? null,
          buyer_name: name,
          buyer_phone: phone,
          house_no: houseNo,
          road_area: roadArea,
          pincode,
          city,
          state,
          promo_code: promoApplied?.code ?? null,
          discount_paise: promoDiscountPaise,
          final_price_paise: finalPricePaise,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setDone(true);
    } catch {
      setMessage("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto p-4 text-center mt-10">
        <p className="text-4xl mb-3">✅</p>
        <h1 className="text-lg font-bold mb-2">Order मिल गया!</h1>
        <p className="text-sm text-gray-500">आपका order confirm हो गया है, जल्द ही process होगा। Cash on Delivery रखें।</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {!showForm ? (
        <>
          {book.cover_image_url ? (
            <div>
              <img
                src={activeImage === 1 && book.cover_image_url_2 ? book.cover_image_url_2 : book.cover_image_url}
                alt={book.title}
                className="w-full h-72 object-contain bg-gray-50 rounded-xl mb-2"
              />
              {book.cover_image_url_2 ? (
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setActiveImage(0)} className={`flex-1 h-16 rounded-lg overflow-hidden border-2 ${activeImage === 0 ? "border-orange-500" : "border-gray-200"}`}>
                    <img src={book.cover_image_url} alt="1" className="w-full h-full object-cover" />
                  </button>
                  <button type="button" onClick={() => setActiveImage(1)} className={`flex-1 h-16 rounded-lg overflow-hidden border-2 ${activeImage === 1 ? "border-orange-500" : "border-gray-200"}`}>
                    <img src={book.cover_image_url_2} alt="2" className="w-full h-full object-cover" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <h1 className="text-lg font-bold">{book.title}</h1>
          {book.author ? <p className="text-sm text-gray-500">by {book.author}</p> : null}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xl font-bold">₹{(priceAfterDiscount / 100).toFixed(0)}</p>
            {book.discount_percent > 0 ? (
              <>
                <p className="text-sm text-gray-400 line-through">₹{(book.price_paise / 100).toFixed(0)}</p>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{book.discount_percent}% OFF</span>
              </>
            ) : null}
          </div>
          {book.commission_percent > 0 ? (
            <p className="text-xs text-green-600 mt-1">इस book को share करके {book.commission_percent}% कमाओ</p>
          ) : null}

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-4 mb-4">
            {book.publisher ? <p>Publisher: {book.publisher}</p> : null}
            {book.pages ? <p>Pages: {book.pages}</p> : null}
            {book.language ? <p>Language: {book.language}</p> : null}
          </div>

          {book.description ? <p className="text-sm text-gray-600 mb-6">{book.description}</p> : null}

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg"
          >
            Buy Now
          </button>

          {userId ? (
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full mt-3 border border-orange-400 text-orange-600 font-medium py-2.5 rounded-lg text-sm"
            >
              {copied ? "✓ Link Copy हो गया!" : `Share करो & ${book.commission_percent}% कमाओ`}
            </button>
          ) : null}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-base font-bold mb-3">Delivery Address</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 mb-4">
            <div>
              <label className="text-xs text-gray-500">Name *</label>
              <input className="w-full border-b border-gray-200 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500">Contact Number *</label>
              <input className="w-full border-b border-gray-200 py-2 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500">House No. / Building Name *</label>
              <input className="w-full border-b border-gray-200 py-2 text-sm" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500">Road Name / Area / Colony *</label>
              <input className="w-full border-b border-gray-200 py-2 text-sm" value={roadArea} onChange={(e) => setRoadArea(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500">Pincode *</label>
              <input className="w-full border-b border-gray-200 py-2 text-sm" value={pincode} onChange={(e) => setPincode(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">City *</label>
                <input className="w-full border-b border-gray-200 py-2 text-sm" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">State *</label>
                <input className="w-full border-b border-gray-200 py-2 text-sm" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <label className="text-xs text-gray-500 block mb-1">Promo Code</label>
            <div className="flex gap-2">
              <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Enter code" />
              <button type="button" onClick={applyPromo} className="bg-gray-100 text-sm font-medium px-4 rounded-lg">Apply</button>
            </div>
            {promoMessage ? <p className="text-xs mt-1 text-orange-600">{promoMessage}</p> : null}
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4 text-sm">
            <div className="flex justify-between"><span>Price</span><span>₹{(priceAfterDiscount / 100).toFixed(0)}</span></div>
            {promoDiscountPaise > 0 ? (
              <div className="flex justify-between text-green-600"><span>Promo Discount</span><span>-₹{(promoDiscountPaise / 100).toFixed(0)}</span></div>
            ) : null}
            <div className="flex justify-between font-bold mt-1 pt-1 border-t border-orange-200"><span>Total (COD)</span><span>₹{(finalPricePaise / 100).toFixed(0)}</span></div>
          </div>

          {message ? <p className="text-sm text-red-500 mb-3">{message}</p> : null}

          <button type="submit" disabled={submitting} className="w-full bg-purple-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
            {submitting ? "Placing Order..." : "Continue"}
          </button>
        </form>
      )}
    </div>
  );
}
