"use client";
import { useEffect, useState } from "react";
import PointsBadge from "@/components/PointsBadge";
import QuickActions from "@/features/dashboard/components/QuickActions";
import DashboardCard from "@/features/dashboard/components/DashboardCard";
import DailyQuoteCard from "@/features/daily-content/components/DailyQuoteCard";
import DailyLearningCard from "@/features/daily-content/components/DailyLearningCard";

type DashboardData = {
  points_balance: number;
  current_streak_days: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({ points_balance: 0, current_streak_days: 0 });

  useEffect(() => {
    fetch("/api/v1/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => {
        if (result) setData(result);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-lg font-bold px-4 pt-4">Dashboard</h1>
      <PointsBadge points={data.points_balance ?? 0} streak={data.current_streak_days ?? 0} />
      <QuickActions />
      <DailyQuoteCard />
      <DailyLearningCard />
      <div className="px-4 space-y-3 mt-2">
        <DashboardCard title="Learning Videos" description="YouTube se seekhein, topic-wise" href="/learning" emoji="🎬" />
        <DashboardCard title="Leaderboard Rank" description="देखें आप अपने class में कहां हैं" href="/leaderboard" emoji="🏆" />
        <DashboardCard title="Notifications" description="नई activity देखें" href="/notifications" emoji="🔔" />
        <DashboardCard title="Opportunities Near You" description="Jobs, internships, scholarships" href="/opportunities" emoji="🎯" />
        <DashboardCard title="Refer & Earn" description="दोस्तों को invite करें, दोनों को points मिलेंगे" href="/referrals" emoji="🎁" />
      </div>
    </div>
  );
}
