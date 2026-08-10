"use client";
import { useEffect, useState } from "react";
import MeetingCard from "@/features/meetings/components/MeetingCard";

type Meeting = { id: string; title: string; description: string | null; scheduled_at: string };

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/meetings")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setMeetings(data?.data ?? []))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-lg font-bold mb-3">Meetings & Live Sessions</h1>
      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && meetings.length === 0 ? <p className="text-center text-gray-400 text-sm py-8">अभी कोई upcoming meeting नहीं है</p> : null}
      <div className="space-y-3">
        {meetings.map((m) => {
          return <MeetingCard key={m.id} meeting={m} />;
        })}
      </div>
    </div>
  );
}
