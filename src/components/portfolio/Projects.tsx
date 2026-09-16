import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Code2, ExternalLink, Github, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePortfolio } from "@/context/PortfolioContext";
import type { Project } from "@/data/profile";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "./Section";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = ["All", "Full-Stack", "Backend & APIs", "Frontend"] as const;

/* ─────────────── Magnetic Hover Button ─────────────── */
function MagneticWrap({
  children,
  className,
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      gsap.to(ref.current, { x, y, duration: 0.35, ease: "power2.out" });
    },
    [strength],
  );

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  }, []);

  return (
    <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  );
}

/* ─────────────── Project Links ─────────────── */
function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-3.5 pt-2.5 border-t border-border/70 flex flex-wrap items-center gap-2.5">
      {/* Live Demo */}
      {project.liveUrl ? (
        <MagneticWrap strength={0.25} className="inline-block">
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
        </MagneticWrap>
      ) : null}

      {/* GitHub / Source Code */}
      <MagneticWrap strength={0.25} className="inline-block">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-secondary/60 px-3.5 py-2 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer"
        >
          <Github className="size-3.5 shrink-0" aria-hidden="true" />
          <span>Source Code</span>
        </a>
      </MagneticWrap>
    </div>
  );
}

/* ─────────────── Tech Pills ─────────────── */
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

/* ─────────────── 3D Tilt Project Visual ─────────────── */
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
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -4;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 4;

    gsap.to(tiltRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!tiltRef.current) return;
    gsap.to(tiltRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  }, []);

  const content = (
    <div
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col overflow-hidden rounded-xl border border-border/90 bg-surface/40 transition-shadow duration-300 hover:border-border-strong hover:shadow-soft will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
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

      {/* Image frame */}
      <div className="group/image relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-muted/30 dark:bg-card/80 flex items-center justify-center">
        {image ? (
          <>
            {/* Ambient blurred backdrop */}
            <img
              src={image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover blur-md opacity-30 dark:opacity-20 scale-110 pointer-events-none"
            />

            {/* Main sharp screenshot */}
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

/* ─────────────── Main Projects Section ─────────────── */
export function Projects() {
  const { data } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingAnimatedRef = useRef(false);

  const filteredProjects = data.projects.filter((p) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Full-Stack") return p.category?.toLowerCase().includes("full-stack");
    if (activeCategory === "Backend & APIs") return p.category?.toLowerCase().includes("backend");
    if (activeCategory === "Frontend") return p.category?.toLowerCase().includes("frontend");
    return true;
  });

  /* ── GSAP ScrollTrigger entrance ── */
  useEffect(() => {
    if (headingAnimatedRef.current || !sectionRef.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    headingAnimatedRef.current = true;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".projects-anim-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".projects-anim-heading",
            start: "top 88%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".projects-anim-tabs",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".projects-anim-tabs",
            start: "top 90%",
            once: true,
          },
        },
      );
    }, sectionRef);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card-anim");
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 48, scale: 0.985, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.18,
          clearProps: "all",
          scrollTrigger: {
            trigger: cards,
            start: "top 86%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <Section id="projects" ref={sectionRef}>
      <div className="projects-anim-heading">
        <SectionHeading
          animate={false}
          eyebrow="Selected Work"
          title="Featured Projects"
          description="Full-stack web applications, cloud systems, and developer tools built with React, Node.js, Express, and Supabase."
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="projects-anim-tabs mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
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

      {/* Project Cards */}
      <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        {filteredProjects.map((project, index) => {
          const isEven = index % 2 === 1;

          return (
            <article
              key={project.title}
              className="project-card-anim relative rounded-2xl border border-border bg-card p-3.5 sm:p-4 lg:p-5 transition-all hover:border-border-strong hover:shadow-soft"
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
            </article>
          );
        })}
      </div>
    </Section>
  );
}
