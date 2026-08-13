"use client";

import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/navigation/AppLayout";
import AIMessage from "@/components/ai/AIMessage";
import CodeBlock from "@/components/ai/CodeBlock";
import { conversations, mockMessages } from "@/data/conversations";
import {
  Plus,
  MessageSquare,
  Bookmark,
  Send,
  Paperclip,
  Mic,
  Code2,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MentorPage() {
  const [activeConv, setActiveConv] = useState("1");
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = {
      id: String(Date.now()),
      role: "user" as const,
      content: input,
      timestamp: "now",
    };
    const aiMsg = {
      id: String(Date.now() + 1),
      role: "assistant" as const,
      content: "That's a great question! Let me analyze this and provide you with a comprehensive explanation. Here's what you need to know:",
      timestamp: "now",
      code: `// Example solution\nfunction solve(arr) {\n  const map = new Map();\n  for (let i = 0; i < arr.length; i++) {\n    const complement = target - arr[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(arr[i], i);\n  }\n  return [];\n}`,
      language: "typescript",
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <AppLayout>
      <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8" style={{ height: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <div className="hidden lg:flex w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="p-4 border-b border-[var(--color-border)]">
            <button className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
              <Plus size={16} /> New Conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
            <div className="px-3 py-2">
              <p className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Recent</p>
            </div>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl text-sm transition-colors",
                  activeConv === conv.id
                    ? "bg-indigo-500/10 text-indigo-600"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]"
                )}
              >
                <p className="font-medium truncate">{conv.title}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] truncate mt-0.5">{conv.lastMessage}</p>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-[var(--color-border)] space-y-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]">
              <Bookmark size={15} /> Saved Explanations
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[var(--color-surface-secondary)]">
          {/* Chat Header */}
          <div className="h-14 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <MessageSquare size={14} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">AI Mentor</h2>
                <p className="text-[10px] text-emerald-500">● Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                <Search size={16} />
              </button>
              <button className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
            {messages.map((msg) => (
              <AIMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                code={msg.code}
                language={msg.language}
                showActions={msg.role === "assistant"}
              />
            ))}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 max-w-3xl mx-auto">
              <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                <Paperclip size={16} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                <Code2 size={16} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your AI mentor anything..."
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none"
              />
              <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                <Mic size={16} />
              </button>
              <button
                onClick={handleSend}
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
