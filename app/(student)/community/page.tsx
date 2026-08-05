"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMS = [
  "upsc", "ssc", "neet", "jee", "cuet", "banking",
  "10th-board", "12th-board", "gate", "cat", "clat",
  "nda", "cds", "railway-rrb", "ctet-tet", "police-si",
  "state-psc", "polytechnic", "ielts-toefl", "gre-gmat",
];

const POPULAR_COLLEGES = ["iit-bombay", "iit-delhi", "aiims-delhi", "du"];
const STATES = ["bihar", "chhattisgarh", "uttar-pradesh", "maharashtra", "madhya-pradesh"];

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function CommunityIndexPage() {
  const router = useRouter();
  const [collegeInput, setCollegeInput] = useState("");

  function goToCollegeCommunity() {
    const slug = slugify(collegeInput);
    if (!slug) return;
    router.push(`/community/college/${slug}`);
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-6">
      <h1 className="text-lg font-bold">Community</h1>

      <Section title="Exam Communities" type="exam" items={EXAMS} />

      <div>
        <h2 className="text-sm font-semibold mb-2">College Community</h2>
        <p className="text-xs text-gray-500 mb-2">
          अपने college का नाम लिखें — अगर community पहले से नहीं है, तो आपकी पहली post से बन जाएगी
        </p>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="जैसे: RD National College Mumbai"
            value={collegeInput}
            onChange={(e) => setCollegeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToCollegeCommunity();
            }}
          />
          <button
            type="button"
            onClick={goToCollegeCommunity}
            className="shrink-0 bg-orange-500 text-white text-sm font-medium px-4 rounded-lg"
          >
            Go
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {POPULAR_COLLEGES.map((item) => {
            return (
              <Link
                key={item}
                href={`/community/college/${item}`}
                className="text-xs bg-gray-100 rounded-full px-3 py-1.5 capitalize"
              >
                {item.replace(/-/g, " ")}
              </Link>
            );
          })}
        </div>
      </div>

      <Section title="State Communities" type="state" items={STATES} />
    </div>
  );
}

function Section({ title, type, items }: { title: string; type: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          return (
            <Link
              key={item}
              href={`/community/${type}/${item}`}
              className="text-xs bg-gray-100 rounded-full px-3 py-1.5 capitalize"
            >
              {item.replace(/-/g, " ")}
            </Link>
          );
        })}
      </div>
    </div>
  );
}