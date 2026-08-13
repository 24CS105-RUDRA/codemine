"use client";

import { useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/navigation/AppLayout";
import { challenges, challengeCategories } from "@/data/challenges";
import Badge from "@/components/ui/Badge";
import {
  Trophy,
  Clock,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const difficultyColor: Record<string, "success" | "warning" | "error"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "error",
};

export default function ChallengesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");

  const filtered = challenges.filter((c) => {
    if (activeCategory !== "All" && c.category !== activeCategory) return false;
    if (difficultyFilter !== "All" && c.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Coding Challenges</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Test your skills with curated coding challenges
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-tertiary)]">
              {challenges.filter((c) => c.completed).length}/{challenges.length} completed
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
          {challengeCategories.map((cat) => (
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

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--color-text-tertiary)]" />
          {["All", "Easy", "Medium", "Hard"].map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-medium transition-colors",
                difficultyFilter === d
                  ? "bg-indigo-500/10 text-indigo-600"
                  : "text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-tertiary)]"
              )}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((challenge) => (
            <div
              key={challenge.id}
              className="glass rounded-2xl p-5 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant={difficultyColor[challenge.difficulty]} size="sm">
                  {challenge.difficulty}
                </Badge>
                {challenge.completed && (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                )}
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-indigo-600 transition-colors">
                {challenge.title}
              </h3>
              <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-tertiary)] mb-4">
                <span className="flex items-center gap-1">
                  <Trophy size={10} />
                  {challenge.topic}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {challenge.estimatedTime}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-4">
                {challenge.description}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/challenges/${challenge.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors"
                >
                  {challenge.completed ? "Review" : "Solve Challenge"}
                </Link>
                <Link
                  href="/mentor"
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] text-xs font-medium hover:bg-[var(--color-border)] transition-colors"
                >
                  <Sparkles size={12} />
                  Mentor
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
