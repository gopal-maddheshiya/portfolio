import React from "react";
import { Sparkles, Clock, Plus, Trash2 } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import type { JourneyMilestone, HighlightItem } from "@/data/profile";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { IconPicker } from "@/components/admin/ui/IconPicker";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import { toast } from "sonner";

interface JourneyTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function JourneyTab({ data, updateData }: JourneyTabProps) {
  const highlights = data.highlights || [];
  const journey = data.journey || [];

  // Highlights handlers
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

  // Journey milestone handlers
  const handleAddMilestone = () => {
    const phaseNum = (journey.length + 1).toString().padStart(2, "0");
    const newMilestone: JourneyMilestone = {
      phase: phaseNum,
      title: "New Learning Milestone",
      detail: "Details of concepts learned, projects engineered, and algorithms applied.",
      status: "next",
      tags: ["Topic 1", "Topic 2"],
    };
    updateData({ journey: [...journey, newMilestone] });
    toast.success("New learning milestone added!");
  };

  const handleDeleteMilestone = (index: number) => {
    const item = journey[index];
    if (confirm(`Delete milestone "${item?.title || "phase"}"?`)) {
      updateData({ journey: journey.filter((_, i) => i !== index) });
      toast.info("Milestone removed.");
    }
  };

  const handleMoveMilestone = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= journey.length) return;
    const itemA = journey[index];
    const itemB = journey[targetIndex];
    if (itemA && itemB) {
      const updated = [...journey];
      updated[index] = itemB;
      updated[targetIndex] = itemA;
      updateData({ journey: updated });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* 1. Top Highlights Cards */}
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
                <button
                  type="button"
                  onClick={() => handleDeleteHighlight(idx)}
                  title="Delete highlight"
                  className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
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

      {/* 2. Journey Timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              <span>Learning Journey &amp; Milestones ({journey.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phases mapping your trajectory from fundamentals to advanced development.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddMilestone}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Milestone</span>
          </button>
        </div>

        <div className="space-y-4">
          {journey.map((m, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-surface/50 p-4 space-y-3.5 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-mono font-bold text-primary">Phase {m.phase}</span>

                <div className="flex items-center gap-2">
                  <ReorderControls
                    index={idx}
                    total={journey.length}
                    onMove={handleMoveMilestone}
                    label="milestone"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(idx)}
                    title="Delete milestone"
                    className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Phase Code
                  </label>
                  <input
                    type="text"
                    value={m.phase}
                    onChange={(e) => {
                      const updated = [...journey];
                      updated[idx] = { ...m, phase: e.target.value };
                      updateData({ journey: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => {
                      const updated = [...journey];
                      updated[idx] = { ...m, title: e.target.value };
                      updateData({ journey: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Status
                  </label>
                  <select
                    value={m.status}
                    onChange={(e) => {
                      const updated = [...journey];
                      updated[idx] = {
                        ...m,
                        status: e.target.value as "done" | "active" | "next",
                      };
                      updateData({ journey: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="done">Done (Completed)</option>
                    <option value="active">Active (In Progress)</option>
                    <option value="next">Next (Upcoming)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={m.detail}
                    onChange={(e) => {
                      const updated = [...journey];
                      updated[idx] = { ...m, detail: e.target.value };
                      updateData({ journey: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none min-h-[60px]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <TagListInput
                    label="Milestone Focus Tags"
                    tags={m.tags || []}
                    onChange={(newTags) => {
                      const updated = [...journey];
                      updated[idx] = { ...m, tags: newTags };
                      updateData({ journey: updated });
                    }}
                    placeholder="Add focus tag (e.g. Java, Algorithms) and press Enter..."
                    badgeColorClass="bg-primary/10 text-primary border-primary/20"
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
