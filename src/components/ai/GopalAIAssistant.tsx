import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  CornerDownLeft,
  Loader2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { PERSONAL_INFO } from "@/data/profile";
import { cn } from "@/lib/utils";
import { askGopalAi, type ChatMessage } from "@/server/ai";
import { AIChatMessage } from "./AIChatMessage";

const INITIAL_SUGGESTIONS = [
  "What full-stack projects has Gopal built?",
  "Tell me about Gopal's DSA background",
  "Is Gopal available for Summer 2026 roles?",
  "What are Gopal's primary skills?",
  "How can I contact Gopal directly?",
  "Download Gopal's Resume",
];

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: `Hello! I'm **Ask Gopal**, the intelligent assistant for **Gopal Maddheshiya**.\n\nI can answer questions about Gopal's **full-stack projects**, **Java & DSA problem-solving**, **academic background at SRMU**, and **Summer 2026 availability**.\n\nWhat would you like to know?`,
  suggestions: INITIAL_SUGGESTIONS.slice(0, 3),
  actions: [
    { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" },
    { label: "🚀 View Projects", action: "projects" },
    {
      label: "💬 Message on WhatsApp",
      url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
      action: "whatsapp",
    },
  ],
};

export function GopalAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      role: "user",
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await askGopalAi({
        data: {
          message: query,
          history: messages.slice(-6),
        },
      });

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.reply,
        suggestions: res.suggestions,
        actions: res.actions,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      console.error("Failed to query AI assistant:", err);
      const errorMsg: ChatMessage = {
        role: "assistant",
        content:
          "I apologize, but I encountered a momentary issue processing your request. Please feel free to try again or reach out to Gopal directly at [gopalmaddheshiya138@gmail.com](mailto:gopalmaddheshiya138@gmail.com).",
        actions: [
          {
            label: "💬 Message on WhatsApp",
            url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
            action: "whatsapp",
          },
          { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" },
        ],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage["actions"]>[number]) => {
    if (action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (action.action === "projects") {
      const el = document.getElementById("projects");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (action.action === "dsa") {
      const el = document.getElementById("dsa");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (action.action === "contact") {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (action.action === "resume") {
      window.open(PERSONAL_INFO.resume, "_blank", "noopener,noreferrer");
    } else if (action.action === "whatsapp") {
      window.open(`https://wa.me/${PERSONAL_INFO.whatsapp}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleClearHistory = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Ask Gopal Portfolio Assistant"
            className="group relative flex items-center gap-2.5 rounded-full border border-border/90 bg-card/95 px-3.5 py-2.5 sm:px-4 sm:py-3 text-foreground shadow-lift backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Glowing / pulsating AI icon container */}
            <div className="relative flex size-7 sm:size-8 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground shadow-sm">
              <Bot className="size-4 shrink-0 transition-transform group-hover:rotate-12 duration-200" />
              <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 border border-card" />
              </span>
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  Ask Gopal
                </span>
                <Sparkles className="size-3 text-primary animate-pulse" />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono leading-none">
                Live Portfolio Assistant
              </span>
            </div>

            {hasUnread && (
              <span className="absolute -top-1 -left-1 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-80" />
                <span className="relative inline-flex size-3 rounded-full bg-primary" />
              </span>
            )}
          </button>
        )}
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <aside
          aria-label="Ask Gopal Portfolio Assistant Chat"
          className={cn(
            "fixed z-50 flex flex-col border border-border bg-background/98 backdrop-blur-xl shadow-lift transition-all duration-300 animate-in fade-in-50 zoom-in-95",
            // Mobile full screen drawer or fixed widget
            "inset-x-2 bottom-2 top-16 sm:inset-auto sm:right-6 sm:bottom-6 rounded-2xl",
            isExpanded ? "sm:w-[38rem] sm:h-[42rem]" : "sm:w-[25rem] sm:h-[35rem]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 bg-surface/70 px-4 py-3 sm:px-5 sm:py-3.5 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold shadow-xs">
                <Bot className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5">
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 border border-background" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-sm sm:text-base font-bold text-foreground leading-none">
                    Ask Gopal
                  </h2>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary uppercase">
                    Assistant
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Trained on portfolio data</span>
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors active:scale-95 cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Restore Size" : "Expand Size"}
                className="hidden sm:flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors active:scale-95 cursor-pointer"
              >
                {isExpanded ? (
                  <Minimize2 className="size-3.5" />
                ) : (
                  <Maximize2 className="size-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors active:scale-95 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm">
            {messages.map((msg, index) => (
              <AIChatMessage
                key={index}
                message={msg}
                onActionClick={handleActionClick}
                onSuggestionClick={(sug) => handleSendMessage(sug)}
              />
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-3 max-w-[80%]">
                <div className="size-7 sm:size-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">
                  <Bot className="size-4" />
                </div>
                <div className="rounded-2xl rounded-tl-xs border border-border bg-card px-4 py-3 text-card-foreground shadow-xs flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-2 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions pills when only welcome message exists */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-[11px] font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
                Frequently Asked
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {INITIAL_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/80 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground active:scale-95 cursor-pointer text-left"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="border-t border-border/80 bg-surface/50 p-3 sm:p-3.5 rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, DSA, college..."
                disabled={loading}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none disabled:opacity-60 pr-10"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="absolute right-1.5 flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CornerDownLeft className="size-3.5" />
                )}
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground/70 px-1 font-mono">
              <span>Powered by Gopal's Live Portfolio Data</span>
              <span className="hidden sm:inline">Press Enter ↵ to send</span>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
