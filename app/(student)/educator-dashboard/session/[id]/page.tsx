"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Participant = {
  profile_id: string;
  profiles: { full_name: string; username: string; mobile_number: string } | null;
};

export default function SessionParticipantsPage() {
  const params = useParams<{ id: string }>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/educator/meetings/" + params.id + "/participants")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setParticipants(data?.data ?? []))
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false));
  }, [params.id]);

  function whatsappLink(mobile: string) {
    return "https://wa.me/91" + mobile;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">Registered Participants ({participants.length})</h1>
      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : null}
      {!loading && participants.length === 0 ? <p className="text-gray-400 text-sm">अभी कोई register नहीं हुआ</p> : null}
      <div className="space-y-2">
        {participants.map((p) => {
          return (
            <div key={p.profile_id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
              <div>
                <p className="text-sm font-medium">{p.profiles?.full_name}</p>
                <p className="text-xs text-gray-400">@{p.profiles?.username}</p>
              </div>
              {p.profiles?.mobile_number ? (
                <a href={whatsappLink(p.profiles.mobile_number)} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg">
                  WhatsApp
                </a>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
