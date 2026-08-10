import Link from "next/link";

type Meeting = { id: string; title: string; description: string | null; scheduled_at: string };

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Link href={"/meetings/" + meeting.id} className="block border border-gray-200 rounded-xl p-4">
      <p className="font-medium text-sm">{meeting.title}</p>
      {meeting.description ? <p className="text-xs text-gray-500 mt-1 line-clamp-2">{meeting.description}</p> : null}
      <p className="text-xs text-orange-500 mt-2">{new Date(meeting.scheduled_at).toLocaleString("en-IN")}</p>
    </Link>
  );
}
