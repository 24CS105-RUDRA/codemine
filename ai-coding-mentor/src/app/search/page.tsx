"use client";

import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/navigation/AppLayout";
import {
  Search,
  FileText,
  Trophy,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Command,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const searchCategories = [
  { label: "Conversations", icon: MessageSquare },
  { label: "Challenges", icon: Trophy },
  { label: "Documents", icon: FileText },
  { label: "Topics", icon: BookOpen },
  { label: "Recommendations", icon: Sparkles },
];

const mockResults = [
  { type: "conversation", title: "Async/Await explained", subtitle: "2 hours ago", icon: MessageSquare },
  { type: "conversation", title: "React hooks deep dive", subtitle: "5 hours ago", icon: MessageSquare },
  { type: "challenge", title: "Two Sum", subtitle: "Easy · Arrays", icon: Trophy },
  { type: "challenge", title: "Merge Intervals", subtitle: "Medium · Arrays", icon: Trophy },
  { type: "document", title: "JavaScript Notes.pdf", subtitle: "2.4 MB", icon: FileText },
  { type: "topic", title: "Closures & Scope", subtitle: "Advanced JavaScript", icon: BookOpen },
  { type: "recommendation", title: "Master JavaScript Promises", subtitle: "Based on activity", icon: Sparkles },
];

const typeColor: Record<string, string> = {
  conversation: "text-blue-500 bg-blue-500/10",
  challenge: "text-amber-500 bg-amber-500/10",
  document: "text-red-500 bg-red-500/10",
  topic: "text-purple-500 bg-purple-500/10",
  recommendation: "text-indigo-500 bg-indigo-500/10",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredResults = mockResults.filter((r) => {
    if (activeCategory !== "All") {
      const catMap: Record<string, string> = {
        Conversations: "conversation",
        Challenges: "challenge",
        Documents: "document",
        Topics: "topic",
        Recommendations: "recommendation",
      };
      if (r.type !== catMap[activeCategory]) return false;
    }
    if (query && !r.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-strong rounded-2xl p-2 flex items-center gap-3">
          <div className="pl-3">
            <Search size={20} className="text-[var(--color-text-tertiary)]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations, challenges, documents, topics..."
            className="flex-1 bg-transparent text-base text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-lg bg-[var(--color-surface-tertiary)] text-[10px] font-mono text-[var(--color-text-tertiary)] border border-[var(--color-border)]">
            <Command size={10} />K
          </kbd>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
          {["All", ...searchCategories.map((c) => c.label)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          {filteredResults.map((result, i) => {
            const Icon = result.icon;
            return (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-[var(--color-surface-tertiary)] transition-colors text-left group"
              >
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", typeColor[result.type])}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors truncate">
                    {result.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{result.subtitle}</p>
                </div>
                <ArrowRight size={14} className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
          {filteredResults.length === 0 && (
            <div className="text-center py-16">
              <Search size={32} className="mx-auto mb-3 text-[var(--color-text-tertiary)]" />
              <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">No results found</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
