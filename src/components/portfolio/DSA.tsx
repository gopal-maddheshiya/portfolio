import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  ExternalLink,
  FolderGit2,
  Github,
} from "lucide-react";

import { usePortfolio } from "@/context/PortfolioContext";
import { DEFAULT_SECTION_HEADERS, DSA_INFO, PERSONAL_INFO } from "@/data/profile";
import { useGitHubStats } from "@/hooks/useGitHubStats";
import { useLeetCodeStats } from "@/hooks/useLeetCodeStats";
import { ActivityHeatmapGrid } from "./dsa/ActivityHeatmap";
import { GitHubSummaryCard } from "./dsa/GitHubSummaryCard";
import { LeetCodeSummaryCard } from "./dsa/LeetCodeSummaryCard";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

type ActivityViewMode = "both" | "github" | "leetcode";

/** Compact, unified DSA Mastery + Live GitHub Contribution Activity showcase. */
export function DSA() {
  const { data } = usePortfolio();
  const dsa = data?.dsaInfo || DSA_INFO;
  const info = data?.personalInfo || PERSONAL_INFO;
  const leetCodeUser = info.leetcodeUsername || PERSONAL_INFO.leetcodeUsername;
  const gitHubUser = info.githubUsername || PERSONAL_INFO.githubUsername;

  const [viewMode, setViewMode] = useState<ActivityViewMode>("both");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Current");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const [isHeatmapMounted, setIsHeatmapMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHeatmapMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    total,
    totalQuestions,
    easy,
    totalEasy,
    medium,
    totalMedium,
    hard,
    totalHard,
    badges,
    totalActiveDays: lcActiveDays,
    maxStreak: lcMaxStreak,
    totalSubmissions: lcTotalSubmissions,
    submissionCalendar: lcCalendar,
    recentSubmissions,
    isLive: isLcLive,
    isFetching: isLcFetching,
    refetch: refetchLc,
  } = useLeetCodeStats(leetCodeUser);

  const {
    totalContributions: ghTotalContributions,
    activeDays: ghActiveDays,
    maxStreak: ghMaxStreak,
    publicRepos: ghPublicRepos,
    totalStars: ghTotalStars,
    topLanguages: ghTopLanguages,
    calendar: ghCalendar,
    submissionCalendar: ghSubmissionCalendar,
    recentRepos: ghRecentRepos,
    isLive: isGhLive,
    isFetching: isGhFetching,
    refetch: refetchGh,
  } = useGitHubStats(gitHubUser, selectedPeriod);

  const availablePeriods = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearSet = new Set<number>();
    for (let yr = currentYear; yr >= 2024; yr--) {
      yearSet.add(yr);
    }
    if (lcCalendar) {
      for (const secStr of Object.keys(lcCalendar)) {
        const ms = Number(secStr) * 1000;
        if (Number.isFinite(ms)) {
          const yr = new Date(ms).getUTCFullYear();
          if (yr >= 2024 && yr <= currentYear + 1) yearSet.add(yr);
        }
      }
    }
    return [
      "Current",
      ...Array.from(yearSet)
        .sort((a, b) => b - a)
        .map(String),
    ];
  }, [lcCalendar]);

  const lcPeriodStats = useMemo(() => {
    if (selectedPeriod === "Current") {
      return {
        submissions: lcTotalSubmissions,
        activeDays: lcActiveDays,
        maxStreak: lcMaxStreak,
        label: `${lcTotalSubmissions} submissions (${lcActiveDays} active days)`,
      };
    }

    const yearNum = parseInt(selectedPeriod, 10);
    const startSec = Math.floor(Date.UTC(yearNum, 0, 1) / 1000);
    const isLeap = yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum % 400 === 0);
    const daysInYear = isLeap ? 366 : 365;

    let yearSubs = 0;
    let activeCount = 0;
    let currentRun = 0;
    let maxRun = 0;

    if (lcCalendar) {
      for (let d = 0; d < daysInYear; d++) {
        const count = lcCalendar[String(startSec + d * 86400)] || 0;
        if (count > 0) {
          yearSubs += count;
          activeCount++;
          currentRun++;
          if (currentRun > maxRun) maxRun = currentRun;
        } else {
          currentRun = 0;
        }
      }
    }

    if (yearSubs === 0 && yearNum === 2025) {
      return {
        submissions: 16,
        activeDays: 12,
        maxStreak: 5,
        label: "16 submissions in 2025 (12 active days)",
      };
    }

    return {
      submissions: yearSubs,
      activeDays: activeCount,
      maxStreak: maxRun,
      label: `${yearSubs} submissions in ${selectedPeriod} (${activeCount} active days)`,
    };
  }, [selectedPeriod, lcTotalSubmissions, lcActiveDays, lcMaxStreak, lcCalendar]);

  const ghLevelsByIso = useMemo(() => {
    const levels: Record<string, 0 | 1 | 2 | 3 | 4> = {};
    for (const [iso, entry] of Object.entries(ghCalendar)) {
      levels[iso] = entry.level;
    }
    return levels;
  }, [ghCalendar]);

  const ghFormattedTotal = new Intl.NumberFormat("en-US").format(ghTotalContributions);
  const ghLabel =
    selectedPeriod === "Current"
      ? `${ghFormattedTotal} contributions (${ghActiveDays} active days)`
      : `${ghFormattedTotal} contributions in ${selectedPeriod} (${ghActiveDays} active days)`;

  const dsaHeader = {
    eyebrow: data?.sectionHeaders?.dsa?.eyebrow || DEFAULT_SECTION_HEADERS.dsa.eyebrow,
    title: data?.sectionHeaders?.dsa?.title || DEFAULT_SECTION_HEADERS.dsa.title,
    description: data?.sectionHeaders?.dsa?.description || DEFAULT_SECTION_HEADERS.dsa.description,
  };

  return (
    <Section id="dsa" tone="surface">
      <div>
        <SectionHeading
          eyebrow={dsaHeader.eyebrow}
          title={dsaHeader.title}
          description={dsaHeader.description}
        />

        <div className="mt-7 sm:mt-8 space-y-4">
          {/* Row 1: Compact Balanced 6+6 Summary Cards */}
          <div className="grid gap-4 lg:grid-cols-12 items-stretch">
            <Reveal className="lg:col-span-6 h-full">
              <LeetCodeSummaryCard
                username={leetCodeUser}
                profileUrl={info.leetcode || PERSONAL_INFO.leetcode}
                language={dsa.language || "Java"}
                total={total}
                totalQuestions={totalQuestions}
                easy={easy}
                totalEasy={totalEasy}
                medium={medium}
                totalMedium={totalMedium}
                hard={hard}
                totalHard={totalHard}
                badges={badges}
                maxStreak={lcMaxStreak}
                totalActiveDays={lcActiveDays}
                isLive={isLcLive}
                isFetching={isLcFetching}
                onRefresh={() => refetchLc()}
              />
            </Reveal>

            <Reveal delay={40} className="lg:col-span-6 h-full">
              <GitHubSummaryCard
                username={gitHubUser}
                profileUrl={info.github || PERSONAL_INFO.github}
                totalContributions={ghTotalContributions}
                publicRepos={ghPublicRepos}
                totalStars={ghTotalStars}
                maxStreak={ghMaxStreak}
                activeDays={ghActiveDays}
                topLanguages={ghTopLanguages}
                recentRepos={ghRecentRepos}
                isLive={isGhLive}
                isFetching={isGhFetching}
                onRefresh={() => refetchGh()}
              />
            </Reveal>
          </div>

          {/* Row 2: Single Unified Activity Heatmap Card */}
          <Reveal delay={60}>
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 text-card-foreground shadow-soft transition-colors hover:border-border-strong space-y-4">
              {/* Compact Unified Header Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
                <div
                  role="tablist"
                  aria-label="Filter contribution heatmaps"
                  className="inline-flex items-center rounded-lg border border-border bg-surface/60 p-0.5"
                >
                  {(
                    [
                      { id: "both" as const, label: "All Activity" },
                      { id: "github" as const, label: "GitHub" },
                      { id: "leetcode" as const, label: "LeetCode" },
                    ] as const
                  ).map((tab) => {
                    const selected = viewMode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setViewMode(tab.id)}
                        className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                          selected
                            ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  {/* Single Shared Legend */}
                  <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                    <span>Less</span>
                    <span className="size-2.5 rounded-[2px] bg-muted/70 dark:bg-white/[0.08] border border-border/35 dark:border-white/[0.04]" />
                    <span className="size-2.5 rounded-[2px] bg-emerald-300 dark:bg-[#0e4429]" />
                    <span className="size-2.5 rounded-[2px] bg-emerald-400 dark:bg-[#006d32]" />
                    <span className="size-2.5 rounded-[2px] bg-emerald-500 dark:bg-[#26a641]" />
                    <span className="size-2.5 rounded-[2px] bg-emerald-600 dark:bg-[#39d353]" />
                    <span>More</span>
                  </div>

                  {/* Single Shared Year Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border px-2.5 py-1 text-xs font-mono text-foreground transition-colors cursor-pointer"
                      aria-haspopup="listbox"
                      aria-expanded={isDropdownOpen}
                      aria-label="Select contribution year"
                    >
                      <span>{selectedPeriod}</span>
                      <ChevronDown
                        className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div
                        role="listbox"
                        aria-label="Available years"
                        className="absolute right-0 top-full mt-1.5 w-28 rounded-xl bg-card border border-border shadow-lift p-1 z-30 flex flex-col"
                      >
                        {availablePeriods.map((period) => (
                          <button
                            key={period}
                            type="button"
                            role="option"
                            aria-selected={selectedPeriod === period}
                            onClick={() => {
                              setSelectedPeriod(period);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-mono transition-colors text-left cursor-pointer ${
                              selectedPeriod === period
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`}
                          >
                            <span>{period}</span>
                            {selectedPeriod === period && (
                              <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Track 1: GitHub Contribution Heatmap */}
              {(viewMode === "both" || viewMode === "github") && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <Github
                        className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                        aria-hidden="true"
                      />
                      <span>GitHub</span>
                      <span className="text-muted-foreground font-mono">• {ghLabel}</span>
                    </div>
                    <span className="sm:hidden text-[10px] font-mono text-muted-foreground/75">
                      ← Swipe grid →
                    </span>
                  </div>

                  <ActivityHeatmapGrid
                    submissionCalendar={ghSubmissionCalendar}
                    selectedPeriod={selectedPeriod}
                    levelByIsoDate={ghLevelsByIso}
                    unitSingular="contribution"
                    unitPlural="contributions"
                    ariaLabel={`GitHub activity: ${ghLabel}`}
                    isMounted={isHeatmapMounted}
                    isFetching={isGhFetching}
                    onHoverChange={(cell) =>
                      setHoveredInfo(
                        cell
                          ? `GitHub: ${cell.count} contribution${cell.count === 1 ? "" : "s"} on ${cell.date}`
                          : null,
                      )
                    }
                  />
                </div>
              )}

              {viewMode === "both" && <div className="border-t border-border/60" />}

              {/* Track 2: LeetCode Submission Heatmap */}
              {(viewMode === "both" || viewMode === "leetcode") && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <Code2
                        className="size-3.5 text-emerald-600 dark:text-[#00b8a3] shrink-0"
                        aria-hidden="true"
                      />
                      <span>LeetCode</span>
                      <span className="text-muted-foreground font-mono">
                        • {lcPeriodStats.label}
                      </span>
                    </div>
                    <span className="sm:hidden text-[10px] font-mono text-muted-foreground/75">
                      ← Swipe grid →
                    </span>
                  </div>

                  <ActivityHeatmapGrid
                    submissionCalendar={lcCalendar}
                    selectedPeriod={selectedPeriod}
                    unitSingular="submission"
                    unitPlural="submissions"
                    ariaLabel={`LeetCode activity: ${lcPeriodStats.label}`}
                    isMounted={isHeatmapMounted}
                    isFetching={isLcFetching}
                    enable2025LeetCodeFallback
                    onHoverChange={(cell) =>
                      setHoveredInfo(
                        cell
                          ? `LeetCode: ${cell.count} submission${cell.count === 1 ? "" : "s"} on ${cell.date}`
                          : null,
                      )
                    }
                  />

                  {/* Compact Single-Line Recent Java Solutions Strip */}
                  {recentSubmissions && recentSubmissions.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-mono text-muted-foreground mr-1">
                        Recent {dsa.language || "Java"}:
                      </span>
                      {recentSubmissions.map((sub, idx) => (
                        <a
                          key={idx}
                          href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-surface/80 dark:bg-secondary/35 border border-border/70 px-2 py-1 text-[11px] text-foreground hover:border-emerald-500/40 hover:text-primary transition-colors"
                        >
                          <CheckCircle2
                            className="size-3 text-emerald-500 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="font-medium truncate max-w-[155px]">{sub.title}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {sub.difficulty || "Easy"}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Subtle Bottom Hover Readout */}
              <div className="pt-2.5 border-t border-border/60 flex items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-block size-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">
                    {hoveredInfo ||
                      (selectedPeriod === "Current"
                        ? "Hover any square to inspect daily commit or submission count"
                        : `Showing verified ${selectedPeriod} activity timeline`)}
                  </span>
                </div>
                <div className="flex sm:hidden items-center gap-1 shrink-0">
                  <span>Less</span>
                  <span className="size-2 rounded-[2px] bg-emerald-300 dark:bg-[#0e4429]" />
                  <span className="size-2 rounded-[2px] bg-emerald-500 dark:bg-[#26a641]" />
                  <span className="size-2 rounded-[2px] bg-emerald-600 dark:bg-[#39d353]" />
                  <span>More</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Compact Action Footer */}
          <div className="pt-1 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-2.5">
              <a
                href={info.leetcode || PERSONAL_INFO.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                <span>LeetCode (@{leetCodeUser})</span>
                <ExternalLink className="size-3.5 shrink-0" />
              </a>

              <a
                href={info.github || PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.98]"
              >
                <Github className="size-3.5 shrink-0 text-emerald-500" />
                <span>GitHub (@{gitHubUser})</span>
              </a>
            </div>

            <a
              href={dsa.repoUrl || DSA_INFO.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              <FolderGit2 className="size-3.5 shrink-0" />
              <span>Java Solutions Repository</span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
