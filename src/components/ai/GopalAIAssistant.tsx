import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Loader2, Maximize2, Minimize2, RotateCcw, Sparkles, X } from "lucide-react";
import { gsap } from "gsap";

import { PERSONAL_INFO } from "@/data/profile";
import { usePortfolio } from "@/context/PortfolioContext";
import { cn } from "@/lib/utils";
import { askGopalAiStream, type ChatAction, type ChatMessage } from "@/server/ai";
import { AIChatMessage } from "./AIChatMessage";

const INITIAL_SUGGESTIONS = [
  "What projects has Gopal built?",
  "Tell me about his DSA skills",
  "Download Resume",
];

const createWelcomeMessage = (): ChatMessage => ({
  role: "assistant",
  content: `Hello! I'm **Ask Gopal**, Gopal Maddheshiya's portfolio assistant.\n\nFeel free to ask me anything about his projects, skills, DSA problem solving, or background!`,
  suggestions: INITIAL_SUGGESTIONS,
});

export function GopalAIAssistant() {
  const { data } = usePortfolio();
  const info = data?.personalInfo || PERSONAL_INFO;

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const launcherRef = useRef<HTMLDivElement>(null);

  // Typewriter Streaming Engine Refs
  const bufferRef = useRef<string>("");
  const isDoneRef = useRef<boolean>(false);
  const completionDataRef = useRef<{
    suggestions: string[];
    actions?: ChatAction[] | undefined;
  } | null>(null);
  const timerRef = useRef<number | null>(null);

  // Auto-scroll to bottom smoothly
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isStreaming, loading, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Page Load Entrance: Assistant button slides in from the right to its resting position
  useEffect(() => {
    if (launcherRef.current) {
      gsap.fromTo(
        launcherRef.current,
        {
          x: 180,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.35,
        },
      );
    }
  }, []);

  // Animate Chat Window Open with GSAP
  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        {
          opacity: 0,
          scale: 0.88,
          y: 24,
          transformOrigin: "bottom right",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.38,
          ease: "back.out(1.25)",
        },
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 16,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false);
        },
      });
    } else {
      setIsOpen(false);
    }
  };

  // Cleanup typewriter timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const startTypewriterLoop = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const tick = () => {
      if (bufferRef.current.length > 0) {
        // Natural typewriter cadence:
        // Speed up dynamically if network delivers a large chunk so it never falls behind
        const charsToTake =
          bufferRef.current.length > 80 ? 4 : bufferRef.current.length > 30 ? 2 : 1;
        const piece = bufferRef.current.slice(0, charsToTake);
        bufferRef.current = bufferRef.current.slice(charsToTake);

        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") {
            next[next.length - 1] = {
              ...last,
              content: last.content + piece,
            };
          }
          return next;
        });

        timerRef.current = window.setTimeout(tick, 18);
      } else if (isDoneRef.current) {
        // Buffer is empty and stream generation is complete
        if (completionDataRef.current) {
          const comp = completionDataRef.current;
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              next[next.length - 1] = {
                ...last,
                suggestions: comp.suggestions,
                actions: comp.actions,
              };
            }
            return next;
          });
        }
        setIsStreaming(false);
        setLoading(false);
        timerRef.current = null;
      } else {
        // Still waiting for more network chunks
        timerRef.current = window.setTimeout(tick, 25);
      }
    };

    timerRef.current = window.setTimeout(tick, 18);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      role: "user",
      content: query,
      timestamp: Date.now(),
    };

    const initialAssistantMsg: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    const previousHistory = messages.filter((m) => m.content.length > 0).slice(-6);

    // Reset typewriter buffer & flags
    bufferRef.current = "";
    isDoneRef.current = false;
    completionDataRef.current = null;

    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setLoading(true);
    setIsStreaming(true);

    startTypewriterLoop();

    try {
      await askGopalAiStream({
        message: query,
        history: previousHistory,
        resumeUrl: info.resume,
        whatsappNumber: info.whatsapp,
        onChunk: (chunk) => {
          bufferRef.current += chunk;
        },
        onComplete: ({ suggestions, actions }) => {
          completionDataRef.current = { suggestions, actions };
          isDoneRef.current = true;
        },
        onError: (err) => {
          console.error("AI assistant stream error:", err);
          bufferRef.current +=
            "\n\nGopal is open for software engineering opportunities! You can contact him directly at " +
            info.email +
            " or on WhatsApp.";
          completionDataRef.current = {
            suggestions: ["What projects has Gopal built?", "Tell me about his DSA skills"],
            actions: [
              {
                label: "💬 Message on WhatsApp",
                url: `https://wa.me/${info.whatsapp || PERSONAL_INFO.whatsapp}`,
                action: "whatsapp",
              },
              { label: "📄 Download Resume", url: info.resume, action: "resume" },
            ],
          };
          isDoneRef.current = true;
        },
      });
    } catch (err) {
      console.error("Failed to query AI assistant:", err);
      isDoneRef.current = true;
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
      window.open(info.resume || PERSONAL_INFO.resume, "_blank", "noopener,noreferrer");
    } else if (action.action === "whatsapp") {
      window.open(
        `https://wa.me/${info.whatsapp || PERSONAL_INFO.whatsapp}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  const handleClearHistory = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    bufferRef.current = "";
    isDoneRef.current = false;
    completionDataRef.current = null;
    setIsStreaming(false);
    setLoading(false);
    setMessages([createWelcomeMessage()]);
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom-Right */}
      {!isOpen && (
        <div
          ref={launcherRef}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto"
          style={{ opacity: 0, transform: "translateX(180px)" }}
        >
          <div className="animate-float-slow">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open Ask Gopal AI Portfolio Assistant"
              className="group relative flex items-center gap-3 rounded-full border border-primary/35 hover:border-primary bg-card/95 px-4 py-2.5 sm:px-4.5 sm:py-3 text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.45)] ring-1 ring-white/10 hover:ring-primary/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.55),0_0_24px_rgba(249,115,22,0.18)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              {/* Bot Avatar */}
              <div className="flex size-8 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground shadow-sm shadow-primary/30">
                <Bot className="size-4.5 shrink-0 transition-transform group-hover:rotate-12 duration-200" />
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Ask Gopal
                  </span>
                  <Sparkles className="size-3 text-primary" />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono leading-none">
                  AI Assistant
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <aside
          ref={modalRef}
          aria-label="Ask Gopal Portfolio Assistant Chat Window"
          className={cn(
            "fixed z-50 flex flex-col border border-primary/30 bg-background/98 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10 transition-all duration-300",
            // Mobile full screen drawer or fixed widget
            "inset-x-2 bottom-2 top-14 sm:inset-auto sm:right-6 sm:bottom-6 rounded-3xl overflow-hidden",
            isExpanded ? "sm:w-[44rem] sm:h-[44rem]" : "sm:w-[28rem] sm:h-[38rem]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 bg-surface/80 px-4 py-3 sm:px-5 sm:py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold shadow-xs">
                <Bot className="size-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-display text-sm sm:text-base font-bold text-foreground leading-none">
                    Ask Gopal
                  </h2>
                  <span className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-[9px] font-medium text-primary uppercase">
                    Assistant
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                  {isStreaming ? (
                    <span className="flex items-center gap-1 text-primary">
                      <Sparkles className="size-2.5" />
                      <span>Thinking & typing...</span>
                    </span>
                  ) : (
                    <span>Portfolio Representative</span>
                  )}
                </div>
              </div>
            </div>

            {/* Header control buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Restore Size" : "Expand Size"}
                className="hidden sm:flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95 cursor-pointer"
              >
                {isExpanded ? (
                  <Minimize2 className="size-3.5" />
                ) : (
                  <Maximize2 className="size-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                title="Close Assistant"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm">
            {messages
              .filter((msg) => msg.content.length > 0)
              .map((msg, index) => {
                const isLastAssistant = index === messages.length - 1 && msg.role === "assistant";
                return (
                  <AIChatMessage
                    key={index}
                    message={msg}
                    isStreaming={isLastAssistant && isStreaming}
                    onActionClick={handleActionClick}
                    onSuggestionClick={(sug) => handleSendMessage(sug)}
                  />
                );
              })}

            {/* Initial Typing indicator before first character arrives */}
            {loading && !messages[messages.length - 1]?.content && (
              <div className="w-full rounded-2xl rounded-tl-xs border border-border/80 bg-card/95 px-4 py-3 text-xs sm:text-sm text-card-foreground backdrop-blur-md shadow-soft animate-in fade-in-50">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-primary mb-2 border-b border-border/50 pb-1.5">
                  <Bot className="size-3.5" />
                  <span>Ask Gopal</span>
                </div>
                <div className="flex items-center gap-1.5 py-1">
                  <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="border-t border-border/80 bg-surface/70 p-3 sm:p-3.5 backdrop-blur-md">
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
                className="w-full rounded-xl border border-input bg-background/90 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:outline-none disabled:opacity-60 pr-12 shadow-xs transition-all"
              />

              {/* Modern Sleek Elevated Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className={cn(
                  "absolute right-1.5 flex size-8 sm:size-8.5 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer",
                  input.trim() && !loading
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30 hover:opacity-90 active:scale-95"
                    : "bg-muted text-muted-foreground/40 cursor-not-allowed opacity-50",
                )}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin text-foreground" />
                ) : (
                  <ArrowUp className="size-4 stroke-[2.5]" />
                )}
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground/70 px-1 font-mono">
              <span>Ask Gopal Portfolio Assistant</span>
              <span className="hidden sm:inline">Press Enter ↵ to send</span>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
