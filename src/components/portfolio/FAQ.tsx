import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle, MessageSquareText, Search, Sparkles } from "lucide-react";

import { FAQS, type FAQItem } from "@/data/faq";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "./Section";

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
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set([FAQS[0]?.id || ""]));

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
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-gopal-ai-assistant", {
          detail: { question: question || "Can you tell me more about Gopal?" },
        }),
      );
    }
  };

  return (
    <Section id="faq" tone="surface">
      <div itemScope itemType="https://schema.org/FAQPage" className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Knowledge Base & AEO"
            title="Frequently Asked Questions"
            description="Clear, verified facts and structured answers about Gopal Maddheshiya's background, technical stack, projects, and internship availability for visitors, hiring managers, and AI answer engines."
          />

          {/* Quick AI Trigger Button */}
          <button
            type="button"
            onClick={() => handleAskAI()}
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs sm:text-sm font-medium text-primary hover:bg-primary/20 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="size-4 animate-pulse text-primary" aria-hidden="true" />
            <span>Ask Custom Question to AI</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Category badges */}
          <div
            className="flex flex-wrap gap-1.5 sm:gap-2"
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
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
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

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search answers..."
              className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card shadow-xs">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
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
                  className="transition-colors hover:bg-muted/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
                        {faq.category}
                      </span>
                      <h3
                        itemProp="name"
                        className="text-sm sm:text-base font-medium text-foreground leading-snug"
                      >
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
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
                      className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0 text-xs sm:text-sm leading-relaxed text-muted-foreground"
                    >
                      <div
                        itemProp="text"
                        className="whitespace-pre-line pl-0 sm:pl-11 border-l-2 border-primary/30 ml-2 sm:ml-0"
                      >
                        {faq.answer}
                      </div>

                      <div className="mt-3.5 pl-0 sm:pl-11 flex items-center gap-3">
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

        {/* AI Answer & AEO footnote */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Structured Data Verified for Google AI Overviews & Perplexity Search Citations
            </span>
          </div>
          <span className="font-mono text-[11px]">Schema.org FAQPage • JSON-LD</span>
        </div>
      </div>
    </Section>
  );
}
