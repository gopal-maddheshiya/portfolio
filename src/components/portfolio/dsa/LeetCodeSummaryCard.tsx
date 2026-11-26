import { useEffect, useRef } from "react";
import { ArrowUpRight, Award, CheckCircle2, RefreshCw } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion";
import type { LeetCodeBadge } from "@/lib/leetcode-shared";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

interface LeetCodeSummaryCardProps {
  username: string;
  profileUrl: string;
  language: string;
  total: number;
  totalQuestions: number;
  easy: number;
  totalEasy: number;
  medium: number;
  totalMedium: number;
  hard: number;
  totalHard: number;
  badges: LeetCodeBadge[];
  maxStreak: number;
  totalActiveDays: number;
  isLive: boolean;
  isFetching: boolean;
  onRefresh: () => void;
}

/** Compact LeetCode summary card with smooth horseshoe gauge, borderless progress bars & badge line. */
export function LeetCodeSummaryCard({
  username,
  profileUrl,
  language,
  total,
  totalQuestions,
  easy,
  totalEasy,
  medium,
  totalMedium,
  hard,
  totalHard,
  badges,
  maxStreak,
  totalActiveDays,
  isLive,
  isFetching,
  onRefresh,
}: LeetCodeSummaryCardProps) {
  const hasTriggeredRef = useRef(false);
  const gaugeCardRef = useRef<HTMLDivElement>(null);
  const donutSvgRef = useRef<SVGSVGElement>(null);
  const easyArcRef = useRef<SVGPathElement>(null);
  const medArcRef = useRef<SVGPathElement>(null);
  const hardArcRef = useRef<SVGPathElement>(null);
  const totalCountRef = useRef<HTMLSpanElement>(null);
  const easyCountRef = useRef<HTMLSpanElement>(null);
  const medCountRef = useRef<HTMLSpanElement>(null);
  const hardCountRef = useRef<HTMLSpanElement>(null);
  const easyBarRef = useRef<HTMLDivElement>(null);
  const medBarRef = useRef<HTMLDivElement>(null);
  const hardBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const radius = 46;
    const totalArc = (260 / 360) * 2 * Math.PI * radius;
    const totalSafe = Math.max(total, 1);
    const easyTarget = (easy / totalSafe) * totalArc;
    const medTarget = (medium / totalSafe) * totalArc;
    const hardTarget = (hard / totalSafe) * totalArc;
    const easyPctTarget = Math.min(100, (easy / Math.max(totalEasy, 1)) * 100);
    const medPctTarget = Math.min(100, (medium / Math.max(totalMedium, 1)) * 100);
    const hardPctTarget = Math.min(100, (hard / Math.max(totalHard, 1)) * 100);

    const applyGaugeProgress = (progress: number) => {
      const filled = progress * totalArc;
      const eLen = Math.min(filled, easyTarget);
      const mLen = Math.max(0, Math.min(filled - easyTarget, medTarget));
      const hLen = Math.max(0, Math.min(filled - easyTarget - medTarget, hardTarget));

      easyArcRef.current?.setAttribute("stroke-dasharray", `${eLen} ${totalArc}`);
      medArcRef.current?.setAttribute("stroke-dasharray", `${mLen} ${totalArc}`);
      hardArcRef.current?.setAttribute("stroke-dasharray", `${hLen} ${totalArc}`);

      if (totalCountRef.current)
        totalCountRef.current.textContent = String(Math.round(total * progress));
      if (easyCountRef.current)
        easyCountRef.current.textContent = String(Math.round(easy * progress));
      if (medCountRef.current)
        medCountRef.current.textContent = String(Math.round(medium * progress));
      if (hardCountRef.current)
        hardCountRef.current.textContent = String(Math.round(hard * progress));

      if (easyBarRef.current) easyBarRef.current.style.width = `${easyPctTarget * progress}%`;
      if (medBarRef.current) medBarRef.current.style.width = `${medPctTarget * progress}%`;
      if (hardBarRef.current) hardBarRef.current.style.width = `${hardPctTarget * progress}%`;
    };

    if (hasTriggeredRef.current || prefersReducedMotion()) {
      hasTriggeredRef.current = true;
      applyGaugeProgress(1);
      return;
    }

    const triggerEl = gaugeCardRef.current;
    if (!triggerEl) return;

    const tweenState = { progress: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          hasTriggeredRef.current = true;
          applyGaugeProgress(1);
        },
      });

      if (donutSvgRef.current) {
        tl.fromTo(
          donutSvgRef.current,
          { rotate: -40, scale: 0.94, transformOrigin: "50% 50%" },
          { rotate: 0, scale: 1, duration: 1.15, ease: "power3.out", clearProps: "transform" },
          0,
        );
      }

      tl.to(
        tweenState,
        {
          progress: 1,
          duration: 1.15,
          ease: "power2.out",
          onUpdate: () => applyGaugeProgress(tweenState.progress),
        },
        0,
      );

      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 86%",
        once: true,
        onEnter: () => {
          applyGaugeProgress(0);
          tl.play(0);
        },
        onEnterBack: () => {
          hasTriggeredRef.current = true;
          tl.progress(1);
        },
      });
    }, gaugeCardRef);

    return () => ctx.revert();
  }, [total, easy, medium, hard, totalEasy, totalMedium, totalHard]);

  const radius = 46;
  const totalArcLength = (260 / 360) * 2 * Math.PI * radius;
  const totalSolvedSafe = Math.max(total, 1);
  const easyTargetLen = (easy / totalSolvedSafe) * totalArcLength;
  const medTargetLen = (medium / totalSolvedSafe) * totalArcLength;
  const hardTargetLen = (hard / totalSolvedSafe) * totalArcLength;
  const arcPath = "M 24.77 89.57 A 46 46 0 1 1 95.23 89.57";

  const difficultyRows = [
    {
      label: "Easy",
      count: easy,
      max: totalEasy,
      textClass: "text-[#00b8a3]",
      barClass: "bg-[#00b8a3]",
      countRef: easyCountRef,
      barRef: easyBarRef,
    },
    {
      label: "Med.",
      count: medium,
      max: totalMedium,
      textClass: "text-[#ffc01e]",
      barClass: "bg-[#ffc01e]",
      countRef: medCountRef,
      barRef: medBarRef,
    },
    {
      label: "Hard",
      count: hard,
      max: totalHard,
      textClass: "text-[#ef4444]",
      barClass: "bg-[#ef4444]",
      countRef: hardCountRef,
      barRef: hardBarRef,
    },
  ];

  return (
    <div
      ref={gaugeCardRef}
      className="h-full rounded-2xl border border-border bg-card p-4 sm:p-5 text-card-foreground shadow-soft flex flex-col justify-between transition-colors hover:border-border-strong relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald-500/35 before:to-transparent"
    >
      <div>
        {/* Clean Minimal Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border/70">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`size-2 rounded-full shrink-0 ${
                isFetching
                  ? "bg-amber-500 animate-pulse"
                  : isLive
                    ? "bg-emerald-500"
                    : "bg-muted-foreground/60"
              }`}
              title={isFetching ? "Syncing" : isLive ? "Live Synced" : "Cached Snapshot"}
            />
            <span className="font-display text-sm font-bold text-foreground">LeetCode</span>
            <span className="text-xs text-muted-foreground font-mono truncate">@{username}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isFetching}
              title="Refresh live LeetCode stats"
              aria-label="Refresh LeetCode stats"
              className="flex items-center justify-center size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`size-3.5 ${isFetching ? "animate-spin text-emerald-500" : ""}`}
              />
            </button>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LeetCode profile"
              className="flex items-center justify-center size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Gauge + Clean Borderless Difficulty Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div className="relative flex size-32 sm:size-36 items-center justify-center">
              <svg
                ref={donutSvgRef}
                className="size-full origin-center will-change-transform"
                viewBox="0 0 120 120"
              >
                <path
                  d={arcPath}
                  fill="none"
                  stroke="currentColor"
                  className="text-muted-foreground/15 dark:text-white/10"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  ref={easyArcRef}
                  d={arcPath}
                  fill="none"
                  stroke="#00b8a3"
                  strokeWidth="6"
                  strokeDasharray={`${easyTargetLen} ${totalArcLength}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                <path
                  ref={medArcRef}
                  d={arcPath}
                  fill="none"
                  stroke="#ffc01e"
                  strokeWidth="6"
                  strokeDasharray={`${medTargetLen} ${totalArcLength}`}
                  strokeDashoffset={`-${easyTargetLen}`}
                />
                <path
                  ref={hardArcRef}
                  d={arcPath}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeDasharray={`${hardTargetLen} ${totalArcLength}`}
                  strokeDashoffset={`-${easyTargetLen + medTargetLen}`}
                  strokeLinecap={hard > 0 ? "round" : undefined}
                />
                <circle cx="24.77" cy="89.57" r="3" fill="#00b8a3" />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-1.5">
                <div className="flex items-baseline justify-center">
                  <span
                    ref={totalCountRef}
                    className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight"
                  >
                    {total}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono ml-0.5">
                    /{formatNumber(totalQuestions)}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-[#00b8a3] flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle2 className="size-3" />
                  <span>Solved</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {language}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-7 flex flex-col gap-3">
            {difficultyRows.map((row) => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold font-mono ${row.textClass}`}>{row.label}</span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span
                      ref={row.countRef}
                      className="font-display text-sm font-bold text-foreground"
                    >
                      {row.count}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      / {formatNumber(row.max)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary dark:bg-muted overflow-hidden">
                  <div
                    ref={row.barRef}
                    className={`h-full rounded-full ${row.barClass}`}
                    style={{
                      width: `${Math.min(100, (row.count / Math.max(row.max, 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Single Clean Hairline Footer */}
      <div className="mt-4 pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="inline-flex items-center gap-2 min-w-0">
          {badges[0]?.icon ? (
            <img
              src={badges[0].icon}
              alt={badges[0].displayName || "LeetCode Badge"}
              width={20}
              height={20}
              className="size-5 object-contain shrink-0"
            />
          ) : (
            <Award className="size-4 text-emerald-500 shrink-0" />
          )}
          <span className="font-medium text-foreground truncate">
            {badges[0]?.displayName || "50 Days Badge 2026"}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground shrink-0">
          <span>
            Streak <strong className="text-emerald-600 dark:text-emerald-400">{maxStreak}d</strong>
          </span>
          <span className="opacity-40">•</span>
          <span>
            Active <strong className="text-foreground">{totalActiveDays}d</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
