import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Code2, ExternalLink, Github, Sparkles } from "lucide-react";

import { usePortfolio } from "@/context/PortfolioContext";
import type { Project } from "@/data/profile";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

const CATEGORIES = ["All", "Full-Stack", "Backend & APIs", "Frontend"] as const;

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-3.5 pt-2.5 border-t border-border/70 flex flex-wrap items-center gap-2.5">
      {/* Live Demo */}
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
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
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-secondary/60 px-3.5 py-2 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer"
      >
        <Github className="size-3.5 shrink-0" aria-hidden="true" />
        <span>Source Code</span>
      </a>
    </div>
  );
}

function TechList({ items }: { items: string[] }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {items.map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center rounded-md border border-border bg-secondary/80 px-2 py-0.5 text-[11px] font-mono text-muted-foreground transition-colors hover:text-foreground"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

/** Slim, compact project preview mockup with zero unnecessary gap */
function ProjectVisual({
  title,
  image,
  liveUrl,
  featured,
}: {
  title: string;
  image?: string | undefined;
  liveUrl?: string | undefined;
  featured?: boolean | undefined;
}) {
  const content = (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-border/90 bg-surface/40 transition-all duration-300 hover:border-border-strong hover:shadow-soft">
      {/* Sleek browser header */}
      <div className="flex h-6 sm:h-7 w-full items-center justify-between border-b border-border/80 bg-surface/90 px-2.5">
        <div className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-destructive/60" />
          <span className="size-2 rounded-full bg-primary/40" />
          <span className="size-2 rounded-full bg-accent/40" />
        </div>
        <div className="truncate px-2 text-[10px] font-mono text-muted-foreground/70">
          {title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.dev
        </div>
        <div className="w-4" />
      </div>

      {/* Image frame without extra margins */}
      <div className="group/image relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-muted/30 dark:bg-card/80 flex items-center justify-center">
        {image ? (
          <>
            {/* Ambient blurred backdrop for seamless edge-to-edge aesthetics on any aspect ratio */}
            <img
              src={image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover blur-md opacity-30 dark:opacity-20 scale-110 pointer-events-none"
            />

            {/* Main sharp screenshot with full width/height visibility (no side cropping) */}
            <img
              src={image}
              alt={`${title} project preview`}
              loading="lazy"
              width={900}
              height={500}
              className="relative z-10 h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover/image:scale-[1.02]"
            />
            {liveUrl ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover/image:opacity-100">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lift">
                  <span>View Live Project</span>
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface">
            <Code2 className="size-8 text-muted-foreground/40" />
          </div>
        )}

        {/* Featured Pill */}
        {featured ? (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary-foreground backdrop-blur-xs shadow-xs">
              <Sparkles className="size-2.5" />
              <span>Featured</span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (liveUrl) {
    return (
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open live demo for ${title}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        {content}
      </a>
    );
  }

  return content;
}

export function Projects() {
  const { data } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredProjects = data.projects.filter((p) => {
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
        description="Full-stack web applications, cloud systems, and developer tools built with React, Node.js, Express, and Supabase."
      />

      {/* Category Filter Tabs */}
      <div className="mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-3.5 py-1 font-mono text-xs font-medium transition-all cursor-pointer",
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

      {/* Slim & Compact Horizontal Project Cards */}
      <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        {filteredProjects.map((project, index) => {
          const isEven = index % 2 === 1;

          return (
            <Reveal
              key={project.title}
              as="article"
              delay={index * 40}
              className="relative rounded-2xl border border-border bg-card p-3.5 sm:p-4 lg:p-5 transition-all hover:border-border-strong hover:shadow-soft"
            >
              <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 lg:items-center">
                {/* Visual / Screenshot column */}
                <div
                  className={cn(
                    "lg:col-span-5 xl:col-span-5",
                    isEven ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <ProjectVisual
                    title={project.title}
                    image={project.image}
                    liveUrl={project.liveUrl}
                    featured={project.featured}
                  />
                </div>

                {/* Content column */}
                <div
                  className={cn(
                    "flex flex-col justify-center lg:col-span-7 xl:col-span-7 min-w-0",
                    isEven ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  {/* Top meta */}
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">
                      {project.category || "Full-Stack"}
                    </span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-1.5 font-display text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-foreground">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>

                  {/* Key Features (Clean 2 bullets) */}
                  {project.features?.length ? (
                    <ul className="mt-2.5 grid gap-1 sm:grid-cols-2 text-[11px] sm:text-xs text-muted-foreground">
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

                  {/* Tech stack tags */}
                  <TechList items={project.technologies} />

                  {/* Action links */}
                  <ProjectLinks project={project} />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
