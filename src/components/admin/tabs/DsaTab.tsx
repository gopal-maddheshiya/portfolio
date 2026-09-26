import React from "react";
import { Code2, Globe, Plus, Trash2, ExternalLink } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import type { CodingProfile, DsaTopicItem } from "@/data/profile";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { IconPicker } from "@/components/admin/ui/IconPicker";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import { toast } from "sonner";

interface DsaTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function DsaTab({ data, updateData }: DsaTabProps) {
  const dsa = data.dsaInfo;
  const codingProfiles = data.codingProfiles || [];
  const difficulty = dsa.difficulty || [
    {
      label: "Easy",
      count: 30,
      percent: 56,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      bar: "bg-emerald-500",
    },
    {
      label: "Medium",
      count: 22,
      percent: 41,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      bar: "bg-amber-500",
    },
    {
      label: "Hard",
      count: 2,
      percent: 4,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      bar: "bg-rose-500",
    },
  ];
  const topicBreakdown = dsa.topicBreakdown || [];
  const notes = dsa.notes || [];

  // Helper to recalculate total and percentages
  const handleDifficultyChange = (index: number, newCount: number) => {
    const safeCount = Math.max(0, isNaN(newCount) ? 0 : newCount);
    const updated = [...difficulty];
    updated[index] = { ...updated[index], count: safeCount };

    const total = updated.reduce((sum, item) => sum + item.count, 0);
    const withPercents = updated.map((item) => ({
      ...item,
      percent: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }));

    updateData({
      dsaInfo: {
        ...dsa,
        totalSolvedCount: total,
        problemsSolved: `${total}+`,
        difficulty: withPercents,
      },
    });
  };

  // Topic breakdown handlers
  const handleAddTopic = () => {
    const newTopic: DsaTopicItem = {
      topic: "New Topic / Pattern",
      count: 1,
    };
    updateData({
      dsaInfo: {
        ...dsa,
        topicBreakdown: [...topicBreakdown, newTopic],
      },
    });
    toast.success("New topic breakdown item added!");
  };

  const handleDeleteTopic = (index: number) => {
    updateData({
      dsaInfo: {
        ...dsa,
        topicBreakdown: topicBreakdown.filter((_, i) => i !== index),
      },
    });
    toast.info("Topic removed.");
  };

  // Notes handlers
  const handleAddNote = () => {
    updateData({
      dsaInfo: {
        ...dsa,
        notes: [...notes, "New problem-solving approach or optimization guideline."],
      },
    });
  };

  const handleDeleteNote = (index: number) => {
    updateData({
      dsaInfo: {
        ...dsa,
        notes: notes.filter((_, i) => i !== index),
      },
    });
  };

  // Coding Profiles handlers
  const handleAddProfile = () => {
    const newProfile: CodingProfile = {
      name: "New Platform",
      url: "https://",
      username: "handle",
      description: "Problem solving and algorithms practice.",
      icon: "code",
    };
    updateData({ codingProfiles: [...codingProfiles, newProfile] });
    toast.success("New coding platform profile added!");
  };

  const handleDeleteProfile = (index: number) => {
    const target = codingProfiles[index];
    if (confirm(`Delete coding profile for "${target?.name || "platform"}"?`)) {
      updateData({ codingProfiles: codingProfiles.filter((_, i) => i !== index) });
      toast.info("Profile removed.");
    }
  };

  const handleMoveProfile = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= codingProfiles.length) return;
    const itemA = codingProfiles[index];
    const itemB = codingProfiles[targetIndex];
    if (itemA && itemB) {
      const updated = [...codingProfiles];
      updated[index] = itemB;
      updated[targetIndex] = itemA;
      updateData({ codingProfiles: updated });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* 1. Primary DSA Section Configuration */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Code2 className="size-5 text-primary" />
            <span>DSA Problem Solving Core Metrics</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure primary language, repository links, and solved problem metrics.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Problems Solved Badge Text
            </label>
            <input
              type="text"
              value={dsa.problemsSolved}
              onChange={(e) => updateData({ dsaInfo: { ...dsa, problemsSolved: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Total Solved Count (Number)
            </label>
            <input
              type="number"
              value={dsa.totalSolvedCount ?? 54}
              onChange={(e) =>
                updateData({
                  dsaInfo: { ...dsa, totalSolvedCount: parseInt(e.target.value, 10) || 0 },
                })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Primary Language
            </label>
            <input
              type="text"
              value={dsa.language}
              onChange={(e) => updateData({ dsaInfo: { ...dsa, language: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              GitHub DSA Repo Name
            </label>
            <input
              type="text"
              value={dsa.repoName}
              onChange={(e) => updateData({ dsaInfo: { ...dsa, repoName: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              GitHub DSA Repo URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={dsa.repoUrl}
                onChange={(e) => updateData({ dsaInfo: { ...dsa, repoUrl: e.target.value } })}
                className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
              />
              {dsa.repoUrl && (
                <a
                  href={dsa.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Difficulty Breakdown: Easy, Medium, Hard with live counters */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Code2 className="size-5 text-emerald-500" />
            <span>Problem Difficulty Distribution (Easy / Medium / Hard)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update problem counts per difficulty. Percentages and total counts update automatically.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {difficulty.map((diff, dIdx) => (
            <div
              key={dIdx}
              className={`rounded-xl border p-4 space-y-3 ${
                diff.label === "Easy"
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : diff.label === "Medium"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-rose-500/30 bg-rose-500/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${diff.color}`}>{diff.label}</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-card border border-border">
                  {diff.percent}%
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Solved Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={diff.count}
                  onChange={(e) => handleDifficultyChange(dIdx, parseInt(e.target.value, 10))}
                  className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-sm font-bold text-foreground focus:outline-none font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Topic Breakdown Manager */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Code2 className="size-5 text-primary" />
              <span>DSA Topic Breakdown ({topicBreakdown.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specific problem patterns and topic breakdown charts displayed in the portfolio.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddTopic}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Topic</span>
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {topicBreakdown.map((t, tIdx) => (
            <div
              key={tIdx}
              className="rounded-xl border border-border bg-surface/50 p-3.5 flex items-center gap-3"
            >
              <div className="flex-1">
                <label className="block text-[10px] font-semibold uppercase text-muted-foreground mb-0.5">
                  Topic / Pattern Name
                </label>
                <input
                  type="text"
                  value={t.topic}
                  onChange={(e) => {
                    const updated = [...topicBreakdown];
                    updated[tIdx] = { ...t, topic: e.target.value };
                    updateData({ dsaInfo: { ...dsa, topicBreakdown: updated } });
                  }}
                  className="w-full rounded-md border border-border-strong bg-card px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none"
                />
              </div>

              <div className="w-20">
                <label className="block text-[10px] font-semibold uppercase text-muted-foreground mb-0.5">
                  Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={t.count}
                  onChange={(e) => {
                    const updated = [...topicBreakdown];
                    updated[tIdx] = { ...t, count: parseInt(e.target.value, 10) || 0 };
                    updateData({ dsaInfo: { ...dsa, topicBreakdown: updated } });
                  }}
                  className="w-full rounded-md border border-border-strong bg-card px-2.5 py-1.5 text-xs font-bold font-mono text-foreground focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteTopic(tIdx)}
                title="Delete topic"
                className="mt-4 p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Problem Solving Notes / Methodology */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Code2 className="size-5 text-primary" />
              <span>DSA Methodology &amp; Notes ({notes.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Guiding problem solving notes displayed at the bottom of the DSA section.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNote}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Note</span>
          </button>
        </div>

        <div className="space-y-3">
          {notes.map((note, nIdx) => (
            <div key={nIdx} className="flex items-center gap-2.5">
              <input
                type="text"
                value={note}
                onChange={(e) => {
                  const updated = [...notes];
                  updated[nIdx] = e.target.value;
                  updateData({ dsaInfo: { ...dsa, notes: updated } });
                }}
                className="flex-1 rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleDeleteNote(nIdx)}
                title="Delete note"
                className="p-2 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Competitive Coding Platform Profiles */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Globe className="size-5 text-primary" />
              <span>Competitive Coding Platform Profiles ({codingProfiles.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage platform handles (LeetCode, GFG, CodeChef, HackerRank, etc.) with custom icons
              and links.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddProfile}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Platform</span>
          </button>
        </div>

        <div className="space-y-4">
          {codingProfiles.map((prof, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-surface/50 p-4 space-y-3.5 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold text-foreground">
                  {prof.name || "Coding Platform"} Profile
                </span>

                <div className="flex items-center gap-2">
                  <ReorderControls
                    index={idx}
                    total={codingProfiles.length}
                    onMove={handleMoveProfile}
                    label="profile"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteProfile(idx)}
                    title="Delete profile"
                    className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={prof.name}
                    onChange={(e) => {
                      const updated = [...codingProfiles];
                      updated[idx] = { ...prof, name: e.target.value };
                      updateData({ codingProfiles: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                    Username / Handle
                  </label>
                  <input
                    type="text"
                    value={prof.username}
                    onChange={(e) => {
                      const updated = [...codingProfiles];
                      updated[idx] = { ...prof, username: e.target.value };
                      updateData({ codingProfiles: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <IconPicker
                    label="Platform Icon"
                    value={prof.icon || "code"}
                    onChange={(newIcon) => {
                      const updated = [...codingProfiles];
                      updated[idx] = {
                        ...prof,
                        icon: newIcon as "code" | "terminal" | "codechef" | "trophy",
                      };
                      updateData({ codingProfiles: updated });
                    }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                    Profile URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={prof.url}
                      onChange={(e) => {
                        const updated = [...codingProfiles];
                        updated[idx] = { ...prof, url: e.target.value };
                        updateData({ codingProfiles: updated });
                      }}
                      className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                    />
                    {prof.url && (
                      <a
                        href={prof.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                    Description / Subtitle
                  </label>
                  <input
                    type="text"
                    value={prof.description}
                    onChange={(e) => {
                      const updated = [...codingProfiles];
                      updated[idx] = { ...prof, description: e.target.value };
                      updateData({ codingProfiles: updated });
                    }}
                    className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
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
