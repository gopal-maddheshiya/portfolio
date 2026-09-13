import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  ExternalLink,
  LogOut,
  User,
  Briefcase,
  Layers,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  FileCode2,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  FileText,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { usePortfolio } from "@/context/PortfolioContext";
import { uploadPortfolioImage, type PortfolioData } from "@/lib/supabase";
import type { Project, Certification } from "@/data/profile";

interface AdminDashboardProps {
  onSignOut: () => void;
  userEmail: string;
}

type TabType = "hero" | "projects" | "skills" | "certifications" | "journey";

export function AdminDashboard({ onSignOut, userEmail }: AdminDashboardProps) {
  const { data, updateData, saveData, resetToDefaults, isSaving } = usePortfolio();
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState<boolean>(false);

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
          personalInfo: { ...data.personalInfo, profilePhoto: res.url },
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

  // Helper for uploading project image
  const handleProjectImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(index);
      toast.info("Uploading image to Supabase Storage...");
      const res = await uploadPortfolioImage(file, "projects");
      if (res.url) {
        const existing = data.projects[index];
        if (existing) {
          const updatedProjects = [...data.projects];
          updatedProjects[index] = { ...existing, image: res.url };
          updateData({ projects: updatedProjects });
          toast.success("Image uploaded! Remember to click 'Save Live Changes'.");
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

  // Helper for adding new project
  const handleAddProject = () => {
    const newProject: Project = {
      title: "New Flagship Project",
      year: new Date().getFullYear().toString(),
      category: "Full-Stack Web",
      summary: "Description of the project, architecture and impact.",
      problem: "Key problem solved by this project.",
      technologies: ["React.js", "Node.js", "Tailwind CSS"],
      features: ["Core feature 1", "Core feature 2", "Responsive UI"],
      githubUrl: "https://github.com/gopal-maddheshiya",
      liveUrl: "",
      featured: false,
    };
    updateData({ projects: [newProject, ...data.projects] });
    toast.success("New project card added at top! Fill in its details.");
  };

  // Helper for deleting project
  const handleDeleteProject = (index: number) => {
    if (confirm(`Are you sure you want to delete "${data.projects[index]?.title}"?`)) {
      const updated = data.projects.filter((_, i) => i !== index);
      updateData({ projects: updated });
      toast.info("Project removed.");
    }
  };

  // Helper for reordering project
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

  // Helper for adding certification
  const handleAddCertification = () => {
    const newCert: Certification = {
      title: "New Certificate / Contest",
      org: "Issuing Organization",
      period: "2026",
      detail: "Description of skills verified and contest performance.",
      skills: ["Java", "Problem Solving"],
      certificateUrl: "",
    };
    updateData({ certifications: [newCert, ...data.certifications] });
  };

  const handleDeleteCertification = (index: number) => {
    const updated = data.certifications.filter((_, i) => i !== index);
    updateData({ certifications: updated });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-display font-bold border border-primary/20">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-sm sm:text-base">Portfolio Studio</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Connected
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

      {/* Main Content Area with Navigation Tabs */}
      <div className="container-page mt-6">
        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border scrollbar-none">
          <button
            onClick={() => setActiveTab("hero")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "hero"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <User className="size-4" />
            <span>Profile &amp; Hero</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "projects"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Briefcase className="size-4" />
            <span>Projects ({data.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "skills"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Layers className="size-4" />
            <span>Skills &amp; Tech</span>
          </button>

          <button
            onClick={() => setActiveTab("certifications")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "certifications"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Award className="size-4" />
            <span>Certificates ({data.certifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("journey")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "journey"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Sparkles className="size-4" />
            <span>Highlights &amp; Journey</span>
          </button>
        </div>

        {/* Tab 1: Profile & Hero */}
        {activeTab === "hero" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <User className="size-4 text-primary" />
                Personal Information &amp; Hero Headline
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.personalInfo.name}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, name: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Primary Role / Title</label>
                  <input
                    type="text"
                    value={data.personalInfo.role}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, role: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={data.personalInfo.subtitle}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, subtitle: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">Bio / About Summary</label>
                  <textarea
                    rows={3}
                    value={data.personalInfo.siteDescription}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, siteDescription: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Location</label>
                  <input
                    type="text"
                    value={data.personalInfo.location}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, location: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, email: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Phone</label>
                  <input
                    type="text"
                    value={data.personalInfo.phone}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, phone: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Resume Link (PDF/URL)</label>
                  <input
                    type="text"
                    value={data.personalInfo.resume}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, resume: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">WhatsApp (Digits with Country Code)</label>
                  <input
                    type="text"
                    placeholder="916388354988"
                    value={data.personalInfo.whatsapp || ""}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, whatsapp: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Profile Photo (Hero Picture)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="Image URL or upload below"
                      value={data.personalInfo.profilePhoto || ""}
                      onChange={(e) =>
                        updateData({
                          personalInfo: { ...data.personalInfo, profilePhoto: e.target.value },
                        })
                      }
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
                    Uploads directly to your Supabase Storage bucket (`portfolio-media`) or paste any image URL.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Globe className="size-4 text-primary" />
                Social &amp; Coding Profiles
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={data.personalInfo.github}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, github: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={data.personalInfo.linkedin}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, linkedin: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">LeetCode URL</label>
                  <input
                    type="text"
                    value={data.personalInfo.leetcode}
                    onChange={(e) =>
                      updateData({
                        personalInfo: { ...data.personalInfo, leetcode: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Projects Manager */}
        {activeTab === "projects" && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">Projects Manager</h2>
                <p className="text-xs text-muted-foreground">
                  Add, reorder, edit descriptions, change tags, or upload new screenshot images.
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
                  {/* Card header with action controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h3 className="font-semibold text-sm sm:text-base text-foreground">
                        {project.title || "Untitled Project"}
                      </h3>
                      {project.featured && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500 border border-amber-500/20">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMoveProject(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        onClick={() => handleMoveProject(idx, "down")}
                        disabled={idx === data.projects.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(idx)}
                        title="Delete Project"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Form fields */}
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
                      <label className="block text-xs font-medium text-foreground mb-1">Category &bull; Year</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Full-Stack MERN"
                          value={project.category || ""}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[idx] = { ...project, category: e.target.value };
                            updateData({ projects: updated });
                          }}
                          className="w-2/3 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="2026"
                          value={project.year}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[idx] = { ...project, year: e.target.value };
                            updateData({ projects: updated });
                          }}
                          className="w-1/3 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-foreground mb-1">Summary</label>
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
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={project.technologies.join(", ")}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = {
                            ...project,
                            technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          };
                          updateData({ projects: updated });
                        }}
                        placeholder="React.js, Node.js, MongoDB, Tailwind CSS"
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
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={project.liveUrl || ""}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx] = { ...project, liveUrl: e.target.value };
                          updateData({ projects: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                        <input
                          type="checkbox"
                          checked={project.featured || false}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[idx] = { ...project, featured: e.target.checked };
                            updateData({ projects: updated });
                          }}
                          className="size-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span>Featured Project Badge</span>
                      </label>
                    </div>

                    {/* Screenshot / Image Uploader Section */}
                    <div className="sm:col-span-3 pt-2 border-t border-border">
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Project Image / Screenshot
                      </label>
                      <div className="flex flex-wrap items-center gap-4">
                        {project.image ? (
                          <div className="relative size-20 rounded-lg overflow-hidden border border-border shrink-0 bg-surface">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="size-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="size-20 rounded-lg border border-dashed border-border bg-surface flex items-center justify-center text-muted-foreground text-xs shrink-0">
                            No image
                          </div>
                        )}

                        <div className="flex-1 min-w-[200px] space-y-2">
                          <input
                            type="text"
                            placeholder="Image URL or upload file"
                            value={project.image || ""}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[idx] = { ...project, image: e.target.value };
                              updateData({ projects: updated });
                            }}
                            className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                          <label className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer">
                            <Upload className="size-3.5" />
                            <span>
                              {uploadingIndex === idx ? "Uploading to Cloud..." : "Upload New Image"}
                            </span>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Skills & Technologies */}
        {activeTab === "skills" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">Skills &amp; Technologies</h2>
                <p className="text-xs text-muted-foreground">
                  Add, edit or organize tech stacks into domain categories.
                </p>
              </div>
              <button
                onClick={() => {
                  const newCategory = {
                    title: "New Category",
                    skills: ["Skill 1", "Skill 2"],
                    primary: false,
                  };
                  updateData({ skillGroups: [...data.skillGroups, newCategory] });
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-soft hover:opacity-90 active:scale-[0.99] cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {data.skillGroups.map((group, idx) => (
                <div key={idx} className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-border">
                    <input
                      type="text"
                      value={group.title}
                      onChange={(e) => {
                        const updated = [...data.skillGroups];
                        updated[idx] = { ...group, title: e.target.value };
                        updateData({ skillGroups: updated });
                      }}
                      className="font-semibold text-sm text-foreground bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                    />
                    <button
                      onClick={() => {
                        const updated = data.skillGroups.filter((_, i) => i !== idx);
                        updateData({ skillGroups: updated });
                      }}
                      className="text-muted-foreground hover:text-destructive p-1 rounded cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Skills (comma-separated):
                    </label>
                    <textarea
                      rows={3}
                      value={group.skills.join(", ")}
                      onChange={(e) => {
                        const updated = [...data.skillGroups];
                        updated[idx] = {
                          ...group,
                          skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        };
                        updateData({ skillGroups: updated });
                      }}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Certifications */}
        {activeTab === "certifications" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">Certificates &amp; Achievements</h2>
                <p className="text-xs text-muted-foreground">
                  Update contest wins, university milestones, and course certificates.
                </p>
              </div>
              <button
                onClick={handleAddCertification}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-soft hover:opacity-90 active:scale-[0.99] cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add Certificate</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.certifications.map((cert, idx) => (
                <div key={idx} className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-mono text-xs text-muted-foreground">#{idx + 1}</span>
                    <button
                      onClick={() => handleDeleteCertification(idx)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Title</label>
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, title: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Organization &bull; Period</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cert.org}
                          onChange={(e) => {
                            const updated = [...data.certifications];
                            updated[idx] = { ...cert, org: e.target.value };
                            updateData({ certifications: updated });
                          }}
                          placeholder="Org"
                          className="w-2/3 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                        <input
                          type="text"
                          value={cert.period}
                          onChange={(e) => {
                            const updated = [...data.certifications];
                            updated[idx] = { ...cert, period: e.target.value };
                            updateData({ certifications: updated });
                          }}
                          placeholder="Date"
                          className="w-1/3 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-foreground mb-1">Detail Description</label>
                      <textarea
                        rows={2}
                        value={cert.detail}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, detail: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-foreground mb-1">Certificate PDF/Link URL</label>
                      <input
                        type="text"
                        value={cert.certificateUrl || ""}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[idx] = { ...cert, certificateUrl: e.target.value };
                          updateData({ certifications: updated });
                        }}
                        placeholder="/certificates/find-the-language.pdf"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Highlights & Journey */}
        {activeTab === "journey" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            {/* Highlights section */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Top Highlights Badges (Hero Bar)
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {data.highlights.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-surface p-3 space-y-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const updated = [...data.highlights];
                        updated[idx] = { ...item, label: e.target.value };
                        updateData({ highlights: updated });
                      }}
                      className="w-full font-semibold text-xs text-foreground bg-transparent border-b border-border pb-1 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={item.detail}
                      onChange={(e) => {
                        const updated = [...data.highlights];
                        updated[idx] = { ...item, detail: e.target.value };
                        updateData({ highlights: updated });
                      }}
                      className="w-full text-xs text-muted-foreground bg-transparent focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Journey steps */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                Developer Journey Milestones
              </h2>

              <div className="space-y-3">
                {data.journey.map((step, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-surface p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary">{step.phase}</span>
                      <select
                        value={step.status}
                        onChange={(e) => {
                          const updated = [...data.journey];
                          updated[idx] = {
                            ...step,
                            status: e.target.value as "done" | "active" | "next",
                          };
                          updateData({ journey: updated });
                        }}
                        className="rounded border border-border bg-card px-2 py-1 text-xs text-foreground"
                      >
                        <option value="done">Completed (Done)</option>
                        <option value="active">Active Now</option>
                        <option value="next">Upcoming (Next)</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...data.journey];
                        updated[idx] = { ...step, title: e.target.value };
                        updateData({ journey: updated });
                      }}
                      className="w-full font-semibold text-xs text-foreground bg-transparent border-b border-border pb-1 focus:outline-none"
                    />

                    <textarea
                      rows={2}
                      value={step.detail}
                      onChange={(e) => {
                        const updated = [...data.journey];
                        updated[idx] = { ...step, detail: e.target.value };
                        updateData({ journey: updated });
                      }}
                      className="w-full text-xs text-muted-foreground bg-transparent focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Save / Action Bar on Bottom */}
      <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto rounded-full border border-border/80 bg-card/95 backdrop-blur-xl px-5 py-2.5 shadow-lift flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {data.updatedAt
              ? `Last saved: ${new Date(data.updatedAt).toLocaleTimeString()}`
              : "Ready to save changes"}
          </span>

          <button
            onClick={resetToDefaults}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => saveData()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span className="font-semibold">{isSaving ? "Saving to Cloud..." : "Save Live Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
