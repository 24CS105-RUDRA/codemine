"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full whitespace-nowrap",
        {
          "bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)]": variant === "default",
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400": variant === "success",
          "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400": variant === "warning",
          "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400": variant === "error",
          "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400": variant === "info",
          "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400": variant === "purple",
        },
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
