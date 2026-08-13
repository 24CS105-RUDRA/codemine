"use client";

import { useState } from "react";
import { Bot, X, Send, Paperclip, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

export default function FloatingAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; code?: string }[]
  >([
    {
      role: "assistant",
      content: "Hi! I'm your AI Coding Mentor. Ask me anything about programming, debugging, or learning concepts.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        role: "assistant",
        content:
          "That's a great question! Let me help you understand this concept better.",
        code: `// Here's a quick example:\nconst greet = (name) => {\n  return \`Hello, \${name}!\`;\n};\n\nconsole.log(greet("Alex")); // Hello, Alex!`,
      },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass-strong flex items-center justify-center transition-all duration-300",
          "hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/25",
          open && "bg-red-500/10",
          "group"
        )}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-glow" />
        {open ? (
          <X size={22} className="relative z-10 text-red-500" />
        ) : (
          <Bot size={22} className="relative z-10 text-indigo-600 dark:text-indigo-400" />
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] glass-strong rounded-3xl overflow-hidden animate-fade-in flex flex-col" style={{ height: "500px", maxHeight: "calc(100vh - 140px)" }}>
          <div className="px-5 py-4 border-b border-[var(--color-glass-border)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">AI Mentor</p>
              <p className="text-[10px] text-emerald-500">● Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-[var(--color-surface-tertiary)] text-[var(--color-text-primary)] rounded-bl-md"
                  )}
                >
                  <p>{msg.content}</p>
                  {msg.code && (
                    <div className="mt-2">
                      <CodeBlock code={msg.code} language="javascript" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[var(--color-glass-border)]">
            <div className="flex items-center gap-2 glass rounded-2xl px-3 py-2">
              <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                <Paperclip size={16} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none"
              />
              <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                <Mic size={16} />
              </button>
              <button
                onClick={handleSend}
                className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
