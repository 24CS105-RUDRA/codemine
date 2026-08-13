"use client";

import AppLayout from "@/components/navigation/AppLayout";
import {
  notifications,
} from "@/data/notifications";
import {
  Bot,
  Trophy,
  BookOpen,
  Settings,
  CheckCircle2,
  Bell,
  BellOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const iconMap = {
  ai: Bot,
  learning: BookOpen,
  challenge: Trophy,
  system: Settings,
};

const colorMap = {
  ai: "text-indigo-500 bg-indigo-500/10",
  learning: "text-emerald-500 bg-emerald-500/10",
  challenge: "text-amber-500 bg-amber-500/10",
  system: "text-[var(--color-text-tertiary)] bg-[var(--color-surface-tertiary)]",
};

const categories = ["All", "AI Recommendations", "Learning", "Challenges", "System"];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [notifs, setNotifs] = useState(notifications);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Notifications</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Stay updated on your learning progress
            </p>
          </div>
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-colors"
          >
            <CheckCircle2 size={14} />
            Mark all read
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
                filter === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {notifs.map((notif) => {
            const Icon = iconMap[notif.type];
            return (
              <div
                key={notif.id}
                className={cn(
                  "glass rounded-2xl p-4 flex items-start gap-4 transition-all hover:translate-y-[-1px]",
                  !notif.read && "border-l-2 border-l-indigo-500"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colorMap[notif.type])}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{notif.title}</p>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{notif.message}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{notif.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
