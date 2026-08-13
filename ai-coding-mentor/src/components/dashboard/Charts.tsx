"use client";

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
} from "recharts";
import { weeklyActivity, performanceData } from "@/data/dashboard";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ActivityChart() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Weekly Activity</h3>
        <div className="flex gap-1">
          {["Problems", "Time"].map((tab, i) => (
            <button
              key={tab}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-medium transition-colors",
                i === 0 ? "bg-indigo-500/10 text-indigo-600" : "text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-tertiary)]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weeklyActivity}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="problems" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceChart() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Performance Trend</h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={performanceData}>
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
          <Area type="monotone" dataKey="accuracy" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
