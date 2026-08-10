import { redirect } from "next/navigation";
import { requireEducator } from "@/lib/auth/requireEducator";
import EducatorSessions from "@/features/educator/components/EducatorSessions";

export default async function EducatorDashboardPage() {
  const { authorized, profile } = await requireEducator();

  if (!authorized) {
    redirect("/");
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-gradient-to-br from-purple-600 to-orange-500 text-white rounded-xl p-5 mb-6">
        <p className="text-xs opacity-80 mb-1">Educator Dashboard</p>
        <p className="text-lg font-bold">{profile?.full_name}</p>
        {profile?.educator_title ? <span className="inline-block mt-2 text-xs bg-white/20 px-3 py-1 rounded-full">{profile.educator_title}</span> : null}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium mb-1">🎥 Students से Online Sessions के ज़रिए जुड़ें</p>
        <p className="text-xs text-gray-500">यहां से session बनाइए, students को /meetings पर दिखेगा।</p>
      </div>

      <EducatorSessions />
    </div>
  );
}
