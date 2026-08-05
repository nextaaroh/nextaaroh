"use client";
import { useEffect, useState } from "react";

type ReferralStats = {
  referral_code: string;
  share_url: string;
  total_referrals: number;
  points_earned: number;
};

export default function ReferralCard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/v1/referrals/my-link")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  function handleCopy() {
    if (!stats) return;
    navigator.clipboard.writeText(stats.share_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleShare() {
    if (!stats) return;
    if (navigator.share) {
      navigator.share({
        title: "NextAaroh — Skills, Leadership, Employment & Entrepreneurship",
        text: "मेरे साथ NextAaroh join करो, दोनों को points मिलेंगे!",
        url: stats.share_url,
      });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-gradient-to-br from-[#0a1a3a] to-[#132a5c] text-white rounded-xl p-5 text-center mb-4">
        <p className="text-3xl mb-1">🎁</p>
        <h1 className="text-lg font-bold mb-1">Refer & Earn</h1>
        <p className="text-sm text-white/70">
          दोस्तों को invite करो — दोनों को 100 points मिलेंगे जब वो अपनी profile complete करेंगे
        </p>
      </div>

      {stats ? (
        <>
          <div className="border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">आपका Referral Code</p>
            <p className="text-xl font-bold tracking-wide text-orange-600">{stats.referral_code}</p>
          </div>

          <div className="flex gap-2 mb-4">
            <button type="button" onClick={handleCopy} className="flex-1 border border-orange-500 text-orange-500 font-medium py-2.5 rounded-lg text-sm">
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button type="button" onClick={handleShare} className="flex-1 bg-orange-500 text-white font-medium py-2.5 rounded-lg text-sm">
              Share
            </button>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-orange-600">{stats.total_referrals}</p>
              <p className="text-xs text-gray-500">Friends Joined</p>
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-700">{stats.points_earned}</p>
              <p className="text-xs text-gray-500">Points Earned</p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400 text-sm py-6">Loading...</p>
      )}
    </div>
  );
}
