"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import WalletSection from "./WalletSection";
import GamificationCard from "@/features/gamification/components/GamificationCard";
import { uploadToImgbb } from "@/lib/imgbb/uploadImage";

type Certificate = { id: string; title: string; issuer: string | null; issue_date: string | null };
type Project = { id: string; title: string; description: string | null; project_url: string | null };

type Profile = {
  username: string;
  full_name: string;
  bio: string | null;
  dream: string | null;
  photo_url: string | null;
  class_segment: string;
  state: string;
  district: string;
  skills: string[];
  instagram_url: string | null;
  linkedin_url: string | null;
  certificates: Certificate[];
  projects: Project[];
};

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [dream, setDream] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projUrl, setProjUrl] = useState("");

  const load = useCallback(() => {
    fetch("/api/v1/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          setBio(data.bio ?? "");
          setDream(data.dream ?? "");
          setSkills(data.skills ?? []);
          setInstagramUrl(data.instagram_url ?? "");
          setLinkedinUrl(data.linkedin_url ?? "");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function enterEditMode() {
    setEditMode(true);
  }

  function cancelEdit() {
    if (profile) {
      setBio(profile.bio ?? "");
      setDream(profile.dream ?? "");
      setSkills(profile.skills ?? []);
      setInstagramUrl(profile.instagram_url ?? "");
      setLinkedinUrl(profile.linkedin_url ?? "");
    }
    setEditMode(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/v1/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, dream, skills, instagram_url: instagramUrl, linkedin_url: linkedinUrl }),
      });
      setEditMode(false);
      load();
    } catch {
      // silently ignore for now
    } finally {
      setSaving(false);
    }
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  async function addCertificate() {
    if (!certTitle.trim()) return;
    await fetch("/api/v1/me/profile-certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: certTitle, issuer: certIssuer }),
    });
    setCertTitle("");
    setCertIssuer("");
    load();
  }

  async function removeCertificate(id: string) {
    await fetch("/api/v1/me/profile-certificates/" + id, { method: "DELETE" });
    load();
  }

  async function addProject() {
    if (!projTitle.trim()) return;
    await fetch("/api/v1/me/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: projTitle, description: projDesc, project_url: projUrl }),
    });
    setProjTitle("");
    setProjDesc("");
    setProjUrl("");
    load();
  }

  async function removeProject(id: string) {
    await fetch("/api/v1/me/projects/" + id, { method: "DELETE" });
    load();
  }

  async function handlePhotoChange(file: File | null) {
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadToImgbb(file);
      const res = await fetch("/api/v1/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: url }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert("Save नहीं हुआ: " + (data.error?.message ?? "unknown"));
      }
      load();
    } catch (err) {
      alert("Upload नहीं हुआ: " + String(err));
    } finally {
      setUploadingPhoto(false);
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
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-600 overflow-hidden ring-2 ring-orange-200">
            {profile.photo_url ? (
              <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              profile.full_name?.[0]?.toUpperCase() ?? "?"
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm cursor-pointer ring-2 ring-white">
            {uploadingPhoto ? "…" : "📷"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <p className="font-semibold text-lg mt-1">{profile.full_name}</p>
        <p className="text-sm text-gray-500">@{profile.username}</p>
        <p className="text-xs text-gray-400">{profile.district}, {profile.state}</p>
        <div className="flex gap-3 mt-1">
          {instagramUrl ? <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-500">Instagram</a> : null}
          {linkedinUrl ? <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600">LinkedIn</a> : null}
        </div>

        {!editMode ? (
          <button type="button" onClick={enterEditMode} className="mt-3 border border-gray-300 text-gray-700 text-sm font-medium px-6 py-1.5 rounded-lg">
            Edit Profile
          </button>
        ) : null}
      </div>

      <WalletSection />

      <GamificationCard />

      <section>
        <label className="text-sm font-medium block mb-1">Bio</label>
        {editMode ? (
          <textarea className="input resize-none" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="अपने बारे में कुछ लिखें..." />
        ) : (
          <p className="text-sm text-gray-700">{bio || "अभी कोई bio नहीं है"}</p>
        )}
      </section>

      <section>
        <label className="text-sm font-medium block mb-1">आपका सपना</label>
        {editMode ? (
          <input className="input" value={dream} onChange={(e) => setDream(e.target.value)} placeholder="जैसे: IAS officer बनना है" />
        ) : (
          <p className="text-sm text-gray-700">{dream || "अभी कुछ नहीं जोड़ा"}</p>
        )}
      </section>

      <section>
        <label className="text-sm font-medium block mb-2">Skills</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.length === 0 ? <p className="text-sm text-gray-400">अभी कोई skill नहीं है</p> : null}
          {skills.map((skill) => {
            return (
              <span key={skill} className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                {skill}
                {editMode ? <button type="button" onClick={() => removeSkill(skill)} className="text-orange-400">×</button> : null}
              </span>
            );
          })}
        </div>
        {editMode ? (
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="जैसे: Communication, Excel"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <button type="button" onClick={addSkill} className="shrink-0 bg-gray-100 text-gray-700 text-sm px-4 rounded-lg">Add</button>
          </div>
        ) : null}
      </section>

      {editMode ? (
        <section>
          <label className="text-sm font-medium block mb-2">Social Links</label>
          <input className="input mb-2" placeholder="Instagram profile link" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
          <input className="input" placeholder="LinkedIn profile link" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
        </section>
      ) : null}

      {editMode ? (
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} disabled={saving} className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={cancelEdit} className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-lg">
            Cancel
          </button>
        </div>
      ) : null}

      <section className="border-t border-gray-200 pt-5">
        <p className="text-sm font-semibold mb-3">🏅 Certificates</p>
        <div className="space-y-2 mb-3">
          {profile.certificates.length === 0 ? <p className="text-sm text-gray-400">अभी कोई certificate नहीं है</p> : null}
          {profile.certificates.map((cert) => {
            return (
              <div key={cert.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{cert.title}</p>
                  {cert.issuer ? <p className="text-xs text-gray-400">{cert.issuer}</p> : null}
                </div>
                {editMode ? <button type="button" onClick={() => removeCertificate(cert.id)} className="text-red-500 text-xs">Remove</button> : null}
              </div>
            );
          })}
        </div>
        {editMode ? (
          <>
            <div className="flex gap-2">
              <input className="input" placeholder="Certificate title" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} />
              <input className="input" placeholder="Issuer" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} />
            </div>
            <button type="button" onClick={addCertificate} className="mt-2 text-orange-500 text-sm font-medium">+ Add Certificate</button>
          </>
        ) : null}
      </section>

      <section className="border-t border-gray-200 pt-5">
        <p className="text-sm font-semibold mb-3">💼 Projects</p>
        <div className="space-y-2 mb-3">
          {profile.projects.length === 0 ? <p className="text-sm text-gray-400">अभी कोई project नहीं है</p> : null}
          {profile.projects.map((proj) => {
            return (
              <div key={proj.id} className="flex items-start justify-between border border-gray-200 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{proj.title}</p>
                  {proj.description ? <p className="text-xs text-gray-500">{proj.description}</p> : null}
                </div>
                {editMode ? <button type="button" onClick={() => removeProject(proj.id)} className="text-red-500 text-xs shrink-0 ml-2">Remove</button> : null}
              </div>
            );
          })}
        </div>
        {editMode ? (
          <>
            <input className="input mb-2" placeholder="Project title" value={projTitle} onChange={(e) => setProjTitle(e.target.value)} />
            <textarea className="input resize-none mb-2" rows={2} placeholder="Short description" value={projDesc} onChange={(e) => setProjDesc(e.target.value)} />
            <input className="input" placeholder="Project link (optional)" value={projUrl} onChange={(e) => setProjUrl(e.target.value)} />
            <button type="button" onClick={addProject} className="mt-2 text-orange-500 text-sm font-medium">+ Add Project</button>
          </>
        ) : null}
      </section>

      <Link href="/resume" className="block text-center border-2 border-orange-500 text-orange-500 font-semibold py-3 rounded-lg">
        📄 View / Download Resume
      </Link>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">NextAaroh Settings</p>
        <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
          <Link href="/dashboard" className="flex items-center justify-between px-4 py-3 text-sm">
            <span>📊 Dashboard</span>
            <span className="text-gray-300">›</span>
          </Link>
          <Link href="/analytics" className="flex items-center justify-between px-4 py-3 text-sm">
            <span>📈 My Analytics</span>
            <span className="text-gray-300">›</span>
          </Link>
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

      <button type="button" onClick={handleLogout} disabled={loggingOut} className="w-full border border-red-300 text-red-600 font-semibold py-3 rounded-lg disabled:opacity-50">
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
