import { createClient } from "@supabase/supabase-js";
import { compressImageToWebP, type CompressionResult } from "@/lib/image-compress";
import { FAQS, type FAQItem } from "@/data/faq";
import {
  ABOUT_DATA,
  ACADEMIC_GALLERY,
  CERTIFICATIONS,
  CODING_PROFILES,
  CONTACT_DATA,
  DEFAULT_SECTION_HEADERS,
  DSA_INFO,
  EDUCATION,
  FOCUS_AREAS,
  HERO_DATA,
  HIGHLIGHTS,
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
  type EditableSectionKey,
  type EducationItem,
  type HeroData,
  type HighlightItem,
  type PersonalInfo,
  type Project,
  type ResumeCTAData,
  type SectionHeadersMap,
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
  featuredSkills?: string[] | undefined;
  projects: Project[];
  dsaInfo: DsaInfo;
  codingProfiles: CodingProfile[];
  education: EducationItem[];
  certifications: Certification[];
  academicGallery: AcademicMediaItem[];
  faqs: FAQItem[];
  resumeCTA: ResumeCTAData;
  contactData: ContactData;
  sectionHeaders?: SectionHeadersMap | undefined;
  updatedAt?: string | undefined;
}

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  personalInfo: PERSONAL_INFO,
  heroData: HERO_DATA,
  aboutData: ABOUT_DATA,
  highlights: HIGHLIGHTS,
  focusAreas: FOCUS_AREAS,
  skillGroups: SKILL_GROUPS,
  featuredSkills: [],
  projects: PROJECTS,
  dsaInfo: DSA_INFO,
  codingProfiles: CODING_PROFILES,
  education: EDUCATION,
  certifications: CERTIFICATIONS,
  academicGallery: ACADEMIC_GALLERY,
  faqs: FAQS,
  resumeCTA: RESUME_CTA_DATA,
  contactData: CONTACT_DATA,
  sectionHeaders: DEFAULT_SECTION_HEADERS,
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
  const personalInfoRaw = pickObject<Partial<PortfolioData["personalInfo"]>>("personalInfo");

  return {
    ...DEFAULT_PORTFOLIO_DATA,
    personalInfo: {
      ...DEFAULT_PORTFOLIO_DATA.personalInfo,
      ...personalInfoRaw,
      googleSiteVerification:
        personalInfoRaw.googleSiteVerification?.trim() ||
        DEFAULT_PORTFOLIO_DATA.personalInfo.googleSiteVerification,
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
    featuredSkills: pickArray<string>("featuredSkills", []),
    sectionHeaders: (() => {
      const rawHeaders = pickObject<Record<string, unknown>>("sectionHeaders");
      const merged: SectionHeadersMap = {};
      (Object.keys(DEFAULT_SECTION_HEADERS) as EditableSectionKey[]).forEach((key) => {
        const custom = rawHeaders[key];
        const customObj =
          custom !== null && typeof custom === "object" && !Array.isArray(custom)
            ? (custom as Record<string, unknown>)
            : {};
        merged[key] = {
          eyebrow:
            typeof customObj["eyebrow"] === "string"
              ? customObj["eyebrow"]
              : DEFAULT_SECTION_HEADERS[key].eyebrow,
          title:
            typeof customObj["title"] === "string"
              ? customObj["title"]
              : DEFAULT_SECTION_HEADERS[key].title,
          description:
            typeof customObj["description"] === "string"
              ? customObj["description"]
              : DEFAULT_SECTION_HEADERS[key].description,
        };
      });
      return merged;
    })(),
    projects: pickArray<PortfolioData["projects"][number]>(
      "projects",
      DEFAULT_PORTFOLIO_DATA.projects,
    ).map((proj) => {
      const matchingDefault = DEFAULT_PORTFOLIO_DATA.projects.find(
        (d) => d.title.toLowerCase() === proj.title?.toLowerCase(),
      );
      if (!matchingDefault) return proj;
      return {
        ...proj,
        role: proj.role !== undefined ? proj.role : matchingDefault.role,
        architecture:
          proj.architecture !== undefined ? proj.architecture : matchingDefault.architecture,
        challenges: proj.challenges !== undefined ? proj.challenges : matchingDefault.challenges,
        impact: proj.impact !== undefined ? proj.impact : matchingDefault.impact,
      };
    }),
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
    ).map((prof) => {
      const matchingDefault = DEFAULT_PORTFOLIO_DATA.codingProfiles.find(
        (d) => d.name.toLowerCase() === prof.name?.toLowerCase(),
      );
      if (!matchingDefault) return prof;
      return {
        ...prof,
        highlight: prof.highlight !== undefined ? prof.highlight : matchingDefault.highlight,
      };
    }),
    education: pickArray<PortfolioData["education"][number]>(
      "education",
      DEFAULT_PORTFOLIO_DATA.education,
    ),
    certifications: pickArray<PortfolioData["certifications"][number]>(
      "certifications",
      DEFAULT_PORTFOLIO_DATA.certifications,
    ).map((cert) => {
      const matchingDefault = DEFAULT_PORTFOLIO_DATA.certifications.find(
        (d) => d.title.toLowerCase() === cert.title?.toLowerCase(),
      );
      if (!matchingDefault) return cert;
      return {
        ...cert,
        category: cert.category !== undefined ? cert.category : matchingDefault.category,
        featured: cert.featured !== undefined ? cert.featured : matchingDefault.featured,
      };
    }),
    academicGallery: pickArray<PortfolioData["academicGallery"][number]>(
      "academicGallery",
      DEFAULT_PORTFOLIO_DATA.academicGallery,
    ).map((item) => {
      const matchingDefault = DEFAULT_PORTFOLIO_DATA.academicGallery.find(
        (d) => d.id === item.id || d.title.toLowerCase() === item.title?.toLowerCase(),
      );
      if (!matchingDefault) return item;
      return {
        ...item,
        featured: item.featured !== undefined ? item.featured : matchingDefault.featured,
      };
    }),
    faqs: pickArray<FAQItem>("faqs", DEFAULT_PORTFOLIO_DATA.faqs),
    ...(resolvedUpdatedAt ? { updatedAt: resolvedUpdatedAt } : {}),
  };
}

const LEGACY_STORAGE_KEY = "gopal_portfolio_content_v1";
const ADMIN_DRAFT_STORAGE_KEY = "gopal_portfolio_admin_draft_v1";

/** Remove deprecated full-cache key so stale localStorage never overrides live data on `/`. */
export function clearLegacyPublicCache(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

/** Retrieve an unsaved or offline Admin draft stored in browser localStorage. */
export function getAdminDraftPortfolioData(): PortfolioData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { dirty?: boolean; updatedAt?: string; data?: unknown };
    if (!parsed || !parsed.dirty || !parsed.data) return null;
    return parsePortfolioContent(
      parsed.data,
      typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined,
    );
  } catch (e) {
    console.warn("Failed to read Admin draft from localStorage:", e);
    return null;
  }
}

/** Persist pending Admin edits locally so reloads inside /admin never lose unsaved work. */
export function setAdminDraftPortfolioData(data: PortfolioData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ADMIN_DRAFT_STORAGE_KEY,
      JSON.stringify({ dirty: true, updatedAt: new Date().toISOString(), data }),
    );
  } catch (e) {
    console.warn("Failed to write Admin draft to localStorage:", e);
  }
}

/** Clear pending Admin draft once changes are saved live or reset. */
export function clearAdminDraftPortfolioData(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ADMIN_DRAFT_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

let cachedPortfolioData: PortfolioData | null = null;
let lastPortfolioFetchTime = 0;
const PORTFOLIO_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes in-memory cache

export function invalidatePortfolioCache(): void {
  cachedPortfolioData = null;
  lastPortfolioFetchTime = 0;
}

/**
 * Fetch portfolio data from Supabase (authoritative live source) with safe fallbacks.
 * Only hydrates unsaved Admin drafts when active inside `/admin`.
 */
export async function fetchPortfolioData(forceFresh = false): Promise<PortfolioData> {
  const now = Date.now();
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) clearLegacyPublicCache();

  const isAdminRoute = isBrowser && window.location.pathname.startsWith("/admin");
  const draftData = isAdminRoute ? getAdminDraftPortfolioData() : null;

  if (!forceFresh && cachedPortfolioData && now - lastPortfolioFetchTime < PORTFOLIO_CACHE_TTL_MS) {
    return draftData || cachedPortfolioData;
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("content, updated_at")
      .eq("id", RECORD_ID)
      .maybeSingle();

    if (error) {
      console.warn("Supabase fetch warning (using fallback cache):", error.message);
      const fallback = draftData || cachedPortfolioData || DEFAULT_PORTFOLIO_DATA;
      cachedPortfolioData = fallback;
      return fallback;
    }

    if (data && data.content) {
      const remoteParsed = parsePortfolioContent(data.content, data.updated_at);
      cachedPortfolioData = remoteParsed;
      lastPortfolioFetchTime = now;

      if (draftData) {
        return draftData;
      }
      return remoteParsed;
    }
  } catch (err) {
    console.warn("Network / Supabase error (using fallback):", err);
  }

  const fallback = draftData || cachedPortfolioData || DEFAULT_PORTFOLIO_DATA;
  cachedPortfolioData = fallback;
  return fallback;
}

/**
 * Save / Upsert portfolio data directly to Supabase.
 * Clears Admin draft on success so public routes never serve stale localStorage overrides.
 */
export async function savePortfolioData(
  content: PortfolioData,
): Promise<{ success: boolean; error?: string; savedLocally?: boolean }> {
  const updatedAt = new Date().toISOString();
  const dataToPersist: PortfolioData = { ...content, updatedAt };

  cachedPortfolioData = dataToPersist;
  lastPortfolioFetchTime = Date.now();

  try {
    try {
      const { data: sessData } = await supabase.auth.getSession();
      if (!sessData?.session) {
        await supabase.auth.refreshSession();
      }
    } catch {
      // Continue to try upsert
    }

    const { error } = await supabase.from(TABLE_NAME).upsert(
      {
        id: RECORD_ID,
        content: dataToPersist,
        updated_at: updatedAt,
      },
      { onConflict: "id" },
    );

    if (error) {
      console.warn("Supabase upsert warning (kept in Admin draft):", error.message);
      setAdminDraftPortfolioData(dataToPersist);
      return { success: false, error: error.message, savedLocally: true };
    }

    clearAdminDraftPortfolioData();
    clearLegacyPublicCache();
    return { success: true, savedLocally: false };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save to cloud";
    console.warn("Supabase save exception (kept in Admin draft):", msg);
    setAdminDraftPortfolioData(dataToPersist);
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

export interface ImageUploadResponse {
  url?: string;
  error?: string;
  originalSize?: number;
  compressedSize?: number;
  savingsPercent?: number;
  converted?: boolean;
}

/**
 * Upload an image to Supabase Storage bucket 'portfolio-media'.
 * Automatically compresses oversized images (PNG/JPEG/etc.) into optimized WebP format client-side.
 */
export async function uploadPortfolioImage(
  file: File,
  folder = "projects",
  compressionOptions?: { maxWidth?: number; maxHeight?: number; quality?: number },
): Promise<ImageUploadResponse> {
  let fileToUpload = file;
  let compressionResult: CompressionResult | null = null;

  try {
    if (typeof window !== "undefined") {
      compressionResult = await compressImageToWebP(file, compressionOptions);
      fileToUpload = compressionResult.file;
    }
  } catch (compressErr) {
    console.warn("Client compression skipped, uploading original file:", compressErr);
  }

  const uploadRes = await uploadPortfolioFile(fileToUpload, folder);

  return {
    ...uploadRes,
    originalSize: compressionResult?.originalSize ?? file.size,
    compressedSize: compressionResult?.compressedSize ?? fileToUpload.size,
    savingsPercent: compressionResult?.savingsPercent ?? 0,
    converted: compressionResult?.converted ?? false,
  };
}
