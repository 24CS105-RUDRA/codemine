"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "indigo" | "emerald" | "amber" | "red" | "cyan";
  showLabel?: boolean;
  className?: string;
}

export default function Progress({
  value,
  max = 100,
  size = "md",
  color = "indigo",
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[var(--color-text-tertiary)]">Progress</span>
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-[var(--color-surface-tertiary)] overflow-hidden",
          {
            "h-1.5": size === "sm",
            "h-2.5": size === "md",
            "h-4": size === "lg",
          }
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            {
              "bg-indigo-500": color === "indigo",
              "bg-emerald-500": color === "emerald",
              "bg-amber-500": color === "amber",
              "bg-red-500": color === "red",
              "bg-cyan-500": color === "cyan",
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
