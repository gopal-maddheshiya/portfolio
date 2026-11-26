import { useId, useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Type } from "lucide-react";
import { DEFAULT_SECTION_HEADERS, type EditableSectionKey } from "@/data/profile";
import type { PortfolioData } from "@/lib/supabase";

interface SectionHeadingEditorProps {
  sectionKey: EditableSectionKey;
  sectionLabel: string;
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

/** Collapsible editor for a portfolio section's eyebrow, title, and description. */
export function SectionHeadingEditor({
  sectionKey,
  sectionLabel,
  data,
  updateData,
}: SectionHeadingEditorProps) {
  const baseId = useId();
  const [expanded, setExpanded] = useState(false);
  const defaults = DEFAULT_SECTION_HEADERS[sectionKey];
  const current = data.sectionHeaders?.[sectionKey] || {};

  const eyebrowValue = current.eyebrow ?? defaults.eyebrow;
  const titleValue = current.title ?? defaults.title;
  const descriptionValue = current.description ?? defaults.description;

  const updateField = (field: "eyebrow" | "title" | "description", value: string) => {
    updateData((prev) => ({
      ...prev,
      sectionHeaders: {
        ...(prev.sectionHeaders || {}),
        [sectionKey]: {
          ...defaults,
          ...(prev.sectionHeaders?.[sectionKey] || {}),
          [field]: value,
        },
      },
    }));
  };

  const resetDefaults = () => {
    updateData((prev) => ({
      ...prev,
      sectionHeaders: {
        ...(prev.sectionHeaders || {}),
        [sectionKey]: { ...defaults },
      },
    }));
  };

  return (
    <div className="rounded-2xl border border-border bg-card/85 shadow-2xs overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-surface/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Type className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
              {sectionLabel} Section Heading &amp; Subtitle
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {eyebrowValue} &bull; {titleValue}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-mono text-muted-foreground shrink-0">
          <span>{expanded ? "Hide" : "Edit"}</span>
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-border/80 bg-surface/35 p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${baseId}-eyebrow`}
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Section Eyebrow
              </label>
              <input
                id={`${baseId}-eyebrow`}
                name={`${sectionKey}-eyebrow`}
                type="text"
                value={eyebrowValue}
                onChange={(e) => updateField("eyebrow", e.target.value)}
                className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs font-mono text-primary focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor={`${baseId}-title`}
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Section Title
              </label>
              <input
                id={`${baseId}-title`}
                name={`${sectionKey}-title`}
                type="text"
                value={titleValue}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs sm:text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${baseId}-description`}
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Section Subtitle / Description
                </label>
                <button
                  type="button"
                  onClick={resetDefaults}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset Heading Defaults</span>
                </button>
              </div>
              <textarea
                id={`${baseId}-description`}
                name={`${sectionKey}-description`}
                rows={2}
                value={descriptionValue}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none min-h-[60px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
