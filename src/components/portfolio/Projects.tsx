import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Code2, ExternalLink, Github, Sparkles } from "lucide-react";

import { PROJECTS, type Project } from "@/data/profile";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

const CATEGORIES = ["All", "Full-Stack", "Backend & APIs", "Frontend"] as const;

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-4 pt-3 border-t border-border/80 flex items-center gap-2.5">
      {/* Live Demo */}
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
        >
          <span>Live Demo</span>
          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="sr-only"> for {project.title}</span>
        </a>
      ) : null}

      {/* GitHub / Source Code */}
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-secondary/70 px-3.5 py-2 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer",
          !project.liveUrl && "flex-1",
        )}
      >
        <Github className="size-3.5 shrink-0" aria-hidden="true" />
        <span>Source Code</span>
      </a>
    </div>
  );
}

function TechList({ items }: { items: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.slice(0, 5).map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center rounded-md border border-border bg-secondary/80 px-2 py-0.5 text-[11px] font-mono text-muted-foreground transition-colors hover:text-foreground"
        >
          {tech}
        </span>
      ))}
      {items.length > 5 ? (
        <span className="inline-flex items-center rounded-md border border-border/60 bg-secondary/40 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/80">
          +{items.length - 5}
        </span>
      ) : null}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal
      as="article"
      delay={index * 40}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-lift"
    >
      <div>
        {/* Visual Mockup Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/20 border-b border-border/80">
          {/* Mockup browser window header */}
          <div className="absolute top-0 inset-x-0 z-10 flex h-7 items-center justify-between border-b border-border/80 bg-surface/90 px-3 backdrop-blur-xs">
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-destructive/60" />
              <span className="size-2 rounded-full bg-primary/40" />
              <span className="size-2 rounded-full bg-accent/40" />
            </div>
            <div className="truncate px-2 text-[10px] font-mono text-muted-foreground/70">
              {project.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.dev
            </div>
            <div className="w-5" />
          </div>

          {/* Project Screenshot / Cover */}
          {project.image ? (
            <div className="relative h-full w-full pt-7 overflow-hidden">
              <img
                src={project.image}
                alt={`${project.title} project preview`}
                loading="lazy"
                width={800}
                height={450}
                className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open live demo for ${project.title}`}
                  className="absolute inset-0 pt-7 flex items-center justify-center bg-background/50 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lift">
                    <span>View Live Project</span>
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </a>
              ) : null}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface pt-7">
              <Code2 className="size-8 text-muted-foreground/40" />
            </div>
          )}

          {/* Featured Badge */}
          {project.featured ? (
            <div className="absolute bottom-2.5 left-2.5 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary-foreground backdrop-blur-xs shadow-xs">
                <Sparkles className="size-2.5" />
                <span>Featured</span>
              </span>
            </div>
          ) : null}
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          {/* Category & Year */}
          <div className="flex items-center justify-between gap-2 font-mono text-xs">
            <span className="font-semibold text-primary">
              {project.category || "Full-Stack"}
            </span>
            <span className="text-muted-foreground/80">{project.year}</span>
          </div>

          {/* Title */}
          <h3 className="mt-2 font-display text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {project.title}
          </h3>

          {/* Summary */}
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {project.summary}
          </p>

          {/* Key Feature Bullets */}
          {project.features?.length ? (
            <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3 text-[11px] sm:text-xs text-muted-foreground">
              {project.features.slice(0, 2).map((feature) => (
                <li key={feature} className="flex items-start gap-1.5">
                  <CheckCircle2
                    className="size-3.5 shrink-0 mt-0.5 text-primary/80"
                    aria-hidden="true"
                  />
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Tech Stack */}
          <TechList items={project.technologies} />
        </div>
      </div>

      {/* Action Footer Links */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <ProjectLinks project={project} />
      </div>
    </Reveal>
  );
}

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Full-Stack")
      return p.category?.toLowerCase().includes("full-stack");
    if (activeCategory === "Backend & APIs")
      return p.category?.toLowerCase().includes("backend");
    if (activeCategory === "Frontend")
      return p.category?.toLowerCase().includes("frontend");
    return true;
  });

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Selected Work"
        title="Featured Projects"
        description="Full-stack web systems, cloud databases, and developer tools built with React, Node.js, Express, and Supabase."
      />

      {/* Category Filter Tabs */}
      <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-all cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="mt-6 sm:mt-8 grid gap-5 sm:gap-6 md:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
