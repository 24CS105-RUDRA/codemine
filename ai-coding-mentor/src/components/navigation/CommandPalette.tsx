"use client";

import { useState, useRef, useEffect } from "react";
import { X, Search, Bot, FileText, Trophy, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const commands = [
  { label: "Ask AI Mentor", icon: Bot, href: "/mentor", category: "AI" },
  { label: "Search", icon: Search, href: "/search", category: "Navigation" },
  { label: "Open Dashboard", icon: BarChart3, href: "/dashboard", category: "Navigation" },
  { label: "Start Challenge", icon: Trophy, href: "/challenges", category: "Actions" },
  { label: "Review Code", icon: FileText, href: "/code-review", category: "Actions" },
  { label: "Upload Document", icon: FileText, href: "/documents", category: "Actions" },
  { label: "View Analytics", icon: BarChart3, href: "/analytics", category: "Navigation" },
  { label: "Open Settings", icon: Settings, href: "/settings", category: "Navigation" },
];

const recentSearches = [
  "React hooks",
  "async await patterns",
  "binary tree traversal",
  "CSS grid layout",
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
    setQuery("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative glass-strong rounded-3xl w-full max-w-lg mx-4 animate-fade-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 h-14 border-b border-[var(--color-glass-border)]">
          <Search size={18} className="text-[var(--color-text-tertiary)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none"
          />
          <kbd className="px-2 py-0.5 rounded bg-[var(--color-surface-tertiary)] text-[10px] font-mono text-[var(--color-text-tertiary)] border border-[var(--color-border)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
          {query === "" && (
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-[var(--color-text-tertiary)] mb-2">Recent Searches</p>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--color-surface-tertiary)] text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2">
            {query === "" && (
              <p className="px-3 py-1 text-xs font-medium text-[var(--color-text-tertiary)]">Commands</p>
            )}
            {filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.label}
                  onClick={() => handleSelect(cmd.href)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-colors text-left"
                >
                  <Icon size={16} className="text-[var(--color-text-tertiary)]" />
                  <span className="flex-1">{cmd.label}</span>
                  <span className="text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-surface-tertiary)] px-2 py-0.5 rounded-full">
                    {cmd.category}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
                No commands found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
