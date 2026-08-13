"use client";

import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { aiRecommendations } from "@/data/dashboard";
import Progress from "@/components/ui/Progress";

const difficultyColor: Record<string, string> = {
  Easy: "text-emerald-600 bg-emerald-500/10",
  Medium: "text-amber-600 bg-amber-500/10",
  Intermediate: "text-blue-600 bg-blue-500/10",
  Advanced: "text-red-600 bg-red-500/10",
};

export default function RecommendationCard() {
  return (
    <div className="glass rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles size={15} className="text-indigo-500" />
          AI Recommendations
        </h3>
        <button className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">View All</button>
      </div>
      <div className="space-y-3">
        {aiRecommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-indigo-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors">
                {rec.title}
              </h4>
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0", difficultyColor[rec.difficulty])}>
                {rec.difficulty}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-2">{rec.reason}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Progress value={rec.progress} size="sm" className="w-20" />
                <span className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-1">
                  <Clock size={10} />
                  {rec.estimatedTime}
                </span>
              </div>
              <button className="text-xs text-indigo-500 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Start <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
