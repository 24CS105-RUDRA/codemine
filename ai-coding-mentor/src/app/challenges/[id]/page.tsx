"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import AppLayout from "@/components/navigation/AppLayout";
import CodeBlock from "@/components/ai/CodeBlock";
import { challenges } from "@/data/challenges";
import Badge from "@/components/ui/Badge";
import {
  Play,
  RotateCcw,
  Lightbulb,
  Bot,
  Bug,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const starterCode = `// Write your solution here
function solve(input) {
  // Your code here
  return result;
}

// Test your solution
console.log(solve([]));`;

export default function ChallengeWorkspacePage() {
  const params = useParams();
  const challenge = challenges.find((c) => c.id === params.id) || challenges[0];
  const [code, setCode] = useState(starterCode);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  const handleRun = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setRunning(false);
      setResult("success");
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-0 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8" style={{ height: "calc(100vh - 64px)" }}>
        <div className="flex-1 grid lg:grid-cols-[380px_1fr_300px] divide-x divide-[var(--color-border)] min-h-0">
          {/* Problem Panel */}
          <div className="overflow-y-auto scrollbar-thin bg-[var(--color-surface)]">
            <div className="p-5 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={challenge.difficulty === "Easy" ? "success" : challenge.difficulty === "Medium" ? "warning" : "error"}>
                  {challenge.difficulty}
                </Badge>
                <span className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-1">
                  <Clock size={10} />
                  {challenge.estimatedTime}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{challenge.title}</h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Description</h3>
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{challenge.description}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Examples</h3>
                {challenge.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--color-surface-tertiary)] mb-2 font-mono text-xs">
                    <p className="text-[var(--color-text-tertiary)]">Input: <span className="text-[var(--color-text-primary)]">{ex.input}</span></p>
                    <p className="text-[var(--color-text-tertiary)]">Output: <span className="text-[var(--color-text-primary)]">{ex.output}</span></p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Constraints</h3>
                <ul className="space-y-1">
                  {challenge.constraints.map((c, i) => (
                    <li key={i} className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2">
                      <ChevronRight size={10} className="text-[var(--color-text-tertiary)]" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              {showHint && challenge.hints[hintIndex] && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-xs font-medium text-amber-600 mb-1">Hint {hintIndex + 1}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{challenge.hints[hintIndex]}</p>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex flex-col bg-[var(--color-surface-secondary)] min-h-0">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">Solution</span>
                <Badge size="sm">JavaScript</Badge>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setCode(starterCode); setResult(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-colors"
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {running ? <RotateCcw size={12} className="animate-spin" /> : <Play size={12} />}
                  {running ? "Running..." : "Run"}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-[#1e1e2e] rounded-xl p-4 font-mono text-sm text-[#cdd6f4] resize-none outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>
            {result && (
              <div className={cn(
                "px-5 py-3 border-t flex items-center gap-2 text-sm font-medium",
                result === "success" && "bg-emerald-500/5 border-emerald-500/10 text-emerald-600",
                result === "error" && "bg-red-500/5 border-red-500/10 text-red-600"
              )}>
                {result === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {result === "success" ? "All test cases passed! Great work!" : "Some test cases failed. Try again."}
              </div>
            )}
          </div>

          {/* AI Mentor Panel */}
          <div className="hidden lg:flex flex-col bg-[var(--color-surface)] min-h-0">
            <div className="px-4 py-3 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <Bot size={16} className="text-indigo-500" />
                AI Mentor
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              <button
                onClick={() => { setShowHint(true); setHintIndex(Math.min(hintIndex + 1, challenge.hints.length - 1)); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-tertiary)] hover:bg-[var(--color-border)] transition-colors text-left"
              >
                <Lightbulb size={16} className="text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-primary)]">Get Hint</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Reveal a hint for this problem</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-tertiary)] hover:bg-[var(--color-border)] transition-colors text-left">
                <Bot size={16} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-primary)]">Explain Problem</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Get a detailed explanation</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-tertiary)] hover:bg-[var(--color-border)] transition-colors text-left">
                <Eye size={16} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-primary)]">Review Code</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Get feedback on your solution</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-tertiary)] hover:bg-[var(--color-border)] transition-colors text-left">
                <Bug size={16} className="text-red-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-primary)]">Debug</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">Find bugs in your code</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
