"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Conversation = {
  id: string;
  profiles: { full_name: string; username: string; mobile_number: string } | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
};

export default function AdminChatsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/manager/chats")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setConversations(data?.data ?? []))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Student Chats</h1>
      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : null}
      <div className="space-y-2">
        {conversations.map((conv) => {
          return (
            <Link key={conv.id} href={"/admin/chats/" + conv.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{conv.profiles?.full_name} <span className="text-gray-400">@{conv.profiles?.username}</span></p>
                <p className="text-xs text-gray-400 truncate max-w-xs">{conv.last_message ?? "कोई message नहीं"}</p>
              </div>
              {conv.unread_count > 0 ? <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">{conv.unread_count}</span> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
