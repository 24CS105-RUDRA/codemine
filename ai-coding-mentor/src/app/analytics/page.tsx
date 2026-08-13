"use client";

import AppLayout from "@/components/navigation/AppLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  topicPerformance,
  weeklyActivityData,
  difficultyDistribution,
  monthlyProgress,
} from "@/data/analytics";
import { dashboardStats } from "@/data/dashboard";
import {
  Flame,
  Target,
  Zap,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statIcons = [
  <Zap size={20} key="z" />,
  <Target size={20} key="t" />,
  <Clock size={20} key="c" />,
  <Flame size={20} key="f" />,
];

const levelColor: Record<string, string> = {
  Beginner: "text-emerald-600 bg-emerald-500/10",
  Intermediate: "text-blue-600 bg-blue-500/10",
  Advanced: "text-purple-600 bg-purple-500/10",
};

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Analytics</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Track your learning progress and performance insights
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((stat, i) => (
            <div key={stat.label} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  {statIcons[i]}
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight size={10} />
                  {stat.change}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</span>
                <span className="text-sm text-[var(--color-text-tertiary)]">{stat.unit}</span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="problems" fill="#6366f1" radius={[6, 6, 0, 0]} name="Problems" />
                <Bar dataKey="accuracy" fill="#a78bfa" radius={[6, 6, 0, 0]} name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Accuracy Trend */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Accuracy Over Time</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="problems" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} name="Problems" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Difficulty Distribution */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Difficulty Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={difficultyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {difficultyDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {difficultyDistribution.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>

          {/* Topic Performance */}
          <div className="lg:col-span-2 glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Topic Performance</h3>
            <div className="space-y-3">
              {topicPerformance.map((topic) => (
                <div key={topic.topic} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-surface-tertiary)] transition-colors">
                  <div className="w-10 text-center">
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">{topic.score}%</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{topic.topic}</span>
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", levelColor[topic.level])}>
                        {topic.level}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${topic.score}%`,
                          background:
                            topic.score >= 80
                              ? "#10b981"
                              : topic.score >= 60
                              ? "#3b82f6"
                              : "#f59e0b",
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--color-text-tertiary)]">{topic.problems} solved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Monthly Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="problems" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} name="Problems Solved" />
              <Line type="monotone" dataKey="hours" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4 }} name="Hours" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
