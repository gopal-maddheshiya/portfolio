import React from "react";
import { BookOpen, Sparkles, GraduationCap, Layers, Cpu, Plus, Trash2 } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { IconPicker } from "@/components/admin/ui/IconPicker";
import { toast } from "sonner";

interface AboutTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function AboutTab({ data, updateData }: AboutTabProps) {
  const about = data.aboutData;
  const education = data.education || [];
  const principles = about.principles || [];
  const storyParagraphs = about.storyParagraphs || [];

  // ─── Education Handlers ───
  const handleAddEducation = () => {
    const newEdu = {
      title: "Degree / Course",
      org: "University / Institute Name",
      period: "2024 – 2028",
      detail: "CGPA / Percentage",
    };
    updateData({ education: [newEdu, ...education] });
    toast.success("New degree added at the top!");
  };

  const handleDeleteEducation = (index: number) => {
    const item = education[index];
    if (confirm(`Delete "${item?.title || "degree"}"?`)) {
      updateData({ education: education.filter((_, i) => i !== index) });
      toast.info("Degree removed.");
    }
  };

  const handleMoveEducation = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= education.length) return;
    const itemA = education[index];
    const itemB = education[targetIndex];
    if (itemA && itemB) {
      const updated = [...education];
      updated[index] = itemB;
      updated[targetIndex] = itemA;
      updateData({ education: updated });
    }
  };

  // ─── Principles Handlers ───
  const handleAddPrinciple = () => {
    const newPrinciple = {
      title: "New Core Pillar",
      description: "Short description of this engineering principle or discipline.",
      icon: "code",
    };
    updateData({ aboutData: { ...about, principles: [...principles, newPrinciple] } });
    toast.success("New engineering principle added!");
  };

  const handleDeletePrinciple = (index: number) => {
    updateData({
      aboutData: {
        ...about,
        principles: principles.filter((_, i) => i !== index),
      },
    });
    toast.info("Principle removed.");
  };

  const handleMovePrinciple = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= principles.length) return;
    const itemA = principles[index];
    const itemB = principles[targetIndex];
    if (itemA && itemB) {
      const updated = [...principles];
      updated[index] = itemB;
      updated[targetIndex] = itemA;
      updateData({ aboutData: { ...about, principles: updated } });
    }
  };

  // ─── Story Paragraph Handlers ───
  const handleAddStoryParagraph = () => {
    updateData({
      aboutData: {
        ...about,
        storyParagraphs: [
          ...storyParagraphs,
          "New paragraph detailing your journey and technical evolution.",
        ],
      },
    });
  };

  const handleDeleteStoryParagraph = (index: number) => {
    updateData({
      aboutData: {
        ...about,
        storyParagraphs: storyParagraphs.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* 1. About Headings */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <span>About Section Headings &amp; Intro</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure section intro, titles, and story card headline.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Eyebrow Tag
            </label>
            <input
              type="text"
              value={about.eyebrow}
              onChange={(e) => updateData({ aboutData: { ...about, eyebrow: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Main Section Title
            </label>
            <input
              type="text"
              value={about.title}
              onChange={(e) => updateData({ aboutData: { ...about, title: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Section Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={about.description}
              onChange={(e) => updateData({ aboutData: { ...about, description: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[65px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Story Card Headline
            </label>
            <input
              type="text"
              value={about.storyTitle}
              onChange={(e) => updateData({ aboutData: { ...about, storyTitle: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Narrative Paragraphs */}
        <div className="space-y-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Story Paragraphs ({storyParagraphs.length})
            </label>
            <button
              type="button"
              onClick={handleAddStoryParagraph}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Paragraph</span>
            </button>
          </div>

          {storyParagraphs.map((paragraph, pIdx) => (
            <div
              key={pIdx}
              className="relative rounded-xl border border-border bg-surface/50 p-3 space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Paragraph #{pIdx + 1}</span>
                {storyParagraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteStoryParagraph(pIdx)}
                    title="Delete paragraph"
                    className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={paragraph}
                onChange={(e) => {
                  const updated = [...storyParagraphs];
                  updated[pIdx] = e.target.value;
                  updateData({ aboutData: { ...about, storyParagraphs: updated } });
                }}
                className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm leading-relaxed text-foreground focus:border-primary focus:outline-none min-h-[75px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Profile Snapshot Grid */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <span>Profile Snapshot Cards (Right Column Grid)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quick credential metrics shown on the right side of the About section.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Degree Title
            </label>
            <input
              type="text"
              value={about.snapshot?.degree || ""}
              onChange={(e) =>
                updateData({
                  aboutData: {
                    ...about,
                    snapshot: { ...(about.snapshot || {}), degree: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              CGPA
            </label>
            <input
              type="text"
              value={about.snapshot?.cgpa || ""}
              onChange={(e) =>
                updateData({
                  aboutData: {
                    ...about,
                    snapshot: { ...(about.snapshot || {}), cgpa: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              DSA Practice Focus
            </label>
            <input
              type="text"
              value={about.snapshot?.dsaPractice || ""}
              onChange={(e) =>
                updateData({
                  aboutData: {
                    ...about,
                    snapshot: { ...(about.snapshot || {}), dsaPractice: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Core Tech Stack
            </label>
            <input
              type="text"
              value={about.snapshot?.stack || ""}
              onChange={(e) =>
                updateData({
                  aboutData: {
                    ...about,
                    snapshot: { ...(about.snapshot || {}), stack: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Graduating Batch
            </label>
            <input
              type="text"
              value={about.snapshot?.batch || ""}
              onChange={(e) =>
                updateData({
                  aboutData: {
                    ...about,
                    snapshot: { ...(about.snapshot || {}), batch: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              University Name
            </label>
            <input
              type="text"
              value={about.snapshot?.university || ""}
              onChange={(e) =>
                updateData({
                  aboutData: {
                    ...about,
                    snapshot: { ...(about.snapshot || {}), university: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Education Timeline with Reorder & Delete */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              <span>Education Timeline ({education.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add and reorder academic degrees, universities, and graduation years.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddEducation}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Degree</span>
          </button>
        </div>

        <div className="space-y-4">
          {education.map((edu, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-surface/50 p-4 space-y-3.5 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-mono font-bold text-primary">Degree #{idx + 1}</span>

                <div className="flex items-center gap-2">
                  <ReorderControls
                    index={idx}
                    total={education.length}
                    onMove={handleMoveEducation}
                    label="degree"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteEducation(idx)}
                    title="Delete degree"
                    className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Degree Title
                  </label>
                  <input
                    type="text"
                    value={edu.title}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx] = { ...edu, title: e.target.value };
                      updateData({ education: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    University / Institute
                  </label>
                  <input
                    type="text"
                    value={edu.org}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx] = { ...edu, org: e.target.value };
                      updateData({ education: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Period (Years)
                  </label>
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx] = { ...edu, period: e.target.value };
                      updateData({ education: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    CGPA / Details
                  </label>
                  <input
                    type="text"
                    value={edu.detail}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx] = { ...edu, detail: e.target.value };
                      updateData({ education: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Engineering Tenets & Principles with IconPicker & Reorder */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Cpu className="size-5 text-primary" />
              <span>Engineering Tenets &amp; Principles ({principles.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Core pillars shown in the About section Bio tab with custom icons and descriptions.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddPrinciple}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Pillar</span>
          </button>
        </div>

        <div className="space-y-4">
          {principles.map((principle, pIdx) => (
            <div
              key={pIdx}
              className="rounded-xl border border-border bg-surface/50 p-4 space-y-3.5 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-mono font-bold text-primary">Pillar #{pIdx + 1}</span>

                <div className="flex items-center gap-2">
                  <ReorderControls
                    index={pIdx}
                    total={principles.length}
                    onMove={handleMovePrinciple}
                    label="pillar"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePrinciple(pIdx)}
                    title="Delete pillar"
                    className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Pillar Title
                  </label>
                  <input
                    type="text"
                    value={principle.title}
                    onChange={(e) => {
                      const updated = [...principles];
                      updated[pIdx] = { ...principle, title: e.target.value };
                      updateData({ aboutData: { ...about, principles: updated } });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <IconPicker
                    label="Pillar Icon"
                    value={principle.icon || "code"}
                    onChange={(newIcon) => {
                      const updated = [...principles];
                      updated[pIdx] = { ...principle, icon: newIcon };
                      updateData({ aboutData: { ...about, principles: updated } });
                    }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={principle.description}
                    onChange={(e) => {
                      const updated = [...principles];
                      updated[pIdx] = { ...principle, description: e.target.value };
                      updateData({ aboutData: { ...about, principles: updated } });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Coursework & Focus Areas using TagListInput */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Layers className="size-5 text-primary" />
            <span>Academic Coursework &amp; Focus Area Tags</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage subject chips and engineering focus areas easily without typing errors.
          </p>
        </div>

        <div className="space-y-5">
          <TagListInput
            label="Academic Coursework Subjects"
            tags={about.coursework || []}
            onChange={(newCoursework) =>
              updateData({ aboutData: { ...about, coursework: newCoursework } })
            }
            placeholder="Add subject (e.g. Operating Systems) and press Enter..."
            helpText="Displayed in the Education / Coursework tab on the About section."
          />

          <TagListInput
            label="Engineering Focus Areas"
            tags={data.focusAreas || []}
            onChange={(newFocus) => updateData({ focusAreas: newFocus })}
            placeholder="Add focus area (e.g. Microservices, REST APIs)..."
            badgeColorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            helpText="Displayed in key highlight badges and profile filters."
          />
        </div>
      </div>
    </div>
  );
}
