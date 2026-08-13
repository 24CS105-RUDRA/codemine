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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mentor", href: "/mentor", icon: Bot },
  { label: "Review", href: "/code-review", icon: GitPullRequest },
  { label: "Debug", href: "/debug-lab", icon: Bug },
  { label: "Path", href: "/learning-path", icon: Route },
  { label: "Challenges", href: "/challenges", icon: Trophy },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <div className="glass-strong rounded-2xl px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all",
                active
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10"
                  : "text-[var(--color-text-tertiary)]"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
