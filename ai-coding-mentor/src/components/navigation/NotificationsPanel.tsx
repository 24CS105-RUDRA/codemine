"use client";

import { X, Bot, Trophy, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { notifications } from "@/data/notifications";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

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

export default function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="absolute top-16 right-6 w-96 max-w-[calc(100vw-3rem)] glass-strong rounded-3xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-glass-border)]">
          <h3 className="font-semibold text-[var(--color-text-primary)]">Notifications</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
            <X size={16} />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto scrollbar-thin p-2">
          {notifications.map((notif) => {
            const Icon = iconMap[notif.type];
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer",
                  notif.read ? "hover:bg-[var(--color-surface-tertiary)]" : "bg-[var(--color-surface-tertiary)] hover:bg-[var(--color-border)]"
                )}
              >
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", colorMap[notif.type])}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{notif.title}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">{notif.time}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
