import {
  computeCalendarStreakMetrics,
  FALLBACK_LEETCODE_STATS,
  fetchFromAlfaLeetCode,
  normalizeRecentSubmissions,
  type LeetCodeBadge,
  type LeetCodeStatsResponse,
} from "@/lib/leetcode-shared";

// Per-username cache (15-minute TTL) so switching usernames never serves another profile's cached numbers
const statsCache = new Map<string, { data: LeetCodeStatsResponse; fetchedAt: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Strategy 1: Fetch directly from LeetCode Official GraphQL API
 */
async function fetchFromLeetCodeGraphQL(username: string): Promise<LeetCodeStatsResponse> {
  const graphqlQuery = {
    query: `
      query userLeetCodeProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          badges {
            id
            name
            displayName
            icon
            creationDate
          }
          userCalendar {
            streak
            totalActiveDays
            submissionCalendar
          }
        }
        allQuestionsCount {
          difficulty
          count
        }
        recentAcSubmissionList(username: $username, limit: 10) {
          title
          titleSlug
          timestamp
        }
      }
    `,
    variables: { username },
  };

  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Referer: "https://leetcode.com",
      Origin: "https://leetcode.com",
    },
    body: JSON.stringify(graphqlQuery),
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    throw new Error(`LeetCode GraphQL HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    data?: {
      matchedUser?: {
        profile?: { ranking?: number };
        submitStatsGlobal?: {
          acSubmissionNum?: Array<{ difficulty: string; count: number }>;
        };
        badges?: LeetCodeBadge[];
        userCalendar?: {
          streak?: number;
          totalActiveDays?: number;
          submissionCalendar?: string;
        };
      };
      allQuestionsCount?: Array<{ difficulty: string; count: number }>;
      recentAcSubmissionList?: Array<{
        title: string;
        titleSlug: string;
        timestamp: string;
      }>;
    };
  };

  const matchedUser = data?.data?.matchedUser;
  if (!matchedUser) {
    throw new Error("User not found on LeetCode GraphQL");
  }

  const acSubmissions = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
  const allQuestions = data?.data?.allQuestionsCount || [];

  const total = acSubmissions.find((s) => s.difficulty === "All")?.count ?? 0;
  const easy = acSubmissions.find((s) => s.difficulty === "Easy")?.count ?? 0;
  const medium = acSubmissions.find((s) => s.difficulty === "Medium")?.count ?? 0;
  const hard = acSubmissions.find((s) => s.difficulty === "Hard")?.count ?? 0;
  const ranking = matchedUser.profile?.ranking ?? null;

  const totalQ =
    allQuestions.find((q) => q.difficulty === "All")?.count ??
    FALLBACK_LEETCODE_STATS.totalQuestions;
  const totalE =
    allQuestions.find((q) => q.difficulty === "Easy")?.count ?? FALLBACK_LEETCODE_STATS.totalEasy;
  const totalM =
    allQuestions.find((q) => q.difficulty === "Medium")?.count ??
    FALLBACK_LEETCODE_STATS.totalMedium;
  const totalH =
    allQuestions.find((q) => q.difficulty === "Hard")?.count ?? FALLBACK_LEETCODE_STATS.totalHard;

  const badges = matchedUser.badges?.length ? matchedUser.badges : [];
  const calendarJson = matchedUser.userCalendar?.submissionCalendar;
  let submissionCalendar: Record<string, number> = {};
  let calendarMetrics = { activeDays: 0, maxStreak: 0, totalSubmissions: 0 };

  if (calendarJson) {
    try {
      submissionCalendar = JSON.parse(calendarJson) as Record<string, number>;
      calendarMetrics = computeCalendarStreakMetrics(submissionCalendar);
    } catch {
      submissionCalendar = {};
    }
  }

  const totalActiveDays = matchedUser.userCalendar?.totalActiveDays ?? calendarMetrics.activeDays;
  const streakVal = matchedUser.userCalendar?.streak ?? 0;
  const maxStreak = Math.max(streakVal, calendarMetrics.maxStreak);

  const uniqueRecent = normalizeRecentSubmissions(data?.data?.recentAcSubmissionList || []);

  return {
    success: true,
    username,
    totalSolved: total,
    totalQuestions: totalQ,
    easySolved: easy,
    totalEasy: totalE,
    mediumSolved: medium,
    totalMedium: totalM,
    hardSolved: hard,
    totalHard: totalH,
    ranking,
    badges,
    totalActiveDays,
    maxStreak,
    currentStreak: streakVal || maxStreak,
    totalSubmissions: calendarMetrics.totalSubmissions,
    submissionCalendar,
    recentSubmissions: uniqueRecent,
    isLive: true,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Strategy 2: Fetch via Faisal Shohag LeetCode Vercel proxy
 */
async function fetchFromFaisalShohag(username: string): Promise<LeetCodeStatsResponse> {
  const res = await fetch(
    `https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(username)}`,
    {
      signal: AbortSignal.timeout(6000),
    },
  );

  if (!res.ok) {
    throw new Error(`FaisalShohag API returned status ${res.status}`);
  }

  const data = (await res.json()) as {
    totalSolved?: number;
    easySolved?: number;
    mediumSolved?: number;
    hardSolved?: number;
    totalQuestions?: number;
    totalEasy?: number;
    totalMedium?: number;
    totalHard?: number;
    ranking?: number;
    submissionCalendar?: Record<string, number>;
    recentSubmissions?: Array<{
      title: string;
      titleSlug: string;
      lang?: string;
      timestamp: string;
    }>;
  };

  if (typeof data.totalSolved !== "number") {
    throw new Error("FaisalShohag API returned empty profile payload");
  }

  const submissionCalendar =
    data.submissionCalendar && typeof data.submissionCalendar === "object"
      ? data.submissionCalendar
      : {};
  const calendarMetrics = computeCalendarStreakMetrics(submissionCalendar);
  const recent = normalizeRecentSubmissions(data.recentSubmissions || []);

  return {
    success: true,
    username,
    totalSolved: data.totalSolved,
    totalQuestions: data.totalQuestions ?? FALLBACK_LEETCODE_STATS.totalQuestions,
    easySolved: data.easySolved ?? 0,
    totalEasy: data.totalEasy ?? FALLBACK_LEETCODE_STATS.totalEasy,
    mediumSolved: data.mediumSolved ?? 0,
    totalMedium: data.totalMedium ?? FALLBACK_LEETCODE_STATS.totalMedium,
    hardSolved: data.hardSolved ?? 0,
    totalHard: data.totalHard ?? FALLBACK_LEETCODE_STATS.totalHard,
    ranking: data.ranking ?? null,
    badges: FALLBACK_LEETCODE_STATS.badges,
    totalActiveDays: calendarMetrics.activeDays,
    maxStreak: calendarMetrics.maxStreak,
    currentStreak: calendarMetrics.maxStreak,
    totalSubmissions: calendarMetrics.totalSubmissions,
    submissionCalendar,
    recentSubmissions: recent,
    isLive: true,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchLeetCodeStats(
  username = "gopal-maddheshiya",
): Promise<LeetCodeStatsResponse> {
  const normalizedUser = username.trim() || "gopal-maddheshiya";
  const now = Date.now();
  const cached = statsCache.get(normalizedUser);
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  // 1. Try FaisalShohag proxy
  try {
    const result = await fetchFromFaisalShohag(normalizedUser);
    statsCache.set(normalizedUser, { data: result, fetchedAt: now });
    return result;
  } catch (faisalErr: unknown) {
    const msg = faisalErr instanceof Error ? faisalErr.message : "error";
    console.log(`[LeetCode] FaisalShohag proxy unavailable (${msg}), trying Alfa proxy...`);
  }

  // 2. Try Alfa LeetCode proxy
  try {
    const result = await fetchFromAlfaLeetCode(normalizedUser);
    statsCache.set(normalizedUser, { data: result, fetchedAt: now });
    return result;
  } catch (alfaErr: unknown) {
    const msg = alfaErr instanceof Error ? alfaErr.message : "error";
    console.log(`[LeetCode] Alfa proxy unavailable (${msg}), trying GraphQL...`);
  }

  // 3. Try official LeetCode GraphQL
  try {
    const result = await fetchFromLeetCodeGraphQL(normalizedUser);
    statsCache.set(normalizedUser, { data: result, fetchedAt: now });
    return result;
  } catch (graphqlErr: unknown) {
    const msg = graphqlErr instanceof Error ? graphqlErr.message : "error";
    console.log(`[LeetCode] LeetCode GraphQL unavailable (${msg}).`);
  }

  // 4. Return stale cache for this username if available
  if (cached) {
    return { ...cached.data, isLive: false };
  }

  // 5. Offline resilience fallback
  return {
    ...FALLBACK_LEETCODE_STATS,
    username: normalizedUser,
    isLive: false,
    updatedAt: new Date().toISOString(),
  };
}
