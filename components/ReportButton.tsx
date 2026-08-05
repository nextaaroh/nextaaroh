"use client";
import { useState } from "react";

type Props = {
  contentType: string;
  contentId: string;
};

const REASONS = [
  { value: "copyright", label: "Copyright issue" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "spam_scam", label: "Spam / Scam" },
  { value: "other", label: "Other" },
];

export default function ReportButton({ contentType, contentId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!reason) return;
    try {
      await fetch("/api/v1/report/" + contentType + "/" + contentId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      setSubmitted(true);
    } catch {
      // silently ignore for now
    }
  }

  if (submitted) {
    return <p className="text-xs text-green-600">Report submit हो गई, धन्यवाद।</p>;
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-gray-400">
        🚩 Report
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 mt-2">
      <p className="text-xs font-medium mb-2">Report करने का कारण चुनें:</p>
      <div className="space-y-1 mb-3">
        {REASONS.map((r) => {
          return (
            <label key={r.value} className="flex items-center gap-2 text-xs">
              <input type="radio" name="report-reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} />
              {r.label}
            </label>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={handleSubmit} disabled={!reason} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded disabled:opacity-50">
          Submit
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 px-3 py-1.5">
          Cancel
        </button>
      </div>
    </div>
  );
}