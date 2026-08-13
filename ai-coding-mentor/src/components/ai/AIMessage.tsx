"use client";

import { Bot, Copy, Lightbulb, Zap, RefreshCw, Bug } from "lucide-react";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

interface AIMessageProps {
  role: "user" | "assistant";
  content: string;
  code?: string;
  language?: string;
  showActions?: boolean;
}

export default function AIMessage({ role, content, code, language, showActions = true }: AIMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-indigo-600 text-white rounded-2xl rounded-br-md px-5 py-3.5 text-sm leading-relaxed">
          <p>{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
        <Bot size={16} className="text-white" />
      </div>
      <div className="max-w-[80%] space-y-3">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl rounded-bl-md px-5 py-3.5 text-sm leading-relaxed text-[var(--color-text-primary)]">
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }} />
        </div>

        {code && (
          <CodeBlock code={code} language={language || "typescript"} />
        )}

        {showActions && (
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Copy", icon: Copy },
              { label: "Explain", icon: Lightbulb },
              { label: "Optimize", icon: Zap },
              { label: "Find Bug", icon: Bug },
              { label: "Simplify", icon: RefreshCw },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-tertiary)] hover:bg-[var(--color-border)] transition-colors"
              >
                <action.icon size={12} />
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
