"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import {
  Bot,
  Bug,
  Sparkles,
  BarChart3,
  FileText,
  Lightbulb,
  ArrowRight,
  Play,
  Code2,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Bot,
    title: "AI Code Mentor",
    description: "Get intelligent explanations, code reviews, and guidance powered by AI.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Bug,
    title: "Smart Debugging",
    description: "Identify and fix bugs with AI-powered analysis and suggested fixes.",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "Personalized Recommendations",
    description: "Custom learning paths and topic suggestions based on your progress.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Learning Analytics",
    description: "Track your progress with detailed charts and performance metrics.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: FileText,
    title: "Document Understanding",
    description: "Upload PDFs, code files, and notes for AI-powered analysis.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Lightbulb,
    title: "Coding Insights",
    description: "Deep understanding of patterns, best practices, and code quality.",
    color: "from-cyan-500 to-blue-500",
  },
];

const steps = [
  { step: "01", title: "Ask", description: "Ask a coding question or upload code" },
  { step: "02", title: "Analyze", description: "AI analyzes your code and context" },
  { step: "03", title: "Understand", description: "Get clear explanations and examples" },
  { step: "04", title: "Improve", description: "Apply knowledge and track progress" },
];

export default function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface-secondary)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <span className="font-bold text-[var(--color-text-primary)]">AI Mentor</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">How It Works</a>
            <a href="#workspace" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Workspace</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-[var(--color-surface-tertiary)] transition-colors text-[var(--color-text-tertiary)]"
            >
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex h-9 px-5 items-center rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-xl hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)]">
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-[var(--color-glass-border)] px-6 py-4 space-y-3 animate-fade-in">
            <a href="#features" className="block text-sm text-[var(--color-text-secondary)]">Features</a>
            <a href="#how-it-works" className="block text-sm text-[var(--color-text-secondary)]">How It Works</a>
            <Link href="/dashboard" className="block h-10 px-5 items-center rounded-xl bg-indigo-600 text-white text-sm font-medium text-center leading-10">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm text-[var(--color-text-secondary)]">
              <Sparkles size={14} className="text-indigo-500" />
              AI-Powered Learning Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[var(--color-text-primary)]">
              Your AI Coding Mentor,{" "}
              <span className="text-gradient-primary">Always One Step Ahead.</span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto leading-relaxed">
              Understand code. Fix bugs. Learn faster. Build better.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex h-12 px-8 items-center rounded-2xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 gap-2"
              >
                Start Learning <ArrowRight size={18} />
              </Link>
              <a
                href="#workspace"
                className="inline-flex h-12 px-8 items-center rounded-2xl glass text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-glass-bg-strong)] transition-all gap-2"
              >
                <Play size={16} /> Explore Mentor
              </a>
            </div>
          </div>

          {/* Hero Preview */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="glass-strong rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--color-glass-border)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-[var(--color-text-tertiary)] ml-2">AI Coding Mentor</span>
              </div>
              <div className="grid md:grid-cols-2">
                <div className="p-6 border-r border-[var(--color-glass-border)]">
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-indigo-600 text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[85%]">
                        Why does my async function return a Promise instead of the actual value?
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Bot size={14} className="text-white" />
                      </div>
                      <div className="bg-[var(--color-surface-tertiary)] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm max-w-[85%] text-[var(--color-text-primary)]">
                        The issue is that async functions always return a Promise. You need to <code className="px-1.5 py-0.5 bg-[var(--color-border)] rounded text-xs font-mono">await</code> the result...
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-7" />
                      <div className="bg-[#1e1e2e] rounded-xl px-4 py-3 text-xs font-mono text-[#cdd6f4] flex-1">
                        <div><span className="text-[#6c7086]">1</span> <span className="text-[#cba6f7]">const</span> data = <span className="text-[#cba6f7]">await</span> <span className="text-[#89b4fa]">fetchUserData</span>();</div>
                        <div><span className="text-[#6c7086]">2</span> <span className="text-[#89b4fa]">console</span>.<span className="text-[#89dceb]">log</span>(data);</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">Understanding: 87%</p>
                      <div className="w-32 h-1.5 bg-[var(--color-surface-tertiary)] rounded-full mt-1">
                        <div className="w-[87%] h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Code2 size={20} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">Streak: 12 days</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">Keep it up!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Sparkles size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">Topics Mastered: 8</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">3 in progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              Everything you need to master coding
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              A comprehensive AI-powered platform designed to accelerate your programming journey.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-6 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300 group cursor-default"
              >
                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4", f.color)}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              How it works
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Four simple steps to level up your coding skills.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="text-center relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-xl font-bold text-gradient-primary">{s.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workspace Preview */}
      <section id="workspace" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              A workspace built for developers
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              Code editor, AI assistant, debugging tools, and learning resources — all in one place.
            </p>
          </div>
          <div className="glass-strong rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--color-glass-border)]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-[var(--color-text-tertiary)] ml-2">Developer Workspace</span>
            </div>
            <div className="grid lg:grid-cols-3 divide-x divide-[var(--color-glass-border)]">
              <div className="p-4 space-y-2">
                <p className="text-xs font-medium text-[var(--color-text-tertiary)] mb-3">File Explorer</p>
                {["src/components/App.tsx", "src/hooks/useAuth.ts", "src/utils/helpers.ts", "src/pages/Dashboard.tsx"].map((f) => (
                  <div key={f} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] cursor-pointer">
                    <Code2 size={12} className="text-indigo-400" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-[var(--color-text-tertiary)] mb-3">Code Editor</p>
                <div className="bg-[#1e1e2e] rounded-xl p-4 text-xs font-mono text-[#cdd6f4] leading-relaxed">
                  <div><span className="text-[#6c7086]"> 1</span> <span className="text-[#cba6f7]">import</span> {"{ useState }"} <span className="text-[#cba6f7]">from</span> <span className="text-[#a6e3a1]">&apos;react&apos;</span>;</div>
                  <div><span className="text-[#6c7086]"> 2</span></div>
                  <div><span className="text-[#6c7086]"> 3</span> <span className="text-[#cba6f7]">export default function</span> <span className="text-[#89b4fa]">App</span>() {"{"}</div>
                  <div><span className="text-[#6c7086]"> 4</span>   <span className="text-[#cba6f7]">const</span> [count, setCount] = <span className="text-[#89b4fa]">useState</span>(<span className="text-[#fab387]">0</span>);</div>
                  <div><span className="text-[#6c7086]"> 5</span>   <span className="text-[#6c7086]">...</span></div>
                  <div><span className="text-[#6c7086]"> 6</span> {"}"}</div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-xs font-medium text-[var(--color-text-tertiary)]">AI Analysis</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-emerald-600">Code Quality: 92/100</p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">Clean and well-structured</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <Sparkles size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-amber-600">Suggestion</p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">Consider using useCallback for the handler</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                    <Lightbulb size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-indigo-600">Learning Insight</p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">This pattern uses the useState hook effectively</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                Start your coding journey with an AI mentor
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">
                Join thousands of developers learning smarter with AI-powered guidance.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex h-12 px-8 items-center rounded-2xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 gap-2"
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bot size={12} className="text-white" />
            </div>
            AI Coding Mentor
          </div>
          <p>Built for learning</p>
        </div>
      </footer>
    </div>
  );
}
