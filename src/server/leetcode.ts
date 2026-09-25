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

// Known difficulty dictionary for popular & user-practiced LeetCode problems
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
};

// Default fallback data matching Gopal's verified LeetCode profile
export const FALLBACK_STATS: LeetCodeStatsResponse = {
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

// In-memory cache for fast response and avoiding LeetCode rate limits (3-minute TTL)
let cachedStats: LeetCodeStatsResponse | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 3 * 60 * 1000;

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

  const total = acSubmissions.find((s) => s.difficulty === "All")?.count ?? 54;
  const easy = acSubmissions.find((s) => s.difficulty === "Easy")?.count ?? 30;
  const medium = acSubmissions.find((s) => s.difficulty === "Medium")?.count ?? 22;
  const hard = acSubmissions.find((s) => s.difficulty === "Hard")?.count ?? 2;
  const ranking = matchedUser.profile?.ranking ?? 2633618;

  const totalQ = allQuestions.find((q) => q.difficulty === "All")?.count ?? 4060;
  const totalE = allQuestions.find((q) => q.difficulty === "Easy")?.count ?? 966;
  const totalM = allQuestions.find((q) => q.difficulty === "Medium")?.count ?? 2117;
  const totalH = allQuestions.find((q) => q.difficulty === "Hard")?.count ?? 977;

  const badges = matchedUser.badges?.length ? matchedUser.badges : FALLBACK_STATS.badges;

  const calendarJson = matchedUser.userCalendar?.submissionCalendar;
  let submissionCalendar: Record<string, number> = FALLBACK_STATS.submissionCalendar;
  let totalSubmissions = 93;

  if (calendarJson) {
    try {
      submissionCalendar = JSON.parse(calendarJson) as Record<string, number>;
      totalSubmissions = Object.values(submissionCalendar).reduce((a, b) => a + b, 0);
    } catch {
      submissionCalendar = FALLBACK_STATS.submissionCalendar;
    }
  }

  const totalActiveDays = matchedUser.userCalendar?.totalActiveDays ?? 70;
  const streakVal = matchedUser.userCalendar?.streak ?? 61;
  const maxStreak = Math.max(streakVal, 61);
  const currentStreak = streakVal;

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
    currentStreak,
    totalSubmissions,
    submissionCalendar,
    recentSubmissions: uniqueRecent.length > 0 ? uniqueRecent : FALLBACK_STATS.recentSubmissions,
    isLive: true,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Strategy 2: Fetch via high-availability Alfa LeetCode proxy
 */
async function fetchFromAlfaLeetCode(username: string): Promise<LeetCodeStatsResponse> {
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

  const badgesData =
    badgesRes && badgesRes.ok ? ((await badgesRes.json()) as { badges?: LeetCodeBadge[] }) : null;
  const calendarData =
    calendarRes && calendarRes.ok
      ? ((await calendarRes.json()) as {
          totalActiveDays?: number;
          streak?: number;
          submissionCalendar?: string;
        })
      : null;
  const subsData =
    subsRes && subsRes.ok
      ? ((await subsRes.json()) as {
          submission?: Array<{
            title: string;
            titleSlug: string;
            lang?: string;
            timestamp: string | number;
          }>;
        })
      : null;

  let submissionCalendar = FALLBACK_STATS.submissionCalendar;
  let totalSubmissions = 93;

  if (calendarData?.submissionCalendar) {
    try {
      submissionCalendar = JSON.parse(calendarData.submissionCalendar) as Record<string, number>;
      totalSubmissions = Object.values(submissionCalendar).reduce((a, b) => a + b, 0);
    } catch {
      submissionCalendar = FALLBACK_STATS.submissionCalendar;
    }
  }

  const badges = badgesData?.badges?.length ? badgesData.badges : FALLBACK_STATS.badges;

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
    recentSubmissions: uniqueRecent.length > 0 ? uniqueRecent : FALLBACK_STATS.recentSubmissions,
    isLive: true,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Strategy 3: Fetch via Faisal Shohag LeetCode Vercel proxy
 */
async function fetchFromFaisalShohag(username: string): Promise<LeetCodeStatsResponse> {
  const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`, {
    signal: AbortSignal.timeout(6000),
  });

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

  const total = data.totalSolved ?? 54;
  const easy = data.easySolved ?? 30;
  const medium = data.mediumSolved ?? 22;
  const hard = data.hardSolved ?? 2;

  let submissionCalendar = FALLBACK_STATS.submissionCalendar;
  let totalSubmissions = 93;
  if (data.submissionCalendar && typeof data.submissionCalendar === "object") {
    submissionCalendar = data.submissionCalendar;
    totalSubmissions = Object.values(submissionCalendar).reduce((a, b) => a + b, 0);
  }

  const rawRecent = data.recentSubmissions || [];
  const seen = new Set<string>();
  const recent: Array<{
    title: string;
    titleSlug: string;
    lang: string;
    timestamp: string;
    difficulty?: "Easy" | "Medium" | "Hard";
  }> = [];

  for (const s of rawRecent) {
    if (!seen.has(s.title)) {
      seen.add(s.title);
      recent.push({
        title: s.title,
        titleSlug: s.titleSlug,
        lang: s.lang || "java",
        timestamp: String(s.timestamp),
        difficulty: KNOWN_DIFFICULTIES[s.titleSlug] || "Easy",
      });
    }
    if (recent.length >= 4) break;
  }

  return {
    success: true,
    username,
    totalSolved: total,
    totalQuestions: data.totalQuestions ?? 4060,
    easySolved: easy,
    totalEasy: data.totalEasy ?? 966,
    mediumSolved: medium,
    totalMedium: data.totalMedium ?? 2117,
    hardSolved: hard,
    totalHard: data.totalHard ?? 977,
    ranking: data.ranking ?? 2633618,
    badges: FALLBACK_STATS.badges,
    totalActiveDays: FALLBACK_STATS.totalActiveDays,
    maxStreak: 61,
    currentStreak: 61,
    totalSubmissions,
    submissionCalendar,
    recentSubmissions: recent.length > 0 ? recent : FALLBACK_STATS.recentSubmissions,
    isLive: true,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchLeetCodeStats(
  username = "gopal-maddheshiya",
): Promise<LeetCodeStatsResponse> {
  const now = Date.now();
  if (cachedStats && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedStats;
  }

  // 1. Try official LeetCode GraphQL
  try {
    const result = await fetchFromLeetCodeGraphQL(username);
    cachedStats = result;
    lastFetchTime = now;
    return result;
  } catch (graphqlErr) {
    console.warn("LeetCode GraphQL error, attempting Alfa proxy:", graphqlErr);
  }

  // 2. Try Alfa LeetCode proxy
  try {
    const result = await fetchFromAlfaLeetCode(username);
    cachedStats = result;
    lastFetchTime = now;
    return result;
  } catch (alfaErr) {
    console.warn("Alfa proxy error, attempting FaisalShohag proxy:", alfaErr);
  }

  // 3. Try FaisalShohag proxy
  try {
    const result = await fetchFromFaisalShohag(username);
    cachedStats = result;
    lastFetchTime = now;
    return result;
  } catch (faisalErr) {
    console.warn("FaisalShohag proxy error:", faisalErr);
  }

  // 4. Return cached stats if available
  if (cachedStats) {
    return cachedStats;
  }

  // 5. Ultimate fallback
  return {
    ...FALLBACK_STATS,
    updatedAt: new Date().toISOString(),
  };
}
