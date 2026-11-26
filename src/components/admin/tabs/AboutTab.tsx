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
  const primaryBio = about.storyParagraphs?.[0] || "";

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

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* 1. About Headings & Narrative */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <span>About Section Headings &amp; Narrative</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure section intro, availability pill, story headline, and editorial bio.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="about-eyebrow"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Eyebrow Tag
            </label>
            <input
              id="about-eyebrow"
              name="about-eyebrow"
              type="text"
              value={about.eyebrow}
              onChange={(e) => updateData({ aboutData: { ...about, eyebrow: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="about-availability-badge"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Availability Badge (Top-Right of Story Card)
            </label>
            <input
              id="about-availability-badge"
              name="about-availability-badge"
              type="text"
              value={about.availabilityBadge || ""}
              placeholder="Open to Internships"
              onChange={(e) =>
                updateData({ aboutData: { ...about, availabilityBadge: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="about-main-title"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Main Section Title
            </label>
            <input
              id="about-main-title"
              name="about-main-title"
              type="text"
              value={about.title}
              onChange={(e) => updateData({ aboutData: { ...about, title: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="about-story-title"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Story Card Headline
            </label>
            <input
              id="about-story-title"
              name="about-story-title"
              type="text"
              value={about.storyTitle}
              onChange={(e) => updateData({ aboutData: { ...about, storyTitle: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="about-bio"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Editorial Bio Paragraph
            </label>
            <textarea
              id="about-bio"
              name="about-bio"
              rows={3}
              value={primaryBio}
              onChange={(e) => {
                const rest = (about.storyParagraphs || []).slice(1);
                updateData({
                  aboutData: { ...about, storyParagraphs: [e.target.value, ...rest] },
                });
              }}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground focus:border-primary focus:outline-none min-h-[90px]"
            />
          </div>
        </div>
      </div>

      {/* 2. Profile Snapshot Grid */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <span>Academic Snapshot Tiles (Bottom of Story Card)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Degree, CGPA, and Batch tiles shown in the 3-card strip (the 3rd LeetCode tile syncs
            live automatically).
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="about-snapshot-degree"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Degree Title
            </label>
            <input
              id="about-snapshot-degree"
              name="about-snapshot-degree"
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
            <label
              htmlFor="about-snapshot-cgpa"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              CGPA
            </label>
            <input
              id="about-snapshot-cgpa"
              name="about-snapshot-cgpa"
              type="text"
              value={about.snapshot?.cgpa || ""}
              placeholder="CGPA 7.63"
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
            <label
              htmlFor="about-snapshot-batch"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Graduating Batch
            </label>
            <input
              id="about-snapshot-batch"
              name="about-snapshot-batch"
              type="text"
              value={about.snapshot?.batch || ""}
              placeholder="2028 Batch"
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
            <label
              htmlFor="about-snapshot-university"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              University Name
            </label>
            <input
              id="about-snapshot-university"
              name="about-snapshot-university"
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
                  <label
                    htmlFor={`about-edu-title-${idx}`}
                    className="block text-xs font-semibold text-muted-foreground mb-1"
                  >
                    Degree Title
                  </label>
                  <input
                    id={`about-edu-title-${idx}`}
                    name={`about-edu-title-${idx}`}
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
                  <label
                    htmlFor={`about-edu-org-${idx}`}
                    className="block text-xs font-semibold text-muted-foreground mb-1"
                  >
                    University / Institute
                  </label>
                  <input
                    id={`about-edu-org-${idx}`}
                    name={`about-edu-org-${idx}`}
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
                  <label
                    htmlFor={`about-edu-period-${idx}`}
                    className="block text-xs font-semibold text-muted-foreground mb-1"
                  >
                    Period (Years)
                  </label>
                  <input
                    id={`about-edu-period-${idx}`}
                    name={`about-edu-period-${idx}`}
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
                  <label
                    htmlFor={`about-edu-detail-${idx}`}
                    className="block text-xs font-semibold text-muted-foreground mb-1"
                  >
                    CGPA / Details
                  </label>
                  <input
                    id={`about-edu-detail-${idx}`}
                    name={`about-edu-detail-${idx}`}
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
              Core pillars shown in the About section Core Pillars tab with custom icons and
              descriptions.
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

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`about-principle-title-${pIdx}`}
                    className="block text-xs font-semibold text-muted-foreground mb-1"
                  >
                    Pillar Title
                  </label>
                  <input
                    id={`about-principle-title-${pIdx}`}
                    name={`about-principle-title-${pIdx}`}
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

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`about-principle-description-${pIdx}`}
                    className="block text-xs font-semibold text-muted-foreground mb-1"
                  >
                    Description
                  </label>
                  <input
                    id={`about-principle-description-${pIdx}`}
                    name={`about-principle-description-${pIdx}`}
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

      {/* 5. Academic Coursework using TagListInput */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Layers className="size-5 text-primary" />
            <span>Academic Coursework Tags</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            First 6 subjects render cleanly in the About section&apos;s Education tab.
          </p>
        </div>

        <TagListInput
          label="Academic Coursework Subjects"
          tags={about.coursework || []}
          onChange={(newCoursework) =>
            updateData({ aboutData: { ...about, coursework: newCoursework } })
          }
          placeholder="Add subject (e.g. Operating Systems) and press Enter..."
          helpText="Up to 6 subjects are shown cleanly in the About section Education tab."
        />
      </div>
    </div>
  );
}
