type Notification = {
  id: string;
  category: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  points: "⭐",
  referral: "🎁",
  quiz_result: "📝",
  certificate: "🏅",
  community_reply: "💬",
  opportunity_status: "🎯",
  marketplace_status: "🛍️",
  system: "🔔",
};

export default function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) {
  const icon = CATEGORY_ICONS[notification.category] ?? "🔔";

  return (
    <button
      type="button"
      onClick={() => onRead(notification.id)}
      className={
        notification.is_read
          ? "w-full text-left flex gap-3 px-4 py-3 border-b border-gray-100"
          : "w-full text-left flex gap-3 px-4 py-3 border-b border-gray-100 bg-orange-50"
      }
    >
      <span className="text-xl shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{notification.title}</p>
        {notification.body ? <p className="text-xs text-gray-500 mt-0.5">{notification.body}</p> : null}
      </div>
      {!notification.is_read ? <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1.5" /> : null}
    </button>
  );
}