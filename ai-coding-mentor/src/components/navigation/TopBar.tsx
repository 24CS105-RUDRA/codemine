"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Command,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onSearchOpen?: () => void;
  onNotificationsOpen?: () => void;
}

export default function TopBar({ onSearchOpen, onNotificationsOpen }: TopBarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen?.();
      }
    };
    window.addEventListener("keydown", handleKey as any);
    return () => window.removeEventListener("keydown", handleKey as any);
  }, [onSearchOpen]);

  return (
    <header className="h-16 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Welcome back, Alex
          </h1>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            12 day streak · 87% accuracy
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-border)] transition-colors text-sm"
        >
          <Search size={15} />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[10px] font-mono text-[var(--color-text-tertiary)] border border-[var(--color-border)]">
            <Command size={10} />K
          </kbd>
        </button>

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl hover:bg-[var(--color-surface-tertiary)] transition-colors text-[var(--color-text-tertiary)]"
        >
          {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={onNotificationsOpen}
          className="relative p-2.5 rounded-xl hover:bg-[var(--color-surface-tertiary)] transition-colors text-[var(--color-text-tertiary)]"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold"
          >
            AP
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl p-2 animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-[var(--color-glass-border)] mb-1">
                <p className="font-semibold text-sm text-[var(--color-text-primary)]">Alex Patel</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">CS Student</p>
              </div>
              <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-colors" onClick={() => setProfileOpen(false)}>
                <Settings size={15} />
                Settings
              </Link>
              <Link href="/settings#profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-colors" onClick={() => setProfileOpen(false)}>
                <User size={15} />
                Profile
              </Link>
              <div className="border-t border-[var(--color-glass-border)] mt-1 pt-1">
                <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors w-full">
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
