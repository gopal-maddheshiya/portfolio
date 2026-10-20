import { createClient } from "@supabase/supabase-js";
import {
  ABOUT_DATA,
  ACADEMIC_GALLERY,
  CERTIFICATIONS,
  CODING_PROFILES,
  CONTACT_DATA,
  DSA_INFO,
  EDUCATION,
  FOCUS_AREAS,
  HERO_DATA,
  HIGHLIGHTS,
  JOURNEY,
  PERSONAL_INFO,
  PROJECTS,
  RESUME_CTA_DATA,
  SKILL_GROUPS,
  type AboutData,
  type AcademicMediaItem,
  type Certification,
  type CodingProfile,
  type ContactData,
  type DsaInfo,
  type EducationItem,
  type HeroData,
  type HighlightItem,
  type JourneyMilestone,
  type PersonalInfo,
  type Project,
  type ResumeCTAData,
  type SkillGroup,
} from "@/data/profile";

const supabaseUrl =
  (import.meta.env["VITE_SUPABASE_URL"] as string) || "https://rnchpivzlmjlvctjqitr.supabase.co";
const supabaseAnonKey =
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuY2hwaXZ6bG1qbHZjdGpxaXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNzgxNTcsImV4cCI6MjEwNDg1NDE1N30.sUfgvxrSRXStETpKrGEgMYDJvqR9kTTAsWnax8lyB-g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
    detectSessionInUrl: typeof window !== "undefined",
  },
});

export interface PortfolioData {
  personalInfo: PersonalInfo;
  heroData: HeroData;
  aboutData: AboutData;
  highlights: HighlightItem[];
  focusAreas: string[];
  skillGroups: SkillGroup[];
  projects: Project[];
  dsaInfo: DsaInfo;
  codingProfiles: CodingProfile[];
  journey: JourneyMilestone[];
  education: EducationItem[];
  certifications: Certification[];
  academicGallery: AcademicMediaItem[];
  resumeCTA: ResumeCTAData;
  contactData: ContactData;
  updatedAt?: string;
}

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  personalInfo: PERSONAL_INFO,
  heroData: HERO_DATA,
  aboutData: ABOUT_DATA,
  highlights: HIGHLIGHTS,
  focusAreas: FOCUS_AREAS,
  skillGroups: SKILL_GROUPS,
  projects: PROJECTS,
  dsaInfo: DSA_INFO,
  codingProfiles: CODING_PROFILES,
  journey: JOURNEY,
  education: EDUCATION,
  certifications: CERTIFICATIONS,
  academicGallery: ACADEMIC_GALLERY,
  resumeCTA: RESUME_CTA_DATA,
  contactData: CONTACT_DATA,
};

export const TABLE_NAME = "portfolio_data";
export const RECORD_ID = "gopal_portfolio";

/**
 * Parses raw JSON content into safe PortfolioData with defaults.
 */
export function parsePortfolioContent(rawContent: unknown, updatedAt?: string): PortfolioData {
  if (!rawContent || typeof rawContent !== "object") return DEFAULT_PORTFOLIO_DATA;

  const c = rawContent as Record<string, unknown>;

  const pickObject = <T>(key: string): T => {
    const value = c[key];
    return (value !== null && typeof value === "object" && !Array.isArray(value) ? value : {}) as T;
  };

  const pickArray = <T>(key: string, fallback: T[]): T[] => {
    return Array.isArray(c[key]) ? (c[key] as T[]) : fallback;
  };

  const resolvedUpdatedAt: string | undefined =
    updatedAt ?? (typeof c["updatedAt"] === "string" ? c["updatedAt"] : undefined);

  const aboutDataRaw = pickObject<Record<string, unknown>>("aboutData");
  const dsaInfoRaw = pickObject<Record<string, unknown>>("dsaInfo");

  return {
    ...DEFAULT_PORTFOLIO_DATA,
    personalInfo: {
      ...DEFAULT_PORTFOLIO_DATA.personalInfo,
      ...pickObject<Partial<PortfolioData["personalInfo"]>>("personalInfo"),
    },
    heroData: {
      ...DEFAULT_PORTFOLIO_DATA.heroData,
      ...pickObject<Partial<PortfolioData["heroData"]>>("heroData"),
    },
    aboutData: {
      ...DEFAULT_PORTFOLIO_DATA.aboutData,
      ...pickObject<Partial<PortfolioData["aboutData"]>>("aboutData"),
      snapshot: {
        ...DEFAULT_PORTFOLIO_DATA.aboutData.snapshot,
        ...pickObject<Partial<PortfolioData["aboutData"]["snapshot"]>>("snapshot"),
      },
      principles: Array.isArray(aboutDataRaw["principles"])
        ? (aboutDataRaw["principles"] as PortfolioData["aboutData"]["principles"])
        : DEFAULT_PORTFOLIO_DATA.aboutData.principles,
      coursework: Array.isArray(aboutDataRaw["coursework"])
        ? (aboutDataRaw["coursework"] as string[])
        : DEFAULT_PORTFOLIO_DATA.aboutData.coursework,
    },
    dsaInfo: {
      ...DEFAULT_PORTFOLIO_DATA.dsaInfo,
      ...pickObject<Partial<PortfolioData["dsaInfo"]>>("dsaInfo"),
      difficulty: Array.isArray(dsaInfoRaw["difficulty"])
        ? (dsaInfoRaw["difficulty"] as PortfolioData["dsaInfo"]["difficulty"])
        : DEFAULT_PORTFOLIO_DATA.dsaInfo.difficulty,
      topicBreakdown: Array.isArray(dsaInfoRaw["topicBreakdown"])
        ? (dsaInfoRaw["topicBreakdown"] as PortfolioData["dsaInfo"]["topicBreakdown"])
        : DEFAULT_PORTFOLIO_DATA.dsaInfo.topicBreakdown,
      topics: Array.isArray(dsaInfoRaw["topics"])
        ? (dsaInfoRaw["topics"] as string[])
        : DEFAULT_PORTFOLIO_DATA.dsaInfo.topics,
      notes: Array.isArray(dsaInfoRaw["notes"])
        ? (dsaInfoRaw["notes"] as string[])
        : DEFAULT_PORTFOLIO_DATA.dsaInfo.notes,
    },
    resumeCTA: {
      ...DEFAULT_PORTFOLIO_DATA.resumeCTA,
      ...pickObject<Partial<PortfolioData["resumeCTA"]>>("resumeCTA"),
    },
    contactData: {
      ...DEFAULT_PORTFOLIO_DATA.contactData,
      ...pickObject<Partial<PortfolioData["contactData"]>>("contactData"),
    },
    projects: pickArray<PortfolioData["projects"][number]>(
      "projects",
      DEFAULT_PORTFOLIO_DATA.projects,
    ),
    highlights: pickArray<PortfolioData["highlights"][number]>(
      "highlights",
      DEFAULT_PORTFOLIO_DATA.highlights,
    ),
    focusAreas: pickArray<PortfolioData["focusAreas"][number]>(
      "focusAreas",
      DEFAULT_PORTFOLIO_DATA.focusAreas,
    ),
    skillGroups: pickArray<PortfolioData["skillGroups"][number]>(
      "skillGroups",
      DEFAULT_PORTFOLIO_DATA.skillGroups,
    ),
    codingProfiles: pickArray<PortfolioData["codingProfiles"][number]>(
      "codingProfiles",
      DEFAULT_PORTFOLIO_DATA.codingProfiles,
    ),
    journey: pickArray<PortfolioData["journey"][number]>("journey", DEFAULT_PORTFOLIO_DATA.journey),
    education: pickArray<PortfolioData["education"][number]>(
      "education",
      DEFAULT_PORTFOLIO_DATA.education,
    ),
    certifications: pickArray<PortfolioData["certifications"][number]>(
      "certifications",
      DEFAULT_PORTFOLIO_DATA.certifications,
    ),
    academicGallery: pickArray<PortfolioData["academicGallery"][number]>(
      "academicGallery",
      DEFAULT_PORTFOLIO_DATA.academicGallery,
    ),
    ...(resolvedUpdatedAt ? { updatedAt: resolvedUpdatedAt } : {}),
  };
}

const LOCAL_STORAGE_KEY = "gopal_portfolio_content_v1";

/**
 * Retrieve portfolio data cached in browser localStorage.
 */
export function getLocalStoredPortfolioData(): PortfolioData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const parsedData = parsePortfolioContent(
      parsed,
      typeof parsed["updatedAt"] === "string" ? parsed["updatedAt"] : undefined,
    );
    return parsedData;
  } catch (e) {
    console.warn("Failed to read portfolio data from localStorage:", e);
    return null;
  }
}

/**
 * Persist portfolio data synchronously to browser localStorage.
 */
export function setLocalStoredPortfolioData(data: PortfolioData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to write portfolio data to localStorage:", e);
  }
}

let cachedPortfolioData: PortfolioData | null = null;
let lastPortfolioFetchTime = 0;
const PORTFOLIO_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes in-memory cache

function invalidatePortfolioCache() {
  cachedPortfolioData = null;
  lastPortfolioFetchTime = 0;
}

/**
 * Fetch portfolio data from Supabase or localStorage fallback.
 * Guarantees that newer local edits are never overwritten by stale database records.
 */
export async function fetchPortfolioData(forceFresh = false): Promise<PortfolioData> {
  const now = Date.now();
  const localData = getLocalStoredPortfolioData();

  if (!forceFresh && cachedPortfolioData && now - lastPortfolioFetchTime < PORTFOLIO_CACHE_TTL_MS) {
    // If local storage has an even newer version, prefer local storage
    if (localData?.updatedAt && cachedPortfolioData.updatedAt) {
      if (
        new Date(localData.updatedAt).getTime() > new Date(cachedPortfolioData.updatedAt).getTime()
      ) {
        cachedPortfolioData = localData;
      }
    }
    return cachedPortfolioData;
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("content, updated_at")
      .eq("id", RECORD_ID)
      .maybeSingle();

    if (error) {
      console.warn("Supabase fetch warning (using local/fallback cache):", error.message);
      const fallback = localData || cachedPortfolioData || DEFAULT_PORTFOLIO_DATA;
      cachedPortfolioData = fallback;
      return fallback;
    }

    if (data && data.content) {
      const remoteParsed = parsePortfolioContent(data.content, data.updated_at);

      // Conflict resolution: If local storage has a newer timestamp than Supabase,
      // preserve local edits and don't let stale remote data overwrite them!
      if (localData?.updatedAt && remoteParsed.updatedAt) {
        const localTime = new Date(localData.updatedAt).getTime();
        const remoteTime = new Date(remoteParsed.updatedAt).getTime();
        if (localTime > remoteTime) {
          console.log(
            "⚡ [Storage] LocalStorage has newer edits than remote DB. Preserving local edits.",
          );
          cachedPortfolioData = localData;
          lastPortfolioFetchTime = now;
          return localData;
        }
      }

      // Remote is up to date, sync to local storage & memory cache
      setLocalStoredPortfolioData(remoteParsed);
      cachedPortfolioData = remoteParsed;
      lastPortfolioFetchTime = now;
      return remoteParsed;
    }
  } catch (err) {
    console.warn("Network / Supabase error (using local fallback):", err);
  }

  const fallback = localData || cachedPortfolioData || DEFAULT_PORTFOLIO_DATA;
  cachedPortfolioData = fallback;
  return fallback;
}

/**
 * Save / Upsert portfolio data to both LocalStorage and Supabase.
 * Guarantees zero data loss even if network or session issues occur.
 */
export async function savePortfolioData(
  content: PortfolioData,
): Promise<{ success: boolean; error?: string; savedLocally?: boolean }> {
  const updatedAt = new Date().toISOString();
  const dataToPersist: PortfolioData = { ...content, updatedAt };

  // 1. Immediately persist to localStorage & in-memory cache for instant survival across reloads
  setLocalStoredPortfolioData(dataToPersist);
  cachedPortfolioData = dataToPersist;
  lastPortfolioFetchTime = Date.now();

  try {
    // 2. Refresh session if needed for Supabase RLS
    try {
      const { data: sessData } = await supabase.auth.getSession();
      if (!sessData?.session) {
        await supabase.auth.refreshSession();
      }
    } catch {
      // Continue to try upsert
    }

    // 3. Upsert to Supabase database table
    const { error } = await supabase.from(TABLE_NAME).upsert(
      {
        id: RECORD_ID,
        content: dataToPersist,
        updated_at: updatedAt,
      },
      { onConflict: "id" },
    );

    if (error) {
      console.warn("Supabase upsert warning (saved to localStorage):", error.message);
      return { success: false, error: error.message, savedLocally: true };
    }

    return { success: true, savedLocally: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save to cloud";
    console.warn("Supabase save exception (saved to localStorage):", msg);
    return { success: false, error: msg, savedLocally: true };
  }
}

/**
 * Upload a file (PDF resume, document, screenshot, photo) to Supabase Storage bucket 'portfolio-media'
 */
export async function uploadPortfolioFile(
  file: File,
  folder = "resumes",
): Promise<{ url?: string; error?: string }> {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${folder}/${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-media")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        ...(file.type ? { contentType: file.type } : {}),
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(fileName);
    return { url: data.publicUrl };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "File upload failed";
    return { error: msg };
  }
}

/**
 * Alias for uploading images to Supabase Storage bucket 'portfolio-media'
 */
export async function uploadPortfolioImage(
  file: File,
  folder = "projects",
): Promise<{ url?: string; error?: string }> {
  return uploadPortfolioFile(file, folder);
}
