"use client";
import { useEffect, useState } from "react";

type CoinEvent = {
  type: "coins";
  id: string;
  label: string;
  amount: number;
  note: string | null;
  date: string;
};

type WithdrawalEvent = {
  type: "withdrawal";
  id: string;
  label: string;
  amount: number;
  status: string;
  date: string;
};

type Event = CoinEvent | WithdrawalEvent;

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function CoinsHistoryPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/me/coins-history")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setEvents(data?.data ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">Aaroh Coins History</h1>

      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : null}
      {!loading && events.length === 0 ? <p className="text-gray-400 text-sm">अभी कोई activity नहीं है</p> : null}

      <div className="space-y-2">
        {events.map((event) => {
          if (event.type === "withdrawal") {
            return (
              <div key={event.type + event.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-3">
                <div>
                  <p className="text-sm font-medium">💸 {event.label}</p>
                  <p className="text-xs text-gray-400">{formatDate(event.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-700">₹{(event.amount / 100).toFixed(2)}</p>
                  <span className="text-[10px] capitalize text-gray-500">{event.status}</span>
                </div>
              </div>
            );
          }
          const isPositive = event.amount >= 0;
          return (
            <div key={event.type + event.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-3">
              <div>
                <p className="text-sm font-medium">🪙 {event.label}</p>
                <p className="text-xs text-gray-400">{formatDate(event.date)}</p>
              </div>
              <p className={"text-sm font-bold " + (isPositive ? "text-green-600" : "text-red-500")}>
                {isPositive ? "+" : ""}{event.amount}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
