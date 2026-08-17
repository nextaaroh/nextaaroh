"use client";
import { useEffect, useState } from "react";

type Application = { status: string } | null;

export default function CreatorApplyPage() {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [application, setApplication] = useState<Application>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/v1/creator-club/apply")
      .then((res) => res.json())
      .then((data) => setApplication(data.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit() {
    if (!handle.trim()) {
      setMessage("Social handle डालना ज़रूरी है");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/v1/creator-club/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ social_handle: handle, platform }),
    });
    const data = await res.json();
    if (res.ok) {
      setApplication({ status: "pending" });
    } else {
      setMessage(data.error?.message ?? "कुछ गलत हो गया");
    }
    setSubmitting(false);
  }

  if (loading) return <div className="max-w-md mx-auto p-4 text-sm text-gray-500">Loading...</div>;

  if (application?.status === "approved") {
    return (
      <div className="max-w-md mx-auto p-4 text-center mt-10">
        <p className="text-4xl mb-3">🎉</p>
        <h1 className="text-lg font-bold mb-2">आप Creator हो!</h1>
        <p className="text-sm text-gray-500 mb-4">अपने video links बनाना शुरू करो</p>
        <a href="/creator-club/dashboard" className="inline-block bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-lg">
          Dashboard खोलो
        </a>
      </div>
    );
  }

  if (application?.status === "pending") {
    return (
      <div className="max-w-md mx-auto p-4 text-center mt-10">
        <p className="text-4xl mb-3">⏳</p>
        <h1 className="text-lg font-bold mb-2">Application Pending</h1>
        <p className="text-sm text-gray-500">Admin जल्द ही review करेंगे</p>
      </div>
    );
  }

  if (application?.status === "rejected") {
    return (
      <div className="max-w-md mx-auto p-4 text-center mt-10">
        <p className="text-sm text-gray-500">आपकी application approve नहीं हुई। ज़्यादा जानकारी के लिए support से संपर्क करें।</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-1">NextAaroh Creator Club</h1>
      <p className="text-sm text-gray-500 mb-4">Video बनाओ, नए users लाओ, कमाओ!</p>
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="YouTube">YouTube</option>
          <option value="Instagram">Instagram</option>
          <option value="Other">Other</option>
        </select>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Your @handle / Channel Link" value={handle} onChange={(e) => setHandle(e.target.value)} />
        {message ? <p className="text-xs text-orange-600">{message}</p> : null}
        <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full bg-orange-500 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50">
          {submitting ? "Submitting..." : "Apply करो"}
        </button>
      </div>
    </div>
  );
}
