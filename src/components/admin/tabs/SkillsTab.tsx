import React from "react";
import { Layers, Plus, Trash2, Star } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import type { SkillGroup } from "@/data/profile";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { toast } from "sonner";

interface SkillsTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function SkillsTab({ data, updateData }: SkillsTabProps) {
  const skillGroups = data.skillGroups || [];

  const handleAddSkillGroup = () => {
    const newGroup: SkillGroup = {
      title: "New Tech Category",
      skills: ["Skill 1", "Skill 2"],
      primary: false,
    };
    updateData({ skillGroups: [...skillGroups, newGroup] });
    toast.success("New technical category added!");
  };

  const handleDeleteSkillGroup = (index: number) => {
    const item = skillGroups[index];
    if (confirm(`Are you sure you want to delete category "${item?.title || "skill group"}"?`)) {
      updateData({ skillGroups: skillGroups.filter((_, i) => i !== index) });
      toast.info("Category removed.");
    }
  };

  const handleMoveSkillGroup = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skillGroups.length) return;
    const itemA = skillGroups[index];
    const itemB = skillGroups[targetIndex];
    if (itemA && itemB) {
      const updated = [...skillGroups];
      updated[index] = itemB;
      updated[targetIndex] = itemA;
      updateData({ skillGroups: updated });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
            <Layers className="size-6 text-primary" />
            <span>Skill Groups &amp; Tech Stack ({skillGroups.length})</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage technical skill categories, primary card highlights, and individual skill chips.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSkillGroup}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="space-y-5">
        {skillGroups.map((group, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-primary">
                  Category #{idx + 1}
                </span>
                {group.primary && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5 border border-primary/20">
                    <Star className="size-3 fill-primary" />
                    <span>Primary Group</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <ReorderControls
                  index={idx}
                  total={skillGroups.length}
                  onMove={handleMoveSkillGroup}
                  label="skill category"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSkillGroup(idx)}
                  title="Delete category"
                  className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer shadow-2xs"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Category Title
                </label>
                <input
                  type="text"
                  value={group.title}
                  onChange={(e) => {
                    const updated = [...skillGroups];
                    updated[idx] = { ...group, title: e.target.value };
                    updateData({ skillGroups: updated });
                  }}
                  className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-6">
                <input
                  type="checkbox"
                  id={`primary-skill-${idx}`}
                  checked={group.primary}
                  onChange={(e) => {
                    const updated = [...skillGroups];
                    updated[idx] = { ...group, primary: e.target.checked };
                    updateData({ skillGroups: updated });
                  }}
                  className="rounded border-border text-primary size-4.5 cursor-pointer"
                />
                <label
                  htmlFor={`primary-skill-${idx}`}
                  className="text-xs text-foreground font-semibold cursor-pointer"
                >
                  Highlight as Primary Category (Emphasized Card in Skills section)
                </label>
              </div>

              <div className="sm:col-span-2">
                <TagListInput
                  label="Skills in this Category"
                  tags={group.skills || []}
                  onChange={(newSkills) => {
                    const updated = [...skillGroups];
                    updated[idx] = { ...group, skills: newSkills };
                    updateData({ skillGroups: updated });
                  }}
                  placeholder="Add skill (e.g. Java, Spring Boot, React) and press Enter..."
                  badgeColorClass="bg-secondary text-foreground border-border"
                  helpText="Click ✕ on any badge to remove. Add or paste comma-separated skills."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
