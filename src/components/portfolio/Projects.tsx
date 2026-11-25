import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  FileText,
  Github,
  Layers,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  canHoverFinePointer,
  MagneticWrap,
  prefersReducedMotion,
} from "@/components/common/MagneticWrap";
import { usePortfolio } from "@/context/PortfolioContext";
import { DEFAULT_SECTION_HEADERS, type Project } from "@/data/profile";
import { pauseSmoothScroll, resumeSmoothScroll, scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "./Section";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = ["All", "Full-Stack", "Backend & APIs", "Frontend"] as const;
type ProjectCategory = (typeof CATEGORIES)[number];

const INITIAL_PROJECT_COUNT = 3;
const MAX_CARD_TECH_PILLS = 5;

function matchesProjectCategory(project: Project, category: ProjectCategory): boolean {
  if (category === "All") return true;
  const cat = (project.category || "").toLowerCase();
  if (category === "Full-Stack") return cat.includes("full-stack");
  if (category === "Backend & APIs") return cat.includes("backend");
  if (category === "Frontend") return cat.includes("frontend");
  return true;
}

/* ─────────────── Project Visual Frame (Clean Single Image, Zero Fake Browser Chrome) ─────────────── */
function ProjectVisual({
  index,
  title,
  image,
  liveUrl,
  featured,
}: {
  index: number;
  title: string;
  image?: string | undefined;
  liveUrl?: string | undefined;
  featured?: boolean | undefined;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const quickRotXRef = useRef<gsap.QuickToFunc | null>(null);
  const quickRotYRef = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const node = tiltRef.current;
    if (!node || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(node, { transformPerspective: 800 });
      quickRotXRef.current = gsap.quickTo(node, "rotateX", {
        duration: 0.3,
        ease: "power2.out",
      });
      quickRotYRef.current = gsap.quickTo(node, "rotateY", {
        duration: 0.3,
        ease: "power2.out",
      });
    }, tiltRef);

    return () => {
      quickRotXRef.current = null;
      quickRotYRef.current = null;
      ctx.revert();
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (
      !tiltRef.current ||
      !quickRotXRef.current ||
      !quickRotYRef.current ||
      !canHoverFinePointer()
    ) {
      return;
    }
    const rect = tiltRef.current.getBoundingClientRect();
    const rotateX = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -3.5;
    const rotateY = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 3.5;

    quickRotXRef.current(rotateX);
    quickRotYRef.current(rotateY);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!tiltRef.current) return;
    gsap.to(tiltRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  }, []);

  const indexLabel = String(index + 1).padStart(2, "0");

  const frame = (
    <div
      ref={tiltRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group/image relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/80 bg-surface/75 transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-soft will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      {image ? (
        <img
          src={image}
          alt={`${title} preview`}
          loading="lazy"
          decoding="async"
          width={900}
          height={560}
          className="h-full w-full object-contain object-center p-1 sm:p-1.5 transition-transform duration-500 ease-out sm:group-hover/image:scale-[1.02]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface">
          <Code2 className="size-8 text-muted-foreground/40" aria-hidden="true" />
        </div>
      )}

      {/* Subtle corner index & featured badges */}
      <div className="pointer-events-none absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-md border border-border/80 bg-card/85 px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground backdrop-blur-sm">
          {indexLabel}
        </span>

        {featured ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary-foreground shadow-xs backdrop-blur-xs">
            <Sparkles className="size-2.5" aria-hidden="true" />
            <span>Featured</span>
          </span>
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
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
      >
        {frame}
      </a>
    );
  }

  return frame;
}

/* ─────────────── Compact Tech Tag List ─────────────── */
function TechList({ items, onExpandClick }: { items: string[]; onExpandClick?: () => void }) {
  const visible = items.slice(0, MAX_CARD_TECH_PILLS);
  const overflowCount = Math.max(0, items.length - MAX_CARD_TECH_PILLS);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {visible.map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center rounded-md border border-border/80 bg-surface/75 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
        >
          {tech}
        </span>
      ))}
      {overflowCount > 0 && onExpandClick ? (
        <button
          type="button"
          onClick={onExpandClick}
          className="inline-flex items-center rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary hover:bg-primary/15 transition-colors cursor-pointer"
        >
          +{overflowCount} more
        </button>
      ) : null}
    </div>
  );
}

/* ─────────────── Project Case Study Native Top-Layer Dialog ─────────────── */
function ProjectCaseDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isOpen = Boolean(project);

  // Stop Lenis smooth scroll while top-layer dialog is open so mouse wheel scrolls the modal natively
  useEffect(() => {
    if (!isOpen) return undefined;
    pauseSmoothScroll();
    return () => resumeSmoothScroll();
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project && !dialog.open) {
      dialog.showModal();
      if (bodyRef.current) {
        bodyRef.current.scrollTop = 0;
      }
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  // Progressive light-dismiss pointer fallback for browsers without native closedby="any"
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    let pressedOutside = false;
    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    const handleDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const handleUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener("pointerdown", handleDown);
    dialog.addEventListener("pointerup", handleUp);
    return () => {
      dialog.removeEventListener("pointerdown", handleDown);
      dialog.removeEventListener("pointerup", handleUp);
    };
  }, []);

  const handleClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog) dialog.returnValue = "";
    onClose();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      data-lenis-prevent=""
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby="project-case-dialog-title"
      onClose={handleClose}
      className="project-case-dialog max-h-[88dvh] w-[calc(100%-1.5rem)] max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-lift p-0"
    >
      {project ? (
        <div className="flex max-h-[88dvh] flex-col">
          {/* Mobile bottom-sheet drag indicator */}
          <div className="flex justify-center pt-2.5 sm:hidden shrink-0" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-border-strong" />
          </div>

          {/* Sticky Dialog Header */}
          <div className="flex items-start justify-between gap-3 border-b border-border/80 bg-surface/50 px-5 py-4 shrink-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <span className="font-semibold text-primary">
                  {project.category || "Full-Stack"}
                </span>
                <span>&bull;</span>
                <span>{project.year}</span>
                {project.role ? (
                  <>
                    <span>&bull;</span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-card/80 px-2 py-0.5 text-[10px] font-medium text-foreground/90">
                      <UserCheck className="size-3 text-primary" aria-hidden="true" />
                      <span>{project.role}</span>
                    </span>
                  </>
                ) : null}
              </div>
              <h1
                id="project-case-dialog-title"
                className="mt-1.5 font-display text-lg sm:text-xl font-bold tracking-tight text-foreground"
              >
                {project.title}
              </h1>
            </div>

            <form method="dialog">
              <button
                type="submit"
                autoFocus
                aria-label="Close project details"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground cursor-pointer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Scrollable Body (data-lenis-prevent + min-h-0 fixes mouse wheel scrolling inside top-layer dialog) */}
          <div
            ref={bodyRef}
            data-lenis-prevent=""
            className="flex-1 min-h-0 overflow-y-auto px-5 py-4 sm:py-5 space-y-4 sm:space-y-5 overscroll-contain"
          >
            {project.image ? (
              <div className="overflow-hidden rounded-xl border border-border/80 bg-surface/60">
                <img
                  src={project.image}
                  alt={`${project.title} full showcase`}
                  className="aspect-[16/9] w-full object-contain object-center p-1.5"
                />
              </div>
            ) : null}

            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {project.summary}
            </p>

            {/* Problem Statement Box */}
            {project.problem ? (
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-3.5 sm:p-4">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                  <Lightbulb className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>Problem &amp; Goal</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-foreground/90">
                  {project.problem}
                </p>
              </div>
            ) : null}

            {/* Architecture & Technical Approach */}
            {project.architecture ? (
              <div className="rounded-xl border border-border/80 bg-surface/55 p-3.5 sm:p-4">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  <Layers className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <span>Architecture &amp; Technical Approach</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {project.architecture}
                </p>
              </div>
            ) : null}

            {/* Key Challenge & Engineering Decision */}
            {project.challenges ? (
              <div className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  <Target className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <span>Key Challenge &amp; Solution</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {project.challenges}
                </p>
              </div>
            ) : null}

            {/* Complete Engineering Highlights */}
            {project.features?.length ? (
              <div>
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Key Engineering Features ({project.features.length})
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 rounded-lg border border-border/70 bg-surface/45 px-3 py-2"
                    >
                      <CheckCircle2
                        className="size-3.5 shrink-0 mt-0.5 text-primary"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Outcomes & Impact */}
            {project.impact?.length ? (
              <div>
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Outcomes &amp; Impact</span>
                </h2>
                <ul className="space-y-1.5 text-xs text-foreground/90">
                  {project.impact.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-2 rounded-lg border border-primary/15 bg-primary/[0.04] px-3 py-2"
                    >
                      <span
                        className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Complete Stack */}
            <div>
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Technology Stack
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-foreground/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Bar (Thumb-Friendly on Mobile) */}
          <div className="border-t border-border/80 bg-surface/60 px-5 py-3.5 flex flex-wrap items-center gap-2.5 shrink-0">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] min-h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90 cursor-pointer"
              >
                <span>Open Live Demo</span>
                <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
              </a>
            ) : null}

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] min-h-10 inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
            >
              <Github className="size-4 shrink-0" aria-hidden="true" />
              <span>View Source Code</span>
            </a>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

/* ─────────────── Main Projects Section ─────────────── */
export function Projects() {
  const { data } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");
  const [showAll, setShowAll] = useState(false);
  const [activeDialogProject, setActiveDialogProject] = useState<Project | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevViewSignatureRef = useRef<string | null>(null);

  const categoryCounts = useMemo(() => {
    const map: Record<ProjectCategory, number> = {
      All: data.projects.length,
      "Full-Stack": 0,
      "Backend & APIs": 0,
      Frontend: 0,
    };
    CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        map[cat] = data.projects.filter((p) => matchesProjectCategory(p, cat)).length;
      }
    });
    return map;
  }, [data.projects]);

  const filteredProjects = useMemo(
    () => data.projects.filter((p) => matchesProjectCategory(p, activeCategory)),
    [data.projects, activeCategory],
  );

  const displayedProjects = useMemo(() => {
    if (showAll) return filteredProjects;
    return filteredProjects.slice(0, INITIAL_PROJECT_COUNT);
  }, [filteredProjects, showAll]);

  const handleCategoryChange = useCallback((category: ProjectCategory, index: number) => {
    setActiveCategory(category);
    setShowAll(false);
    tabRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIdx: number | null = null;
      if (e.key === "ArrowRight") nextIdx = (currentIndex + 1) % CATEGORIES.length;
      else if (e.key === "ArrowLeft")
        nextIdx = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
      else if (e.key === "Home") nextIdx = 0;
      else if (e.key === "End") nextIdx = CATEGORIES.length - 1;

      if (nextIdx !== null) {
        e.preventDefault();
        const nextCat = CATEGORIES[nextIdx];
        if (nextCat) {
          handleCategoryChange(nextCat, nextIdx);
          tabRefs.current[nextIdx]?.focus();
        }
      }
    },
    [handleCategoryChange],
  );

  const toggleShowAll = useCallback(() => {
    if (showAll) {
      setShowAll(false);
      scrollToId("projects");
    } else {
      setShowAll(true);
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [showAll]);

  // Ambient spotlight handler for cards
  const handleCardPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!canHoverFinePointer()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const handleCardPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--mouse-x", "-500px");
    e.currentTarget.style.setProperty("--mouse-y", "-500px");
  }, []);

  /* ── StrictMode-safe Heading + Tabs ScrollTrigger Entrance ── */
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".projects-anim-heading",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".projects-anim-heading",
            start: "top 90%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".projects-anim-tabs",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".projects-anim-tabs",
            start: "top 92%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  /* ── Smooth Card Entrance on Initial Scroll, Crisp Tab Transition on Category/ShowAll Changes ── */
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const currentSignature = `${activeCategory}:${showAll}`;
    const isInteractiveUpdate =
      prevViewSignatureRef.current !== null && prevViewSignatureRef.current !== currentSignature;
    prevViewSignatureRef.current = currentSignature;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card-anim");
      if (!cards.length) return;

      if (isInteractiveUpdate) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 14, scale: 0.99 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.34,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
        );
      } else {
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 20, scale: 0.985 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              delay: Math.min(i * 0.045, 0.14),
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true,
              },
            },
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [displayedProjects, activeCategory, showAll]);

  const sectionHeader = {
    eyebrow: data.sectionHeaders?.projects?.eyebrow || DEFAULT_SECTION_HEADERS.projects.eyebrow,
    title: data.sectionHeaders?.projects?.title || DEFAULT_SECTION_HEADERS.projects.title,
    description:
      data.sectionHeaders?.projects?.description || DEFAULT_SECTION_HEADERS.projects.description,
  };

  return (
    <Section id="projects" ref={sectionRef} className="py-12 sm:py-16 lg:py-20">
      <div className="projects-anim-heading">
        <SectionHeading
          animate={false}
          eyebrow={sectionHeader.eyebrow}
          title={sectionHeader.title}
          description={sectionHeader.description}
        />
      </div>

      {/* Accessible Scrollable Segmented Category Tabs with Live Counts */}
      <div className="projects-anim-tabs mt-5 sm:mt-7 border-b border-border/80">
        <div className="skills-edge-mask overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="projects-tablist inline-flex min-w-max items-center gap-1 pr-6 md:pr-0 pb-2"
          >
            {CATEGORIES.map((category, idx) => {
              const isSelected = activeCategory === category;
              const count = categoryCounts[category];

              return (
                <button
                  key={category}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`projects-tab-${idx}`}
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleCategoryChange(category, idx)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={cn(
                    "projects-tab-item inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer",
                    isSelected
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/60",
                  )}
                >
                  <span>{category}</span>
                  <span className="text-[10px] text-muted-foreground/75">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Cards List or Clean Empty State */}
      {displayedProjects.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No projects found under{" "}
            <span className="text-foreground font-medium">{activeCategory}</span>.
          </p>
          <button
            type="button"
            onClick={() => handleCategoryChange("All", 0)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 font-mono text-xs font-medium text-primary-foreground cursor-pointer"
          >
            Show All Projects
          </button>
        </div>
      ) : (
        <div
          role="tabpanel"
          aria-labelledby={`projects-tab-${CATEGORIES.indexOf(activeCategory)}`}
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
        >
          {displayedProjects.map((project, index) => {
            const isEven = index % 2 === 1;

            return (
              <article
                key={project.title}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={handleCardPointerLeave}
                className="project-card-anim relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 lg:p-6 shadow-xs before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/45 before:to-transparent transition-all duration-300 hover:border-border-strong hover:shadow-soft"
                style={{
                  backgroundImage:
                    "radial-gradient(460px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), oklch(0.72 0.15 52 / 0.065), transparent 75%)",
                }}
              >
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:items-center">
                  {/* Visual / Screenshot column */}
                  <div className={cn("lg:col-span-5", isEven ? "lg:order-2" : "lg:order-1")}>
                    <ProjectVisual
                      index={index}
                      title={project.title}
                      image={project.image}
                      liveUrl={project.liveUrl}
                      featured={project.featured}
                    />
                  </div>

                  {/* Content column */}
                  <div
                    className={cn(
                      "flex flex-col justify-center lg:col-span-7 min-w-0",
                      isEven ? "lg:order-1" : "lg:order-2",
                    )}
                  >
                    {/* Top Meta Row */}
                    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">
                        {project.category || "Full-Stack"}
                      </span>
                      <span>&bull;</span>
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

                    {/* Clean Key Features (Zero mid-word truncate on mobile!) */}
                    {project.features?.length ? (
                      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                        {project.features.slice(0, 2).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle2
                              className="size-3.5 shrink-0 mt-0.5 text-primary/85"
                              aria-hidden="true"
                            />
                            <span className="line-clamp-2 leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {/* Tech stack tags */}
                    <TechList
                      items={project.technologies}
                      onExpandClick={() => setActiveDialogProject(project)}
                    />

                    {/* Action links (Symmetrical 2-column grid on mobile, clean horizontal flex on sm:+) */}
                    <div className="mt-4 pt-3 border-t border-border/70 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
                      {project.liveUrl ? (
                        <MagneticWrap strength={0.22} className="w-full sm:w-auto">
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-10 sm:min-h-9 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer whitespace-nowrap"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="sr-only"> for {project.title}</span>
                          </a>
                        </MagneticWrap>
                      ) : null}

                      <MagneticWrap strength={0.22} className="w-full sm:w-auto">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-10 sm:min-h-9 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-secondary/65 px-3.5 py-2 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer whitespace-nowrap"
                        >
                          <Github className="size-3.5 shrink-0" aria-hidden="true" />
                          <span>Source Code</span>
                          <span className="sr-only"> for {project.title}</span>
                        </a>
                      </MagneticWrap>

                      <button
                        type="button"
                        onClick={() => setActiveDialogProject(project)}
                        className={cn(
                          "min-h-10 sm:min-h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface/70 px-3.5 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground active:scale-[0.98] cursor-pointer sm:ml-auto sm:w-auto whitespace-nowrap",
                          project.liveUrl ? "col-span-2 w-full sm:col-span-1" : "w-full",
                        )}
                      >
                        <FileText className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                        <span>Case Study</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* View More / Show Less Toggle Button (Dead shadow-glow replaced cleanly) */}
      {filteredProjects.length > INITIAL_PROJECT_COUNT && (
        <div className="mt-8 sm:mt-10 flex justify-center">
          <MagneticWrap strength={0.18} className="inline-block">
            <button
              type="button"
              onClick={toggleShowAll}
              aria-expanded={showAll}
              className="group min-h-10 inline-flex items-center gap-2.5 rounded-full border border-border-strong bg-card/90 px-5 py-2.5 font-mono text-xs sm:text-sm font-medium text-foreground backdrop-blur-xs shadow-soft transition-all hover:border-primary/60 hover:bg-secondary active:scale-[0.98] cursor-pointer"
            >
              <span>{showAll ? "Show Less" : "View More Projects"}</span>
              {!showAll && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  +{filteredProjects.length - INITIAL_PROJECT_COUNT} more
                </span>
              )}
              {showAll ? (
                <ChevronUp
                  className="size-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-foreground"
                  aria-hidden="true"
                />
              ) : (
                <ChevronDown
                  className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-foreground"
                  aria-hidden="true"
                />
              )}
            </button>
          </MagneticWrap>
        </div>
      )}

      {/* Native Accessible Case Study Sheet / Dialog */}
      <ProjectCaseDialog
        project={activeDialogProject}
        onClose={() => setActiveDialogProject(null)}
      />
    </Section>
  );
}
