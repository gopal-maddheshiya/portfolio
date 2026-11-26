import { ArrowUpRight, FolderGit2, RefreshCw } from "lucide-react";
import {
  GITHUB_LANGUAGE_COLORS,
  type GitHubLanguageStat,
  type GitHubRepoSummary,
} from "@/lib/github-shared";

interface GitHubSummaryCardProps {
  username: string;
  profileUrl: string;
  totalContributions: number;
  publicRepos: number;
  totalStars: number;
  maxStreak: number;
  activeDays: number;
  topLanguages: GitHubLanguageStat[];
  recentRepos: GitHubRepoSummary[];
  isLive: boolean;
  isFetching: boolean;
  onRefresh: () => void;
}

/** Compact, airy GitHub activity summary matching LeetCodeSummaryCard height and typography. */
export function GitHubSummaryCard({
  username,
  profileUrl,
  totalContributions,
  publicRepos,
  totalStars,
  maxStreak,
  activeDays,
  topLanguages,
  recentRepos,
  isLive,
  isFetching,
  onRefresh,
}: GitHubSummaryCardProps) {
  const formattedTotal = new Intl.NumberFormat("en-US").format(totalContributions);
  const topThreeLangs = topLanguages.slice(0, 3);
  const quickRepos = recentRepos.slice(0, 3);

  return (
    <div className="h-full rounded-2xl border border-border bg-card p-4 sm:p-5 text-card-foreground shadow-soft flex flex-col justify-between transition-colors hover:border-border-strong relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/35 before:to-transparent">
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
            <span className="font-display text-sm font-bold text-foreground">GitHub</span>
            <span className="text-xs text-muted-foreground font-mono truncate">@{username}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isFetching}
              title="Refresh live GitHub stats"
              aria-label="Refresh GitHub stats"
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
              aria-label="Open GitHub profile"
              className="flex items-center justify-center size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Hero Metric + Clean Typography Stats (No nested heavy boxes) */}
        <div className="flex flex-wrap items-end justify-between gap-4 py-1">
          <div>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {formattedTotal}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Contributions across public repositories (past year)
            </p>
          </div>

          <div className="flex items-center gap-5 text-left font-mono">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Repos</p>
              <p className="text-base font-bold text-foreground">{publicRepos}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Streak</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {maxStreak}d
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Stars</p>
              <p className="text-base font-bold text-amber-600 dark:text-amber-400">{totalStars}</p>
            </div>
          </div>
        </div>

        {/* Thin Language Distribution Bar */}
        <div className="mt-4 space-y-2">
          <div className="h-1.5 w-full rounded-full bg-secondary dark:bg-muted overflow-hidden flex gap-0.5">
            {topLanguages.map((lang) => (
              <div
                key={lang.name}
                title={`${lang.name} (${lang.percent}%)`}
                style={{
                  width: `${lang.percent}%`,
                  backgroundColor: GITHUB_LANGUAGE_COLORS[lang.name] || "var(--color-primary)",
                }}
                className="h-full first:rounded-l-full last:rounded-r-full"
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono">
            {topThreeLangs.map((lang) => (
              <span key={lang.name} className="inline-flex items-center gap-1.5 text-foreground/90">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: GITHUB_LANGUAGE_COLORS[lang.name] || "var(--color-primary)",
                  }}
                />
                <span>{lang.name}</span>
                <span className="text-muted-foreground">{lang.percent}%</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Single Clean Hairline Footer: Quick Repo Links + Active Days */}
      <div className="mt-4 pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <FolderGit2 className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
          {quickRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-secondary/70 hover:bg-secondary border border-border/60 px-2 py-0.5 text-[11px] font-mono text-muted-foreground hover:text-primary transition-colors truncate max-w-[140px]"
            >
              {repo.name}
            </a>
          ))}
        </div>

        <span className="font-mono text-[11px] text-muted-foreground shrink-0">
          Active <strong className="text-foreground">{activeDays}d</strong>
        </span>
      </div>
    </div>
  );
}
