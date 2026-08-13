"use client";

import AppLayout from "@/components/navigation/AppLayout";
import { learningPath } from "@/data/learningPath";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Sparkles,
  BookOpen,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Progress from "@/components/ui/Progress";

const difficultyColor: Record<string, string> = {
  Beginner: "text-emerald-600 bg-emerald-500/10",
  Intermediate: "text-blue-600 bg-blue-500/10",
  Advanced: "text-red-600 bg-red-500/10",
};

export default function LearningPathPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Learning Path</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Your personalized roadmap to becoming a full-stack developer
          </p>
        </div>

        {/* Progress Overview */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Overall Progress</h3>
            <span className="text-sm font-bold text-indigo-600">
              {Math.round(learningPath.reduce((a, m) => a + m.progress, 0) / learningPath.length)}%
            </span>
          </div>
          <Progress
            value={learningPath.reduce((a, m) => a + m.progress, 0) / learningPath.length}
            size="md"
            color="indigo"
          />
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--color-text-primary)]">
                {learningPath.filter((m) => m.progress === 100).length}
              </p>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--color-text-primary)]">
                {learningPath.filter((m) => m.progress > 0 && m.progress < 100).length}
              </p>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--color-text-primary)]">
                {learningPath.filter((m) => m.progress === 0).length}
              </p>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">Upcoming</p>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-[var(--color-border)]" />

          <div className="space-y-6">
            {learningPath.map((module, index) => {
              const isComplete = module.progress === 100;
              const isActive = module.progress > 0 && module.progress < 100;
              const isLocked = module.progress === 0 && index > 0 && learningPath[index - 1].progress < 100;

              return (
                <div key={module.id} className="relative flex gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-4 border-[var(--color-surface-secondary)]",
                        isComplete && "bg-emerald-500",
                        isActive && "bg-indigo-500",
                        isLocked && "bg-[var(--color-surface-tertiary)]"
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 size={18} className="text-white" />
                      ) : isLocked ? (
                        <Lock size={16} className="text-[var(--color-text-tertiary)]" />
                      ) : (
                        <span className="text-sm font-bold text-white">{module.level}</span>
                      )}
                    </div>
                  </div>

                  {/* Module card */}
                  <div
                    className={cn(
                      "flex-1 glass rounded-2xl p-6 transition-all",
                      isComplete && "border-l-2 border-l-emerald-500",
                      isActive && "border-l-2 border-l-indigo-500",
                      isLocked && "opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                            {module.title}
                          </h3>
                          {module.aiRecommended && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 flex items-center gap-1">
                              <Sparkles size={10} /> AI Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)]">{module.description}</p>
                      </div>
                      <span className={cn("text-[10px] font-medium px-2.5 py-0.5 rounded-full shrink-0", difficultyColor[module.difficulty])}>
                        {module.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-xs text-[var(--color-text-tertiary)]">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {module.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} />
                        {module.lessons.filter((l) => l.completed).length}/{module.lessons.length} lessons
                      </span>
                    </div>

                    <Progress value={module.progress} size="sm" color={isComplete ? "emerald" : "indigo"} />

                    {/* Lessons */}
                    <div className="mt-4 space-y-1.5">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs",
                            lesson.completed
                              ? "text-emerald-600 bg-emerald-500/5"
                              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]"
                          )}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                          ) : (
                            <Circle size={14} className="shrink-0 text-[var(--color-text-tertiary)]" />
                          )}
                          {lesson.title}
                        </div>
                      ))}
                    </div>

                    {!isComplete && !isLocked && (
                      <button className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors">
                        Continue <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
