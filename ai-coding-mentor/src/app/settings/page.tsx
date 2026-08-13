"use client";

import { useState } from "react";
import AppLayout from "@/components/navigation/AppLayout";
import { useTheme } from "@/hooks/useTheme";
import {
  User,
  Sun,
  Moon,
  Monitor,
  Bot,
  BookOpen,
  Target,
  Palette,
  Sliders,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingSection({ title, icon, children }: SettingSectionProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-glass-border)] flex items-center gap-2.5">
        {icon}
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        {description && <p className="text-xs text-[var(--color-text-tertiary)]">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors",
        checked ? "bg-indigo-600" : "bg-[var(--color-surface-tertiary)]"
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
          checked ? "left-[22px]" : "left-0.5"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [responseStyle, setResponseStyle] = useState("balanced");
  const [explanationDifficulty, setExplanationDifficulty] = useState("intermediate");

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Settings</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Customize your experience
          </p>
        </div>

        {/* Profile */}
        <SettingSection title="Profile" icon={<User size={16} className="text-indigo-500" />}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                AP
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
                <Camera size={10} className="text-[var(--color-text-tertiary)]" />
              </button>
            </div>
            <div>
              <p className="text-base font-semibold text-[var(--color-text-primary)]">Alex Patel</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Computer Science Student</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Name</label>
              <input
                type="text"
                defaultValue="Alex Patel"
                className="w-full h-10 px-3 rounded-xl bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Role</label>
              <input
                type="text"
                defaultValue="Computer Science Student"
                className="w-full h-10 px-3 rounded-xl bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Learning Goal</label>
              <select className="w-full h-10 px-3 rounded-xl bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/30">
                <option>Full Stack Development</option>
                <option>Frontend Development</option>
                <option>Backend Development</option>
                <option>Data Science</option>
                <option>Mobile Development</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance" icon={<Palette size={16} className="text-purple-500" />}>
          <SettingRow label="Theme" description="Choose your preferred color scheme">
            <div className="flex gap-2">
              {[
                { value: "light", icon: Sun, label: "Light" },
                { value: "dark", icon: Moon, label: "Dark" },
                { value: "system", icon: Monitor, label: "System" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                    theme === t.value
                      ? "bg-indigo-600 text-white"
                      : "bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
                  )}
                >
                  <t.icon size={14} />
                  {t.label}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label="Compact Mode" description="Use smaller spacing and components">
            <Toggle checked={compactMode} onChange={setCompactMode} />
          </SettingRow>
          <SettingRow label="Animations" description="Enable smooth transitions">
            <Toggle checked={animations} onChange={setAnimations} />
          </SettingRow>
          <SettingRow label="Reduced Motion" description="Minimize motion for accessibility">
            <Toggle checked={reducedMotion} onChange={setReducedMotion} />
          </SettingRow>
        </SettingSection>

        {/* AI Preferences */}
        <SettingSection title="AI Preferences" icon={<Bot size={16} className="text-emerald-500" />}>
          <SettingRow label="Response Style" description="How detailed AI responses should be">
            <select
              value={responseStyle}
              onChange={(e) => setResponseStyle(e.target.value)}
              className="h-9 px-3 rounded-xl bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/30"
            >
              <option value="concise">Concise</option>
              <option value="balanced">Balanced</option>
              <option value="detailed">Detailed</option>
            </select>
          </SettingRow>
          <SettingRow label="Explanation Difficulty" description="Complexity level of explanations">
            <select
              value={explanationDifficulty}
              onChange={(e) => setExplanationDifficulty(e.target.value)}
              className="h-9 px-3 rounded-xl bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/30"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </SettingRow>
          <SettingRow label="Code Language" description="Preferred language for code examples">
            <select className="h-9 px-3 rounded-xl bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/30">
              <option>JavaScript</option>
              <option>TypeScript</option>
              <option>Python</option>
              <option>Java</option>
            </select>
          </SettingRow>
          <SettingRow label="Mentor Personality" description="AI mentor interaction style">
            <select className="h-9 px-3 rounded-xl bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/30">
              <option>Friendly</option>
              <option>Professional</option>
              <option>Direct</option>
              <option>Encouraging</option>
            </select>
          </SettingRow>
        </SettingSection>

        {/* Learning Preferences */}
        <SettingSection title="Learning Preferences" icon={<BookOpen size={16} className="text-amber-500" />}>
          <SettingRow label="Daily Learning Goal" description="Target time per day">
            <select className="h-9 px-3 rounded-xl bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/30">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
          </SettingRow>
          <SettingRow label="Preferred Difficulty" description="Challenge difficulty level">
            <select className="h-9 px-3 rounded-xl bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/30">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
              <option>Mixed</option>
            </select>
          </SettingRow>
        </SettingSection>

        {/* Danger Zone */}
        <div className="glass rounded-2xl overflow-hidden border border-red-500/10">
          <div className="px-5 py-4 border-b border-[var(--color-glass-border)] flex items-center gap-2.5">
            <Shield size={16} className="text-red-500" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Account</h3>
          </div>
          <div className="p-5">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-500/10 transition-colors">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
