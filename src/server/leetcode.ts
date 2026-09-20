export type LeetCodeBadge = {
  id?: string;
  name: string;
  displayName: string;
  icon: string;
  creationDate?: string;
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
  recentSubmissions: Array<{
    title: string;
    titleSlug: string;
    lang: string;
    timestamp: string;
    difficulty?: "Easy" | "Medium" | "Hard";
  }>;
  isLive: boolean;
  updatedAt: string;
};

// Default fallback data matching Gopal's official LeetCode profile
const FALLBACK_STATS: LeetCodeStatsResponse = {
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
  currentStreak: 61,
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
    {
      title: "Sqrt(x)",
      titleSlug: "sqrtx",
      lang: "java",
      timestamp: "1786815802",
      difficulty: "Easy",
    },
  ],
  isLive: false,
  updatedAt: new Date().toISOString(),
};

// In-memory cache for fast response and avoiding LeetCode rate limits (10-minute TTL)
let cachedStats: LeetCodeStatsResponse | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function fetchLeetCodeStats(
  username = "gopal-maddheshiya",
): Promise<LeetCodeStatsResponse> {
  const now = Date.now();
  if (cachedStats && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedStats;
  }

  try {
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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!res.ok) {
      throw new Error(`LeetCode API HTTP error: ${res.status}`);
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
    const acSubmissions = matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
    const allQuestions = data?.data?.allQuestionsCount || [];

    const total = acSubmissions.find((s) => s.difficulty === "All")?.count ?? 53;
    const easy = acSubmissions.find((s) => s.difficulty === "Easy")?.count ?? 29;
    const medium = acSubmissions.find((s) => s.difficulty === "Medium")?.count ?? 22;
    const hard = acSubmissions.find((s) => s.difficulty === "Hard")?.count ?? 2;
    const ranking = matchedUser?.profile?.ranking ?? 2613074;

    const totalQ = allQuestions.find((q) => q.difficulty === "All")?.count ?? 4055;
    const totalE = allQuestions.find((q) => q.difficulty === "Easy")?.count ?? 965;
    const totalM = allQuestions.find((q) => q.difficulty === "Medium")?.count ?? 2115;
    const totalH = allQuestions.find((q) => q.difficulty === "Hard")?.count ?? 975;

    // Badges
    const badges = matchedUser?.badges?.length ? matchedUser.badges : FALLBACK_STATS.badges;

    // Calendar
    const calendarJson = matchedUser?.userCalendar?.submissionCalendar;
    let submissionCalendar: Record<string, number> = FALLBACK_STATS.submissionCalendar;
    let totalSubmissions = 89;

    if (calendarJson) {
      try {
        submissionCalendar = JSON.parse(calendarJson) as Record<string, number>;
        totalSubmissions = Object.values(submissionCalendar).reduce((a, b) => a + b, 0);
      } catch {
        submissionCalendar = FALLBACK_STATS.submissionCalendar;
      }
    }

    const totalActiveDays = matchedUser?.userCalendar?.totalActiveDays ?? 69;
    const streakVal = matchedUser?.userCalendar?.streak ?? 61;
    const maxStreak = Math.max(streakVal, 61);
    const currentStreak = streakVal;

    // Difficulty dictionary for known/popular LeetCode problems
    const KNOWN_DIFFICULTIES: Record<string, "Easy" | "Medium" | "Hard"> = {
      "two-sum": "Easy",
      "word-search": "Medium",
      "valid-anagram": "Easy",
      sqrtx: "Easy",
      "reverse-linked-list": "Easy",
      "merge-two-sorted-lists": "Easy",
      "valid-parentheses": "Easy",
      "maximum-subarray": "Medium",
      "climbing-stairs": "Easy",
      "binary-search": "Easy",
      "search-in-rotated-sorted-array": "Medium",
      "3sum": "Medium",
      "container-with-most-water": "Medium",
      "trapping-rain-water": "Hard",
      "median-of-two-sorted-arrays": "Hard",
    };

    // Deduplicate recent submissions by title
    const rawRecent = data?.data?.recentAcSubmissionList || [];
    const seenTitles = new Set<string>();
    const uniqueRecent: Array<{
      title: string;
      titleSlug: string;
      lang: string;
      timestamp: string;
      difficulty?: "Easy" | "Medium" | "Hard";
    }> = [];

    for (const sub of rawRecent) {
      if (!seenTitles.has(sub.title)) {
        seenTitles.add(sub.title);
        uniqueRecent.push({
          title: sub.title,
          titleSlug: sub.titleSlug,
          lang: "java",
          timestamp: sub.timestamp,
          difficulty: KNOWN_DIFFICULTIES[sub.titleSlug] || "Easy",
        });
      }
      if (uniqueRecent.length >= 4) break;
    }

    const result: LeetCodeStatsResponse = {
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
      currentStreak,
      totalSubmissions,
      submissionCalendar,
      recentSubmissions: uniqueRecent.length > 0 ? uniqueRecent : FALLBACK_STATS.recentSubmissions,
      isLive: true,
      updatedAt: new Date().toISOString(),
    };

    cachedStats = result;
    lastFetchTime = now;
    return result;
  } catch (err) {
    console.error("Failed to fetch live LeetCode stats, using fallback:", err);
    if (cachedStats) {
      return cachedStats;
    }
    return {
      ...FALLBACK_STATS,
      updatedAt: new Date().toISOString(),
    };
  }
}
