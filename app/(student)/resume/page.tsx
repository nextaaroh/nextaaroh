"use client";
import { useEffect, useState } from "react";

type Certificate = { id: string; title: string; issuer: string | null };
type Project = { id: string; title: string; description: string | null; project_url: string | null };

type Profile = {
  full_name: string;
  bio: string | null;
  state: string;
  district: string;
  skills: string[];
  instagram_url: string | null;
  linkedin_url: string | null;
  certificates: Certificate[];
  projects: Project[];
};

export default function ResumePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, []);

  if (!profile) {
    return <p className="text-center text-gray-400 text-sm py-8">Loading...</p>;
  }

  return (
    <div>
      <div className="max-w-md mx-auto p-4 print:hidden">
        <button type="button" onClick={() => window.print()} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg">
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6 bg-white">
        <h1 className="text-2xl font-bold">{profile.full_name}</h1>
        <p className="text-sm text-gray-500 mb-4">{profile.district}, {profile.state}</p>

        {profile.bio ? (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1">About</p>
            <p className="text-sm text-gray-700">{profile.bio}</p>
          </div>
        ) : null}

        {profile.skills?.length > 0 ? (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Skills</p>
            <p className="text-sm text-gray-700">{profile.skills.join(" · ")}</p>
          </div>
        ) : null}

        {profile.projects?.length > 0 ? (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Projects</p>
            {profile.projects.map((proj) => {
              return (
                <div key={proj.id} className="mb-2">
                  <p className="text-sm font-medium">{proj.title}</p>
                  {proj.description ? <p className="text-xs text-gray-600">{proj.description}</p> : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {profile.certificates?.length > 0 ? (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Certificates</p>
            {profile.certificates.map((cert) => {
              return (
                <p key={cert.id} className="text-sm text-gray-700">
                  {cert.title}{cert.issuer ? " — " + cert.issuer : ""}
                </p>
              );
            })}
          </div>
        ) : null}

        {profile.instagram_url || profile.linkedin_url ? (
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Links</p>
            <p className="text-sm text-gray-700">
              {profile.instagram_url ? profile.instagram_url : ""} {profile.linkedin_url ? " · " + profile.linkedin_url : ""}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
