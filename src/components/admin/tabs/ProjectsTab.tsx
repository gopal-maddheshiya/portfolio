import { useState, useMemo } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Search,
  Star,
  ExternalLink,
  Github,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import type { Project } from "@/data/profile";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { SectionHeadingEditor } from "@/components/admin/ui/SectionHeadingEditor";
import { toast } from "sonner";

interface ProjectsTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

const CATEGORY_PRESETS = [
  "Full-Stack & Cloud",
  "Full-Stack MERN",
  "AI & Full-Stack",
  "Backend & APIs",
  "Frontend",
];

export function ProjectsTab({ data, updateData }: ProjectsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(() => new Set([0]));
  const projects = useMemo(() => data.projects || [], [data.projects]);

  const toggleExpanded = (index: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleAddProject = () => {
    const newProject: Project = {
      title: "New Flagship Project",
      year: new Date().getFullYear().toString(),
      category: "Full-Stack & Cloud",
      role: "Full-Stack Developer",
      summary: "Description of the project, architecture and impact.",
      problem: "Key problem solved by this project.",
      architecture: "Describe stack architecture, auth, API routes, and data modeling.",
      challenges: "Key technical challenge faced and how you resolved it.",
      impact: ["Measurable impact or key deliverable"],
      technologies: ["React.js", "Node.js", "MongoDB", "Tailwind CSS"],
      features: ["Core feature 1", "Core feature 2", "Responsive UI"],
      githubUrl: "https://github.com/gopal-maddheshiya",
      liveUrl: "",
      featured: false,
    };
    updateData({ projects: [newProject, ...projects] });
    setExpandedCards(new Set([0]));
    toast.success("New project card added at top! Fill in its details & Case Study.");
  };

  const handleDeleteProject = (originalIndex: number) => {
    const target = projects[originalIndex];
    if (confirm(`Are you sure you want to delete "${target?.title || "this project"}"?`)) {
      updateData({ projects: projects.filter((_, i) => i !== originalIndex) });
      toast.info("Project removed.");
    }
  };

  const handleMoveProject = (originalIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? originalIndex - 1 : originalIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const itemA = projects[originalIndex];
    const itemB = projects[targetIndex];
    if (itemA && itemB) {
      const updated = [...projects];
      updated[originalIndex] = itemB;
      updated[targetIndex] = itemA;
      updateData({ projects: updated });
    }
  };

  // Filtered view for easy search
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects.map((p, idx) => ({ project: p, originalIndex: idx }));
    const q = searchQuery.toLowerCase();
    return projects
      .map((p, idx) => ({ project: p, originalIndex: idx }))
      .filter(
        ({ project }) =>
          project.title.toLowerCase().includes(q) ||
          project.category?.toLowerCase().includes(q) ||
          project.technologies?.some((t) => t.toLowerCase().includes(q)) ||
          project.year.toLowerCase().includes(q),
      );
  }, [projects, searchQuery]);

  const allExpanded = projects.length > 0 && expandedCards.size >= projects.length;
  const toggleAllExpanded = () => {
    if (allExpanded) {
      setExpandedCards(new Set());
    } else {
      setExpandedCards(new Set(projects.map((_, idx) => idx)));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <SectionHeadingEditor
        sectionKey="projects"
        sectionLabel="Projects Showcase"
        data={data}
        updateData={updateData}
      />

      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
            <Briefcase className="size-6 text-primary" />
            <span>Projects &amp; Case Studies ({projects.length})</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Edit project cards, Case Study architecture/impact sections, tech tags, and screenshots.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-52 pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-2xs"
            />
          </div>

          {projects.length > 1 && (
            <button
              type="button"
              onClick={toggleAllExpanded}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card hover:bg-secondary px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            >
              {allExpanded ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
              <span>{allExpanded ? "Collapse All" : "Expand All"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.98] cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* 2. Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/60 p-10 text-center flex flex-col items-center justify-center space-y-2">
          <p className="text-sm font-medium text-foreground">
            No projects match your search query.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs text-primary underline cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map(({ project, originalIndex }) => {
            const isExpanded = searchQuery.trim().length > 0 || expandedCards.has(originalIndex);
            return (
              <div
                key={originalIndex}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-5 relative"
              >
                {/* Card Header & Ordering Actions */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-3 ${
                    isExpanded ? "border-b border-border pb-4" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpanded(originalIndex)}
                    className="flex items-center gap-3 min-w-0 text-left flex-1 cursor-pointer group"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-bold font-mono">
                      #{originalIndex + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                          {project.title || "Untitled Project"}
                        </h3>
                        {project.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-semibold px-2 py-0.5 border border-amber-500/20">
                            <Star className="size-3 fill-amber-500" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      {!isExpanded && (
                        <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
                          {project.category || "Full-Stack"} &bull; {project.year}
                          {project.role ? ` • ${project.role}` : ""}
                        </p>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <ReorderControls
                      index={originalIndex}
                      total={projects.length}
                      onMove={handleMoveProject}
                      label="project"
                    />
                    <button
                      type="button"
                      onClick={() => toggleExpanded(originalIndex)}
                      aria-expanded={isExpanded}
                      title={isExpanded ? "Collapse project" : "Expand project"}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-3.5" />
                      ) : (
                        <ChevronDown className="size-3.5" />
                      )}
                      <span className="hidden sm:inline">{isExpanded ? "Hide" : "Edit"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(originalIndex)}
                      title="Delete Project"
                      className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer shadow-2xs"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <>
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
                            const updated = [...projects];
                            updated[originalIndex] = { ...project, title: e.target.value };
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
                            const updated = [...projects];
                            updated[originalIndex] = { ...project, year: e.target.value };
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
                            const updated = [...projects];
                            updated[originalIndex] = { ...project, category: e.target.value };
                            updateData({ projects: updated });
                          }}
                          className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {CATEGORY_PRESETS.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                const updated = [...projects];
                                updated[originalIndex] = { ...project, category: preset };
                                updateData({ projects: updated });
                              }}
                              className={`rounded px-1.5 py-0.5 text-[10px] font-mono border transition-colors cursor-pointer ${
                                project.category === preset
                                  ? "bg-primary/15 border-primary/35 text-primary font-semibold"
                                  : "bg-surface border-border text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Your Role (Case Study)
                        </label>
                        <input
                          type="text"
                          value={project.role || ""}
                          placeholder="e.g. Lead Full-Stack Architect"
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[originalIndex] = { ...project, role: e.target.value };
                            updateData({ projects: updated });
                          }}
                          className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            GitHub Repo URL
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={project.githubUrl}
                              onChange={(e) => {
                                const updated = [...projects];
                                updated[originalIndex] = { ...project, githubUrl: e.target.value };
                                updateData({ projects: updated });
                              }}
                              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono pr-8"
                            />
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                              >
                                <Github className="size-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Live Demo URL (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={project.liveUrl || ""}
                            placeholder="https://..."
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[originalIndex] = { ...project, liveUrl: e.target.value };
                              updateData({ projects: updated });
                            }}
                            className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono pr-8"
                          />
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Summary / Elevator Pitch
                        </label>
                        <textarea
                          rows={2}
                          value={project.summary}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[originalIndex] = { ...project, summary: e.target.value };
                            updateData({ projects: updated });
                          }}
                          className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[65px]"
                        />
                      </div>

                      {/* Case Study Engineering Breakdown Panel */}
                      <div className="sm:col-span-3 rounded-xl border border-primary/20 bg-primary/[0.03] p-4 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                          <Layers className="size-4" />
                          <span>Case Study Deep Dive (Shown in Project Case Study Modal)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Problem &amp; Goal Statement
                          </label>
                          <textarea
                            rows={2}
                            value={project.problem || ""}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[originalIndex] = { ...project, problem: e.target.value };
                              updateData({ projects: updated });
                            }}
                            className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none min-h-[60px]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Architecture &amp; Technical Approach
                          </label>
                          <textarea
                            rows={2}
                            value={project.architecture || ""}
                            placeholder="Explain how frontend, APIs, database schema/RLS, caching, or AI pipeline connect..."
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[originalIndex] = { ...project, architecture: e.target.value };
                              updateData({ projects: updated });
                            }}
                            className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none min-h-[65px]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Key Engineering Challenge &amp; Solution
                          </label>
                          <textarea
                            rows={2}
                            value={project.challenges || ""}
                            placeholder="Describe one tricky technical bottleneck or trade-off and how you solved it..."
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[originalIndex] = { ...project, challenges: e.target.value };
                              updateData({ projects: updated });
                            }}
                            className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none min-h-[60px]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Outcomes &amp; Impact Bullets (One point per line)
                          </label>
                          <textarea
                            rows={3}
                            value={(project.impact || []).join("\n")}
                            placeholder="Reduced billing errors&#10;Realtime sync across users"
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[originalIndex] = {
                                ...project,
                                impact: e.target.value.split("\n"),
                              };
                              updateData({ projects: updated });
                            }}
                            className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none min-h-[70px]"
                          />
                        </div>
                      </div>

                      {/* Technologies with TagListInput */}
                      <div className="sm:col-span-3">
                        <TagListInput
                          label="Technologies &amp; Libraries"
                          tags={project.technologies || []}
                          onChange={(newTechs) => {
                            const updated = [...projects];
                            updated[originalIndex] = { ...project, technologies: newTechs };
                            updateData({ projects: updated });
                          }}
                          placeholder="Add technology (e.g. React.js, Express.js)..."
                          badgeColorClass="bg-primary/10 text-primary border-primary/20"
                          helpText="Key technology pills displayed on the project card."
                        />
                      </div>

                      {/* Key Features (One per line) */}
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Key Features List (One feature per line)
                        </label>
                        <textarea
                          rows={3}
                          value={(project.features || []).join("\n")}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[originalIndex] = {
                              ...project,
                              features: e.target.value.split("\n"),
                            };
                            updateData({ projects: updated });
                          }}
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                          className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-sans min-h-[85px]"
                        />
                      </div>

                      {/* Project Screenshot using ImageUploader */}
                      <div className="sm:col-span-3">
                        <ImageUploader
                          label="Project Screenshot / Cover Image"
                          value={project.image || ""}
                          onChange={(url) => {
                            const updated = [...projects];
                            updated[originalIndex] = { ...project, image: url };
                            updateData({ projects: updated });
                          }}
                          folder="projects"
                          aspectRatio="video"
                          aspectRatioLabel="Recommended: 16:9 Landscape (1280 × 720 px)"
                          helpText="Upload a crisp screenshot of your live UI. Saves directly to Cloud Storage."
                        />
                      </div>

                      {/* Featured Flagship Checkbox */}
                      <div className="sm:col-span-3 flex items-center gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          id={`featured-${originalIndex}`}
                          checked={Boolean(project.featured)}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[originalIndex] = { ...project, featured: e.target.checked };
                            updateData({ projects: updated });
                          }}
                          className="rounded border-border text-primary focus:ring-primary size-4.5 cursor-pointer"
                        />
                        <label
                          htmlFor={`featured-${originalIndex}`}
                          className="text-xs sm:text-sm text-foreground font-semibold cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Mark as Featured Flagship Project</span>
                          <span className="text-xs text-muted-foreground font-normal">
                            (Shown with Featured badge on portfolio)
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
