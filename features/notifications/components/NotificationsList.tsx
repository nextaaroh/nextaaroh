"use client";
import { useEffect, useState, useCallback } from "react";
import NotificationItem from "./NotificationItem";

type Notification = {
  id: string;
  category: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/v1/notifications")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setNotifications(data?.data ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await fetch("/api/v1/notifications/" + id + "/read", { method: "POST" });
    } catch {
      // silently ignore for now
    }
  }

  async function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await fetch("/api/v1/notifications/read-all", { method: "POST" });
    } catch {
      // silently ignore for now
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold">Notifications</h1>
        {unreadCount > 0 ? (
          <button type="button" onClick={markAllAsRead} className="text-xs text-orange-500 font-medium">
            Mark all as read
          </button>
        ) : null}
      </div>

      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && notifications.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">अभी कोई notification नहीं है</p>
      ) : null}

      {notifications.map((notification) => {
        return <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />;
      })}
    </div>
  );
}