import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  HelpCircle,
  MessageSquareText,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { FAQS } from "@/data/faq";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

const CATEGORIES = [
  "All",
  "General",
  "Skills",
  "Projects",
  "DSA",
  "Internships",
  "Contact",
] as const;
type Category = (typeof CATEGORIES)[number];

export function FAQ() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set([FAQS[0]?.id || ""]));

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDrawerOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  // Listen for custom trigger event (e.g. from navbar or footer)
  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ questionId?: string }>;
      setIsDrawerOpen(true);
      if (customEvent.detail?.questionId) {
        setOpenIds((prev) => new Set([...prev, customEvent.detail.questionId!]));
      }
    };
    window.addEventListener("open-faq-drawer", handleOpenEvent);
    return () => {
      window.removeEventListener("open-faq-drawer", handleOpenEvent);
    };
  }, []);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openDrawerWithFaq = (id: string) => {
    setOpenIds(new Set([id]));
    setIsDrawerOpen(true);
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAskAI = (question?: string) => {
    setIsDrawerOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-gopal-ai-assistant", {
          detail: { question: question || "Can you tell me more about Gopal?" },
        }),
      );
    }
  };

  return (
    <Section id="faq" tone="surface" className="py-8 sm:py-12">
      {/* 
        Sleek, Compact Knowledge Base Strip:
        Replaces 1200+ vertical pixels with an elegant interactive card on the page.
      */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-6 sm:p-8 shadow-xs hover:border-primary/40 transition-colors">
        {/* Subtle decorative glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-xs font-mono font-medium text-primary">
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                KNOWLEDGE BASE &amp; AEO
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Schema.org FAQPage • AI Engine Verified
              </span>
            </div>

            <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Frequently Asked Questions &amp; Verified Facts
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Clear, structured facts about Gopal Maddheshiya&apos;s background, B.Tech CSE at SRMU,
              Java &amp; Full-Stack skills, SIH hackathon projects, and internship availability for
              visitors and AI answer engines.
            </p>

            {/* Quick interactive preview chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Quick preview:</span>
              {FAQS.slice(0, 2).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openDrawerWithFaq(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/90 bg-secondary/60 hover:bg-secondary px-2.5 py-1 text-xs text-foreground/80 hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  <span className="max-w-[200px] sm:max-w-none truncate">{item.question}</span>
                  <ArrowRight className="size-3 text-primary shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-xs transition-all cursor-pointer group"
            >
              <BookOpen className="size-4 shrink-0" aria-hidden="true" />
              <span>Explore Knowledge Base ({FAQS.length} Q&amp;As)</span>
              <ArrowRight
                className="size-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={() => handleAskAI()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-secondary px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground transition-colors cursor-pointer"
            >
              <Sparkles className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span>Ask Custom Question to AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 
        Slide-Over Knowledge Base Drawer:
        Rendered in DOM with full Schema.org microdata for Google and AI Answer Engines,
        while taking zero vertical scroll space on the main page when closed.
      */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex justify-end transition-opacity duration-300",
          isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal={isDrawerOpen}
        aria-label="Frequently Asked Questions & Knowledge Base"
        aria-hidden={!isDrawerOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity cursor-pointer"
        />

        {/* Drawer Panel */}
        <div
          className={cn(
            "relative z-10 w-full sm:w-[580px] md:w-[640px] max-w-full bg-card border-l border-border h-full flex flex-col shadow-2xl transition-transform duration-300 ease-out",
            isDrawerOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* Drawer Header */}
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-border bg-card/90 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                  Knowledge Base &amp; AEO
                </span>
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mt-1">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verified facts &amp; details about Gopal Maddheshiya
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Close FAQ drawer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="p-4 sm:p-5 border-b border-border bg-muted/20 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions or keywords (e.g. Java, SRMU, SIH)..."
                className="w-full rounded-lg border border-border bg-card pl-9 pr-9 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div
              className="flex flex-wrap gap-1.5"
              role="tablist"
              aria-label="FAQ Categories"
            >
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                      active
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Accordion List (Microdata Schema for Crawlers) */}
          <div
            itemScope
            itemType="https://schema.org/FAQPage"
            className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-border space-y-2 overscroll-contain"
          >
            {filteredFaqs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                <HelpCircle className="mx-auto size-8 opacity-40 mb-2" />
                <p>No questions matched your search query.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-3 text-xs text-primary underline underline-offset-4 cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openIds.has(faq.id);
                return (
                  <article
                    key={faq.id}
                    itemScope
                    itemProp="mainEntity"
                    itemType="https://schema.org/Question"
                    className="rounded-xl border border-border/70 bg-card/80 overflow-hidden transition-colors hover:border-primary/30"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-3 p-3.5 sm:p-4 text-left cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider shrink-0">
                          {faq.category}
                        </span>
                        <h4
                          itemProp="name"
                          className="text-xs sm:text-sm font-medium text-foreground leading-snug"
                        >
                          {faq.question}
                        </h4>
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform duration-200 mt-0.5",
                          isOpen && "rotate-180 text-primary",
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div
                        itemScope
                        itemProp="acceptedAnswer"
                        itemType="https://schema.org/Answer"
                        className="px-3.5 pb-4 sm:px-4 sm:pb-5 pt-0 text-xs sm:text-sm leading-relaxed text-muted-foreground"
                      >
                        <div
                          itemProp="text"
                          className="whitespace-pre-line pl-3 border-l-2 border-primary/30 ml-1"
                        >
                          {faq.answer}
                        </div>

                        <div className="mt-3 pl-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleAskAI(faq.question)}
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-2 cursor-pointer"
                          >
                            <MessageSquareText className="size-3.5" />
                            <span>Ask AI more about this</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 sm:p-5 border-t border-border bg-card/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px]">Schema.org FAQPage • JSON-LD</span>
            </div>

            <button
              type="button"
              onClick={() => handleAskAI()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-all cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              <span>Ask Custom Question to AI</span>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
