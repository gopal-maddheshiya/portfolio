import { useQuery } from "@tanstack/react-query";
import { PERSONAL_INFO } from "@/data/profile";
import { FALLBACK_GITHUB_STATS, type GitHubStatsResponse } from "@/lib/github-shared";

async function fetchGitHub(username: string, period: string): Promise<GitHubStatsResponse> {
  try {
    const params = new URLSearchParams({
      username,
      year: period,
    });
    const res = await fetch(`/api/github?${params.toString()}`, {
      signal: AbortSignal.timeout(7000),
    });
    if (res.ok) {
      const data = (await res.json()) as GitHubStatsResponse;
      if (data && data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Direct /api/github failed, using snapshot fallback:", err);
  }

  return {
    ...FALLBACK_GITHUB_STATS,
    username,
    period,
    isLive: false,
  };
}

/** Fetches live synchronized GitHub contributions & repository metrics for a given user/year. */
export function useGitHubStats(username?: string, period = "Current") {
  const defaultHandle = PERSONAL_INFO.githubUsername || "gopal-maddheshiya";
  const targetUsername = (username || defaultHandle).trim() || defaultHandle;

  const { data, isLoading, isFetching, isError, refetch } = useQuery<GitHubStatsResponse>({
    queryKey: ["github-stats", targetUsername, period],
    queryFn: () => fetchGitHub(targetUsername, period),
    placeholderData: FALLBACK_GITHUB_STATS,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const stats = data ?? FALLBACK_GITHUB_STATS;

  return {
    stats,
    username: stats.username || targetUsername,
    isLoading,
    isFetching,
    isError,
    refetch,
    totalContributions: stats.totalContributions ?? FALLBACK_GITHUB_STATS.totalContributions,
    activeDays: stats.activeDays ?? FALLBACK_GITHUB_STATS.activeDays,
    maxStreak: stats.maxStreak ?? FALLBACK_GITHUB_STATS.maxStreak,
    currentStreak: stats.currentStreak ?? FALLBACK_GITHUB_STATS.currentStreak,
    publicRepos: stats.publicRepos ?? FALLBACK_GITHUB_STATS.publicRepos,
    followers: stats.followers ?? FALLBACK_GITHUB_STATS.followers,
    totalStars: stats.totalStars ?? FALLBACK_GITHUB_STATS.totalStars,
    topLanguages: stats.topLanguages ?? FALLBACK_GITHUB_STATS.topLanguages,
    calendar: stats.calendar ?? FALLBACK_GITHUB_STATS.calendar,
    submissionCalendar: stats.submissionCalendar ?? FALLBACK_GITHUB_STATS.submissionCalendar,
    recentRepos: stats.recentRepos ?? FALLBACK_GITHUB_STATS.recentRepos,
    isLive: Boolean(stats.isLive),
  };
}
