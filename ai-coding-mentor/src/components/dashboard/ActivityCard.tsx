"use client";

import {
  Bug,
  Trophy,
  FileText,
  Bot,
  GitPullRequest,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { recentActivity } from "@/data/dashboard";

const iconMap: Record<string, React.ReactNode> = {
  Bug: <Bug size={16} />,
  Trophy: <Trophy size={16} />,
  FileText: <FileText size={16} />,
  Bot: <Bot size={16} />,
  "GitPullRequest": <GitPullRequest size={16} />,
};

const colorMap: Record<string, string> = {
  debug: "bg-red-500/10 text-red-500",
  challenge: "bg-amber-500/10 text-amber-500",
  document: "bg-blue-500/10 text-blue-500",
  chat: "bg-purple-500/10 text-purple-500",
  review: "bg-emerald-500/10 text-emerald-500",
};

export default function ActivityCard() {
  return (
    <div className="glass rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Recent Activity</h3>
        <button className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">View All</button>
      </div>
      <div className="space-y-1">
        {recentActivity.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--color-surface-tertiary)] transition-colors cursor-pointer"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", colorMap[item.type])}>
              {iconMap[item.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{item.title}</p>
              <p className="text-xs text-[var(--color-text-tertiary)] truncate">{item.description}</p>
            </div>
            <span className="text-[10px] text-[var(--color-text-tertiary)] whitespace-nowrap flex items-center gap-1">
              <Clock size={10} />
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
