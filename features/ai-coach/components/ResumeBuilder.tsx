"use client";
import { useState } from "react";

export default function ResumeBuilder() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/ai/generate-resume", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setResumeText(data.resume_text);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(resumeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <p className="text-sm font-semibold mb-1">📄 AI Resume Builder</p>
        <p className="text-xs text-gray-500">असली AI आपकी Profile से professional resume लिखेगा</p>
      </div>

      <button type="button" onClick={generate} disabled={loading} className="w-full bg-purple-600 text-white text-sm font-medium py-3 rounded-lg disabled:opacity-50">
        {loading ? "AI resume लिख रहा है..." : resumeText ? "🔄 फिर से बनाएं" : "✨ AI से Resume बनाएं"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {resumeText ? (
        <>
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <pre className="text-xs whitespace-pre-wrap font-mono text-gray-800">{resumeText}</pre>
          </div>
          <button type="button" onClick={handleCopy} className="w-full border-2 border-purple-500 text-purple-600 text-sm font-medium py-2.5 rounded-lg">
            {copied ? "✓ Copied!" : "📋 Copy Resume Text"}
          </button>
        </>
      ) : null}
    </div>
  );
}
