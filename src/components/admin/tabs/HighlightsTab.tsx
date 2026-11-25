import { Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { IconPicker } from "@/components/admin/ui/IconPicker";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import type { HighlightItem } from "@/data/profile";
import type { PortfolioData } from "@/lib/supabase";

const TARGET_SECTIONS = [
  { id: "about", label: "About (#about)" },
  { id: "skills", label: "Skills (#skills)" },
  { id: "projects", label: "Projects (#projects)" },
  { id: "dsa", label: "DSA (#dsa)" },
  { id: "profiles", label: "Profiles (#profiles)" },
  { id: "certifications", label: "Certificates (#certifications)" },
  { id: "gallery", label: "Gallery (#gallery)" },
  { id: "faq", label: "FAQ (#faq)" },
  { id: "contact", label: "Contact (#contact)" },
];

interface HighlightsTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

/** Admin editor for the credential marquee cards shown directly below Hero. */
export function HighlightsTab({ data, updateData }: HighlightsTabProps) {
  const highlights = data.highlights || [];

  const handleAddHighlight = () => {
    const newHighlight: HighlightItem = {
      label: "New Highlight",
      detail: "Key milestone detail",
      section: "about",
      icon: "sparkles",
    };
    updateData({ highlights: [...highlights, newHighlight] });
    toast.success("New highlight card added!");
  };

  const handleDeleteHighlight = (index: number) => {
    updateData({ highlights: highlights.filter((_, i) => i !== index) });
    toast.info("Highlight removed.");
  };

  const handleMoveHighlight = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= highlights.length) return;
    const itemA = highlights[index];
    const itemB = highlights[targetIndex];
    if (itemA && itemB) {
      const updated = [...highlights];
      updated[index] = itemB;
      updated[targetIndex] = itemA;
      updateData({ highlights: updated });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <span>Top Highlights Bar (Cards Below Hero)</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Key credential cards featured horizontally right under the hero section.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddHighlight}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Highlight</span>
          </button>
        </div>

        <div className="space-y-3">
          {highlights.map((hl, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-surface/50 p-4 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-mono font-bold text-primary">
                  Highlight #{idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <ReorderControls
                    index={idx}
                    total={highlights.length}
                    onMove={handleMoveHighlight}
                    label="highlight"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteHighlight(idx)}
                    title="Delete highlight"
                    className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={hl.label}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx] = { ...hl, label: e.target.value };
                      updateData({ highlights: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Detail Text
                  </label>
                  <input
                    type="text"
                    value={hl.detail}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx] = { ...hl, detail: e.target.value };
                      updateData({ highlights: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Click Scroll Target
                  </label>
                  <select
                    value={hl.section || "about"}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx] = { ...hl, section: e.target.value };
                      updateData({ highlights: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none cursor-pointer"
                  >
                    {TARGET_SECTIONS.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <IconPicker
                    label="Highlight Icon"
                    value={hl.icon || "sparkles"}
                    onChange={(newIcon) => {
                      const updated = [...highlights];
                      updated[idx] = { ...hl, icon: newIcon };
                      updateData({ highlights: updated });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
