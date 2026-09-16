import { useQuery } from "@tanstack/react-query";
import type { LeetCodeStatsResponse } from "@/server/leetcode";

const DEFAULT_LEETCODE: LeetCodeStatsResponse = {
  success: true,
  username: "gopal-maddheshiya",
  totalSolved: 53,
  totalQuestions: 4055,
  easySolved: 29,
  totalEasy: 965,
  mediumSolved: 22,
  totalMedium: 2115,
  hardSolved: 2,
  totalHard: 975,
  ranking: 2613074,
  badges: [
    {
      id: "10507504",
      name: "50 Days Badge 2026",
      displayName: "50 Days Badge 2026",
      icon: "https://assets.leetcode.com/static_assets/others/50_1080_1080.png",
      creationDate: "2026-07-09",
    },
  ],
  totalActiveDays: 69,
  maxStreak: 61,
  totalSubmissions: 89,
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
  },
  recentSubmissions: [
    { title: "Two Sum", titleSlug: "two-sum", lang: "java", timestamp: "1787676180" },
    { title: "Word Search", titleSlug: "word-search", lang: "java", timestamp: "1787675900" },
    { title: "Valid Anagram", titleSlug: "valid-anagram", lang: "java", timestamp: "1787589730" },
    { title: "Sqrt(x)", titleSlug: "sqrtx", lang: "java", timestamp: "1786815802" },
  ],
  isLive: false,
  updatedAt: new Date().toISOString(),
};

async function fetchLeetCode(): Promise<LeetCodeStatsResponse> {
  try {
    const res = await fetch("/api/leetcode");
    if (!res.ok) {
      throw new Error(`Failed to fetch LeetCode: ${res.status}`);
    }
    const data = (await res.json()) as LeetCodeStatsResponse;
    return data;
  } catch (err) {
    console.warn("Using fallback LeetCode data:", err);
    return DEFAULT_LEETCODE;
  }
}

export function useLeetCodeStats() {
  const { data, isLoading, isError, refetch } = useQuery<LeetCodeStatsResponse>({
    queryKey: ["leetcode-stats", "gopal-maddheshiya"],
    queryFn: fetchLeetCode,
    initialData: DEFAULT_LEETCODE,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const stats = data || DEFAULT_LEETCODE;

  return {
    stats,
    isLoading,
    isError,
    refetch,
    total: stats.totalSolved || 53,
    totalQuestions: stats.totalQuestions || 4055,
    easy: stats.easySolved || 29,
    totalEasy: stats.totalEasy || 965,
    medium: stats.mediumSolved || 22,
    totalMedium: stats.totalMedium || 2115,
    hard: stats.hardSolved || 2,
    totalHard: stats.totalHard || 975,
    ranking: stats.ranking,
    badges: stats.badges || DEFAULT_LEETCODE.badges,
    totalActiveDays: stats.totalActiveDays || 69,
    maxStreak: stats.maxStreak || 61,
    totalSubmissions: stats.totalSubmissions || 89,
    submissionCalendar: stats.submissionCalendar || DEFAULT_LEETCODE.submissionCalendar,
    recentSubmissions: stats.recentSubmissions || DEFAULT_LEETCODE.recentSubmissions,
    isLive: stats.isLive,
  };
}
