"use client";

import { useState } from "react";
import AppLayout from "@/components/navigation/AppLayout";
import {
  FileBarChart,
  Download,
  FileSpreadsheet,
  Share2,
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  Flame,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const strengths = [
  { topic: "JavaScript", score: 92 },
  { topic: "React", score: 84 },
  { topic: "TypeScript", score: 75 },
];

const weaknesses = [
  { topic: "SQL", score: 60 },
  { topic: "Node.js", score: 68 },
  { topic: "Algorithms", score: 71 },
];

const nextSteps = [
  "Focus on SQL JOIN queries and optimization",
  "Practice more algorithm problems (Dynamic Programming)",
  "Build a full-stack project to strengthen Node.js skills",
  "Review React Context API for state management",
];

const activities = [
  { label: "Problems Solved", value: "84", icon: Target },
  { label: "Learning Hours", value: "42h", icon: Clock },
  { label: "Current Streak", value: "12 days", icon: Flame },
  { label: "Topics Covered", value: "6", icon: BookOpen },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Learning Report</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Your comprehensive learning progress report
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <FileBarChart size={14} />
              {generating ? "Generating..." : "Generate Report"}
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] text-xs font-medium hover:bg-[var(--color-border)] transition-colors">
              <Download size={14} />
              Export PDF
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] text-xs font-medium hover:bg-[var(--color-border)] transition-colors">
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>

        {generated && (
          <>
            {/* Overall Score */}
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">87</span>
              </div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">Overall Score</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Based on your learning activity and performance</p>
            </div>

            {/* Activity Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {activities.map((a) => (
                <div key={a.label} className="glass rounded-2xl p-4 text-center">
                  <a.icon size={20} className="mx-auto mb-2 text-indigo-500" />
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">{a.value}</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">{a.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-500" />
                  Strengths
                </h3>
                <div className="space-y-3">
                  {strengths.map((s) => (
                    <div key={s.topic} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[var(--color-text-primary)] w-24">{s.topic}</span>
                      <div className="flex-1 h-2 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-emerald-600">{s.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <Target size={16} className="text-amber-500" />
                  Areas for Improvement
                </h3>
                <div className="space-y-3">
                  {weaknesses.map((w) => (
                    <div key={w.topic} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[var(--color-text-primary)] w-24">{w.topic}</span>
                      <div className="flex-1 h-2 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${w.score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-amber-600">{w.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Recommended Next Steps</h3>
              <div className="space-y-2">
                {nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-surface-tertiary)]">
                    <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-[var(--color-text-secondary)]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {generating && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
            <p className="text-sm text-[var(--color-text-secondary)]">Generating your report...</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
