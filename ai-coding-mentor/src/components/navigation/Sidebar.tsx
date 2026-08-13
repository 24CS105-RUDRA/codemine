"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  GitPullRequest,
  Bug,
  Route,
  Trophy,
  BarChart3,
  Sparkles,
  FileText,
  FileBarChart,
  Settings,
  User,
  ChevronLeft,
  PanelLeftClose,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Bot,
  GitPullRequest,
  Bug,
  Route,
  Trophy,
  BarChart3,
  Sparkles,
  FileText,
  FileBarChart,
  Settings,
  User,
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "AI Mentor", href: "/mentor", icon: "Bot" },
  { label: "Code Review", href: "/code-review", icon: "GitPullRequest" },
  { label: "Debug Lab", href: "/debug-lab", icon: "Bug" },
  { label: "Learning Path", href: "/learning-path", icon: "Route" },
  { label: "Challenges", href: "/challenges", icon: "Trophy" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Recommendations", href: "/recommendations", icon: "Sparkles" },
  { label: "Documents", href: "/documents", icon: "FileText" },
  { label: "Reports", href: "/reports", icon: "FileBarChart" },
];

const bottomItems = [
  { label: "Settings", href: "/settings", icon: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-4 top-4 bottom-4 z-30 glass-strong rounded-3xl transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className={cn("flex items-center gap-3 px-5 h-16 border-b border-[var(--color-glass-border)]", collapsed && "justify-center px-0")}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <span className="font-bold text-sm text-[var(--color-text-primary)]">AI Mentor</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-[var(--color-surface-tertiary)] transition-colors text-[var(--color-text-tertiary)] ml-auto"
        >
          {collapsed ? <PanelLeftClose size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-tertiary)]"
                )}
                title={collapsed ? item.label : undefined}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                )}
                <Icon size={18} className={cn("shrink-0", active && "text-indigo-500")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-[var(--color-glass-border)] space-y-1">
        {bottomItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                pathname === item.href
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-tertiary)]"
              )}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
