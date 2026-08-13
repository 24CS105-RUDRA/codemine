"use client";

import { useState } from "react";
import AppLayout from "@/components/navigation/AppLayout";
import CodeBlock from "@/components/ai/CodeBlock";
import {
  Bug,
  Play,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Copy,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const buggyCode = `function findMax(arr) {
  let max = arr[0];
  for (let i = 0; i <= arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Test
console.log(findMax([3, 7, 2, 9, 4]));`;

const fixedCode = `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Test
console.log(findMax([3, 7, 2, 9, 4])); // 9`;

const analysisSteps = [
  {
    step: 1,
    title: "Error Detected",
    type: "error" as const,
    content: "Array index out of bounds: using `<=` instead of `<` in the for loop causes `arr[arr.length]` which is `undefined`.",
    icon: AlertTriangle,
  },
  {
    step: 2,
    title: "Why It Happens",
    type: "info" as const,
    content: "The loop condition `i <= arr.length` allows `i` to reach `arr.length`, which is out of bounds for a zero-indexed array.",
    icon: Lightbulb,
  },
  {
    step: 3,
    title: "Suggested Fix",
    type: "success" as const,
    content: "Change `i <= arr.length` to `i < arr.length`. This ensures the loop only accesses valid indices.",
    icon: CheckCircle2,
  },
];

export default function DebugLabPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Problem */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Bug size={20} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Find Maximum in Array</h2>
              <p className="text-xs text-[var(--color-text-tertiary)]">Debugging Lab · Arrays · Easy</p>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            This function should find the maximum value in an array, but it produces an error when run.
            Identify the bug and understand how to fix it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Code */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-glass-border)]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">Your Code</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600">Has Bug</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]">
                <Copy size={12} />
                Copy
              </button>
            </div>
            <div className="p-4">
              <CodeBlock code={buggyCode} language="javascript" showLineNumbers />
            </div>
          </div>

          {/* AI Analysis */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-glass-border)]">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">AI Analysis</span>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {analyzing ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                {analyzing ? "Analyzing..." : "Run Analysis"}
              </button>
            </div>
            <div className="p-4 space-y-3">
              {showResults && analysisSteps.map((step) => (
                <div
                  key={step.step}
                  className={cn(
                    "p-4 rounded-xl border animate-fade-in",
                    step.type === "error" && "bg-red-500/5 border-red-500/10",
                    step.type === "info" && "bg-amber-500/5 border-amber-500/10",
                    step.type === "success" && "bg-emerald-500/5 border-emerald-500/10"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon size={16} className={cn(
                      step.type === "error" && "text-red-500",
                      step.type === "info" && "text-amber-500",
                      step.type === "success" && "text-emerald-500"
                    )} />
                    <span className={cn(
                      "text-xs font-semibold",
                      step.type === "error" && "text-red-600",
                      step.type === "info" && "text-amber-600",
                      step.type === "success" && "text-emerald-600"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{step.content}</p>
                </div>
              ))}
              {analyzing && (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <RefreshCw size={24} className="text-indigo-500 animate-spin" />
                  <p className="text-sm text-[var(--color-text-secondary)]">Analyzing your code...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Before / After */}
        {showResults && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <ArrowRight size={16} className="text-indigo-500" />
              Before &amp; After
            </h3>
            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Your Code
                </p>
                <CodeBlock
                  code={`for (let i = 0; i <= arr.length; i++) {`}
                  language="javascript"
                  showLineNumbers={false}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-600 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Suggested Fix
                </p>
                <CodeBlock
                  code={`for (let i = 1; i < arr.length; i++) {`}
                  language="javascript"
                  showLineNumbers={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
