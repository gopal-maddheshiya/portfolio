import {
  Code2,
  ExternalLink,
  Eye,
  EyeOff,
  FolderGit2,
  Github,
  Globe,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { IconPicker } from "@/components/admin/ui/IconPicker";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { SectionHeadingEditor } from "@/components/admin/ui/SectionHeadingEditor";
import { PERSONAL_INFO, type CodingProfile } from "@/data/profile";
import { useGitHubStats } from "@/hooks/useGitHubStats";
import { useLeetCodeStats } from "@/hooks/useLeetCodeStats";
import type { PortfolioData } from "@/lib/supabase";

interface DsaTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function DsaTab({ data, updateData }: DsaTabProps) {
  const info = data.personalInfo;
  const dsa = data.dsaInfo;
  const codingProfiles = data.codingProfiles || [];

  const activeLeetCodeHandle = info.leetcodeUsername || PERSONAL_INFO.leetcodeUsername;
  const { total, easy, medium, hard, totalActiveDays, maxStreak, isLive, isFetching, refetch } =
    useLeetCodeStats(activeLeetCodeHandle);

  const activeGitHubHandle = info.githubUsername || PERSONAL_INFO.githubUsername;
  const {
    totalContributions: ghTotalContributions,
    publicRepos: ghPublicRepos,
    totalStars: ghTotalStars,
    activeDays: ghActiveDays,
    maxStreak: ghMaxStreak,
    isLive: isGhLive,
    isFetching: isGhFetching,
    refetch: refetchGh,
  } = useGitHubStats(activeGitHubHandle);

  const handleAddProfile = () => {
    const newProfile: CodingProfile = {
      name: "New Platform",
      url: "https://",
      username: "handle",
      description: "Problem solving and algorithms practice.",
      icon: "code",
      highlight: "Active",
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
      <SectionHeadingEditor
        sectionKey="dsa"
        sectionLabel="DSA & Problem Solving"
        data={data}
        updateData={updateData}
      />

      {/* 1. Read-Only Live LeetCode Sync Monitor + Handle Settings */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Code2 className="size-5 text-primary" />
              <span>LeetCode Live Sync Monitor</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                <Lock className="size-2.5" aria-hidden="true" />
                <span>{isLive ? "Live API Synced" : "Auto Synced"}</span>
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Solved counts, Easy/Med/Hard distribution, streaks, and submission calendar update
              automatically from LeetCode — manual count inputs are disabled.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border-strong bg-surface hover:bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />
            <span>{isFetching ? "Syncing..." : "Refresh Live Sync"}</span>
          </button>
        </div>

        {/* Read-Only Telemetry Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Solved", value: total, accent: "text-foreground" },
            { label: "Easy", value: easy, accent: "text-[#00b8a3]" },
            { label: "Medium", value: medium, accent: "text-[#ffc01e]" },
            { label: "Hard", value: hard, accent: "text-[#ef4444]" },
            { label: "Max Streak", value: `${maxStreak}d`, accent: "text-emerald-500" },
            { label: "Active Days", value: `${totalActiveDays}d`, accent: "text-primary" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/80 bg-surface/60 px-3 py-2.5 text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p className={`mt-1 font-display text-lg font-bold ${stat.accent}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Dynamic Handle & Profile Link */}
        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/70">
          <div>
            <label
              htmlFor="dsa-leetcode-username"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              LeetCode Username Handle (Live Sync Key)
            </label>
            <input
              id="dsa-leetcode-username"
              name="dsa-leetcode-username"
              type="text"
              value={info.leetcodeUsername || ""}
              placeholder="gopal-maddheshiya"
              onChange={(e) =>
                updateData({ personalInfo: { ...info, leetcodeUsername: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label
              htmlFor="dsa-leetcode-url"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              LeetCode Profile URL
            </label>
            <div className="relative">
              <input
                id="dsa-leetcode-url"
                name="dsa-leetcode-url"
                type="text"
                value={info.leetcode || ""}
                placeholder="https://leetcode.com/u/gopal-maddheshiya/"
                onChange={(e) =>
                  updateData({ personalInfo: { ...info, leetcode: e.target.value } })
                }
                className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
              />
              {info.leetcode ? (
                <a
                  href={info.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* 1B. Read-Only Live GitHub Sync Monitor + Handle Settings */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Github className="size-5 text-emerald-500" />
              <span>GitHub Live Sync Monitor</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                <Lock className="size-2.5" aria-hidden="true" />
                <span>{isGhLive ? "Live API Synced" : "Auto Synced"}</span>
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Contributions graph, active streaks, public repos, and language mix synchronize
              automatically from GitHub.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetchGh()}
            disabled={isGhFetching}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border-strong bg-surface hover:bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw
              className={`size-3.5 ${isGhFetching ? "animate-spin text-emerald-500" : ""}`}
            />
            <span>{isGhFetching ? "Syncing..." : "Refresh GitHub"}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Past Yr Contribs", value: ghTotalContributions, accent: "text-emerald-500" },
            { label: "Public Repos", value: ghPublicRepos, accent: "text-foreground" },
            { label: "Total Stars", value: ghTotalStars, accent: "text-amber-500" },
            { label: "Max Streak", value: `${ghMaxStreak}d`, accent: "text-emerald-500" },
            { label: "Active Days", value: `${ghActiveDays}d`, accent: "text-primary" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/80 bg-surface/60 px-3 py-2.5 text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p className={`mt-1 font-display text-lg font-bold ${stat.accent}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/70">
          <div>
            <label
              htmlFor="dsa-github-username"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              GitHub Username Handle (Live Sync Key)
            </label>
            <input
              id="dsa-github-username"
              name="dsa-github-username"
              type="text"
              value={info.githubUsername || ""}
              placeholder="gopal-maddheshiya"
              onChange={(e) =>
                updateData({ personalInfo: { ...info, githubUsername: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label
              htmlFor="dsa-github-url"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              GitHub Profile URL
            </label>
            <div className="relative">
              <input
                id="dsa-github-url"
                name="dsa-github-url"
                type="text"
                value={info.github || ""}
                placeholder="https://github.com/gopal-maddheshiya"
                onChange={(e) => updateData({ personalInfo: { ...info, github: e.target.value } })}
                className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
              />
              {info.github ? (
                <a
                  href={info.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* 2. GitHub DSA Repository Settings */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <FolderGit2 className="size-5 text-primary" />
            <span>DSA Solutions Repository &amp; Language</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configures your primary DSA language label and GitHub solutions button link.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="dsa-primary-language"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Primary Language
            </label>
            <input
              id="dsa-primary-language"
              name="dsa-primary-language"
              type="text"
              value={dsa.language}
              onChange={(e) => updateData({ dsaInfo: { ...dsa, language: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="dsa-repo-name"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              GitHub DSA Repo Name
            </label>
            <input
              id="dsa-repo-name"
              name="dsa-repo-name"
              type="text"
              value={dsa.repoName}
              onChange={(e) => updateData({ dsaInfo: { ...dsa, repoName: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="dsa-repo-url"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              GitHub DSA Repo URL
            </label>
            <div className="relative">
              <input
                id="dsa-repo-url"
                name="dsa-repo-url"
                type="text"
                value={dsa.repoUrl}
                onChange={(e) => updateData({ dsaInfo: { ...dsa, repoUrl: e.target.value } })}
                className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
              />
              {dsa.repoUrl ? (
                <a
                  href={dsa.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Coding Platform Profiles */}
      <SectionHeadingEditor
        sectionKey="profiles"
        sectionLabel="Coding Profiles"
        data={data}
        updateData={updateData}
      />

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Globe className="size-5 text-primary" />
              <span>Competitive Coding Platform Profiles ({codingProfiles.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage platform handles (LeetCode, GFG, CodeChef, HackerRank, etc.) with icons, links,
              and highlight badges.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddProfile}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
            <span>Add Platform</span>
          </button>
        </div>

        <div className="space-y-4">
          {codingProfiles.map((prof, idx) => {
            const isLeetCode = prof.name.toLowerCase() === "leetcode";
            return (
              <div
                key={idx}
                className={`rounded-xl border border-border bg-surface/50 p-4 space-y-3.5 shadow-2xs transition-opacity ${
                  prof.hidden ? "opacity-65" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {prof.name || "Coding Platform"} Profile
                    </span>
                    {isLeetCode ? (
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                        Live Solved Badge Auto-Synced
                      </span>
                    ) : null}
                    {prof.hidden ? (
                      <span className="rounded-full bg-secondary border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        Hidden
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...codingProfiles];
                        updated[idx] = { ...prof, hidden: !prof.hidden };
                        updateData({ codingProfiles: updated });
                      }}
                      title={prof.hidden ? "Show on live portfolio" : "Hide from live portfolio"}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                        prof.hidden
                          ? "border-border bg-card text-muted-foreground hover:text-foreground"
                          : "border-primary/25 bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {prof.hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      <span className="hidden sm:inline">{prof.hidden ? "Hidden" : "Visible"}</span>
                    </button>
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
                    <label
                      htmlFor={`dsa-profile-name-${idx}`}
                      className="block text-[11px] text-muted-foreground font-semibold mb-1"
                    >
                      Platform Name
                    </label>
                    <input
                      id={`dsa-profile-name-${idx}`}
                      name={`dsa-profile-name-${idx}`}
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
                    <label
                      htmlFor={`dsa-profile-username-${idx}`}
                      className="block text-[11px] text-muted-foreground font-semibold mb-1"
                    >
                      Username / Handle
                    </label>
                    <input
                      id={`dsa-profile-username-${idx}`}
                      name={`dsa-profile-username-${idx}`}
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

                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`dsa-profile-url-${idx}`}
                      className="block text-[11px] text-muted-foreground font-semibold mb-1"
                    >
                      Profile URL
                    </label>
                    <div className="relative">
                      <input
                        id={`dsa-profile-url-${idx}`}
                        name={`dsa-profile-url-${idx}`}
                        type="text"
                        value={prof.url}
                        onChange={(e) => {
                          const updated = [...codingProfiles];
                          updated[idx] = { ...prof, url: e.target.value };
                          updateData({ codingProfiles: updated });
                        }}
                        className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                      />
                      {prof.url ? (
                        <a
                          href={prof.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`dsa-profile-highlight-${idx}`}
                      className="block text-[11px] text-muted-foreground font-semibold mb-1"
                    >
                      Highlight Stat / Badge (Optional)
                    </label>
                    <input
                      id={`dsa-profile-highlight-${idx}`}
                      name={`dsa-profile-highlight-${idx}`}
                      type="text"
                      value={prof.highlight || ""}
                      placeholder={
                        isLeetCode ? "Auto-synced live on site" : "e.g. Daily Practice, 3★ Coder"
                      }
                      onChange={(e) => {
                        const updated = [...codingProfiles];
                        updated[idx] = { ...prof, highlight: e.target.value };
                        updateData({ codingProfiles: updated });
                      }}
                      className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`dsa-profile-description-${idx}`}
                      className="block text-[11px] text-muted-foreground font-semibold mb-1"
                    >
                      Description / Subtitle
                    </label>
                    <input
                      id={`dsa-profile-description-${idx}`}
                      name={`dsa-profile-description-${idx}`}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
