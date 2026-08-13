"use client";

import AppLayout from "@/components/navigation/AppLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import ActivityCard from "@/components/dashboard/ActivityCard";
import RecommendationCard from "@/components/dashboard/RecommendationCard";
import { ActivityChart, PerformanceChart } from "@/components/dashboard/Charts";
import { dashboardStats } from "@/data/dashboard";
import { Flame, Target, Zap, Clock } from "lucide-react";

const icons = [
  <Flame size={20} key="flame" />,
  <Target size={20} key="target" />,
  <Zap size={20} key="zap" />,
  <Clock size={20} key="clock" />,
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((stat, i) => (
            <StatsCard key={stat.label} {...stat} icon={icons[i]} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart />
          <PerformanceChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityCard />
          <RecommendationCard />
        </div>
      </div>
    </AppLayout>
  );
}
