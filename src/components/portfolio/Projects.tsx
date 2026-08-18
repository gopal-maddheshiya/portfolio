import { ArrowUpRight, CheckCircle2, Code2, ExternalLink, Github } from "lucide-react";

import { PROJECTS, type Project } from "@/data/profile";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3">
      {/* Live Demo */}
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] shadow-soft cursor-pointer"
        >
          <span>Live Demo</span>
          <ExternalLink className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only"> for {project.title}</span>
        </a>
      ) : null}

      {/* GitHub / Source Code */}
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-secondary/60 px-4 py-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer"
      >
        <Github className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
        <span>
          Source Code
          <span className="sr-only"> for {project.title}</span>
        </span>
      </a>
    </div>
  );
}

function TechList({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
      {items.map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center rounded-md border border-border bg-secondary/80 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-border-strong"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

/** Project preview container with browser-like frame styling and smooth hover animation */
function ProjectVisual({
  title,
  image,
  liveUrl,
  className,
}: {
  title: string;
  image?: string | undefined;
  liveUrl?: string | undefined;
  className?: string | undefined;
}) {
  const content = (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface/50 transition-all duration-300 hover:border-border-strong hover:shadow-lift",
        className,
      )}
    >
      {/* Mockup browser window header */}
      <div className="flex h-8 w-full items-center justify-between border-b border-border/80 bg-surface px-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-primary/40" />
          <span className="size-2.5 rounded-full bg-accent/40" />
        </div>
        <div className="truncate px-2 text-[11px] font-mono text-muted-foreground/70">
          {title.toLowerCase().replace(/\s+/g, "-")}.dev
        </div>
        <div className="w-8" />
      </div>

      {/* Image frame with isolated hover state */}
      <div className="group/image relative aspect-[16/10] w-full overflow-hidden bg-muted/20">
        {image ? (
          <>
            <img
              src={image}
              alt={`${title} project preview`}
              loading="lazy"
              width={1200}
              height={750}
              className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover/image:scale-105"
            />
            {liveUrl ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover/image:opacity-100">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-lift">
                  <span>View Live Project</span>
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface">
            <Code2 className="size-10 text-muted-foreground/40" />
          </div>
        )}
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
  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Selected Work"
        title="Featured Projects"
        description="A showcase of full-stack applications and interactive web systems built with Java, React, Node.js, and modern APIs."
      />

      <div className="mt-8 sm:mt-12 space-y-10 lg:space-y-14">
        {PROJECTS.map((project, index) => {
          const isEven = index % 2 === 1;

          return (
            <Reveal
              key={project.title}
              as="article"
              delay={index * 60}
              className="relative rounded-2xl border border-border bg-card p-5 sm:p-7 lg:p-9 transition-all hover:border-border-strong hover:shadow-lift"
            >
              <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center">
                {/* Visual / Screenshot column */}
                <div
                  className={cn(
                    "lg:col-span-6 xl:col-span-6",
                    isEven ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <ProjectVisual
                    title={project.title}
                    image={project.image}
                    liveUrl={project.liveUrl}
                  />
                </div>

                {/* Content column */}
                <div
                  className={cn(
                    "flex flex-col justify-center lg:col-span-6 xl:col-span-6",
                    isEven ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  {/* Top meta */}
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span className="text-primary font-medium">Project {index + 1}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>

                  {/* Problem statement / Goal */}
                  {project.problem ? (
                    <div className="mt-3.5 rounded-lg border border-border/70 bg-surface/60 p-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">Goal: </span>
                      {project.problem}
                    </div>
                  ) : null}

                  {/* Key Features */}
                  {project.features?.length ? (
                    <div className="mt-4">
                      <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-primary font-medium">
                        Key Features
                      </h4>
                      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2 text-xs sm:text-sm text-muted-foreground">
                        {project.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle2
                              className="size-3.5 shrink-0 mt-0.5 text-primary/80"
                              aria-hidden="true"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Tech stack */}
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
