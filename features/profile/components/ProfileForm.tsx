"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import WalletSection from "./WalletSection";

type Profile = {
  username: string;
  full_name: string;
  bio: string | null;
  dream: string | null;
  photo_url: string | null;
  class_segment: string;
  state: string;
  district: string;
};

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState("");
  const [dream, setDream] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          setBio(data.bio ?? "");
          setDream(data.dream ?? "");
        }
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/v1/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, dream }),
      });
      setSaved(true);
    } catch {
      // silently ignore for now
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  }

  if (!profile) {
    return <p className="text-center text-gray-400 text-sm py-8">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-5">
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-600">
          {profile.full_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <p className="font-semibold">{profile.full_name}</p>
        <p className="text-sm text-gray-500">@{profile.username}</p>
        <p className="text-xs text-gray-400">
          {profile.district}, {profile.state}
        </p>
      </div>

      <WalletSection />

      <div>
        <label className="text-sm font-medium block mb-1">Bio</label>
        <textarea
          className="input resize-none"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="अपने बारे में कुछ लिखें..."
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">आपका सपना</label>
        <input
          className="input"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="जैसे: IAS officer बनना है"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {saved ? <p className="text-green-600 text-sm text-center">Saved!</p> : null}

      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">NextAaroh Settings</p>
        <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
          <Link href="/referrals" className="flex items-center justify-between px-4 py-3 text-sm">
            <span>🎁 Refer & Earn</span>
            <span className="text-gray-300">›</span>
          </Link>
          <Link href="/legal/privacy-policy" className="flex items-center justify-between px-4 py-3 text-sm">
            <span>Privacy Policy</span>
            <span className="text-gray-300">›</span>
          </Link>
          <Link href="/legal/terms" className="flex items-center justify-between px-4 py-3 text-sm">
            <span>Terms & Conditions</span>
            <span className="text-gray-300">›</span>
          </Link>
          <Link href="/about" className="flex items-center justify-between px-4 py-3 text-sm">
            <span>About NextAaroh</span>
            <span className="text-gray-300">›</span>
          </Link>
          <Link href="/contact" className="flex items-center justify-between px-4 py-3 text-sm">
            <span>Contact Us</span>
            <span className="text-gray-300">›</span>
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full border border-red-300 text-red-600 font-semibold py-3 rounded-lg disabled:opacity-50"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
