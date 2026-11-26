import { computeCalendarStreakMetrics } from "@/lib/leetcode-shared";

export type GitHubContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface GitHubContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: GitHubContributionLevel;
}

export interface GitHubRepoSummary {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  updatedAt: string;
}

export interface GitHubLanguageStat {
  name: string;
  count: number;
  percent: number;
}

export interface GitHubStatsResponse {
  success: boolean;
  username: string;
  period: string;
  totalContributions: number;
  activeDays: number;
  maxStreak: number;
  currentStreak: number;
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: GitHubLanguageStat[];
  calendar: Record<string, GitHubContributionDay>;
  /** Unix-second keyed map compatible with shared calendar metrics/grid helpers. */
  submissionCalendar: Record<string, number>;
  recentRepos: GitHubRepoSummary[];
  isLive: boolean;
  updatedAt: string;
}

/** Language palette matching GitHub conventions while fitting dark & light surfaces cleanly. */
export const GITHUB_LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Python: "#3572a5",
  C: "#555555",
  "C++": "#f34b7d",
};

export const FALLBACK_GITHUB_STATS: GitHubStatsResponse = {
  success: true,
  username: "gopal-maddheshiya",
  period: "Current",
  totalContributions: 715,
  activeDays: 112,
  maxStreak: 21,
  currentStreak: 3,
  publicRepos: 22,
  followers: 2,
  totalStars: 7,
  topLanguages: [
    { name: "TypeScript", count: 8, percent: 38 },
    { name: "JavaScript", count: 7, percent: 33 },
    { name: "Java", count: 4, percent: 19 },
    { name: "CSS", count: 2, percent: 10 },
  ],
  calendar: {},
  submissionCalendar: {},
  recentRepos: [
    {
      name: "portfolio",
      url: "https://github.com/gopal-maddheshiya/portfolio",
      description: "Full-stack TanStack Start portfolio with live LeetCode, GitHub & AI studio.",
      language: "TypeScript",
      stars: 2,
      updatedAt: new Date().toISOString(),
    },
    {
      name: "krishi-suraksha-sih2026",
      url: "https://github.com/gopal-maddheshiya/krishi-suraksha-sih2026",
      description: "KisanSarthi AI — Smart India Hackathon 2026 agricultural platform.",
      language: "TypeScript",
      stars: 2,
      updatedAt: new Date().toISOString(),
    },
    {
      name: "dsa-tracker",
      url: "https://github.com/gopal-maddheshiya/dsa-tracker",
      description: "MERN spaced-repetition DSA & interview preparation tracker.",
      language: "JavaScript",
      stars: 2,
      updatedAt: new Date().toISOString(),
    },
    {
      name: "online-shopping-store",
      url: "https://github.com/gopal-maddheshiya/online-shopping-store",
      description: "Arun Gopal Traders bilingual e-commerce storefront.",
      language: "TypeScript",
      stars: 1,
      updatedAt: new Date().toISOString(),
    },
  ],
  isLive: false,
  updatedAt: new Date().toISOString(),
};

/** Compute active days, longest streak, current trailing streak, and Unix map from ISO days. */
export function computeGitHubCalendarMetrics(calendar: Record<string, GitHubContributionDay>): {
  activeDays: number;
  maxStreak: number;
  currentStreak: number;
  summedContributions: number;
  submissionCalendar: Record<string, number>;
} {
  const submissionCalendar: Record<string, number> = {};
  const sortedDates = Object.keys(calendar).sort();

  for (const dateStr of sortedDates) {
    const entry = calendar[dateStr];
    if (!entry) continue;
    const ms = Date.parse(`${dateStr}T00:00:00Z`);
    if (Number.isFinite(ms) && entry.count > 0) {
      submissionCalendar[String(Math.floor(ms / 1000))] = entry.count;
    }
  }

  const {
    activeDays,
    maxStreak,
    totalSubmissions: summedContributions,
  } = computeCalendarStreakMetrics(submissionCalendar);

  // Trailing streak ending at latest populated active day (today or yesterday)
  let currentStreak = 0;
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const d = calendar[sortedDates[i]!];
    if (!d) continue;
    if (d.count > 0) {
      currentStreak += 1;
    } else if (currentStreak > 0 || i < sortedDates.length - 1) {
      // Allow only today's incomplete day (last element) to be 0 without resetting streak
      if (i < sortedDates.length - 1) break;
    }
  }

  return {
    activeDays,
    maxStreak,
    currentStreak,
    summedContributions,
    submissionCalendar,
  };
}
