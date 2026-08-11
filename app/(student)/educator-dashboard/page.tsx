import { redirect } from "next/navigation";
import { requireEducator } from "@/lib/auth/requireEducator";
import EducatorSessions from "@/features/educator/components/EducatorSessions";
import ScheduleTable from "@/features/educator/components/ScheduleTable";
import { ANKITA_SCHEDULE, MANDEEP_SCHEDULE } from "@/features/educator/data/schedules";

export default async function EducatorDashboardPage() {
  const { authorized, profile } = await requireEducator();

  if (!authorized) {
    redirect("/");
  }

  const isSkillEducator = profile?.educator_title === "Skill Educator";
  const isSportsEducator = profile?.educator_title === "Sports Educator";
  const schedule = isSkillEducator ? ANKITA_SCHEDULE : isSportsEducator ? MANDEEP_SCHEDULE : null;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-gradient-to-br from-purple-600 to-orange-500 text-white rounded-xl p-5 mb-6">
        <p className="text-xs opacity-80 mb-1">Educator Dashboard</p>
        <p className="text-lg font-bold">{profile?.full_name}</p>
        <p className="text-xs opacity-70">@{(profile as { username?: string })?.username}</p>
        {profile?.educator_title ? <span className="inline-block mt-2 text-xs bg-white/20 px-3 py-1 rounded-full">{profile.educator_title}</span> : null}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium mb-1">🎥 Students से Online Sessions के ज़रिए जुड़ें</p>
        <p className="text-xs text-gray-500">Session बनाइए, Home page पर registration खुलेगा — फिर हर session पर registered participants की list और WhatsApp link मिलेगी।</p>
      </div>

      <EducatorSessions />

      {schedule ? (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-base font-bold mb-3">📅 आपका Video Content Plan (13-31 Aug 2026)</h2>
          <ScheduleTable schedule={schedule} />
        </div>
      ) : null}
    </div>
  );
}
