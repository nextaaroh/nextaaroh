"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Summary = {
  pending_paise: number;
  claimable_paise: number;
  claimed_paise: number;
  total_books_sold: number;
  milestones: { count: number; reward: string; achieved: boolean; status: string }[];
};

export default function CreatorMainDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSummary() {
    const res = await fetch("/api/v1/creator-club/summary");
    const data = await res.json();
    if (res.ok) setSummary(data);
  }

  useEffect(() => {
    loadSummary();
  }, []);

  async function handleClaim() {
    setClaiming(true);
    setMessage("");
    const res = await fetch("/api/v1/creator-club/claim-wallet", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setMessage(`✓ ₹${(data.amount_paise / 100).toFixed(0)} wallet में भेज दिया गया`);
      loadSummary();
    } else {
      setMessage(data.error?.message ?? "कुछ गलत हो गया");
    }
    setClaiming(false);
  }

  if (!summary) return <div className="max-w-md mx-auto p-4 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-1">Creator Dashboard</h1>
      <p className="text-sm text-gray-500 mb-4">आपकी पूरी earning यहाँ एक जगह</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
          <p className="text-xs text-orange-600">Pending</p>
          <p className="text-lg font-bold">₹{(summary.pending_paise / 100).toFixed(0)}</p>
          <p className="text-[10px] text-gray-400">30 दिन बाद unlock</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-xs text-green-600">Tracked (Claimable)</p>
          <p className="text-lg font-bold">₹{(summary.claimable_paise / 100).toFixed(0)}</p>
        </div>
      </div>

      {summary.claimable_paise > 0 ? (
        <button
          type="button"
          onClick={handleClaim}
          disabled={claiming}
          className="w-full bg-purple-700 text-white font-semibold py-3 rounded-lg mb-2 disabled:opacity-50"
        >
          {claiming ? "Sending..." : `NextAaroh Wallet में भेजो (₹${(summary.claimable_paise / 100).toFixed(0)})`}
        </button>
      ) : null}
      {message ? <p className="text-xs text-center text-orange-600 mb-4">{message}</p> : null}

      <p className="text-xs text-gray-400 mb-6">
        कुल claim किया हुआ: ₹{(summary.claimed_paise / 100).toFixed(0)} (यह पैसा NextAaroh Wallet में जा चुका है, वहाँ से आप UPI/Bank में withdraw कर सकते हो)
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/creator-club/dashboard/signup" className="bg-orange-500 text-white rounded-xl p-4 text-center shadow-md active:scale-95 transition-transform">
          <p className="text-2xl mb-1">👤</p>
          <p className="text-sm font-semibold">Signup Links</p>
          <p className="text-[10px] text-white/80">NextAaroh promote करो</p>
        </Link>
        <Link href="/creator-club/dashboard/books" className="bg-purple-700 text-white rounded-xl p-4 text-center shadow-md active:scale-95 transition-transform">
          <p className="text-2xl mb-1">📚</p>
          <p className="text-sm font-semibold">Book Links</p>
          <p className="text-[10px] text-white/80">Books promote करो</p>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-bold mb-2">🎁 Reward Milestones (कुल Books बेचे)</p>
        <p className="text-xs text-gray-500 mb-3">अभी तक: {summary.total_books_sold} books becha (सभी book links मिलाकर)</p>
        <div className="space-y-2">
          {summary.milestones.map((m) => {
            return (
              <div key={m.count} className={`flex justify-between items-center text-xs p-2 rounded-lg ${m.achieved ? "bg-green-50" : "bg-gray-50"}`}>
                <div>
                  <p className="font-medium">{m.count}+ Books</p>
                  <p className="text-gray-500">{m.reward}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] ${
                  m.status === "sent" ? "bg-green-500 text-white" :
                  m.achieved ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-400"
                }`}>
                  {m.status === "sent" ? "भेज दिया" : m.achieved ? "Pending से भेजा जाएगा" : "अभी बाकी"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-xs text-gray-600 space-y-2">
        <p className="font-bold text-sm text-gray-800">💰 पैसा कैसे मिलेगा</p>
        <p>1. Signup Links या Book Links से जो कमाई होती है, वो पहले <strong>Pending</strong> में दिखती है।</p>
        <p>2. Book commission 30 दिन बाद अपने आप <strong>Tracked/Claimable</strong> हो जाता है (यह return window की वजह से है)। Signup link payout NextAaroh Team verify करने के बाद turant claimable हो जाता है।</p>
        <p>3. आप ऊपर वाला बटन दबाकर पैसा <strong>NextAaroh Wallet</strong> में भेज सकते हो।</p>
        <p>4. Wallet से आप UPI या Bank account में withdraw कर सकते हो (Profile → Wallet section में जाकर)।</p>
      </div>

      <details className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
        <summary className="font-bold text-gray-700 cursor-pointer">Terms & Conditions</summary>
        <ul className="mt-2 space-y-1 list-disc pl-4">
          <li>Fake clicks, bots, या fraud तरीके से signups/orders लाने पर account block हो सकता है।</li>
          <li>Reward (T-shirt/shoes/cash) भेजने में समय लग सकता है, NextAaroh team आपसे delivery details के लिए संपर्क करेगी।</li>
          <li>Commission की राशि admin verification के बाद ही final मानी जाएगी।</li>
        </ul>
      </details>
    </div>
  );
}
