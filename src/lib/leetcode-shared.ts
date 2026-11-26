export type LeetCodeBadge = {
  id?: string;
  name: string;
  displayName: string;
  icon: string;
  creationDate?: string;
};

export type RecentLeetCodeSubmission = {
  title: string;
  titleSlug: string;
  lang: string;
  timestamp: string;
  difficulty?: "Easy" | "Medium" | "Hard";
};

export type LeetCodeStatsResponse = {
  success: boolean;
  username: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number | null;
  badges: LeetCodeBadge[];
  totalActiveDays: number;
  maxStreak: number;
  currentStreak: number;
  totalSubmissions: number;
  submissionCalendar: Record<string, number>;
  recentSubmissions: RecentLeetCodeSubmission[];
  isLive: boolean;
  updatedAt: string;
};

export const KNOWN_DIFFICULTIES: Record<string, "Easy" | "Medium" | "Hard"> = {
  "running-sum-of-1d-array": "Easy",
  "two-sum": "Easy",
  "word-search": "Medium",
  "valid-anagram": "Easy",
  sqrtx: "Easy",
  "smallest-divisible-digit-product-i": "Easy",
  "valid-palindrome": "Easy",
  "valid-sudoku": "Medium",
  "valid-parentheses": "Easy",
  "length-of-last-word": "Easy",
  "reverse-linked-list": "Easy",
  "merge-two-sorted-lists": "Easy",
  "maximum-subarray": "Medium",
  "climbing-stairs": "Easy",
  "binary-search": "Easy",
  "search-in-rotated-sorted-array": "Medium",
  "3sum": "Medium",
  "container-with-most-water": "Medium",
  "trapping-rain-water": "Hard",
  "median-of-two-sorted-arrays": "Hard",
  "palindrome-number": "Easy",
  "longest-common-prefix": "Easy",
  "remove-duplicates-from-sorted-array": "Easy",
  "remove-element": "Easy",
  "search-insert-position": "Easy",
  "plus-one": "Easy",
  "add-binary": "Easy",
  "merge-sorted-array": "Easy",
  "binary-tree-inorder-traversal": "Easy",
  "same-tree": "Easy",
  "symmetric-tree": "Easy",
  "maximum-depth-of-binary-tree": "Easy",
  "edit-distance": "Medium",
  "happy-number": "Easy",
};

export const FALLBACK_LEETCODE_STATS: LeetCodeStatsResponse = {
  success: true,
  username: "gopal-maddheshiya",
  totalSolved: 66,
  totalQuestions: 4060,
  easySolved: 37,
  totalEasy: 966,
  mediumSolved: 27,
  totalMedium: 2117,
  hardSolved: 2,
  totalHard: 977,
  ranking: 2348337,
  badges: [
    {
      id: "10507504",
      name: "Annual Badge",
      displayName: "50 Days Badge 2026",
      icon: "https://assets.leetcode.com/static_assets/others/50_1080_1080.png",
      creationDate: "2026-07-09",
    },
  ],
  totalActiveDays: 70,
  maxStreak: 61,
  currentStreak: 61,
  totalSubmissions: 105,
  submissionCalendar: {
    "1770508800": 1,
    "1775347200": 1,
    "1776988800": 1,
    "1779580800": 1,
    "1779667200": 2,
    "1779753600": 2,
    "1779840000": 1,
    "1779926400": 1,
    "1780012800": 1,
    "1780099200": 1,
    "1780185600": 1,
    "1780272000": 1,
    "1780358400": 1,
    "1780444800": 1,
    "1780531200": 1,
    "1780617600": 1,
    "1780704000": 1,
    "1780790400": 3,
    "1780876800": 2,
    "1780963200": 2,
    "1781049600": 1,
    "1781136000": 1,
    "1781222400": 1,
    "1781308800": 1,
    "1781395200": 3,
    "1781481600": 2,
    "1781568000": 1,
    "1781654400": 2,
    "1781740800": 1,
    "1781827200": 1,
    "1781913600": 1,
    "1782000000": 2,
    "1782086400": 1,
    "1782172800": 1,
    "1782259200": 3,
    "1782345600": 1,
    "1782432000": 1,
    "1782518400": 1,
    "1782604800": 1,
    "1782691200": 2,
    "1782777600": 1,
    "1782864000": 1,
    "1782950400": 1,
    "1783036800": 1,
    "1783123200": 1,
    "1783209600": 1,
    "1783296000": 1,
    "1783382400": 1,
    "1783468800": 1,
    "1783555200": 2,
    "1783641600": 1,
    "1783728000": 1,
    "1783814400": 1,
    "1783900800": 1,
    "1783987200": 1,
    "1784073600": 1,
    "1784160000": 1,
    "1784246400": 1,
    "1784332800": 1,
    "1784419200": 1,
    "1784505600": 2,
    "1784592000": 1,
    "1784678400": 3,
    "1784764800": 1,
    "1785196800": 1,
    "1785974400": 1,
    "1786752000": 1,
    "1787529600": 1,
    "1787616000": 3,
    "1790329600": 1,
  },
  recentSubmissions: [
    {
      title: "Edit Distance",
      titleSlug: "edit-distance",
      lang: "java",
      timestamp: "1795600000",
      difficulty: "Medium",
    },
    {
      title: "Happy Number",
      titleSlug: "happy-number",
      lang: "java",
      timestamp: "1795500000",
      difficulty: "Easy",
    },
    {
      title: "Merge Two Sorted Lists",
      titleSlug: "merge-two-sorted-lists",
      lang: "java",
      timestamp: "1795400000",
      difficulty: "Easy",
    },
    {
      title: "Climbing Stairs",
      titleSlug: "climbing-stairs",
      lang: "java",
      timestamp: "1795300000",
      difficulty: "Easy",
    },
  ],
  isLive: false,
  updatedAt: new Date().toISOString(),
};

/** Compute active days & longest consecutive daily streak directly from a Unix calendar map. */
export function computeCalendarStreakMetrics(calendar: Record<string, number>): {
  activeDays: number;
  maxStreak: number;
  totalSubmissions: number;
} {
  const dayBuckets = new Set<number>();
  let totalSubmissions = 0;

  for (const [secStr, count] of Object.entries(calendar)) {
    if (typeof count === "number" && count > 0) {
      totalSubmissions += count;
      const dayIndex = Math.floor(Number(secStr) / 86400);
      if (Number.isFinite(dayIndex)) dayBuckets.add(dayIndex);
    }
  }

  const sortedDays = Array.from(dayBuckets).sort((a, b) => a - b);
  let maxStreak = 0;
  let currentRun = 0;
  let prevDay: number | null = null;

  for (const day of sortedDays) {
    if (prevDay !== null && day === prevDay + 1) {
      currentRun += 1;
    } else {
      currentRun = 1;
    }
    if (currentRun > maxStreak) maxStreak = currentRun;
    prevDay = day;
  }

  return {
    activeDays: sortedDays.length,
    maxStreak,
    totalSubmissions,
  };
}

export function normalizeRecentSubmissions(
  rawSubs: Array<{
    title: string;
    titleSlug: string;
    lang?: string | undefined;
    timestamp: string | number;
  }>,
): RecentLeetCodeSubmission[] {
  const seen = new Set<string>();
  const unique: RecentLeetCodeSubmission[] = [];

  for (const sub of rawSubs) {
    if (!sub?.title || seen.has(sub.title)) continue;
    seen.add(sub.title);
    unique.push({
      title: sub.title,
      titleSlug: sub.titleSlug,
      lang: sub.lang || "java",
      timestamp: String(sub.timestamp),
      difficulty: KNOWN_DIFFICULTIES[sub.titleSlug] || "Easy",
    });
    if (unique.length >= 4) break;
  }

  return unique;
}

/**
 * Shared CORS-compatible fetch via Alfa LeetCode proxy (used cleanly by server & browser fallback).
 */
export async function fetchFromAlfaLeetCode(username: string): Promise<LeetCodeStatsResponse> {
  const safeUser = encodeURIComponent(username);
  const [profileRes, badgesRes, calendarRes, subsRes] = await Promise.all([
    fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${safeUser}`, {
      signal: AbortSignal.timeout(6000),
    }),
    fetch(`https://alfa-leetcode-api.onrender.com/${safeUser}/badges`, {
      signal: AbortSignal.timeout(6000),
    }).catch(() => null),
    fetch(`https://alfa-leetcode-api.onrender.com/${safeUser}/calendar`, {
      signal: AbortSignal.timeout(6000),
    }).catch(() => null),
    fetch(`https://alfa-leetcode-api.onrender.com/${safeUser}/acSubmission?limit=10`, {
      signal: AbortSignal.timeout(6000),
    }).catch(() => null),
  ]);

  if (!profileRes.ok) {
    throw new Error(`Alfa API returned status ${profileRes.status}`);
  }

  const profile = (await profileRes.json()) as {
    totalSolved?: number;
    easySolved?: number;
    mediumSolved?: number;
    hardSolved?: number;
    totalQuestions?: number;
    totalEasy?: number;
    totalMedium?: number;
    totalHard?: number;
    ranking?: number;
  };

  const badgesData = badgesRes?.ok
    ? ((await badgesRes.json()) as { badges?: LeetCodeBadge[] })
    : null;
  const calendarData = calendarRes?.ok
    ? ((await calendarRes.json()) as {
        totalActiveDays?: number;
        streak?: number;
        submissionCalendar?: string;
      })
    : null;
  const subsData = subsRes?.ok
    ? ((await subsRes.json()) as {
        submission?: Array<{
          title: string;
          titleSlug: string;
          lang?: string;
          timestamp: string | number;
        }>;
      })
    : null;

  let submissionCalendar: Record<string, number> = {};
  let calendarMetrics = { activeDays: 0, maxStreak: 0, totalSubmissions: 0 };

  if (calendarData?.submissionCalendar) {
    try {
      submissionCalendar = JSON.parse(calendarData.submissionCalendar) as Record<string, number>;
      calendarMetrics = computeCalendarStreakMetrics(submissionCalendar);
    } catch {
      submissionCalendar = {};
    }
  }

  const badges = badgesData?.badges?.length ? badgesData.badges : [];
  const uniqueRecent = normalizeRecentSubmissions(subsData?.submission || []);
  const reportedStreak = typeof calendarData?.streak === "number" ? calendarData.streak : 0;
  const maxStreak = Math.max(reportedStreak, calendarMetrics.maxStreak);

  return {
    success: true,
    username,
    totalSolved: profile.totalSolved ?? 0,
    totalQuestions: profile.totalQuestions ?? FALLBACK_LEETCODE_STATS.totalQuestions,
    easySolved: profile.easySolved ?? 0,
    totalEasy: profile.totalEasy ?? FALLBACK_LEETCODE_STATS.totalEasy,
    mediumSolved: profile.mediumSolved ?? 0,
    totalMedium: profile.totalMedium ?? FALLBACK_LEETCODE_STATS.totalMedium,
    hardSolved: profile.hardSolved ?? 0,
    totalHard: profile.totalHard ?? FALLBACK_LEETCODE_STATS.totalHard,
    ranking: profile.ranking ?? null,
    badges,
    totalActiveDays: calendarData?.totalActiveDays ?? calendarMetrics.activeDays,
    maxStreak,
    currentStreak: reportedStreak || maxStreak,
    totalSubmissions: calendarMetrics.totalSubmissions,
    submissionCalendar,
    recentSubmissions: uniqueRecent,
    isLive: true,
    updatedAt: new Date().toISOString(),
  };
}
