"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type CreatorLink = {
  id: string;
  ref_code: string;
  video_label: string | null;
  click_count: number;
  signup_count: number;
  book_id: string | null;
};

export default function SignupLinksDashboard() {
  const [links, setLinks] = useState<CreatorLink[]>([]);
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [payoutMessage, setPayoutMessage] = useState<Record<string, string>>({});

  async function loadLinks() {
    const res = await fetch("/api/v1/creator-club/links");
    const data = await res.json();
    if (res.ok) setLinks((data.data ?? []).filter((l: CreatorLink) => !l.book_id));
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function handleCreate() {
    setCreating(true);
    await fetch("/api/v1/creator-club/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_label: label, link_type: "signup" }),
    });
    setLabel("");
    setCreating(false);
    loadLinks();
  }

  async function handleCopy(link: CreatorLink) {
    const url = `${window.location.origin}/go/${link.ref_code}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handlePayoutRequest(link: CreatorLink) {
    const res = await fetch("/api/v1/creator-club/payout-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link_id: link.id }),
    });
    const data = await res.json();
    setPayoutMessage((prev) => ({
      ...prev,
      [link.id]: res.ok ? `✓ Request भेजी गई (₹${(data.amount_paise / 100).toFixed(0)})` : data.error?.message,
    }));
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Link href="/creator-club/dashboard" className="text-xs text-gray-400 mb-2 inline-block">← Main Dashboard</Link>
      <h1 className="text-lg font-bold mb-1">Signup Links</h1>
      <p className="text-sm text-gray-500 mb-4">NextAaroh पर नए users लाओ</p>

      <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-6 text-xs">
        <p className="font-semibold mb-1">Payout Levels</p>
        <div className="grid grid-cols-2 gap-1 text-gray-600">
          <span>20+ signups</span><span className="text-right">₹200</span>
          <span>40+ signups</span><span className="text-right">₹350</span>
          <span>50+ signups</span><span className="text-right">₹400</span>
          <span>100+ signups</span><span className="text-right">₹599</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <label className="text-xs text-gray-500 block mb-1">Video Label (सिर्फ आपके लिए)</label>
        <div className="flex gap-2">
          <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Video 1 - Earn Money" value={label} onChange={(e) => setLabel(e.target.value)} />
          <button type="button" onClick={handleCreate} disabled={creating} className="bg-orange-500 text-white text-sm font-medium px-4 rounded-lg disabled:opacity-50">
            {creating ? "..." : "New Link"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {links.map((link) => {
          const slabInfo =
            link.signup_count >= 100 ? "₹599" :
            link.signup_count >= 50 ? "₹400" :
            link.signup_count >= 40 ? "₹350" :
            link.signup_count >= 20 ? "₹200" : "20+ signups needed";
          return (
            <div key={link.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium">{link.video_label || "Untitled Link"}</p>
              <p className="text-xs text-gray-400 font-mono">/go/{link.ref_code}</p>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>👆 {link.click_count} clicks</span>
                <span>👤 {link.signup_count} signups</span>
                <span className="text-green-600 font-medium">{slabInfo}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => handleCopy(link)} className="flex-1 border border-orange-400 text-orange-600 text-xs font-medium py-2 rounded-lg">
                  {copiedId === link.id ? "✓ Copied!" : "Copy Link"}
                </button>
                {link.signup_count >= 20 ? (
                  <button type="button" onClick={() => handlePayoutRequest(link)} className="flex-1 bg-green-500 text-white text-xs font-medium py-2 rounded-lg">
                    Payout Request
                  </button>
                ) : null}
              </div>
              {link.signup_count < 20 ? (
                <p className="text-xs text-orange-600 mt-2">
                  {20 - link.signup_count} more signups needed for payout (₹200 at 20)
                </p>
              ) : null}
              {payoutMessage[link.id] ? <p className="text-xs text-orange-600 mt-2">{payoutMessage[link.id]}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
