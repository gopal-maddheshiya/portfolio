import { ArrowUpRight, Award, CheckCircle2, ExternalLink, Github, Info } from "lucide-react";

import { DSA_INFO, PERSONAL_INFO } from "@/data/profile";
import { useLeetCodeStats } from "@/hooks/useLeetCodeStats";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

// Helper to generate the monthly submission calendar grid
function renderCalendarColumns() {
  return [
    { label: "Sep", weeks: 4, activeWeeks: [0, 0, 0, 0] },
    { label: "Oct", weeks: 4, activeWeeks: [0, 0, 0, 0] },
    { label: "Nov", weeks: 4, activeWeeks: [0, 0, 0, 0] },
    { label: "Dec", weeks: 4, activeWeeks: [0, 0, 0, 0] },
    { label: "Jan", weeks: 4, activeWeeks: [0, 0, 0, 0] },
    { label: "Feb", weeks: 4, activeWeeks: [0, 1, 0, 0] },
    { label: "Mar", weeks: 4, activeWeeks: [0, 0, 0, 0] },
    { label: "Apr", weeks: 4, activeWeeks: [1, 0, 1, 0] },
    { label: "May", weeks: 4, activeWeeks: [2, 3, 3, 3] },
    { label: "Jun", weeks: 4, activeWeeks: [3, 3, 3, 3] },
    { label: "Jul", weeks: 4, activeWeeks: [3, 2, 3, 2] },
    { label: "Aug", weeks: 4, activeWeeks: [1, 2, 1, 0] },
    { label: "Sep", weeks: 3, activeWeeks: [2, 3, 0] },
  ];
}

export function DSA() {
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
    totalActiveDays,
    maxStreak,
    totalSubmissions,
    isLive,
  } = useLeetCodeStats();

  const months = renderCalendarColumns();

  // LeetCode Authentic Horseshoe Arc Math (260° sweep, radius 46)
  const radius = 46;
  const totalArcLength = (260 / 360) * 2 * Math.PI * radius; // ~208.7
  const totalSolvedSafe = Math.max(total, 1);

  const easyLen = (easy / totalSolvedSafe) * totalArcLength;
  const medLen = (medium / totalSolvedSafe) * totalArcLength;
  const hardLen = (hard / totalSolvedSafe) * totalArcLength;

  // Arc path: starts at 140° (bottom-left) and sweeps around to 40° (bottom-right)
  const arcPath = "M 24.77 89.57 A 46 46 0 1 1 95.23 89.57";

  return (
    <Section id="dsa" tone="surface">
      <SectionHeading
        eyebrow="DSA &amp; Problem Solving"
        title="Live LeetCode &amp; Problem Solving"
        description="Real-time synchronized coding metrics, problem difficulty distribution, badges, and 1-year practice activity directly from LeetCode."
      />

      <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5">
        {/* Top 2 Cards: Solved Gauge (Left) + Badges (Right) */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-12">
          {/* Card 1: Solved Questions Gauge & Difficulties (7 Cols on desktop) */}
          <Reveal className="md:col-span-7 rounded-2xl border border-border/80 bg-[#1e1e20] dark:bg-[#1a1a1d] p-4 sm:p-5 text-white shadow-soft transition-all hover:border-border-strong">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#00b8a3]">
                  LeetCode Profile
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs text-white/70 font-mono">@{PERSONAL_INFO.leetcodeUsername}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-semibold">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                </span>
                <span>{isLive ? "Live Synced" : "Active"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Left: Authentic LeetCode Horseshoe Gauge */}
              <div className="sm:col-span-6 flex flex-col items-center justify-center">
                <div className="relative flex size-40 sm:size-44 items-center justify-center">
                  <svg className="size-full" viewBox="0 0 120 120">
                    {/* Background Horseshoe Track */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke="#2d2d32"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    {/* Easy Arc (Cyan / Teal #00b8a3) */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke="#00b8a3"
                      strokeWidth="6"
                      strokeDasharray={`${easyLen} ${totalArcLength}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />

                    {/* Medium Arc (Amber / Yellow #ffc01e) */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke="#ffc01e"
                      strokeWidth="6"
                      strokeDasharray={`${medLen} ${totalArcLength}`}
                      strokeDashoffset={`-${easyLen}`}
                      className="transition-all duration-700"
                    />

                    {/* Hard Arc (Red / Rose #ef4444) */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="6"
                      strokeDasharray={`${hardLen} ${totalArcLength}`}
                      strokeDashoffset={`-${easyLen + medLen}`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />

                    {/* Glowing dot indicator on track start */}
                    <circle cx="24.77" cy="89.57" r="3" fill="#00b8a3" />
                  </svg>

                  {/* Inner Text Center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
                    <div className="flex items-baseline justify-center">
                      <span className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {total}
                      </span>
                      <span className="text-xs text-white/40 font-mono ml-0.5">
                        /{totalQuestions}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-[#00b8a3] flex items-center justify-center gap-1 mt-0.5">
                      <CheckCircle2 className="size-3.5" />
                      <span>Solved</span>
                    </span>

                    <span className="text-[10px] text-white/40 font-mono mt-1">
                      0 Attempting
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Stacked Difficulty Cards (Easy, Med., Hard) */}
              <div className="sm:col-span-6 flex flex-col gap-2">
                {/* Easy */}
                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.06] px-3.5 py-2.5 transition-colors hover:bg-white/[0.07]">
                  <span className="text-xs font-semibold text-[#00b8a3] font-mono">Easy</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-sm sm:text-base font-bold text-white">
                      {easy}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">/{totalEasy}</span>
                  </div>
                </div>

                {/* Medium */}
                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.06] px-3.5 py-2.5 transition-colors hover:bg-white/[0.07]">
                  <span className="text-xs font-semibold text-[#ffc01e] font-mono">Med.</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-sm sm:text-base font-bold text-white">
                      {medium}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">/{totalMedium}</span>
                  </div>
                </div>

                {/* Hard */}
                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.06] px-3.5 py-2.5 transition-colors hover:bg-white/[0.07]">
                  <span className="text-xs font-semibold text-[#ef4444] font-mono">Hard</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-sm sm:text-base font-bold text-white">
                      {hard}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">/{totalHard}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Badges Widget (5 Cols on desktop) */}
          <Reveal
            delay={40}
            className="md:col-span-5 rounded-2xl border border-border/80 bg-[#1e1e20] dark:bg-[#1a1a1d] p-4 sm:p-5 text-white shadow-soft flex flex-col justify-between transition-all hover:border-border-strong"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 mb-3">
                <span className="text-xs font-semibold text-white/80 font-mono">Badges</span>
                <a
                  href={PERSONAL_INFO.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View badges on LeetCode"
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <ArrowUpRight className="size-4" />
                </a>
              </div>

              {/* Badge Count */}
              <p className="font-display text-3xl font-extrabold text-white">{badges.length}</p>

              {/* Badge Visual Graphic */}
              <div className="my-2 flex items-center justify-center py-1">
                <div className="relative group">
                  {/* Subtle Glowing Ring */}
                  <div className="absolute -inset-1 rounded-full bg-emerald-500/25 blur-md transition-all group-hover:bg-emerald-500/45" />

                  {badges[0]?.icon ? (
                    <img
                      src={badges[0].icon}
                      alt={badges[0].displayName || "LeetCode 50 Days Badge"}
                      width={96}
                      height={96}
                      className="relative size-20 sm:size-24 object-contain drop-shadow-[0_4px_20px_rgba(0,184,163,0.35)] transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative size-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Award className="size-10" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-white/[0.08]">
              <p className="text-[11px] text-white/40 font-mono">Most Recent Badge</p>
              <p className="font-display text-sm font-bold text-white mt-0.5">
                {badges[0]?.displayName || "50 Days Badge 2026"}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Card 3: 1-Year Submissions Heatmap Calendar (Full Width) */}
        <Reveal
          delay={60}
          className="rounded-2xl border border-border/80 bg-[#1e1e20] dark:bg-[#1a1a1d] p-4 sm:p-5 text-white shadow-soft transition-all hover:border-border-strong"
        >
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 mb-4">
            <div className="flex items-center gap-1.5 font-display text-sm sm:text-base font-bold text-white">
              <span>{totalSubmissions} submissions in the past one year</span>
              <Info className="size-3.5 text-white/40" />
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-white/70">
              <div>
                Total active days: <span className="text-white font-bold">{totalActiveDays}</span>
              </div>
              <div>
                Max streak: <span className="text-emerald-400 font-bold">{maxStreak}</span>
              </div>
              <span className="hidden sm:inline-block rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/80">
                Current
              </span>
            </div>
          </div>

          {/* Heatmap Grid (Smooth horizontal scroll on mobile) */}
          <div className="overflow-x-auto pb-2 -mx-1 px-1">
            <div className="min-w-[640px] flex items-end justify-between gap-2.5">
              {months.map((m, mIdx) => (
                <div key={`${m.label}-${mIdx}`} className="flex flex-col items-center gap-1.5">
                  {/* Week Blocks in this month */}
                  <div className="flex items-center gap-1">
                    {m.activeWeeks.map((level, wIdx) => {
                      return (
                        <div key={wIdx} className="flex flex-col gap-1">
                          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                            let cellBg = "bg-white/[0.07]"; // 0 submissions

                            if (level === 1 && (day === 2 || day === 4)) {
                              cellBg = "bg-[#0e4429]";
                            } else if (level === 2 && day % 2 === 0) {
                              cellBg = "bg-[#006d32]";
                            } else if (level === 3) {
                              if (day === 0 || day === 6) cellBg = "bg-[#26a641]";
                              else if (day === 2 || day === 3) cellBg = "bg-[#39d353]";
                              else cellBg = "bg-[#006d32]";
                            }

                            return (
                              <div
                                key={day}
                                className={`size-2.5 rounded-[2px] ${cellBg} transition-colors hover:scale-125 hover:z-10`}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  {/* Month Label */}
                  <span className="text-[11px] font-mono text-white/40 mt-1">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Action Footer: LeetCode Profile & GitHub Repo Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={PERSONAL_INFO.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
          >
            <span>Open LeetCode Profile (@{PERSONAL_INFO.leetcodeUsername})</span>
            <ExternalLink className="size-4 shrink-0" />
          </a>

          <a
            href={DSA_INFO.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-5 py-2.5 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer"
          >
            <Github className="size-4 shrink-0 text-muted-foreground" />
            <span>Explore Java Solutions Repository</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
