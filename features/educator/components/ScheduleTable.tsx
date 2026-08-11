import { ScheduleItem, VIDEO_GUIDELINES } from "../data/schedules";

export default function ScheduleTable({ schedule }: { schedule: ScheduleItem[] }) {
  return (
    <div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-800 mb-4">
        निर्धारित Publish Date से 1 दिन पहले अपना वीडियो भेजें। Long Video: 4-10 मिनट | Short Video: 20-40 सेकंड
      </div>

      <div className="space-y-2 mb-6">
        {schedule.map((item, i) => {
          const isLong = item.video_type === "Long Video";
          return (
            <div key={i} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500">{item.publish_date} ({item.day}) · {item.publish_time}</p>
                <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (isLong ? "bg-[#0a1a3a] text-white" : "bg-orange-500 text-white")}>
                  {item.video_type}
                </span>
              </div>
              <p className="text-sm font-semibold mb-1">{item.topic}</p>
              <p className="text-xs text-gray-600">{item.direction}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0a1a3a] text-white rounded-lg p-3">
          <p className="text-xs font-bold mb-2">LONG VIDEO</p>
          {VIDEO_GUIDELINES.long.map((g, i) => {
            return <p key={i} className="text-[10px] opacity-90 mb-1">• {g}</p>;
          })}
        </div>
        <div className="bg-orange-500 text-white rounded-lg p-3">
          <p className="text-xs font-bold mb-2">SHORT VIDEO</p>
          {VIDEO_GUIDELINES.short.map((g, i) => {
            return <p key={i} className="text-[10px] opacity-90 mb-1">• {g}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
