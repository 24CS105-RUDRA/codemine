"use client";

import AppLayout from "@/components/navigation/AppLayout";
import { topicRecommendations, projectRecommendations } from "@/data/recommendations";
import Progress from "@/components/ui/Progress";
import Badge from "@/components/ui/Badge";
import {
  Sparkles,
  Clock,
  ArrowRight,
  Rocket,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const difficultyColor: Record<string, string> = {
  Easy: "text-emerald-600 bg-emerald-500/10",
  Beginner: "text-emerald-600 bg-emerald-500/10",
  Intermediate: "text-blue-600 bg-blue-500/10",
  Advanced: "text-red-600 bg-red-500/10",
};

export default function RecommendationsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Recommendations</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            AI-powered suggestions tailored to your learning journey
          </p>
        </div>

        {/* Topic Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-indigo-500" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Recommended for You</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="glass rounded-2xl p-5 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="purple" size="sm">{rec.topic}</Badge>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", difficultyColor[rec.difficulty])}>
                    {rec.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-indigo-600 transition-colors">
                  {rec.title}
                </h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mb-4">{rec.reason}</p>
                <Progress value={rec.progress} size="sm" color="indigo" showLabel />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-1">
                    <Clock size={10} />
                    {rec.estimatedTime}
                  </span>
                  <button className="text-xs text-indigo-500 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Start <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Rocket size={18} className="text-purple-500" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Recommended Projects</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {projectRecommendations.map((proj) => (
              <div
                key={proj.id}
                className="glass rounded-2xl p-5 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="info" size="sm">{proj.topic}</Badge>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", difficultyColor[proj.difficulty])}>
                    {proj.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-indigo-600 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mb-4">{proj.reason}</p>
                {proj.progress > 0 && <Progress value={proj.progress} size="sm" color="indigo" showLabel />}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-1">
                    <Clock size={10} />
                    {proj.estimatedTime}
                  </span>
                  <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors">
                    Start Project <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
