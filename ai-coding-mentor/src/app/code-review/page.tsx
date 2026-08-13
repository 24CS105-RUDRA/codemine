"use client";

import { useState } from "react";
import AppLayout from "@/components/navigation/AppLayout";
import CodeBlock from "@/components/ai/CodeBlock";
import {
  FileCode,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Zap,
  Eye,
  ChevronDown,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const files = [
  { name: "src/", indent: 0, isDir: true },
  { name: "components/", indent: 1, isDir: true },
  { name: "App.tsx", indent: 2, isDir: false, active: true },
  { name: "Header.tsx", indent: 2, isDir: false },
  { name: "pages/", indent: 1, isDir: true },
  { name: "Dashboard.tsx", indent: 2, isDir: false },
  { name: "hooks/", indent: 1, isDir: true },
  { name: "useAuth.ts", indent: 2, isDir: false },
  { name: "utils/", indent: 1, isDir: true },
  { name: "helpers.ts", indent: 2, isDir: false },
];

const reviewIssues = [
  {
    type: "bug" as const,
    severity: "high",
    title: "Missing error boundary",
    description: "Component doesn't handle async errors in useEffect",
    line: 14,
  },
  {
    type: "warning" as const,
    severity: "medium",
    title: "Unused state variable",
    description: "'loading' state is declared but never used",
    line: 7,
  },
  {
    type: "suggestion" as const,
    severity: "low",
    title: "Consider useMemo",
    description: "Expensive computation could be memoized",
    line: 22,
  },
  {
    type: "suggestion" as const,
    severity: "low",
    title: "Extract to custom hook",
    description: "Data fetching logic could be extracted to a reusable hook",
    line: 18,
  },
];

const codeContent = `import React, { useState, useEffect } from 'react';
import { Header } from './Header';

interface Props {
  userId: string;
}

export function Dashboard({ userId }: Props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const processedData = data?.items.map(item => ({
    ...item,
    fullName: \`\${item.firstName} \${item.lastName}\`,
  }));

  return (
    <div className="dashboard">
      <Header title="Dashboard" />
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {processedData && (
        <ul>
          {processedData.map(item => (
            <li key={item.id}>{item.fullName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}`;

export default function CodeReviewPage() {
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [issuesExpanded, setIssuesExpanded] = useState(true);

  const bugs = reviewIssues.filter((i) => i.type === "bug").length;
  const warnings = reviewIssues.filter((i) => i.type === "warning").length;
  const suggestions = reviewIssues.filter((i) => i.type === "suggestion").length;

  return (
    <AppLayout>
      <div className="flex gap-4" style={{ height: "calc(100vh - 120px)" }}>
        {/* File Explorer */}
        {showFileExplorer && (
          <div className="hidden lg:flex w-56 flex-col glass rounded-2xl overflow-hidden shrink-0">
            <div className="px-4 py-3 border-b border-[var(--color-glass-border)] flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Files</span>
              <button onClick={() => setShowFileExplorer(false)} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
              {files.map((f) => (
                <div
                  key={f.name}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors",
                    f.active
                      ? "bg-indigo-500/10 text-indigo-600"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]"
                  )}
                  style={{ paddingLeft: `${f.indent * 12 + 8}px` }}
                >
                  {f.isDir ? (
                    <ChevronDown size={12} className="shrink-0" />
                  ) : (
                    <FileCode size={12} className="shrink-0 text-indigo-400" />
                  )}
                  {f.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Editor */}
        <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col min-w-0">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-glass-border)]">
            <div className="flex items-center gap-2">
              {!showFileExplorer && (
                <button onClick={() => setShowFileExplorer(true)} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] mr-1">
                  <FileCode size={16} />
                </button>
              )}
              <span className="text-sm font-medium text-[var(--color-text-primary)]">App.tsx</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">TypeScript</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-colors">
              <RefreshCw size={12} />
              Re-analyze
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <CodeBlock code={codeContent} language="typescript" showLineNumbers />
          </div>
        </div>

        {/* AI Review Panel */}
        <div className="hidden xl:flex w-80 flex-col glass rounded-2xl overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-[var(--color-glass-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">AI Code Review</h3>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {/* Quality Score */}
            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Code Quality</span>
                <span className="text-2xl font-bold text-emerald-600">92</span>
              </div>
              <div className="h-2 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
              </div>
              <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2">Out of 100 · Excellent</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                <p className="text-lg font-bold text-red-600">{bugs}</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">Bugs</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                <p className="text-lg font-bold text-amber-600">{warnings}</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">Warnings</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                <p className="text-lg font-bold text-blue-600">{suggestions}</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">Tips</p>
              </div>
            </div>

            {/* Issues */}
            <button
              onClick={() => setIssuesExpanded(!issuesExpanded)}
              className="flex items-center gap-2 w-full text-xs font-semibold text-[var(--color-text-secondary)]"
            >
              {issuesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              Potential Issues ({reviewIssues.length})
            </button>
            {issuesExpanded && (
              <div className="space-y-2">
                {reviewIssues.map((issue, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-indigo-500/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      {issue.type === "bug" && <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />}
                      {issue.type === "warning" && <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />}
                      {issue.type === "suggestion" && <Zap size={14} className="text-blue-500 mt-0.5 shrink-0" />}
                      <div>
                        <p className="text-xs font-medium text-[var(--color-text-primary)]">{issue.title}</p>
                        <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{issue.description}</p>
                        <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Line {issue.line}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Readability */}
            <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={14} className="text-indigo-500" />
                <span className="text-xs font-medium text-[var(--color-text-primary)]">Readability: 88/100</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">Good naming conventions and structure</p>
            </div>

            {/* Security */}
            <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-emerald-500" />
                <span className="text-xs font-medium text-[var(--color-text-primary)]">Security: Clean</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">No security concerns detected</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
