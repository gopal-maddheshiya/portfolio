import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  ExternalLink,
  LogOut,
  User,
  BookOpen,
  Briefcase,
  Layers,
  Code2,
  Award,
  Sparkles,
  Mail,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  Globe,
  FileText,
  Clock,
  GraduationCap,
  Image as ImageIcon,
  Camera,
  Video,
  Play,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import defaultProfilePhoto from "@/assets/gopal-profile.jpg";
import { usePortfolio } from "@/context/PortfolioContext";
import { uploadPortfolioFile, uploadPortfolioImage } from "@/lib/supabase";
import {
  ABOUT_DATA,
  CONTACT_DATA,
  HERO_DATA,
  RESUME_CTA_DATA,
  type Project,
  type Certification,
  type AcademicMediaItem,
  type JourneyMilestone,
  type EducationItem,
  type SkillGroup,
} from "@/data/profile";

interface AdminDashboardProps {
  onSignOut: () => void;
  userEmail: string;
}

type TabType =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "dsa"
  | "certifications"
  | "gallery"
  | "journey"
  | "contact";

export function AdminDashboard({ onSignOut, userEmail }: AdminDashboardProps) {
  const { data, updateData, saveData, resetToDefaults, isSaving } = usePortfolio();
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState<boolean>(false);
  const [uploadingResume, setUploadingResume] = useState<boolean>(false);
  const [uploadingCertIndex, setUploadingCertIndex] = useState<number | null>(null);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null);
  const [uploadingGalleryThumbIndex, setUploadingGalleryThumbIndex] = useState<number | null>(null);

  // Safe accessors with fallbacks
  const info = data.personalInfo;
  const currentProfilePhoto =
    info.profilePhoto &&
    (info.profilePhoto.startsWith("http://") ||
      info.profilePhoto.startsWith("https://") ||
      info.profilePhoto.startsWith("data:"))
      ? info.profilePhoto
      : defaultProfilePhoto;
  const hero = data.heroData || HERO_DATA;
  const about = data.aboutData || ABOUT_DATA;
  const cta = data.resumeCTA || RESUME_CTA_DATA;
  const contact = data.contactData || CONTACT_DATA;

  // Helper for uploading profile avatar
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingProfilePhoto(true);
      toast.info("Uploading profile photo to Supabase Storage...");
      const res = await uploadPortfolioImage(file, "profile");
      if (res.url) {
        updateData({
          personalInfo: { ...info, profilePhoto: res.url },
        });
        toast.success("Profile photo uploaded! Remember to click 'Save Live'.");
      } else {
        toast.error(`Upload error: ${res.error || "Failed"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  // Helper for uploading resume PDF document
  const handleResumePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingResume(true);
      toast.info("Uploading resume PDF to Supabase Storage...");
      const res = await uploadPortfolioFile(file, "resumes");
      if (res.url) {
        updateData({
          personalInfo: { ...info, resume: res.url },
        });
        toast.success("Resume PDF uploaded successfully! Click 'Save Live' to publish.");
      } else {
        toast.error(`Upload error: ${res.error || "Failed to upload resume PDF"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Resume upload failed";
      toast.error(msg);
    } finally {
      setUploadingResume(false);
    }
  };

  // Helper for uploading project image
  const handleProjectImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(index);
      toast.info("Uploading project image to Supabase Storage...");
      const res = await uploadPortfolioImage(file, "projects");
      if (res.url) {
        const existing = data.projects[index];
        if (existing) {
          const updatedProjects = [...data.projects];
          updatedProjects[index] = { ...existing, image: res.url };
          updateData({ projects: updatedProjects });
          toast.success("Project screenshot uploaded! Click 'Save Live' to persist.");
        }
      } else {
        toast.error(`Upload error: ${res.error || "Failed"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploadingIndex(null);
    }
  };

  // Helper for uploading certificate PDF or image
  const handleCertFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCertIndex(index);
      toast.info("Uploading certificate file to Supabase Storage...");
      const res = await uploadPortfolioFile(file, "certificates");
      if (res.url) {
        const existing = data.certifications[index];
        if (existing) {
          const updatedCerts = [...data.certifications];
          updatedCerts[index] = { ...existing, certificateUrl: res.url };
          updateData({ certifications: updatedCerts });
          toast.success("Certificate uploaded! Click 'Save Live' to persist.");
        }
      } else {
        toast.error(`Upload error: ${res.error || "Failed to upload certificate"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Certificate upload failed";
      toast.error(msg);
    } finally {
      setUploadingCertIndex(null);
    }
  };

  // ---------------- PROJECT HELPERS ----------------
  const handleAddProject = () => {
    const newProject: Project = {
      title: "New Flagship Project",
      year: new Date().getFullYear().toString(),
      category: "Full-Stack Web",
      summary: "Description of the project, architecture and impact.",
      problem: "Key problem solved by this project.",
      technologies: ["React.js", "Node.js", "MongoDB", "Tailwind CSS"],
      features: ["Core feature 1", "Core feature 2", "Responsive UI"],
      githubUrl: "https://github.com/gopal-maddheshiya",
      liveUrl: "",
      featured: false,
    };
    updateData({ projects: [newProject, ...data.projects] });
    toast.success("New project card added at top! Fill in its details.");
  };

  const handleDeleteProject = (index: number) => {
    if (confirm(`Are you sure you want to delete "${data.projects[index]?.title}"?`)) {
      const updated = data.projects.filter((_, i) => i !== index);
      updateData({ projects: updated });
      toast.info("Project removed.");
    }
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.projects.length) return;
    const itemA = data.projects[index];
    const itemB = data.projects[targetIndex];
    if (itemA && itemB) {
      const updated = [...data.projects];
      updated[index] = itemB;
      updated[targetIndex] = itemA;
      updateData({ projects: updated });
    }
  };

  // ---------------- CERTIFICATION HELPERS ----------------
  const handleAddCertification = () => {
    const newCert: Certification = {
      title: "New Certificate / Contest",
      org: "Issuing Organization",
      period: "2026",
      detail: "Description of skills verified and contest performance.",
      skills: ["Problem Solving", "Java"],
      certificateUrl: "",
    };
    updateData({ certifications: [newCert, ...data.certifications] });
  };

  const handleDeleteCertification = (index: number) => {
    const updated = data.certifications.filter((_, i) => i !== index);
    updateData({ certifications: updated });
  };

  // ---------------- ACADEMIC GALLERY HELPERS ----------------
  const handleAddGalleryItem = () => {
    const newItem: AcademicMediaItem = {
      id: crypto.randomUUID(),
      title: "New Academic Milestone / Event",
      caption: "Details about this milestone, event, problem solved, or context.",
      type: "image",
      url: "",
      thumbnailUrl: "",
      category: "College Event",
      date: new Date().getFullYear().toString(),
    };
    updateData({ academicGallery: [newItem, ...(data.academicGallery || [])] });
    toast.success("New media card added at the top! Upload image/video and fill details.");
  };

  const handleDeleteGalleryItem = (index: number) => {
    const item = (data.academicGallery || [])[index];
    if (confirm(`Are you sure you want to delete "${item?.title || "this media item"}"?`)) {
      const updated = (data.academicGallery || []).filter((_, i) => i !== index);
      updateData({ academicGallery: updated });
      toast.info("Media item removed.");
    }
  };

  const handleMoveGalleryItem = (index: number, direction: "up" | "down") => {
    const list = data.academicGallery || [];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const itemA = list[index];
    const itemB = list[targetIndex];
    if (itemA && itemB) {
      const updated = [...list];
      updated[index] = itemB;
      updated[targetIndex] = itemA;
      updateData({ academicGallery: updated });
    }
  };

  const handleGalleryMediaUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGalleryIndex(index);
      toast.info("Uploading media file to Supabase Storage...");
      const res = await uploadPortfolioFile(file, "gallery");
      if (res.url) {
        const list = data.academicGallery || [];
        const existing = list[index];
        if (existing) {
          const updated = [...list];
          updated[index] = { ...existing, url: res.url };
          updateData({ academicGallery: updated });
          toast.success("Media file uploaded! Remember to click 'Save Live'.");
        }
      } else {
        toast.error(`Upload error: ${res.error || "Failed to upload media file"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploadingGalleryIndex(null);
    }
  };

  const handleGalleryThumbnailUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGalleryThumbIndex(index);
      toast.info("Uploading thumbnail to Supabase Storage...");
      const res = await uploadPortfolioImage(file, "gallery-thumbnails");
      if (res.url) {
        const list = data.academicGallery || [];
        const existing = list[index];
        if (existing) {
          const updated = [...list];
          updated[index] = { ...existing, thumbnailUrl: res.url };
          updateData({ academicGallery: updated });
          toast.success("Video thumbnail uploaded!");
        }
      } else {
        toast.error(`Upload error: ${res.error || "Failed to upload thumbnail"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Thumbnail upload failed";
      toast.error(msg);
    } finally {
      setUploadingGalleryThumbIndex(null);
    }
  };

  // ---------------- SKILL HELPERS ----------------
  const handleAddSkillGroup = () => {
    const newGroup: SkillGroup = {
      title: "New Tech Category",
      skills: ["Skill 1", "Skill 2"],
      primary: false,
    };
    updateData({ skillGroups: [...data.skillGroups, newGroup] });
  };

  const handleDeleteSkillGroup = (index: number) => {
    const updated = data.skillGroups.filter((_, i) => i !== index);
    updateData({ skillGroups: updated });
  };

  // ---------------- EDUCATION HELPERS ----------------
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      title: "Degree / Diploma",
      org: "University / Institute Name",
      period: "2024 – 2028",
      detail: "CGPA / Percentage",
    };
    updateData({ education: [...data.education, newEdu] });
  };

  const handleDeleteEducation = (index: number) => {
    const updated = data.education.filter((_, i) => i !== index);
    updateData({ education: updated });
  };

  // ---------------- JOURNEY HELPERS ----------------
  const handleAddMilestone = () => {
    const phaseNum = (data.journey.length + 1).toString().padStart(2, "0");
    const newMilestone: JourneyMilestone = {
      phase: phaseNum,
      title: "New Learning Milestone",
      detail: "Details of topics mastered, projects completed, and concepts applied.",
      status: "next",
      tags: ["Topic 1", "Topic 2"],
    };
    updateData({ journey: [...data.journey, newMilestone] });
  };

  const handleDeleteMilestone = (index: number) => {
    const updated = data.journey.filter((_, i) => i !== index);
    updateData({ journey: updated });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {/* 1. TOP STICKY APP HEADER */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-base shadow-sm ring-2 ring-primary/20">
                G
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-base tracking-tight text-foreground">
                    Portfolio Studio
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Cloud Sync
                  </span>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Admin: <span className="font-mono text-foreground font-medium">{userEmail}</span>
                </p>
              </div>
            </div>

            {/* Mobile-only Logout button */}
            <button
              onClick={onSignOut}
              title="Sign Out"
              className="sm:hidden p-2 rounded-lg border border-border bg-surface text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </div>

          {/* Global Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-card hover:bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
            >
              <ExternalLink className="size-3.5 text-primary" />
              <span>Preview Site</span>
            </a>

            <button
              onClick={() => resetToDefaults()}
              title="Reset to local profile defaults"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              onClick={() => saveData()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 px-5 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Save className="size-4" />
              )}
              <span>{isSaving ? "Saving Live..." : "Save Live"}</span>
            </button>

            <button
              onClick={onSignOut}
              title="Sign Out"
              className="hidden sm:inline-flex items-center justify-center rounded-lg border border-border bg-card hover:bg-destructive/10 p-2 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. STICKY SUB-HEADER: UNIFIED SECTION TABS */}
      <nav className="sticky top-[57px] sm:top-[61px] z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-8 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => setActiveTab("hero")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "hero"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <User className="size-4" />
            <span>1. Hero &amp; Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "about"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <BookOpen className="size-4" />
            <span>2. About &amp; Education</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "projects"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <Briefcase className="size-4" />
            <span>3. Projects</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "projects"
                  ? "bg-white/20 text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {data.projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "skills"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <Layers className="size-4" />
            <span>4. Skills &amp; Stack</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "skills"
                  ? "bg-white/20 text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {data.skillGroups.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("dsa")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "dsa"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <Code2 className="size-4" />
            <span>5. DSA &amp; Profiles</span>
          </button>

          <button
            onClick={() => setActiveTab("certifications")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "certifications"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <Award className="size-4" />
            <span>6. Certificates</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "certifications"
                  ? "bg-white/20 text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {data.certifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "gallery"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <Camera className="size-4" />
            <span>7. Academic Media &amp; Gallery</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "gallery"
                  ? "bg-white/20 text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {(data.academicGallery || []).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("journey")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "journey"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <Sparkles className="size-4" />
            <span>8. Highlights &amp; Journey</span>
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "contact"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <Mail className="size-4" />
            <span>9. Contact &amp; Footer</span>
          </button>
        </div>
      </nav>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 sm:mt-8">
        {/* ---------------- TAB 1: HERO & PROFILE ---------------- */}
        {activeTab === "hero" && (
          <div className="space-y-6 max-w-4xl">
            {/* Hero Main */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <User className="size-5 text-primary" />
                  Hero Headline, Typewriter &amp; Greeting
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure primary identity, headline badges, rotating typewriter roles, and
                  contact info.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={info.name}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, name: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Primary Role / Title
                  </label>
                  <input
                    type="text"
                    value={info.role}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, role: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Greeting Pill Badge
                  </label>
                  <input
                    type="text"
                    placeholder="Hi, I'm Gopal Maddheshiya"
                    value={hero.greetingBadge || ""}
                    onChange={(e) =>
                      updateData({ heroData: { ...hero, greetingBadge: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Headline Prefix
                  </label>
                  <input
                    type="text"
                    placeholder="Building software as a"
                    value={hero.headlinePrefix || ""}
                    onChange={(e) =>
                      updateData({ heroData: { ...hero, headlinePrefix: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Typewriter Rotating Roles (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={(hero.typewriterRoles || []).join(", ")}
                    onChange={(e) =>
                      updateData({
                        heroData: {
                          ...hero,
                          typewriterRoles: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={info.subtitle}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, subtitle: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Bio / Site Description
                  </label>
                  <textarea
                    rows={3}
                    value={info.siteDescription}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, siteDescription: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-2xs min-h-[90px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Top-Left Floating Chip
                  </label>
                  <input
                    type="text"
                    placeholder="Java • DSA"
                    value={hero.floatingBadge1 || ""}
                    onChange={(e) =>
                      updateData({ heroData: { ...hero, floatingBadge1: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Bottom-Right Floating Chip
                  </label>
                  <input
                    type="text"
                    placeholder="Full-Stack"
                    value={hero.floatingBadge2 || ""}
                    onChange={(e) =>
                      updateData({ heroData: { ...hero, floatingBadge2: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Status Badge Text
                  </label>
                  <input
                    type="text"
                    placeholder="Online"
                    value={hero.availabilityStatus || ""}
                    onChange={(e) =>
                      updateData({ heroData: { ...hero, availabilityStatus: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={info.location}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, location: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={info.email}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, email: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={info.phone}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, phone: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    WhatsApp (Digits with Country Code)
                  </label>
                  <input
                    type="text"
                    placeholder="916388354988"
                    value={info.whatsapp || ""}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, whatsapp: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Profile Photo (Hero Picture) with Live Preview & Recommended Specs */}
                <div className="sm:col-span-2 rounded-2xl border-2 border-border/80 bg-surface/50 p-5 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-border/60 pb-2.5">
                    <label className="block text-sm font-bold text-foreground">
                      Hero Profile Photo (Homepage Main Avatar)
                    </label>
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      Recommended: 4:5 Portrait or 1:1 Square
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                    {/* Live Thumbnail Preview */}
                    <div className="relative w-28 h-36 rounded-2xl overflow-hidden border-2 border-border bg-card shrink-0 shadow-sm ring-2 ring-primary/20 flex items-center justify-center">
                      <img
                        src={currentProfilePhoto}
                        alt="Current Homepage Profile Preview"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = defaultProfilePhoto;
                        }}
                        className="w-full h-full object-cover object-[center_18%]"
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] font-semibold text-white">
                        Live Preview
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                        <input
                          type="text"
                          placeholder="Image URL or upload from device"
                          value={info.profilePhoto || ""}
                          onChange={(e) =>
                            updateData({ personalInfo: { ...info, profilePhoto: e.target.value } })
                          }
                          className="flex-1 w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                        />
                        <label className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs font-semibold text-primary-foreground cursor-pointer transition-all shrink-0 shadow-sm">
                          <Upload className="size-4" />
                          <span>{uploadingProfilePhoto ? "Uploading..." : "Upload New Photo"}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            className="hidden"
                            disabled={uploadingProfilePhoto}
                            onChange={handleProfilePhotoUpload}
                          />
                        </label>
                      </div>

                      {/* Dimensions & Sizing Guidelines Box */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground font-mono">
                        <div className="bg-card rounded-lg border border-border p-2">
                          <span className="text-[10px] text-muted-foreground block uppercase font-sans font-bold">
                            Aspect Ratio
                          </span>
                          <strong className="text-foreground">4:5 or 1:1</strong>
                        </div>
                        <div className="bg-card rounded-lg border border-border p-2">
                          <span className="text-[10px] text-muted-foreground block uppercase font-sans font-bold">
                            Ideal Resolution
                          </span>
                          <strong className="text-foreground">800 × 1000 px</strong>
                        </div>
                        <div className="bg-card rounded-lg border border-border p-2">
                          <span className="text-[10px] text-muted-foreground block uppercase font-sans font-bold">
                            Supported Formats
                          </span>
                          <strong className="text-foreground">JPG, PNG, WEBP</strong>
                        </div>
                        <div className="bg-card rounded-lg border border-border p-2">
                          <span className="text-[10px] text-muted-foreground block uppercase font-sans font-bold">
                            Max File Size
                          </span>
                          <strong className="text-foreground">&lt; 5 MB</strong>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        💡 <strong>Photo Tip:</strong> For best look on both desktop and mobile,
                        upload a portrait photo where your face and shoulders are well-centered.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resume PDF Upload & URL */}
                <div className="sm:col-span-2 rounded-2xl border-2 border-border/80 bg-surface/50 p-5 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-border/60 pb-2.5">
                    <label className="block text-sm font-bold text-foreground">
                      Resume PDF Document (Universal Single Source)
                    </label>
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      Format: .PDF document
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="Resume URL (/gopal-cv.pdf or Supabase URL)"
                      value={info.resume || ""}
                      onChange={(e) =>
                        updateData({ personalInfo: { ...info, resume: e.target.value } })
                      }
                      className="flex-1 w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs font-semibold text-primary-foreground cursor-pointer transition-all shrink-0 shadow-sm">
                      <Upload className="size-4" />
                      <span>{uploadingResume ? "Uploading PDF..." : "Upload PDF Resume"}</span>
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        disabled={uploadingResume}
                        onChange={handleResumePdfUpload}
                      />
                    </label>
                    {info.resume && (
                      <a
                        href={info.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0 shadow-2xs"
                      >
                        <ExternalLink className="size-4" />
                        <span>View Current PDF</span>
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ℹ️ <strong>Universal Single Source of Truth:</strong> When you upload or update
                    your resume PDF here, it automatically syncs across the entire portfolio —
                    including the <strong>Hero "View Resume" button</strong>,{" "}
                    <strong>Desktop Navbar "Resume" button</strong>,{" "}
                    <strong>Mobile Menu "Download Resume" button</strong>,{" "}
                    <strong>Resume CTA Banner</strong>, and the{" "}
                    <strong>Ask Gopal AI Chat Assistant</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Globe className="size-5 text-primary" />
                  Social &amp; Coding Profile Links
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={info.github}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, github: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={info.linkedin}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, linkedin: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    LeetCode URL
                  </label>
                  <input
                    type="text"
                    value={info.leetcode}
                    onChange={(e) =>
                      updateData({ personalInfo: { ...info, leetcode: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: ABOUT & EDUCATION ---------------- */}
        {activeTab === "about" && (
          <div className="space-y-6 max-w-4xl">
            {/* About Headings & Story */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  About Section Headings &amp; Story
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update section intro, your software philosophy story paragraphs, and core values.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={about.eyebrow}
                    onChange={(e) =>
                      updateData({ aboutData: { ...about, eyebrow: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Main Heading
                  </label>
                  <input
                    type="text"
                    value={about.title}
                    onChange={(e) => updateData({ aboutData: { ...about, title: e.target.value } })}
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Section Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={about.description}
                    onChange={(e) =>
                      updateData({ aboutData: { ...about, description: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Story Card Title
                  </label>
                  <input
                    type="text"
                    value={about.storyTitle}
                    onChange={(e) =>
                      updateData({ aboutData: { ...about, storyTitle: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Story Paragraph 1
                  </label>
                  <textarea
                    rows={3}
                    value={about.storyParagraphs?.[0] || ""}
                    onChange={(e) => {
                      const updated = [...(about.storyParagraphs || [])];
                      updated[0] = e.target.value;
                      updateData({ aboutData: { ...about, storyParagraphs: updated } });
                    }}
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground focus:border-primary focus:outline-none min-h-[90px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Story Paragraph 2
                  </label>
                  <textarea
                    rows={3}
                    value={about.storyParagraphs?.[1] || ""}
                    onChange={(e) => {
                      const updated = [...(about.storyParagraphs || [])];
                      updated[1] = e.target.value;
                      updateData({ aboutData: { ...about, storyParagraphs: updated } });
                    }}
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground focus:border-primary focus:outline-none min-h-[90px]"
                  />
                </div>
              </div>
            </div>

            {/* Profile Snapshot Stats */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  Profile Snapshot Grid (Right Column Cards)
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Degree Title
                  </label>
                  <input
                    type="text"
                    value={about.snapshot?.degree || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...(about.snapshot || {}), degree: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    CGPA
                  </label>
                  <input
                    type="text"
                    value={about.snapshot?.cgpa || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...(about.snapshot || {}), cgpa: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    DSA Practice Count
                  </label>
                  <input
                    type="text"
                    value={about.snapshot?.dsaPractice || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...(about.snapshot || {}), dsaPractice: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Core Tech Stack
                  </label>
                  <input
                    type="text"
                    value={about.snapshot?.stack || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...(about.snapshot || {}), stack: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Graduating Batch
                  </label>
                  <input
                    type="text"
                    value={about.snapshot?.batch || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...(about.snapshot || {}), batch: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    University Name
                  </label>
                  <input
                    type="text"
                    value={about.snapshot?.university || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...(about.snapshot || {}), university: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Education Timeline */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <GraduationCap className="size-5 text-primary" />
                  Education Timeline ({data.education.length})
                </h2>
                <button
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-surface/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-primary">
                        Degree #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteEducation(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Degree Title
                        </label>
                        <input
                          type="text"
                          value={edu.title}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx] = { ...edu, title: e.target.value };
                            updateData({ education: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          University / Institute
                        </label>
                        <input
                          type="text"
                          value={edu.org}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx] = { ...edu, org: e.target.value };
                            updateData({ education: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Period (Years)
                        </label>
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx] = { ...edu, period: e.target.value };
                            updateData({ education: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          CGPA / Details
                        </label>
                        <input
                          type="text"
                          value={edu.detail}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx] = { ...edu, detail: e.target.value };
                            updateData({ education: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coursework & Focus Areas */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Layers className="size-5 text-primary" />
                  Academic Coursework &amp; Focus Area Tags
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Coursework Subjects (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={(about.coursework || []).join(", ")}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          coursework: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Engineering Focus Areas (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={(data.focusAreas || []).join(", ")}
                    onChange={(e) =>
                      updateData({
                        focusAreas: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: PROJECTS MANAGER ---------------- */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {/* Header + Add Project */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
                  <Briefcase className="size-6 text-primary" />
                  Projects Manager ({data.projects.length})
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Add, reorder, edit titles, problem statements, features, and upload live project
                  screenshots.
                </p>
              </div>
              <button
                onClick={handleAddProject}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="size-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Sizing & Image Specs Banner */}
            <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                  <ImageIcon className="size-4 text-primary" />
                  Project Screenshot Sizing Guidelines:
                </h3>
                <p className="text-xs text-muted-foreground">
                  Upload crisp, landscape screenshots of your live web apps or UI dashboards.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="rounded-lg bg-card border border-border px-2.5 py-1 text-foreground font-semibold">
                  📐 16:9 Landscape
                </span>
                <span className="rounded-lg bg-card border border-border px-2.5 py-1 text-foreground font-semibold">
                  🎯 1280 × 720 px / 1920 × 1080 px
                </span>
                <span className="rounded-lg bg-card border border-border px-2.5 py-1 text-foreground font-semibold">
                  🖼️ WebP / PNG / JPG
                </span>
                <span className="rounded-lg bg-card border border-border px-2.5 py-1 text-foreground font-semibold">
                  ⚡ &lt; 5 MB
                </span>
              </div>
            </div>

            {/* Project Cards List */}
            <div className="space-y-6">
              {data.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5 relative"
                >
                  {/* Card Header & Ordering Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-bold font-mono">
                        #{idx + 1}
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                        {project.title || "Untitled Project"}
                      </h3>
                      {project.featured && (
                        <span className="rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold px-2.5 py-0.5 border border-amber-500/20">
                          ★ Featured Flagship
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMoveProject(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up in List"
                        className="p-2 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        onClick={() => handleMoveProject(idx, "down")}
                        disabled={idx === data.projects.length - 1}
                        title="Move Down in List"
                        className="p-2 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(idx)}
                        title="Delete Project"
                        className="p-2 rounded-lg border border-border bg-card hover:bg-destructive/10 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, title: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Year
                      </label>
                      <input
                        type="text"
                        value={project.year}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, year: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Category Tag
                      </label>
                      <input
                        type="text"
                        value={project.category || ""}
                        placeholder="Full-Stack MERN, AI, Frontend"
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, category: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        GitHub Repo URL
                      </label>
                      <input
                        type="text"
                        value={project.githubUrl}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, githubUrl: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Live Demo URL
                      </label>
                      <input
                        type="text"
                        value={project.liveUrl || ""}
                        placeholder="https://..."
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, liveUrl: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Summary / Elevator Pitch
                      </label>
                      <textarea
                        rows={2}
                        value={project.summary}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, summary: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[70px]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Problem Statement &amp; Solution
                      </label>
                      <textarea
                        rows={2}
                        value={project.problem || ""}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, problem: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[70px]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Technologies (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={(project.technologies || []).join(", ")}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = {
                            ...project,
                            technologies: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Key Features (One feature per line)
                      </label>
                      <textarea
                        rows={3}
                        value={(project.features || []).join("\n")}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = {
                            ...project,
                            features: e.target.value
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-sans min-h-[80px]"
                      />
                    </div>

                    {/* Screenshot Image Upload & Live Preview Card */}
                    <div className="sm:col-span-3 rounded-2xl border-2 border-border/80 bg-surface/50 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-border/60 pb-2.5">
                        <label className="block text-sm font-bold text-foreground">
                          Project Screenshot / Cover Image
                        </label>
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          Recommended: 16:9 Landscape (1280 × 720 px)
                        </span>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-5 items-start">
                        {/* Live Image Preview Thumbnail */}
                        <div className="w-full sm:w-64 aspect-video rounded-xl border-2 border-border bg-card overflow-hidden shrink-0 shadow-xs relative flex items-center justify-center">
                          {project.image ? (
                            <>
                              <img
                                src={project.image}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 h-full w-full object-cover blur-sm opacity-25"
                              />
                              <img
                                src={project.image}
                                alt={project.title}
                                className="relative z-10 w-full h-full object-contain"
                              />
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                              <ImageIcon className="size-8 stroke-1 mb-1 opacity-50" />
                              <span className="text-[11px]">No image uploaded</span>
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex-1 space-y-3 w-full">
                          <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                            <input
                              type="text"
                              value={project.image || ""}
                              placeholder="Image URL or upload from device"
                              onChange={(e) => {
                                const updated = [...data.projects];
                                updated[idx] = { ...project, image: e.target.value };
                                updateData({ projects: updated });
                              }}
                              className="flex-1 w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                            />
                            <label className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs font-semibold text-primary-foreground cursor-pointer transition-all shrink-0 shadow-sm">
                              <Upload className="size-4" />
                              <span>
                                {uploadingIndex === idx ? "Uploading..." : "Upload Screenshot"}
                              </span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                className="hidden"
                                disabled={uploadingIndex === idx}
                                onChange={(e) => handleProjectImageUpload(idx, e)}
                              />
                            </label>
                            {project.image && (
                              <a
                                href={project.image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
                              >
                                <ExternalLink className="size-3.5" />
                                <span>Preview</span>
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Uploads screenshot directly to Supabase Storage bucket
                            (`portfolio-media/projects`).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Featured toggle */}
                    <div className="sm:col-span-3 flex items-center gap-2.5 pt-2">
                      <input
                        type="checkbox"
                        id={`featured-${idx}`}
                        checked={Boolean(project.featured)}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, featured: e.target.checked };
                          updateData({ projects: updated });
                        }}
                        className="rounded border-border text-primary focus:ring-primary size-4.5 cursor-pointer"
                      />
                      <label
                        htmlFor={`featured-${idx}`}
                        className="text-sm text-foreground font-semibold cursor-pointer"
                      >
                        Mark as Featured Flagship Project (Displayed with badge in Hero / Projects)
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: SKILLS & STACK ---------------- */}
        {activeTab === "skills" && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
                  <Layers className="size-6 text-primary" />
                  Skill Groups &amp; Tech Stack ({data.skillGroups.length})
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage technical skill categories and tag lists displayed in the Skills section.
                </p>
              </div>
              <button
                onClick={handleAddSkillGroup}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.skillGroups.map((group, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs font-mono font-bold text-primary">
                      Skill Category #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleDeleteSkillGroup(idx)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Category Title
                      </label>
                      <input
                        type="text"
                        value={group.title}
                        onChange={(e) => {
                          const updated = [...data.skillGroups];
                          updated[idx] = { ...group, title: e.target.value };
                          updateData({ skillGroups: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id={`primary-skill-${idx}`}
                        checked={group.primary}
                        onChange={(e) => {
                          const updated = [...data.skillGroups];
                          updated[idx] = { ...group, primary: e.target.checked };
                          updateData({ skillGroups: updated });
                        }}
                        className="rounded border-border text-primary size-4.5 cursor-pointer"
                      />
                      <label
                        htmlFor={`primary-skill-${idx}`}
                        className="text-xs text-foreground font-semibold cursor-pointer"
                      >
                        Highlight as Primary Category (Emphasized Card)
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Skills &amp; Frameworks (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={(group.skills || []).join(", ")}
                        onChange={(e) => {
                          const updated = [...data.skillGroups];
                          updated[idx] = {
                            ...group,
                            skills: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          };
                          updateData({ skillGroups: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 5: DSA & CODING PROFILES ---------------- */}
        {activeTab === "dsa" && (
          <div className="space-y-6 max-w-4xl">
            {/* DSA Section Config */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Code2 className="size-5 text-primary" />
                  DSA Problem Solving Configuration
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Problems Solved Badge Text
                  </label>
                  <input
                    type="text"
                    value={data.dsaInfo.problemsSolved}
                    onChange={(e) =>
                      updateData({
                        dsaInfo: { ...data.dsaInfo, problemsSolved: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Primary Problem Solving Language
                  </label>
                  <input
                    type="text"
                    value={data.dsaInfo.language}
                    onChange={(e) =>
                      updateData({
                        dsaInfo: { ...data.dsaInfo, language: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    GitHub DSA Repo Name
                  </label>
                  <input
                    type="text"
                    value={data.dsaInfo.repoName}
                    onChange={(e) =>
                      updateData({
                        dsaInfo: { ...data.dsaInfo, repoName: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    GitHub DSA Repo URL
                  </label>
                  <input
                    type="text"
                    value={data.dsaInfo.repoUrl}
                    onChange={(e) =>
                      updateData({
                        dsaInfo: { ...data.dsaInfo, repoUrl: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Coding Profiles Cards */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Globe className="size-5 text-primary" />
                  Competitive Coding Platform Profiles
                </h2>
              </div>

              <div className="space-y-4">
                {data.codingProfiles.map((prof, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-surface/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{prof.name} Profile</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                          Profile Link (URL)
                        </label>
                        <input
                          type="text"
                          value={prof.url}
                          onChange={(e) => {
                            const updated = [...data.codingProfiles];
                            updated[idx] = { ...prof, url: e.target.value };
                            updateData({ codingProfiles: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                          Username / Handle
                        </label>
                        <input
                          type="text"
                          value={prof.username}
                          onChange={(e) => {
                            const updated = [...data.codingProfiles];
                            updated[idx] = { ...prof, username: e.target.value };
                            updateData({ codingProfiles: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                          Description / Subtitle
                        </label>
                        <input
                          type="text"
                          value={prof.description}
                          onChange={(e) => {
                            const updated = [...data.codingProfiles];
                            updated[idx] = { ...prof, description: e.target.value };
                            updateData({ codingProfiles: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 6: CERTIFICATIONS ---------------- */}
        {activeTab === "certifications" && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
                  <Award className="size-6 text-primary" />
                  Certifications &amp; Contests ({data.certifications.length})
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Add or edit verified certifications, issuing universities, and credential PDF/URL
                  links.
                </p>
              </div>
              <button
                onClick={handleAddCertification}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add Certificate</span>
              </button>
            </div>

            {/* Sizing & Image Specs Banner */}
            <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  Certificate File Recommendations:
                </h3>
                <p className="text-xs text-muted-foreground">
                  Upload official Certificate PDFs or landscape screenshot badges.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="rounded-lg bg-card border border-border px-2.5 py-1 text-foreground font-semibold">
                  📄 PDF or Image
                </span>
                <span className="rounded-lg bg-card border border-border px-2.5 py-1 text-foreground font-semibold">
                  🎯 4:3 / 16:9 Landscape
                </span>
              </div>
            </div>

            <div className="space-y-5">
              {data.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs font-mono font-bold text-primary">
                      Certificate #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleDeleteCertification(idx)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, title: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Issuing Organization
                      </label>
                      <input
                        type="text"
                        value={cert.org}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, org: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Period / Date
                      </label>
                      <input
                        type="text"
                        value={cert.period}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, period: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Description / Impact
                      </label>
                      <textarea
                        rows={2}
                        value={cert.detail}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, detail: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[70px]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Skills Verified (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={(cert.skills || []).join(", ")}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = {
                            ...cert,
                            skills: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    {/* Certificate File Upload & Live Link */}
                    <div className="sm:col-span-2 rounded-xl border border-border bg-surface/50 p-4 space-y-3">
                      <label className="block text-xs font-bold text-foreground">
                        Certificate PDF / Image Document
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                        <input
                          type="text"
                          value={cert.certificateUrl || ""}
                          placeholder="/certificates/... or Supabase URL"
                          onChange={(e) => {
                            const updated = [...data.certifications];
                            updated[idx] = { ...cert, certificateUrl: e.target.value };
                            updateData({ certifications: updated });
                          }}
                          className="flex-1 w-full rounded-lg border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                        />
                        <label className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground cursor-pointer transition-all shrink-0 shadow-xs">
                          <Upload className="size-3.5" />
                          <span>{uploadingCertIndex === idx ? "Uploading..." : "Upload File"}</span>
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            className="hidden"
                            disabled={uploadingCertIndex === idx}
                            onChange={(e) => handleCertFileUpload(idx, e)}
                          />
                        </label>
                        {cert.certificateUrl && (
                          <a
                            href={cert.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
                          >
                            <ExternalLink className="size-3.5" />
                            <span>View</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 7: ACADEMIC MEDIA & GALLERY ---------------- */}
        {activeTab === "gallery" && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
                  <Camera className="size-6 text-primary" />
                  Academic Media &amp; Gallery ({(data.academicGallery || []).length})
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload and manage your university event photos, hackathon pictures, lab demo
                  videos, and context descriptions.
                </p>
              </div>
              <button
                onClick={handleAddGalleryItem}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="size-4" />
                <span>Add Photo / Video</span>
              </button>
            </div>

            {/* Feature Info Banner */}
            <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  Academic Media &amp; Context Details:
                </h3>
                <p className="text-xs text-muted-foreground">
                  Each photo/video includes a dedicated bottom context box explaining what it
                  relates to (event, team role, or achievement).
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="rounded-lg bg-card border border-border px-2.5 py-1 text-foreground font-semibold">
                  📸 JPG, PNG, WEBP
                </span>
                <span className="rounded-lg bg-card border border-border px-2.5 py-1 text-foreground font-semibold">
                  🎥 MP4, WEBM, YouTube
                </span>
              </div>
            </div>

            {/* Empty State when no items */}
            {!data.academicGallery || data.academicGallery.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border bg-card/60 p-10 text-center flex flex-col items-center justify-center space-y-3">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Camera className="size-6" />
                </div>
                <h3 className="font-display font-semibold text-base text-foreground">
                  No Academic Media Added Yet
                </h3>
                <p className="text-xs text-muted-foreground max-w-md">
                  Your portfolio gallery section is currently blank as requested. Click the button
                  below to add your first photo or video.
                </p>
                <button
                  onClick={handleAddGalleryItem}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>Add First Media Item</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {data.academicGallery.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-5"
                  >
                    {/* Item Top Row: Index, Move & Delete */}
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-primary">
                          Media Item #{idx + 1}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          {item.type === "video" ? (
                            <>
                              <Video className="size-3 text-red-500" /> Video
                            </>
                          ) : (
                            <>
                              <Camera className="size-3 text-primary" /> Photo
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMoveGalleryItem(idx, "up")}
                          disabled={idx === 0}
                          title="Move up"
                          className="p-1.5 rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveGalleryItem(idx, "down")}
                          disabled={idx === (data.academicGallery?.length || 1) - 1}
                          title="Move down"
                          className="p-1.5 rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryItem(idx)}
                          title="Delete media"
                          className="p-1.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Media Type Selector */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Media Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(data.academicGallery || [])];
                              updated[idx] = { ...item, type: "image" };
                              updateData({ academicGallery: updated });
                            }}
                            className={`inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer ${
                              item.type === "image"
                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                : "bg-card border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Camera className="size-3.5" />
                            <span>Photo / Image</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(data.academicGallery || [])];
                              updated[idx] = { ...item, type: "video" };
                              updateData({ academicGallery: updated });
                            }}
                            className={`inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer ${
                              item.type === "video"
                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                : "bg-card border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Video className="size-3.5" />
                            <span>Video / Demo</span>
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Milestone / Event Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          placeholder="e.g. Smart India Hackathon internal finals presentation"
                          onChange={(e) => {
                            const updated = [...(data.academicGallery || [])];
                            updated[idx] = { ...item, title: e.target.value };
                            updateData({ academicGallery: updated });
                          }}
                          className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      {/* Category Tag */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Category Tag
                        </label>
                        <input
                          type="text"
                          value={item.category || ""}
                          placeholder="Hackathon, College Event, Workshop, Lab Project, Campus"
                          onChange={(e) => {
                            const updated = [...(data.academicGallery || [])];
                            updated[idx] = { ...item, category: e.target.value };
                            updateData({ academicGallery: updated });
                          }}
                          className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      {/* Date / Period */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Date / Year
                        </label>
                        <input
                          type="text"
                          value={item.date || ""}
                          placeholder="e.g. Feb 2026 or 2025"
                          onChange={(e) => {
                            const updated = [...(data.academicGallery || [])];
                            updated[idx] = { ...item, date: e.target.value };
                            updateData({ academicGallery: updated });
                          }}
                          className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      {/* USER'S KEY REQUIREMENT: What this photo/video relates to */}
                      <div className="sm:col-span-2 rounded-xl border-2 border-primary/20 bg-primary/5 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Tag className="size-3.5 text-primary" />
                            <span>Photo / Video Bottom Note: "Related To &amp; Context"</span>
                          </label>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            Displayed on card bottom
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Write what this photo/video relates to (e.g. which project was
                          demonstrated, what problem was solved, team members involved, or
                          university contest details):
                        </p>
                        <textarea
                          rows={2}
                          value={item.caption || ""}
                          placeholder="e.g. Explaining the algorithmic pipeline during the university hackathon with CSE classmates; demonstrated live data structures optimization."
                          onChange={(e) => {
                            const updated = [...(data.academicGallery || [])];
                            updated[idx] = { ...item, caption: e.target.value };
                            updateData({ academicGallery: updated });
                          }}
                          className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[70px]"
                        />
                      </div>

                      {/* Media File Upload & Direct URL */}
                      <div className="sm:col-span-2 rounded-xl border border-border bg-surface/50 p-4 space-y-3">
                        <label className="block text-xs font-bold text-foreground">
                          {item.type === "video"
                            ? "Video File or Embed URL"
                            : "Photo Image File or Direct URL"}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                          <input
                            type="text"
                            value={item.url || ""}
                            placeholder={
                              item.type === "video"
                                ? "Supabase video URL, YouTube link, or MP4 URL"
                                : "/media/... or Supabase image URL"
                            }
                            onChange={(e) => {
                              const updated = [...(data.academicGallery || [])];
                              updated[idx] = { ...item, url: e.target.value };
                              updateData({ academicGallery: updated });
                            }}
                            className="flex-1 w-full rounded-lg border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                          />
                          <label className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground cursor-pointer transition-all shrink-0 shadow-xs">
                            <Upload className="size-3.5" />
                            <span>
                              {uploadingGalleryIndex === idx
                                ? "Uploading..."
                                : item.type === "video"
                                  ? "Upload Video"
                                  : "Upload Photo"}
                            </span>
                            <input
                              type="file"
                              accept={item.type === "video" ? "video/*" : "image/*"}
                              className="hidden"
                              disabled={uploadingGalleryIndex === idx}
                              onChange={(e) => handleGalleryMediaUpload(idx, e)}
                            />
                          </label>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            >
                              <ExternalLink className="size-3.5" />
                              <span>View</span>
                            </a>
                          )}
                        </div>

                        {/* Optional Video Thumbnail if type is video */}
                        {item.type === "video" && (
                          <div className="pt-2 border-t border-border/60">
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5">
                              Custom Video Poster / Thumbnail (Optional)
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                              <input
                                type="text"
                                value={item.thumbnailUrl || ""}
                                placeholder="Poster image URL for video card"
                                onChange={(e) => {
                                  const updated = [...(data.academicGallery || [])];
                                  updated[idx] = { ...item, thumbnailUrl: e.target.value };
                                  updateData({ academicGallery: updated });
                                }}
                                className="flex-1 w-full rounded-lg border border-border-strong bg-card px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                              />
                              <label className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3 py-1.5 text-xs font-medium text-foreground cursor-pointer transition-colors shrink-0">
                                <ImageIcon className="size-3.5 text-primary" />
                                <span>
                                  {uploadingGalleryThumbIndex === idx
                                    ? "Uploading..."
                                    : "Upload Poster"}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingGalleryThumbIndex === idx}
                                  onChange={(e) => handleGalleryThumbnailUpload(idx, e)}
                                />
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Live Visual Preview */}
                        {item.url && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-border bg-black/40 aspect-video max-w-sm relative flex items-center justify-center">
                            {item.type === "video" ? (
                              item.thumbnailUrl ? (
                                <img
                                  src={item.thumbnailUrl}
                                  alt={item.title}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <div className="text-center text-zinc-400 p-4 space-y-1">
                                  <Video className="size-8 mx-auto text-primary" />
                                  <p className="text-[11px] font-mono truncate max-w-xs">
                                    {item.url}
                                  </p>
                                </div>
                              )
                            ) : (
                              <img
                                src={item.url}
                                alt={item.title}
                                className="size-full object-cover"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB 8: JOURNEY & HIGHLIGHTS ---------------- */}
        {activeTab === "journey" && (
          <div className="space-y-6 max-w-4xl">
            {/* Top Highlights Stats Bar */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  Top Highlights Cards (Below Hero Section)
                </h2>
              </div>

              <div className="space-y-3">
                {data.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-surface/50 p-4 grid gap-3 sm:grid-cols-2"
                  >
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Highlight Label
                      </label>
                      <input
                        type="text"
                        value={hl.label}
                        onChange={(e) => {
                          const updated = [...data.highlights];
                          updated[idx] = { ...hl, label: e.target.value };
                          updateData({ highlights: updated });
                        }}
                        className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Detail Text
                      </label>
                      <input
                        type="text"
                        value={hl.detail}
                        onChange={(e) => {
                          const updated = [...data.highlights];
                          updated[idx] = { ...hl, detail: e.target.value };
                          updateData({ highlights: updated });
                        }}
                        className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Clock className="size-5 text-primary" />
                  Journey &amp; Milestone Phases ({data.journey.length})
                </h2>
                <button
                  onClick={handleAddMilestone}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.journey.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-surface/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-primary">
                        Phase {m.phase}
                      </span>
                      <button
                        onClick={() => handleDeleteMilestone(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Phase Code
                        </label>
                        <input
                          type="text"
                          value={m.phase}
                          onChange={(e) => {
                            const updated = [...data.journey];
                            updated[idx] = { ...m, phase: e.target.value };
                            updateData({ journey: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => {
                            const updated = [...data.journey];
                            updated[idx] = { ...m, title: e.target.value };
                            updateData({ journey: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Status
                        </label>
                        <select
                          value={m.status}
                          onChange={(e) => {
                            const updated = [...data.journey];
                            updated[idx] = {
                              ...m,
                              status: e.target.value as "done" | "active" | "next",
                            };
                            updateData({ journey: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none cursor-pointer"
                        >
                          <option value="done">Done (Completed)</option>
                          <option value="active">Active (In Progress)</option>
                          <option value="next">Next (Upcoming)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={m.detail}
                          onChange={(e) => {
                            const updated = [...data.journey];
                            updated[idx] = { ...m, detail: e.target.value };
                            updateData({ journey: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none min-h-[60px]"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Tags (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={(m.tags || []).join(", ")}
                          onChange={(e) => {
                            const updated = [...data.journey];
                            updated[idx] = {
                              ...m,
                              tags: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            };
                            updateData({ journey: updated });
                          }}
                          className="w-full rounded-md border border-border-strong bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 8: CONTACT, RESUME & FOOTER ---------------- */}
        {activeTab === "contact" && (
          <div className="space-y-6 max-w-4xl">
            {/* Contact Heading */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Mail className="size-5 text-primary" />
                  Contact Section Heading &amp; Text
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={contact.eyebrow}
                    onChange={(e) =>
                      updateData({ contactData: { ...contact, eyebrow: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={contact.title}
                    onChange={(e) =>
                      updateData({ contactData: { ...contact, title: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={contact.description}
                    onChange={(e) =>
                      updateData({ contactData: { ...contact, description: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[70px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Availability Notice Card (Right Column)
                  </label>
                  <input
                    type="text"
                    value={contact.availabilityNote || ""}
                    placeholder="Open to Summer 2026 SWE & Full-Stack Internships"
                    onChange={(e) =>
                      updateData({ contactData: { ...contact, availabilityNote: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Resume CTA Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
              <div className="border-b border-border pb-3">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  Resume CTA Banner (Above Contact Section)
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Eyebrow
                  </label>
                  <input
                    type="text"
                    value={cta.eyebrow}
                    onChange={(e) => updateData({ resumeCTA: { ...cta, eyebrow: e.target.value } })}
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={cta.title}
                    onChange={(e) => updateData({ resumeCTA: { ...cta, title: e.target.value } })}
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={cta.description}
                    onChange={(e) =>
                      updateData({ resumeCTA: { ...cta, description: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[70px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Pill Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={(cta.tags || []).join(", ")}
                    onChange={(e) =>
                      updateData({
                        resumeCTA: {
                          ...cta,
                          tags: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 rounded-xl border border-border bg-surface/50 p-4 space-y-3">
                  <label className="block text-xs font-bold text-foreground">
                    Attached Resume PDF File (Direct Upload &amp; Link)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="Resume URL (/gopal-cv.pdf or Supabase URL)"
                      value={info.resume || ""}
                      onChange={(e) =>
                        updateData({ personalInfo: { ...info, resume: e.target.value } })
                      }
                      className="flex-1 w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground cursor-pointer transition-all shrink-0 shadow-xs">
                      <Upload className="size-3.5" />
                      <span>{uploadingResume ? "Uploading PDF..." : "Upload New PDF Resume"}</span>
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        disabled={uploadingResume}
                        onChange={handleResumePdfUpload}
                      />
                    </label>
                    {info.resume && (
                      <a
                        href={info.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>View Current</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
