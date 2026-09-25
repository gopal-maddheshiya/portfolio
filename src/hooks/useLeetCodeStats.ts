import { useQuery } from "@tanstack/react-query";
import type { LeetCodeBadge, LeetCodeStatsResponse } from "@/server/leetcode";
import { KNOWN_DIFFICULTIES } from "@/server/leetcode";

const DEFAULT_LEETCODE: LeetCodeStatsResponse = {
  success: true,
  username: "gopal-maddheshiya",
  totalSolved: 54,
  totalQuestions: 4060,
  easySolved: 30,
  totalEasy: 966,
  mediumSolved: 22,
  totalMedium: 2117,
  hardSolved: 2,
  totalHard: 977,
  ranking: 2633618,
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
  totalSubmissions: 93,
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
      title: "Running Sum of 1d Array",
      titleSlug: "running-sum-of-1d-array",
      lang: "java",
      timestamp: "1790329603",
      difficulty: "Easy",
    },
    {
      title: "Two Sum",
      titleSlug: "two-sum",
      lang: "java",
      timestamp: "1787676180",
      difficulty: "Easy",
    },
    {
      title: "Word Search",
      titleSlug: "word-search",
      lang: "java",
      timestamp: "1787675900",
      difficulty: "Medium",
    },
    {
      title: "Valid Anagram",
      titleSlug: "valid-anagram",
      lang: "java",
      timestamp: "1787589730",
      difficulty: "Easy",
    },
  ],
  isLive: false,
  updatedAt: new Date().toISOString(),
};

/**
 * Direct client-side fallback via CORS-enabled public API
 * Used if /api/leetcode returns an error or is unreachable
 */
async function fetchFromClientFallback(
  username = "gopal-maddheshiya",
): Promise<LeetCodeStatsResponse> {
  const [profileRes, badgesRes, calendarRes, subsRes] = await Promise.all([
    fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`, {
      signal: AbortSignal.timeout(6000),
    }),
    fetch(`https://alfa-leetcode-api.onrender.com/${username}/badges`, {
      signal: AbortSignal.timeout(6000),
    }).catch(() => null),
    fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`, {
      signal: AbortSignal.timeout(6000),
    }).catch(() => null),
    fetch(`https://alfa-leetcode-api.onrender.com/${username}/acSubmission?limit=10`, {
      signal: AbortSignal.timeout(6000),
    }).catch(() => null),
  ]);

  if (!profileRes.ok) {
    throw new Error(`Client fallback returned ${profileRes.status}`);
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

  let submissionCalendar = DEFAULT_LEETCODE.submissionCalendar;
  let totalSubmissions = 93;

  if (calendarData?.submissionCalendar) {
    try {
      submissionCalendar = JSON.parse(calendarData.submissionCalendar) as Record<string, number>;
      totalSubmissions = Object.values(submissionCalendar).reduce((a, b) => a + b, 0);
    } catch {
      submissionCalendar = DEFAULT_LEETCODE.submissionCalendar;
    }
  }

  const badges = badgesData?.badges?.length ? badgesData.badges : DEFAULT_LEETCODE.badges;

  const rawSubs = subsData?.submission || [];
  const seenTitles = new Set<string>();
  const uniqueRecent: Array<{
    title: string;
    titleSlug: string;
    lang: string;
    timestamp: string;
    difficulty?: "Easy" | "Medium" | "Hard";
  }> = [];

  for (const s of rawSubs) {
    if (!seenTitles.has(s.title)) {
      seenTitles.add(s.title);
      uniqueRecent.push({
        title: s.title,
        titleSlug: s.titleSlug,
        lang: s.lang || "java",
        timestamp: String(s.timestamp),
        difficulty: KNOWN_DIFFICULTIES[s.titleSlug] || "Easy",
      });
    }
    if (uniqueRecent.length >= 4) break;
  }

  const streakVal = calendarData?.streak ?? 61;

  return {
    success: true,
    username,
    totalSolved: profile.totalSolved ?? 54,
    totalQuestions: profile.totalQuestions ?? 4060,
    easySolved: profile.easySolved ?? 30,
    totalEasy: profile.totalEasy ?? 966,
    mediumSolved: profile.mediumSolved ?? 22,
    totalMedium: profile.totalMedium ?? 2117,
    hardSolved: profile.hardSolved ?? 2,
    totalHard: profile.totalHard ?? 977,
    ranking: profile.ranking ?? 2633618,
    badges,
    totalActiveDays: calendarData?.totalActiveDays ?? 70,
    maxStreak: Math.max(streakVal, 61),
    currentStreak: streakVal,
    totalSubmissions,
    submissionCalendar,
    recentSubmissions: uniqueRecent.length > 0 ? uniqueRecent : DEFAULT_LEETCODE.recentSubmissions,
    isLive: true,
    updatedAt: new Date().toISOString(),
  };
}

async function fetchLeetCode(): Promise<LeetCodeStatsResponse> {
  // 1. Try local server endpoint /api/leetcode
  try {
    const res = await fetch("/api/leetcode", { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = (await res.json()) as LeetCodeStatsResponse;
      if (data && data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Direct /api/leetcode failed, attempting direct public fallback:", err);
  }

  // 2. Direct browser fallback via public CORS API
  try {
    const fallbackData = await fetchFromClientFallback("gopal-maddheshiya");
    return fallbackData;
  } catch (clientErr) {
    console.warn("Client-side LeetCode fallback failed:", clientErr);
  }

  // 3. Fallback to default verified metrics
  return DEFAULT_LEETCODE;
}

export function useLeetCodeStats() {
  const { data, isLoading, isFetching, isError, refetch } = useQuery<LeetCodeStatsResponse>({
    queryKey: ["leetcode-stats", "gopal-maddheshiya"],
    queryFn: fetchLeetCode,
    placeholderData: DEFAULT_LEETCODE,
    staleTime: 60 * 1000, // 1 minute fresh time
    refetchInterval: 5 * 60 * 1000, // Auto background refresh every 5 minutes
    refetchOnWindowFocus: true, // Refresh when switching back to portfolio
  });

  const stats = data || DEFAULT_LEETCODE;

  return {
    stats,
    isLoading,
    isFetching,
    isError,
    refetch,
    total: stats.totalSolved || 54,
    totalQuestions: stats.totalQuestions || 4060,
    easy: stats.easySolved || 30,
    totalEasy: stats.totalEasy || 966,
    medium: stats.mediumSolved || 22,
    totalMedium: stats.totalMedium || 2117,
    hard: stats.hardSolved || 2,
    totalHard: stats.totalHard || 977,
    ranking: stats.ranking,
    badges: stats.badges || DEFAULT_LEETCODE.badges,
    totalActiveDays: stats.totalActiveDays || 70,
    maxStreak: stats.maxStreak || 61,
    currentStreak: stats.currentStreak || stats.maxStreak || 61,
    totalSubmissions: stats.totalSubmissions || 93,
    submissionCalendar: stats.submissionCalendar || DEFAULT_LEETCODE.submissionCalendar,
    recentSubmissions: stats.recentSubmissions || DEFAULT_LEETCODE.recentSubmissions,
    isLive: stats.isLive,
  };
}
