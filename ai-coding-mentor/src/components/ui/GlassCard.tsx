"use client";

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle" | "solid";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function GlassCard({
  className,
  variant = "default",
  hover = true,
  padding = "md",
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        {
          "glass": variant === "default",
          "glass-strong": variant === "strong",
          "glass-subtle": variant === "subtle",
          "bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm": variant === "solid",
        },
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },
        hover && "hover:translate-y-[-2px] hover:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
