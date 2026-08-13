"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          "active:scale-[0.97]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          {
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25": variant === "primary",
            "bg-[var(--color-surface-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] border border-[var(--color-border)]": variant === "secondary",
            "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-tertiary)]": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25": variant === "danger",
            "glass text-[var(--color-text-primary)] hover:bg-[var(--color-glass-bg-strong)]": variant === "glass",
          },
          {
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-5 text-sm": size === "md",
            "h-12 px-7 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export default Button;
