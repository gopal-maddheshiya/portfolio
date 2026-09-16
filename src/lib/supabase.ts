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
  dsaInfo: typeof DSA_INFO;
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
    },
    dsaInfo: {
      ...DEFAULT_PORTFOLIO_DATA.dsaInfo,
      ...pickObject<Partial<PortfolioData["dsaInfo"]>>("dsaInfo"),
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

/**
 * Fetch portfolio data from Supabase, falling back to local constants.
 */
export async function fetchPortfolioData(): Promise<PortfolioData> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("content, updated_at")
      .eq("id", RECORD_ID)
      .maybeSingle();

    if (error) {
      console.warn("Supabase fetch warning (using local fallback):", error.message);
      return DEFAULT_PORTFOLIO_DATA;
    }

    if (data && data.content) {
      return parsePortfolioContent(data.content, data.updated_at);
    }
  } catch (err) {
    console.warn("Network / Supabase error (using local fallback):", err);
  }

  return DEFAULT_PORTFOLIO_DATA;
}

/**
 * Save / Upsert portfolio data to Supabase.
 */
export async function savePortfolioData(
  content: PortfolioData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from(TABLE_NAME).upsert(
      {
        id: RECORD_ID,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save portfolio data";
    return { success: false, error: msg };
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
