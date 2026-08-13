"use client";

import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/navigation/AppLayout";
import AIMessage from "@/components/ai/AIMessage";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  code?: string | null;
  language?: string | null;
  createdAt?: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
}

export default function MentorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingConv, setLoadingConv] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEnd = useRef<HTMLDivElement>(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const res = await api.get("/conversations");
      if (res.success) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeConv) {
          setActiveConv(res.data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConv) return;
    const fetchMessages = async () => {
      setLoadingConv(true);
      try {
        const res = await api.get(`/conversations/${activeConv}`);
        if (res.success && res.data) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoadingConv(false);
      }
    };
    fetchMessages();
  }, [activeConv]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateConversation = async () => {
    try {
      const res = await api.post("/conversations", { title: "New Conversation" });
      if (res.success && res.data) {
        setConversations((prev) => [res.data, ...prev]);
        setActiveConv(res.data.id);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    
    let currentConvId = activeConv;
    
    // Create a conversation first if there isn't one
    if (!currentConvId) {
      try {
        const res = await api.post("/conversations", { title: input.slice(0, 30) });
        if (res.success && res.data) {
          currentConvId = res.data.id;
          setActiveConv(currentConvId);
          setConversations((prev) => [res.data, ...prev]);
        } else {
          return;
        }
      } catch (err) {
        console.error("Error creating conversation on send:", err);
        return;
      }
    }

    const tempUserMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await api.post(`/conversations/${currentConvId}/messages`, {
        content: tempUserMsg.content,
      });

      if (res.success && res.data) {
        const { userMessage, assistantMessage } = res.data;
        // Replace temp message with database message, and append assistant response
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          userMessage,
          assistantMessage,
        ]);
        // Refresh conversations list to update titles/last message preview
        fetchConversations();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      // Add error notice message
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: "Sorry, I ran into an error getting the AI response. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-surface)]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8" style={{ height: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <div className="hidden lg:flex w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="p-4 border-b border-[var(--color-border)]">
            <button
              onClick={handleCreateConversation}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
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
                <p className="text-xs text-[var(--color-text-tertiary)] truncate mt-0.5">{conv.lastMessage || "No messages yet"}</p>
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
            {loadingConv ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-3">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Start a new conversation</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1 max-w-sm">
                  Ask your AI coding mentor anything about programming, code review, debugging, or technical concepts.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <AIMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  code={msg.code || undefined}
                  language={msg.language || undefined}
                  showActions={msg.role === "assistant"}
                />
              ))
            )}
            {sending && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
                <span>AI Mentor is thinking...</span>
              </div>
            )}
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
                disabled={sending}
                placeholder={sending ? "Waiting for response..." : "Ask your AI mentor anything..."}
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none disabled:opacity-50"
              />
              <button className="p-1.5 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]">
                <Mic size={16} />
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
