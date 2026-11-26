import { useQuery } from "@tanstack/react-query";
import { PERSONAL_INFO } from "@/data/profile";
import {
  FALLBACK_LEETCODE_STATS,
  fetchFromAlfaLeetCode,
  type LeetCodeStatsResponse,
} from "@/lib/leetcode-shared";

async function fetchLeetCode(username: string): Promise<LeetCodeStatsResponse> {
  // 1. Try server endpoint /api/leetcode
  try {
    const res = await fetch(`/api/leetcode?username=${encodeURIComponent(username)}`, {
      signal: AbortSignal.timeout(6000),
    });
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
    return await fetchFromAlfaLeetCode(username);
  } catch (clientErr) {
    console.warn("Client-side LeetCode fallback failed:", clientErr);
  }

  // 3. Offline verified metrics fallback
  return {
    ...FALLBACK_LEETCODE_STATS,
    username,
    isLive: false,
  };
}

export function useLeetCodeStats(username?: string) {
  const defaultHandle = PERSONAL_INFO.leetcodeUsername || "gopal-maddheshiya";
  const targetUsername = (username || defaultHandle).trim() || defaultHandle;

  const { data, isLoading, isFetching, isError, refetch } = useQuery<LeetCodeStatsResponse>({
    queryKey: ["leetcode-stats", targetUsername],
    queryFn: () => fetchLeetCode(targetUsername),
    placeholderData: FALLBACK_LEETCODE_STATS,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const stats = data ?? FALLBACK_LEETCODE_STATS;

  return {
    stats,
    username: stats.username || targetUsername,
    isLoading,
    isFetching,
    isError,
    refetch,
    total: stats.totalSolved ?? FALLBACK_LEETCODE_STATS.totalSolved,
    totalQuestions: stats.totalQuestions ?? FALLBACK_LEETCODE_STATS.totalQuestions,
    easy: stats.easySolved ?? FALLBACK_LEETCODE_STATS.easySolved,
    totalEasy: stats.totalEasy ?? FALLBACK_LEETCODE_STATS.totalEasy,
    medium: stats.mediumSolved ?? FALLBACK_LEETCODE_STATS.mediumSolved,
    totalMedium: stats.totalMedium ?? FALLBACK_LEETCODE_STATS.totalMedium,
    hard: stats.hardSolved ?? FALLBACK_LEETCODE_STATS.hardSolved,
    totalHard: stats.totalHard ?? FALLBACK_LEETCODE_STATS.totalHard,
    ranking: stats.ranking,
    badges: stats.badges ?? FALLBACK_LEETCODE_STATS.badges,
    totalActiveDays: stats.totalActiveDays ?? FALLBACK_LEETCODE_STATS.totalActiveDays,
    maxStreak: stats.maxStreak ?? FALLBACK_LEETCODE_STATS.maxStreak,
    currentStreak: stats.currentStreak ?? stats.maxStreak ?? FALLBACK_LEETCODE_STATS.currentStreak,
    totalSubmissions: stats.totalSubmissions ?? FALLBACK_LEETCODE_STATS.totalSubmissions,
    submissionCalendar: stats.submissionCalendar ?? FALLBACK_LEETCODE_STATS.submissionCalendar,
    recentSubmissions: stats.recentSubmissions ?? FALLBACK_LEETCODE_STATS.recentSubmissions,
    isLive: Boolean(stats.isLive),
  };
}
