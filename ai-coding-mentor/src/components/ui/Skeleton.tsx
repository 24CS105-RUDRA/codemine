"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export default function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "shimmer bg-[var(--color-surface-tertiary)] rounded-xl",
        {
          "h-4 w-full rounded-md": variant === "text",
          "rounded-full": variant === "circular",
        },
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 space-y-3">
            <Skeleton className="h-4 w-24" variant="text" />
            <Skeleton className="h-8 w-16" variant="text" />
            <Skeleton className="h-3 w-32" variant="text" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-40" variant="text" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="glass rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-32" variant="text" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={cn("flex gap-3", i % 2 === 0 ? "justify-end" : "justify-start")}>
          <div className="space-y-2 max-w-md">
            <Skeleton className="h-4 w-32" variant="text" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
