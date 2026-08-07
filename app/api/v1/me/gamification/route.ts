import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BADGE_DEFS = [
  { code: "welcome", emoji: "👋", title: "Welcome Aboard", desc: "Account बनाया", check: () => true },
  { code: "profile_pro", emoji: "🪪", title: "Profile Pro", desc: "Bio + Skills दोनों जोड़े", check: (s: Stats) => s.hasBio && s.skillsCount > 0 },
  { code: "quiz_rookie", emoji: "📝", title: "Quiz Rookie", desc: "पहला quiz खेला", check: (s: Stats) => s.quizzes >= 1 },
  { code: "quiz_master", emoji: "🧠", title: "Quiz Master", desc: "10 quiz पूरे किए", check: (s: Stats) => s.quizzes >= 10 },
  { code: "streak_warrior", emoji: "🔥", title: "Streak Warrior", desc: "7-दिन की streak", check: (s: Stats) => s.streak >= 7 },
  { code: "first_sale", emoji: "🛍️", title: "First Sale", desc: "Marketplace पर पहली sale", check: (s: Stats) => s.sales >= 1 },
  { code: "top_seller", emoji: "🏆", title: "Top Seller", desc: "5 sales पूरी की", check: (s: Stats) => s.sales >= 5 },
  { code: "networker", emoji: "🤝", title: "Networker", desc: "3 दोस्तों को refer किया", check: (s: Stats) => s.referrals >= 3 },
  { code: "learner", emoji: "🎬", title: "Dedicated Learner", desc: "5 घंटे सीखा", check: (s: Stats) => s.hoursLearned >= 5 },
  { code: "certified", emoji: "🏅", title: "Certified", desc: "पहला certificate जोड़ा", check: (s: Stats) => s.certificates >= 1 },
];

type Stats = {
  hasBio: boolean;
  skillsCount: number;
  quizzes: number;
  streak: number;
  sales: number;
  referrals: number;
  hoursLearned: number;
  certificates: number;
};

function computeLevel(xp: number) {
  if (xp >= 2000) return { level: 6, title: "Legend", nextAt: null };
  if (xp >= 1000) return { level: 5, title: "Achiever", nextAt: 2000 };
  if (xp >= 500) return { level: 4, title: "Rising Star", nextAt: 1000 };
  if (xp >= 250) return { level: 3, title: "Go-Getter", nextAt: 500 };
  if (xp >= 100) return { level: 2, title: "Explorer", nextAt: 250 };
  return { level: 1, title: "Beginner", nextAt: 100 };
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const [profile, quizAttempts, certificates, watchSessions, referrals, salesOrders] = await Promise.all([
    supabase.from("profiles").select("bio, skills, current_streak_days").eq("id", user.id).single(),
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("profile_certificates").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("video_watch_sessions").select("seconds_watched").eq("profile_id", user.id),
    supabase.from("referrals").select("id", { count: "exact", head: true }).eq("referrer_id", user.id).eq("reward_granted", true),
    supabase.from("orders").select("id, marketplace_products!inner(seller_id)").eq("status", "paid").eq("marketplace_products.seller_id", user.id),
  ]);

  const totalSeconds = (watchSessions.data ?? []).reduce((sum, row) => sum + (row.seconds_watched ?? 0), 0);
  const hoursLearned = totalSeconds / 3600;

  const stats: Stats = {
    hasBio: !!profile.data?.bio,
    skillsCount: profile.data?.skills?.length ?? 0,
    quizzes: quizAttempts.count ?? 0,
    streak: profile.data?.current_streak_days ?? 0,
    sales: salesOrders.data?.length ?? 0,
    referrals: referrals.count ?? 0,
    hoursLearned,
    certificates: certificates.count ?? 0,
  };

  const badges = BADGE_DEFS.map((def) => ({
    code: def.code,
    emoji: def.emoji,
    title: def.title,
    desc: def.desc,
    earned: def.check(stats),
  }));

  const earnedCount = badges.filter((b) => b.earned).length;
  const xp = stats.quizzes * 20 + stats.sales * 60 + stats.referrals * 40 + stats.certificates * 30 + Math.floor(stats.hoursLearned) * 15 + earnedCount * 15;

  const levelInfo = computeLevel(xp);

  return NextResponse.json({ xp, ...levelInfo, badges });
}
