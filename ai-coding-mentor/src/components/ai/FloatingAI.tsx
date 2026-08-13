"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Paperclip, Mic, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/api/auth";

interface Message {
  role: "user" | "assistant";
  content: string;
  code?: string | null;
  language?: string | null;
}

export default function FloatingAI() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI Coding Mentor. Ask me anything about programming, debugging, or learning concepts.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Load or create a "Quick Chat" conversation when opened and user is logged in
  useEffect(() => {
    if (!open || !user || conversationId) return;

    const initQuickChat = async () => {
      try {
        const res = await api.get("/conversations");
        if (res.success && Array.isArray(res.data)) {
          const existing = res.data.find((c: any) => c.title === "Quick Chat");
          if (existing) {
            setConversationId(existing.id);
            // Fetch messages for this conversation
            const msgRes = await api.get(`/conversations/${existing.id}`);
            if (msgRes.success && msgRes.data.messages) {
              setMessages(msgRes.data.messages);
            }
          } else {
            // Create a new "Quick Chat"
            const newRes = await api.post("/conversations", { title: "Quick Chat" });
            if (newRes.success && newRes.data) {
              setConversationId(newRes.data.id);
            }
          }
        }
      } catch (err) {
        console.error("Error initializing quick chat:", err);
      }
    };

    initQuickChat();
  }, [open, user, conversationId]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userText = input;
    setInput("");

    // Add user message locally
    const userMsg: Message = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    if (!user) {
      // Fallback for unauthenticated user
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Please log in to chat with the AI Mentor using real-time LLM features.",
          },
        ]);
        setSending(false);
      }, 1000);
      return;
    }

    try {
      let currentConvId = conversationId;
      if (!currentConvId) {
        const newRes = await api.post("/conversations", { title: "Quick Chat" });
        if (newRes.success && newRes.data) {
          currentConvId = newRes.data.id;
          setConversationId(currentConvId);
        } else {
          throw new Error("Could not initialize conversation");
        }
      }

      const res = await api.post(`/conversations/${currentConvId}/messages`, {
        content: userText,
      });

      if (res.success && res.data) {
        const { assistantMessage } = res.data;
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error("Error in floating AI chat:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble reaching the server. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
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
                      <CodeBlock code={msg.code} language={msg.language || "javascript"} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
                <span>AI Mentor is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
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
                disabled={sending}
                placeholder={sending ? "Waiting..." : "Ask anything..."}
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none disabled:opacity-50"
              />
              <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                <Mic size={16} />
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
