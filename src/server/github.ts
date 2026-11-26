import {
  computeGitHubCalendarMetrics,
  FALLBACK_GITHUB_STATS,
  type GitHubContributionDay,
  type GitHubContributionLevel,
  type GitHubLanguageStat,
  type GitHubRepoSummary,
  type GitHubStatsResponse,
} from "@/lib/github-shared";

interface CachedProfileMeta {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: GitHubLanguageStat[];
  recentRepos: GitHubRepoSummary[];
  fetchedAt: number;
}

interface CachedCalendar {
  totalContributions: number;
  activeDays: number;
  maxStreak: number;
  currentStreak: number;
  calendar: Record<string, GitHubContributionDay>;
  submissionCalendar: Record<string, number>;
  fetchedAt: number;
}

const CACHE_TTL_MS = 15 * 60 * 1000;
const profileCache = new Map<string, CachedProfileMeta>();
const calendarCache = new Map<string, CachedCalendar>();

function clampLevel(raw: number): GitHubContributionLevel {
  if (raw <= 0) return 0;
  if (raw === 1) return 1;
  if (raw === 2) return 2;
  if (raw === 3) return 3;
  return 4;
}

/** Parse GitHub's native `/users/{username}/contributions` HTML fragment into daily records. */
function parseContributionsHtml(html: string): {
  totalContributions: number;
  calendar: Record<string, GitHubContributionDay>;
} {
  const calendar: Record<string, GitHubContributionDay> = {};

  // Build tooltip id -> numeric count lookup (`No contributions...` -> 0, `7 contributions...` -> 7)
  const tipCounts = new Map<string, number>();
  const tipRegex = /for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]+)<\/tool-tip>/g;
  let tipMatch: RegExpExecArray | null;
  while ((tipMatch = tipRegex.exec(html)) !== null) {
    const id = tipMatch[1];
    const text = tipMatch[2]?.trim() || "";
    if (!id) continue;
    const numMatch = text.match(/^(\d+)\s+contribution/i);
    tipCounts.set(id, numMatch?.[1] ? Number(numMatch[1]) : 0);
  }

  // Parse calendar cells (handle any attribute ordering cleanly)
  const tdTagRegex = /<td\b[^>]*ContributionCalendar-day[^>]*>/g;
  let tagMatch: RegExpExecArray | null;
  while ((tagMatch = tdTagRegex.exec(html)) !== null) {
    const tag = tagMatch[0];
    const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    if (!date) continue;
    const id = tag.match(/id="(contribution-day-component-\d+-\d+)"/)?.[1];
    const rawLevel = Number(tag.match(/data-level="(\d+)"/)?.[1] ?? "0");
    const level = clampLevel(Number.isFinite(rawLevel) ? rawLevel : 0);
    const tipCount = id ? tipCounts.get(id) : undefined;
    const count = tipCount !== undefined ? tipCount : level > 0 ? level : 0;

    calendar[date] = { date, count, level };
  }

  const headingMatch = html.match(/([\d,]+)\s+contributions?\s+in/i);
  const parsedHeadingTotal = headingMatch?.[1] ? Number(headingMatch[1].replace(/,/g, "")) : NaN;

  const summed = Object.values(calendar).reduce((acc, d) => acc + d.count, 0);
  const totalContributions =
    Number.isFinite(parsedHeadingTotal) && parsedHeadingTotal >= 0 ? parsedHeadingTotal : summed;

  return { totalContributions, calendar };
}

async function fetchCalendarPeriod(username: string, period: string): Promise<CachedCalendar> {
  const cacheKey = `${username.toLowerCase()}::${period}`;
  const now = Date.now();
  const cached = calendarCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached;
  }

  const safeUser = encodeURIComponent(username);
  const yearNum = /^\d{4}$/.test(period) ? Number(period) : null;
  const endpoint = yearNum
    ? `https://github.com/users/${safeUser}/contributions?from=${yearNum}-01-01&to=${yearNum}-12-31`
    : `https://github.com/users/${safeUser}/contributions`;

  const res = await fetch(endpoint, {
    headers: {
      "User-Agent": "gopal-portfolio-ssr/1.0",
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    throw new Error(`GitHub contributions HTTP ${res.status}`);
  }

  const html = await res.text();
  const { totalContributions, calendar } = parseContributionsHtml(html);

  if (Object.keys(calendar).length === 0) {
    throw new Error("GitHub contributions returned empty calendar HTML");
  }

  const metrics = computeGitHubCalendarMetrics(calendar);
  const result: CachedCalendar = {
    totalContributions: totalContributions > 0 ? totalContributions : metrics.summedContributions,
    activeDays: metrics.activeDays,
    maxStreak: metrics.maxStreak,
    currentStreak: metrics.currentStreak,
    calendar,
    submissionCalendar: metrics.submissionCalendar,
    fetchedAt: now,
  };

  calendarCache.set(cacheKey, result);
  return result;
}

async function fetchProfileMeta(username: string): Promise<CachedProfileMeta> {
  const cacheKey = username.toLowerCase();
  const now = Date.now();
  const cached = profileCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached;
  }

  const safeUser = encodeURIComponent(username);
  const headers = {
    "User-Agent": "gopal-portfolio-ssr/1.0",
    Accept: "application/vnd.github+json",
  };

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${safeUser}`, {
      headers,
      signal: AbortSignal.timeout(5000),
    }),
    fetch(`https://api.github.com/users/${safeUser}/repos?per_page=100&sort=pushed`, {
      headers,
      signal: AbortSignal.timeout(5000),
    }),
  ]);

  if (!userRes.ok || !reposRes.ok) {
    throw new Error(`GitHub REST HTTP ${userRes.status}/${reposRes.status}`);
  }

  const userJson = (await userRes.json()) as {
    public_repos?: number;
    followers?: number;
  };
  const reposJson = (await reposRes.json()) as Array<{
    name?: string;
    html_url?: string;
    description?: string | null;
    language?: string | null;
    stargazers_count?: number;
    pushed_at?: string;
    fork?: boolean;
  }>;

  const ownRepos = Array.isArray(reposJson) ? reposJson.filter((r) => !r.fork) : [];
  const totalStars = Array.isArray(reposJson)
    ? reposJson.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0)
    : 0;

  const langCounts = new Map<string, number>();
  for (const r of ownRepos) {
    if (r.language) {
      langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
    }
  }

  const totalTyped = Array.from(langCounts.values()).reduce((a, b) => a + b, 0) || 1;
  const topLanguages: GitHubLanguageStat[] = Array.from(langCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.max(1, Math.round((count / totalTyped) * 100)),
    }));

  const recentRepos: GitHubRepoSummary[] = ownRepos.slice(0, 4).map((r) => ({
    name: r.name || "repository",
    url: r.html_url || `https://github.com/${username}`,
    description: r.description?.trim() || "Production repository and documented engineering code.",
    language: r.language || "TypeScript",
    stars: r.stargazers_count ?? 0,
    updatedAt: r.pushed_at || new Date().toISOString(),
  }));

  const meta: CachedProfileMeta = {
    publicRepos: userJson.public_repos ?? ownRepos.length,
    followers: userJson.followers ?? 0,
    totalStars,
    topLanguages: topLanguages.length > 0 ? topLanguages : FALLBACK_GITHUB_STATS.topLanguages,
    recentRepos: recentRepos.length > 0 ? recentRepos : FALLBACK_GITHUB_STATS.recentRepos,
    fetchedAt: now,
  };

  profileCache.set(cacheKey, meta);
  return meta;
}

/**
 * Fetches live GitHub contributions calendar & repository stats with independent 15m caching.
 */
export async function fetchGitHubStats(
  username = "gopal-maddheshiya",
  period = "Current",
): Promise<GitHubStatsResponse> {
  const normalizedUser = username.trim() || "gopal-maddheshiya";
  const normalizedPeriod = /^\d{4}$/.test(period.trim()) ? period.trim() : "Current";

  const [calOutcome, metaOutcome] = await Promise.allSettled([
    fetchCalendarPeriod(normalizedUser, normalizedPeriod),
    fetchProfileMeta(normalizedUser),
  ]);

  const staleCal = calendarCache.get(`${normalizedUser.toLowerCase()}::${normalizedPeriod}`);
  const staleMeta = profileCache.get(normalizedUser.toLowerCase());

  const cal = calOutcome.status === "fulfilled" ? calOutcome.value : staleCal;
  const meta = metaOutcome.status === "fulfilled" ? metaOutcome.value : staleMeta;

  if (!cal && !meta) {
    return {
      ...FALLBACK_GITHUB_STATS,
      username: normalizedUser,
      period: normalizedPeriod,
      isLive: false,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    success: true,
    username: normalizedUser,
    period: normalizedPeriod,
    totalContributions: cal?.totalContributions ?? FALLBACK_GITHUB_STATS.totalContributions,
    activeDays: cal?.activeDays ?? FALLBACK_GITHUB_STATS.activeDays,
    maxStreak: cal?.maxStreak ?? FALLBACK_GITHUB_STATS.maxStreak,
    currentStreak: cal?.currentStreak ?? FALLBACK_GITHUB_STATS.currentStreak,
    publicRepos: meta?.publicRepos ?? FALLBACK_GITHUB_STATS.publicRepos,
    followers: meta?.followers ?? FALLBACK_GITHUB_STATS.followers,
    totalStars: meta?.totalStars ?? FALLBACK_GITHUB_STATS.totalStars,
    topLanguages: meta?.topLanguages ?? FALLBACK_GITHUB_STATS.topLanguages,
    calendar: cal?.calendar ?? FALLBACK_GITHUB_STATS.calendar,
    submissionCalendar: cal?.submissionCalendar ?? FALLBACK_GITHUB_STATS.submissionCalendar,
    recentRepos: meta?.recentRepos ?? FALLBACK_GITHUB_STATS.recentRepos,
    isLive: calOutcome.status === "fulfilled",
    updatedAt: new Date().toISOString(),
  };
}
