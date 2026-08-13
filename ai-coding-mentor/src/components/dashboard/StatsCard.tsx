"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  unit: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

export default function StatsCard({ label, value, unit, change, positive, icon }: StatsCardProps) {
  return (
    <div className="glass rounded-2xl p-5 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
          positive ? "text-emerald-600 bg-emerald-500/10" : "text-red-600 bg-red-500/10"
        )}>
          {positive ? <TrendingUp size={12} /> : change === "0" ? <Minus size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</span>
        <span className="text-sm text-[var(--color-text-tertiary)]">{unit}</span>
      </div>
      <p className="text-xs text-[var(--color-text-secondary)] mt-1">{label}</p>
    </div>
  );
}
