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
  CheckCircle2,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Phone,
  FileText,
  Clock,
  Zap,
  Cpu,
  GraduationCap,
  Download,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { usePortfolio } from "@/context/PortfolioContext";
import { uploadPortfolioFile, uploadPortfolioImage } from "@/lib/supabase";
import {
  ABOUT_DATA,
  CONTACT_DATA,
  HERO_DATA,
  RESUME_CTA_DATA,
  type Project,
  type Certification,
  type CodingProfile,
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
  | "journey"
  | "contact";

export function AdminDashboard({ onSignOut, userEmail }: AdminDashboardProps) {
  const { data, updateData, saveData, resetToDefaults, isSaving } = usePortfolio();
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState<boolean>(false);
  const [uploadingResume, setUploadingResume] = useState<boolean>(false);
  const [uploadingCertIndex, setUploadingCertIndex] = useState<number | null>(null);

  // Safe accessors with fallbacks
  const info = data.personalInfo;
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
  const handleProjectImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
          toast.success("Image uploaded! Remember to click 'Save Live'.");
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
          toast.success("Certificate uploaded! Remember to click 'Save Live'.");
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
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-display font-bold border border-primary/20">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-sm sm:text-base">Portfolio Studio</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Ready
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Logged in as <span className="font-mono text-foreground">{userEmail}</span>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <ExternalLink className="size-3.5" />
            <span className="hidden sm:inline">Preview Site</span>
          </a>

          <button
            onClick={() => resetToDefaults()}
            title="Reset to local profile defaults"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => saveData()}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>{isSaving ? "Saving..." : "Save Live"}</span>
          </button>

          <button
            onClick={onSignOut}
            title="Sign Out"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface p-2 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="container-page mt-6">
        {/* Section Navigation Tabs (Mapped 1:1 with website sections) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border scrollbar-none">
          <button
            onClick={() => setActiveTab("hero")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "hero"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <User className="size-3.5" />
            <span>1. Hero &amp; Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "about"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <BookOpen className="size-3.5" />
            <span>2. About &amp; Education</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "projects"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Briefcase className="size-3.5" />
            <span>3. Projects ({data.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "skills"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Layers className="size-3.5" />
            <span>4. Skills &amp; Stack</span>
          </button>

          <button
            onClick={() => setActiveTab("dsa")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "dsa"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Code2 className="size-3.5" />
            <span>5. DSA &amp; Coding Profiles</span>
          </button>

          <button
            onClick={() => setActiveTab("certifications")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "certifications"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Award className="size-3.5" />
            <span>6. Certificates ({data.certifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("journey")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "journey"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Sparkles className="size-3.5" />
            <span>7. Highlights &amp; Journey</span>
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "contact"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Mail className="size-3.5" />
            <span>8. Contact &amp; Footer</span>
          </button>
        </div>

        {/* ---------------- TAB 1: HERO & PROFILE ---------------- */}
        {activeTab === "hero" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            {/* Hero Main */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <User className="size-4 text-primary" />
                Hero Headline, Typewriter &amp; Greeting
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    value={info.name}
                    onChange={(e) => updateData({ personalInfo: { ...info, name: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Primary Role / Title</label>
                  <input
                    type="text"
                    value={info.role}
                    onChange={(e) => updateData({ personalInfo: { ...info, role: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Greeting Pill Badge</label>
                  <input
                    type="text"
                    placeholder="Hi, I'm Gopal Maddheshiya"
                    value={hero.greetingBadge || ""}
                    onChange={(e) => updateData({ heroData: { ...hero, greetingBadge: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Headline Prefix</label>
                  <input
                    type="text"
                    placeholder="Building software as a"
                    value={hero.headlinePrefix || ""}
                    onChange={(e) => updateData({ heroData: { ...hero, headlinePrefix: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Typewriter Rotating Roles (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={(hero.typewriterRoles || []).join(", ")}
                    onChange={(e) =>
                      updateData({
                        heroData: {
                          ...hero,
                          typewriterRoles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={info.subtitle}
                    onChange={(e) => updateData({ personalInfo: { ...info, subtitle: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Bio / Site Description</label>
                  <textarea
                    rows={3}
                    value={info.siteDescription}
                    onChange={(e) => updateData({ personalInfo: { ...info, siteDescription: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Top-Left Floating Chip</label>
                  <input
                    type="text"
                    placeholder="Java • DSA"
                    value={hero.floatingBadge1 || ""}
                    onChange={(e) => updateData({ heroData: { ...hero, floatingBadge1: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Bottom-Right Floating Chip</label>
                  <input
                    type="text"
                    placeholder="Full-Stack"
                    value={hero.floatingBadge2 || ""}
                    onChange={(e) => updateData({ heroData: { ...hero, floatingBadge2: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Status Badge Text</label>
                  <input
                    type="text"
                    placeholder="Online"
                    value={hero.availabilityStatus || ""}
                    onChange={(e) => updateData({ heroData: { ...hero, availabilityStatus: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Location</label>
                  <input
                    type="text"
                    value={info.location}
                    onChange={(e) => updateData({ personalInfo: { ...info, location: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
                  <input
                    type="email"
                    value={info.email}
                    onChange={(e) => updateData({ personalInfo: { ...info, email: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={info.phone}
                    onChange={(e) => updateData({ personalInfo: { ...info, phone: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">WhatsApp (Digits with Country Code)</label>
                  <input
                    type="text"
                    placeholder="916388354988"
                    value={info.whatsapp || ""}
                    onChange={(e) => updateData({ personalInfo: { ...info, whatsapp: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Resume PDF Upload & URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Resume PDF Document (File Upload &amp; Link)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="Resume URL (/gopal-cv.pdf or Supabase URL)"
                      value={info.resume || ""}
                      onChange={(e) => updateData({ personalInfo: { ...info, resume: e.target.value } })}
                      className="flex-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary cursor-pointer transition-colors shrink-0">
                      <Upload className="size-3.5 text-primary" />
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
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>View PDF</span>
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Upload your latest resume PDF directly. It saves to Supabase Storage and connects with Hero "View Resume", Navbar "Resume", Resume CTA banner, and AI Chat Assistant.
                  </p>
                </div>

                {/* Profile Photo Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Profile Photo (Hero Picture)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="Image URL or upload below"
                      value={info.profilePhoto || ""}
                      onChange={(e) => updateData({ personalInfo: { ...info, profilePhoto: e.target.value } })}
                      className="flex-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary cursor-pointer transition-colors shrink-0">
                      <Upload className="size-3.5 text-primary" />
                      <span>{uploadingProfilePhoto ? "Uploading..." : "Upload New Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingProfilePhoto}
                        onChange={handleProfilePhotoUpload}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Uploads directly to your Supabase Storage bucket (`portfolio-media`).
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Globe className="size-4 text-primary" />
                Social Profiles
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={info.github}
                    onChange={(e) => updateData({ personalInfo: { ...info, github: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={info.linkedin}
                    onChange={(e) => updateData({ personalInfo: { ...info, linkedin: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">LeetCode URL</label>
                  <input
                    type="text"
                    value={info.leetcode}
                    onChange={(e) => updateData({ personalInfo: { ...info, leetcode: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: ABOUT & EDUCATION ---------------- */}
        {activeTab === "about" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            {/* About Headings & Story */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                About Section Heading &amp; Philosophy Story
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Eyebrow Tag</label>
                  <input
                    type="text"
                    value={about.eyebrow}
                    onChange={(e) => updateData({ aboutData: { ...about, eyebrow: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={about.title}
                    onChange={(e) => updateData({ aboutData: { ...about, title: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Section Subtitle / Description</label>
                  <input
                    type="text"
                    value={about.description}
                    onChange={(e) => updateData({ aboutData: { ...about, description: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Story Card Title</label>
                  <input
                    type="text"
                    value={about.storyTitle}
                    onChange={(e) => updateData({ aboutData: { ...about, storyTitle: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Story Paragraph 1</label>
                  <textarea
                    rows={3}
                    value={about.storyParagraphs?.[0] || ""}
                    onChange={(e) => {
                      const updated = [...(about.storyParagraphs || [])];
                      updated[0] = e.target.value;
                      updateData({ aboutData: { ...about, storyParagraphs: updated } });
                    }}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Story Paragraph 2</label>
                  <textarea
                    rows={3}
                    value={about.storyParagraphs?.[1] || ""}
                    onChange={(e) => {
                      const updated = [...(about.storyParagraphs || [])];
                      updated[1] = e.target.value;
                      updateData({ aboutData: { ...about, storyParagraphs: updated } });
                    }}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Profile Snapshot Stats */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Profile Snapshot Grid (Right Column Cards)
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Degree Title</label>
                  <input
                    type="text"
                    value={about.snapshot?.degree || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...about.snapshot, degree: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">CGPA / Score</label>
                  <input
                    type="text"
                    value={about.snapshot?.cgpa || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...about.snapshot, cgpa: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">DSA Practice Badge</label>
                  <input
                    type="text"
                    value={about.snapshot?.dsaPractice || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...about.snapshot, dsaPractice: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Primary Stack</label>
                  <input
                    type="text"
                    value={about.snapshot?.stack || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...about.snapshot, stack: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Graduation Batch</label>
                  <input
                    type="text"
                    value={about.snapshot?.batch || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...about.snapshot, batch: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">University / College</label>
                  <input
                    type="text"
                    value={about.snapshot?.university || ""}
                    onChange={(e) =>
                      updateData({
                        aboutData: {
                          ...about,
                          snapshot: { ...about.snapshot, university: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Education Timeline Manager */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                  <GraduationCap className="size-4 text-primary" />
                  Education Timeline ({data.education.length})
                </h2>
                <button
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-surface p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">Degree #{idx + 1}</span>
                      <button
                        onClick={() => handleDeleteEducation(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Degree Title</label>
                        <input
                          type="text"
                          value={edu.title}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx] = { ...edu, title: e.target.value };
                            updateData({ education: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Institution / School</label>
                        <input
                          type="text"
                          value={edu.org}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx] = { ...edu, org: e.target.value };
                            updateData({ education: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Period (Years)</label>
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx] = { ...edu, period: e.target.value };
                            updateData({ education: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Detail (CGPA / Score)</label>
                        <input
                          type="text"
                          value={edu.detail}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx] = { ...edu, detail: e.target.value };
                            updateData({ education: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coursework & Focus Areas */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Coursework &amp; Focus Areas Tags
              </h2>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Relevant Coursework (Comma separated)
                </label>
                <input
                  type="text"
                  value={(about.coursework || []).join(", ")}
                  onChange={(e) =>
                    updateData({
                      aboutData: {
                        ...about,
                        coursework: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Focus Areas Pills (Comma separated)
                </label>
                <input
                  type="text"
                  value={(data.focusAreas || []).join(", ")}
                  onChange={(e) =>
                    updateData({
                      focusAreas: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: PROJECTS MANAGER ---------------- */}
        {activeTab === "projects" && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">Projects Manager</h2>
                <p className="text-xs text-muted-foreground">
                  Add, reorder, edit summaries, problem statements, tech tags, or upload screenshot images.
                </p>
              </div>
              <button
                onClick={handleAddProject}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-soft hover:opacity-90 active:scale-[0.99] cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {data.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4 relative"
                >
                  {/* Card Header & Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                        {idx + 1}
                      </span>
                      <h3 className="font-display font-semibold text-sm sm:text-base text-foreground">
                        {project.title || "Untitled Project"}
                      </h3>
                      {project.featured && (
                        <span className="rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-semibold px-2 py-0.5 border border-amber-500/20">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveProject(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveProject(idx, "down")}
                        disabled={idx === data.projects.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(idx)}
                        title="Delete Project"
                        className="p-1.5 rounded-lg border border-border bg-surface text-muted-foreground hover:text-destructive hover:border-destructive/30 cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-foreground mb-1">Project Title</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, title: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Year</label>
                      <input
                        type="text"
                        value={project.year}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, year: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Category</label>
                      <input
                        type="text"
                        value={project.category || ""}
                        placeholder="Full-Stack MERN, Frontend, Cloud"
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, category: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={project.githubUrl}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, githubUrl: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={project.liveUrl || ""}
                        placeholder="https://..."
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, liveUrl: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-foreground mb-1">Summary / Pitch</label>
                      <textarea
                        rows={2}
                        value={project.summary}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, summary: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-foreground mb-1">Problem Statement</label>
                      <textarea
                        rows={2}
                        value={project.problem || ""}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, problem: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Technologies (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={(project.technologies || []).join(", ")}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = {
                            ...project,
                            technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Key Features (One feature per line)
                      </label>
                      <textarea
                        rows={3}
                        value={(project.features || []).join("\n")}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = {
                            ...project,
                            features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                          };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    {/* Screenshot image upload & URL */}
                    <div className="sm:col-span-3 pt-2">
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Project Screenshot Image
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <input
                          type="text"
                          value={project.image || ""}
                          placeholder="Image URL or upload from device"
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[idx] = { ...project, image: e.target.value };
                            updateData({ projects: updated });
                          }}
                          className="flex-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                        />
                        <label className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary cursor-pointer transition-colors shrink-0">
                          <Upload className="size-3.5 text-primary" />
                          <span>{uploadingIndex === idx ? "Uploading..." : "Upload Screenshot"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingIndex === idx}
                            onChange={(e) => handleProjectImageUpload(idx, e)}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Featured toggle */}
                    <div className="sm:col-span-3 flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id={`featured-${idx}`}
                        checked={Boolean(project.featured)}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, featured: e.target.checked };
                          updateData({ projects: updated });
                        }}
                        className="rounded border-border text-primary focus:ring-primary size-4"
                      />
                      <label htmlFor={`featured-${idx}`} className="text-xs text-foreground font-medium cursor-pointer">
                        Mark as Featured Flagship Project
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
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  Skill Groups &amp; Tech Stack
                </h2>
                <p className="text-xs text-muted-foreground">
                  Manage technical skill categories and tag lists displayed in the Skills section.
                </p>
              </div>
              <button
                onClick={handleAddSkillGroup}
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.skillGroups.map((group, idx) => (
                <div key={idx} className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">Category #{idx + 1}</span>
                    <button
                      onClick={() => handleDeleteSkillGroup(idx)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Category Title</label>
                      <input
                        type="text"
                        value={group.title}
                        onChange={(e) => {
                          const updated = [...data.skillGroups];
                          updated[idx] = { ...group, title: e.target.value };
                          updateData({ skillGroups: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
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
                        className="rounded border-border text-primary size-4"
                      />
                      <label htmlFor={`primary-skill-${idx}`} className="text-xs text-foreground font-medium">
                        Highlight as Primary Category
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Skills &amp; Frameworks (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={(group.skills || []).join(", ")}
                        onChange={(e) => {
                          const updated = [...data.skillGroups];
                          updated[idx] = {
                            ...group,
                            skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          };
                          updateData({ skillGroups: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
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
          <div className="mt-6 space-y-6 max-w-4xl">
            {/* DSA Section Config */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Code2 className="size-4 text-primary" />
                DSA Problem Solving Configuration
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Problems Solved Badge Text</label>
                  <input
                    type="text"
                    value={data.dsaInfo.problemsSolved}
                    onChange={(e) =>
                      updateData({
                        dsaInfo: { ...data.dsaInfo, problemsSolved: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Primary Problem Solving Language</label>
                  <input
                    type="text"
                    value={data.dsaInfo.language}
                    onChange={(e) =>
                      updateData({
                        dsaInfo: { ...data.dsaInfo, language: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">GitHub DSA Repo Name</label>
                  <input
                    type="text"
                    value={data.dsaInfo.repoName}
                    onChange={(e) =>
                      updateData({
                        dsaInfo: { ...data.dsaInfo, repoName: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">GitHub DSA Repo URL</label>
                  <input
                    type="text"
                    value={data.dsaInfo.repoUrl}
                    onChange={(e) =>
                      updateData({
                        dsaInfo: { ...data.dsaInfo, repoUrl: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Coding Profiles Cards */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Globe className="size-4 text-primary" />
                Competitive Coding Platform Profiles
              </h2>

              <div className="space-y-3">
                {data.codingProfiles.map((prof, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-surface p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{prof.name} Profile</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Profile Link (URL)</label>
                        <input
                          type="text"
                          value={prof.url}
                          onChange={(e) => {
                            const updated = [...data.codingProfiles];
                            updated[idx] = { ...prof, url: e.target.value };
                            updateData({ codingProfiles: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Username / Handle</label>
                        <input
                          type="text"
                          value={prof.username}
                          onChange={(e) => {
                            const updated = [...data.codingProfiles];
                            updated[idx] = { ...prof, username: e.target.value };
                            updateData({ codingProfiles: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-muted-foreground mb-1">Description / Subtitle</label>
                        <input
                          type="text"
                          value={prof.description}
                          onChange={(e) => {
                            const updated = [...data.codingProfiles];
                            updated[idx] = { ...prof, description: e.target.value };
                            updateData({ codingProfiles: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
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
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                  <Award className="size-4 text-primary" />
                  Certifications &amp; Contests ({data.certifications.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add or edit verified certifications, issuing universities, and credential links.
                </p>
              </div>
              <button
                onClick={handleAddCertification}
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add Certificate</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.certifications.map((cert, idx) => (
                <div key={idx} className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">Certificate #{idx + 1}</span>
                    <button
                      onClick={() => handleDeleteCertification(idx)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-foreground mb-1">Title</label>
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, title: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Issuing Organization</label>
                      <input
                        type="text"
                        value={cert.org}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, org: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Period / Date</label>
                      <input
                        type="text"
                        value={cert.period}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, period: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-foreground mb-1">Description / Impact</label>
                      <textarea
                        rows={2}
                        value={cert.detail}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, detail: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Skills Verified (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={(cert.skills || []).join(", ")}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = {
                            ...cert,
                            skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Certificate PDF / Image Document
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <input
                          type="text"
                          value={cert.certificateUrl || ""}
                          placeholder="/certificates/... or Supabase URL"
                          onChange={(e) => {
                            const updated = [...data.certifications];
                            updated[idx] = { ...cert, certificateUrl: e.target.value };
                            updateData({ certifications: updated });
                          }}
                          className="flex-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                        />
                        <label className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary cursor-pointer transition-colors shrink-0">
                          <Upload className="size-3.5 text-primary" />
                          <span>{uploadingCertIndex === idx ? "Uploading..." : "Upload Certificate File"}</span>
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
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
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

        {/* ---------------- TAB 7: JOURNEY & HIGHLIGHTS ---------------- */}
        {activeTab === "journey" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            {/* Top Highlights Stats Bar */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Top Highlights Cards (Below Hero Section)
              </h2>

              <div className="space-y-3">
                {data.highlights.map((hl, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-surface p-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1">Highlight Label</label>
                      <input
                        type="text"
                        value={hl.label}
                        onChange={(e) => {
                          const updated = [...data.highlights];
                          updated[idx] = { ...hl, label: e.target.value };
                          updateData({ highlights: updated });
                        }}
                        className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1">Detail Text</label>
                      <input
                        type="text"
                        value={hl.detail}
                        onChange={(e) => {
                          const updated = [...data.highlights];
                          updated[idx] = { ...hl, detail: e.target.value };
                          updateData({ highlights: updated });
                        }}
                        className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  Journey &amp; Milestone Phases ({data.journey.length})
                </h2>
                <button
                  onClick={handleAddMilestone}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.journey.map((m, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-surface p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-primary">Phase {m.phase}</span>
                      <button
                        onClick={() => handleDeleteMilestone(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Phase Code</label>
                        <input
                          type="text"
                          value={m.phase}
                          onChange={(e) => {
                            const updated = [...data.journey];
                            updated[idx] = { ...m, phase: e.target.value };
                            updateData({ journey: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Title</label>
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => {
                            const updated = [...data.journey];
                            updated[idx] = { ...m, title: e.target.value };
                            updateData({ journey: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Status</label>
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
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                        >
                          <option value="done">Done (Completed)</option>
                          <option value="active">Active (In Progress)</option>
                          <option value="next">Next (Upcoming)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] text-muted-foreground mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={m.detail}
                          onChange={(e) => {
                            const updated = [...data.journey];
                            updated[idx] = { ...m, detail: e.target.value };
                            updateData({ journey: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] text-muted-foreground mb-1">Tags (Comma separated)</label>
                        <input
                          type="text"
                          value={(m.tags || []).join(", ")}
                          onChange={(e) => {
                            const updated = [...data.journey];
                            updated[idx] = {
                              ...m,
                              tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                            };
                            updateData({ journey: updated });
                          }}
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
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
          <div className="mt-6 space-y-6 max-w-4xl">
            {/* Contact Heading */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                Contact Section Heading &amp; Text
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Eyebrow Tag</label>
                  <input
                    type="text"
                    value={contact.eyebrow}
                    onChange={(e) => updateData({ contactData: { ...contact, eyebrow: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Title</label>
                  <input
                    type="text"
                    value={contact.title}
                    onChange={(e) => updateData({ contactData: { ...contact, title: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={contact.description}
                    onChange={(e) => updateData({ contactData: { ...contact, description: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Availability Notice Card (Right Column)
                  </label>
                  <input
                    type="text"
                    value={contact.availabilityNote || ""}
                    placeholder="Open to Summer 2026 SWE & Full-Stack Internships"
                    onChange={(e) => updateData({ contactData: { ...contact, availabilityNote: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Resume CTA Card */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                Resume CTA Banner (Above Contact Section)
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={cta.eyebrow}
                    onChange={(e) => updateData({ resumeCTA: { ...cta, eyebrow: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Title</label>
                  <input
                    type="text"
                    value={cta.title}
                    onChange={(e) => updateData({ resumeCTA: { ...cta, title: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={cta.description}
                    onChange={(e) => updateData({ resumeCTA: { ...cta, description: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Pill Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={(cta.tags || []).join(", ")}
                    onChange={(e) =>
                      updateData({
                        resumeCTA: {
                          ...cta,
                          tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 pt-3 border-t border-border">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Attached Resume PDF File (Direct Upload &amp; Link)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="Resume URL (/gopal-cv.pdf or Supabase URL)"
                      value={info.resume || ""}
                      onChange={(e) => updateData({ personalInfo: { ...info, resume: e.target.value } })}
                      className="flex-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary cursor-pointer transition-colors shrink-0">
                      <Upload className="size-3.5 text-primary" />
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
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
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
      </div>
    </div>
  );
}
