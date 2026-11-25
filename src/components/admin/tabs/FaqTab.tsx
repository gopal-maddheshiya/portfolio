import { useMemo, useState } from "react";
import { HelpCircle, Plus, Search, Trash2 } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import type { FAQItem } from "@/data/faq";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { SectionHeadingEditor } from "@/components/admin/ui/SectionHeadingEditor";
import { toast } from "sonner";

interface FaqTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

const FAQ_CATEGORIES: FAQItem["category"][] = [
  "General",
  "Skills",
  "Projects",
  "DSA",
  "Internships",
  "Contact",
];

export function FaqTab({ data, updateData }: FaqTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const faqs = useMemo(() => data.faqs || [], [data.faqs]);

  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: `faq-${Date.now().toString(36)}`,
      question: "New Frequently Asked Question?",
      answer: "Provide a clear, factual answer for visitors and Schema.org FAQ indexing.",
      category: "General",
    };
    updateData({ faqs: [newFaq, ...faqs] });
    toast.success("New FAQ added at top!");
  };

  const handleDeleteFaq = (originalIndex: number) => {
    const item = faqs[originalIndex];
    if (confirm(`Delete FAQ "${item?.question || "question"}"?`)) {
      updateData({ faqs: faqs.filter((_, i) => i !== originalIndex) });
      toast.info("FAQ removed.");
    }
  };

  const handleMoveFaq = (originalIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? originalIndex - 1 : originalIndex + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;
    const itemA = faqs[originalIndex];
    const itemB = faqs[targetIndex];
    if (itemA && itemB) {
      const updated = [...faqs];
      updated[originalIndex] = itemB;
      updated[targetIndex] = itemA;
      updateData({ faqs: updated });
    }
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs.map((item, idx) => ({ item, originalIndex: idx }));
    const q = searchQuery.toLowerCase();
    return faqs
      .map((item, idx) => ({ item, originalIndex: idx }))
      .filter(
        ({ item }) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      );
  }, [faqs, searchQuery]);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <SectionHeadingEditor
        sectionKey="faq"
        sectionLabel="Knowledge Base & FAQ"
        data={data}
        updateData={updateData}
      />

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
            <HelpCircle className="size-6 text-primary" />
            <span>FAQ Knowledge Base ({faqs.length})</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Powers both the interactive FAQ drawer and Schema.org FAQPage structured data.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-52 pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
            <span>Add Q&amp;A</span>
          </button>
        </div>
      </div>

      {/* FAQ Items List */}
      <div className="space-y-4">
        {filteredFaqs.map(({ item, originalIndex }) => (
          <div
            key={item.id || originalIndex}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-primary">
                  FAQ #{originalIndex + 1}
                </span>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ReorderControls
                  index={originalIndex}
                  total={faqs.length}
                  onMove={handleMoveFaq}
                  label="FAQ item"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(originalIndex)}
                  title="Delete FAQ"
                  className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer shadow-2xs"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Question
                </label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[originalIndex] = { ...item, question: e.target.value };
                    updateData({ faqs: updated });
                  }}
                  className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Category
                </label>
                <select
                  value={item.category}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[originalIndex] = {
                      ...item,
                      category: e.target.value as FAQItem["category"],
                    };
                    updateData({ faqs: updated });
                  }}
                  className="w-full rounded-lg border border-border-strong bg-card px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
                >
                  {FAQ_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Answer (Supports line breaks)
                </label>
                <textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[originalIndex] = { ...item, answer: e.target.value };
                    updateData({ faqs: updated });
                  }}
                  className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[85px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
