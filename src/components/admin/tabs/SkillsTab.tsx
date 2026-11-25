import { useMemo } from "react";
import { Layers, Plus, Trash2, Star, Sparkles, X, RotateCcw } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import type { SkillGroup } from "@/data/profile";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { SectionHeadingEditor } from "@/components/admin/ui/SectionHeadingEditor";
import { toast } from "sonner";

interface SkillsTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function SkillsTab({ data, updateData }: SkillsTabProps) {
  const skillGroups = useMemo(() => data.skillGroups || [], [data.skillGroups]);
  const featuredSkills = useMemo(() => data.featuredSkills || [], [data.featuredSkills]);

  const allAvailableSkills = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    skillGroups.forEach((group) => {
      (group.skills || []).forEach((skill) => {
        const key = skill.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          list.push(skill);
        }
      });
    });
    return list;
  }, [skillGroups]);

  const toggleFeaturedSkill = (skill: string) => {
    const existsIndex = featuredSkills.findIndex((s) => s.toLowerCase() === skill.toLowerCase());
    if (existsIndex >= 0) {
      updateData({
        featuredSkills: featuredSkills.filter((_, idx) => idx !== existsIndex),
      });
      return;
    }
    if (featuredSkills.length >= 8) {
      toast.error("Core Stack holds up to 8 cards. Remove one first to swap it.");
      return;
    }
    updateData({ featuredSkills: [...featuredSkills, skill] });
  };

  const moveFeaturedSkill = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= featuredSkills.length) return;
    const itemA = featuredSkills[index];
    const itemB = featuredSkills[target];
    if (itemA && itemB) {
      const updated = [...featuredSkills];
      updated[index] = itemB;
      updated[target] = itemA;
      updateData({ featuredSkills: updated });
    }
  };

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
      <SectionHeadingEditor
        sectionKey="skills"
        sectionLabel="Skills & Tech Stack"
        data={data}
        updateData={updateData}
      />

      {/* Core Stack Showcase Picker */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <span>Core Stack Animated Cards ({featuredSkills.length}/8)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose up to 8 headline technologies displayed in the default Core Stack tab (leave
              empty for automatic priority selection).
            </p>
          </div>
          {featuredSkills.length > 0 && (
            <button
              type="button"
              onClick={() => updateData({ featuredSkills: [] })}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface hover:bg-secondary px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="size-3" />
              <span>Use Auto Top 8</span>
            </button>
          )}
        </div>

        {/* Selected Order List */}
        {featuredSkills.length > 0 ? (
          <div className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pinned Core Stack Order
            </span>
            <div className="grid gap-2 sm:grid-cols-2">
              {featuredSkills.map((skill, sIdx) => (
                <div
                  key={`${skill}-${sIdx}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] font-bold text-primary">
                      #{sIdx + 1}
                    </span>
                    <span className="text-xs font-semibold text-foreground truncate">{skill}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <ReorderControls
                      index={sIdx}
                      total={featuredSkills.length}
                      onMove={moveFeaturedSkill}
                      label="core skill"
                    />
                    <button
                      type="button"
                      onClick={() => toggleFeaturedSkill(skill)}
                      title={`Remove ${skill} from Core Stack`}
                      className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-surface/40 px-3.5 py-2.5 text-xs text-muted-foreground">
            Auto mode active: automatically showcases Java, React, TypeScript, Tailwind, Node.js,
            Express, MongoDB, and Supabase. Click any skill below to customize manually.
          </p>
        )}

        {/* Quick Toggle Pool */}
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Click Skills Below to Pin / Unpin
          </span>
          <div className="flex flex-wrap gap-1.5">
            {allAvailableSkills.map((skill) => {
              const isPinned = featuredSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleFeaturedSkill(skill)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
                    isPinned
                      ? "border-primary bg-primary text-primary-foreground font-semibold shadow-2xs"
                      : "border-border bg-surface/60 text-muted-foreground hover:text-foreground hover:border-border-strong"
                  }`}
                >
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
                  Mark as Primary Category (Core track highlighted first)
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
