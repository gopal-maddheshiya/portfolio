import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Flame,
  Globe,
  GraduationCap,
  Layers,
  MapPin,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePortfolio } from "@/context/PortfolioContext";
import { ABOUT_DATA, DSA_INFO } from "@/data/profile";
import { useLeetCodeStats } from "@/hooks/useLeetCodeStats";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type AboutTab = "pillars" | "education";

const PRINCIPLE_ICONS: Record<string, LucideIcon> = {
  code: Code2,
  cpu: Cpu,
  zap: Zap,
  db: Database,
  award: Award,
  sparkles: Sparkles,
  grad: GraduationCap,
  terminal: Terminal,
  trophy: Trophy,
  codechef: Code2,
  globe: Globe,
  layers: Layers,
  book: BookOpen,
  briefcase: Briefcase,
  star: Star,
  check: CheckCircle2,
};

export function About() {
  const { data } = usePortfolio();
  const info = data.personalInfo;
  const education = data.education || [];
  const about = data.aboutData || ABOUT_DATA;
  const { total: leetCodeTotal } = useLeetCodeStats(info.leetcodeUsername);

  const [activeTab, setActiveTab] = useState<AboutTab>("pillars");

  const sectionRef = useRef<HTMLElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasTabSwitchedRef = useRef(false);

  const currentEducation = education[0] || {
    title: "B.Tech in Computer Science & Engineering",
    org: "Shri Ramswaroop Memorial University (SRMU)",
    period: "2024 – 2028",
    detail: "CGPA 7.63",
  };

  const dsaSolvedNumber =
    leetCodeTotal > 0
      ? leetCodeTotal
      : (data.dsaInfo?.totalSolvedCount ?? DSA_INFO.totalSolvedCount ?? 54);

  // Extract exact numeric CGPA & graduation year cleanly (prevents stale 0.00 / 2024 states)
  const cleanCgpa = useMemo(() => {
    const raw = about.snapshot?.cgpa || currentEducation.detail || "7.63";
    const match = raw.match(/\d+(?:\.\d+)?/);
    return match ? match[0] : "7.63";
  }, [about.snapshot?.cgpa, currentEducation.detail]);

  const batchDisplay = useMemo(() => {
    const raw = about.snapshot?.batch || currentEducation.period || "2028";
    const lastYearMatch = raw.match(/20\d{2}(?!.*20\d{2})/) || raw.match(/\d{4}/);
    return lastYearMatch ? lastYearMatch[0] : "2028";
  }, [about.snapshot?.batch, currentEducation.period]);

  const universityShortName =
    about.snapshot?.university ||
    currentEducation.org ||
    "Shri Ramswaroop Memorial University (SRMU)";

  const principles = about.principles?.length ? about.principles : ABOUT_DATA.principles;
  const coursework = (about.coursework?.length ? about.coursework : ABOUT_DATA.coursework).slice(
    0,
    6,
  );

  // Pointer-following warm ember radial spotlight
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mouse-x", "-500px");
    e.currentTarget.style.setProperty("--mouse-y", "-500px");
  }, []);

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const order: AboutTab[] = ["pillars", "education"];
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") nextIdx = (idx + 1) % 2;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = 1;

    if (nextIdx !== null) {
      e.preventDefault();
      const target = order[nextIdx];
      if (target) {
        setActiveTab(target);
        tabRefs.current[nextIdx]?.focus();
      }
    }
  }, []);

  // StrictMode-safe GSAP ScrollTrigger entrance animation
  useEffect(() => {
    if (!sectionRef.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-anim-heading",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: sectionRef.current, start: "top 86%", once: true },
        },
      );

      gsap.fromTo(
        ".about-anim-col",
        { opacity: 0, y: 24, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".about-layout-grid", start: "top 85%", once: true },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Crisp subtle transition on tab changes after initial render
  useEffect(() => {
    if (!hasTabSwitchedRef.current) {
      hasTabSwitchedRef.current = true;
      return;
    }
    if (!tabContentRef.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const items = tabContentRef.current.querySelectorAll(".tab-item");
    const tween = gsap.fromTo(
      items.length ? items : tabContentRef.current,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.28,
        stagger: 0.04,
        ease: "power2.out",
        clearProps: "transform,opacity",
      },
    );

    return () => {
      tween.kill();
    };
  }, [activeTab]);

  return (
    <Section id="about" ref={sectionRef} className="py-12 sm:py-16 lg:py-20">
      {/* ── Crisp Compact Editorial Heading (Zero Duplicate Blurb) ── */}
      <div className="about-anim-heading max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          {about.eyebrow || "About Me"}
        </p>
        <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {about.title || "Passionate about problem solving & engineering web apps."}
        </h2>
      </div>

      {/* ── Balanced 2-Column Editorial Bento (7 : 5 Split) ── */}
      <div className="about-layout-grid mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* ── Left Column (7 Cols): Profile Story & Accurate Snapshot ── */}
        <div className="about-anim-col lg:col-span-7 flex flex-col">
          <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/45 before:to-transparent transition-colors hover:border-border-strong"
            style={{
              backgroundImage:
                "radial-gradient(420px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), oklch(0.72 0.15 52 / 0.07), transparent 75%)",
            }}
          >
            <div>
              {/* Clean Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-border/70">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <MapPin className="size-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span>{info.location}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-primary">
                  <span className="relative flex size-1.5 shrink-0" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-65" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                  </span>
                  <span>
                    {about.availabilityBadge ||
                      data.heroData?.availabilityStatus ||
                      "Open to Internships"}
                  </span>
                </span>
              </div>

              {/* Concise Editorial Headline & Single Crisp Paragraph */}
              <h3 className="mt-4 font-display text-lg sm:text-xl font-semibold text-foreground leading-snug">
                {about.storyTitle || "A developer who learns by building, solving, and iterating."}
              </h3>

              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {about.storyParagraphs?.[0] ||
                  "I'm a Computer Science Engineering student at Shri Ramswaroop Memorial University, actively preparing for software engineering roles through Java algorithmic problem-solving and full-stack MERN development."}
              </p>

              {/* 3 Bug-Free Credential Snapshot Tiles */}
              <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
                <div className="rounded-xl border border-border/75 bg-surface/55 p-2.5 sm:p-3 text-center">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Degree
                  </span>
                  <span className="mt-0.5 block font-display text-xs sm:text-sm font-bold text-foreground truncate">
                    {about.snapshot?.degree || "B.Tech CSE"}
                  </span>
                  <span className="block font-mono text-[10px] text-muted-foreground/80 mt-0.5">
                    Class of {batchDisplay}
                  </span>
                </div>

                <div className="rounded-xl border border-border/75 bg-surface/55 p-2.5 sm:p-3 text-center">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    CGPA
                  </span>
                  <span className="mt-0.5 block font-display text-base sm:text-lg font-bold text-primary">
                    {cleanCgpa}
                  </span>
                  <span className="block font-mono text-[10px] text-muted-foreground/80 mt-0.5 truncate">
                    {(info.universityShort?.split("·")[0]?.trim() || "SRMU") + " Scale"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToId("dsa")}
                  className="group/stat rounded-xl border border-border/75 bg-surface/55 p-2.5 sm:p-3 text-center transition-colors hover:border-primary/45 hover:bg-surface cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover/stat:text-primary transition-colors">
                    <Flame className="size-3 text-primary" aria-hidden="true" />
                    <span>LeetCode</span>
                  </span>
                  <span className="mt-0.5 block font-display text-base sm:text-lg font-bold text-foreground">
                    {dsaSolvedNumber}+
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground/80 mt-0.5">
                    <span>Solved</span>
                    <ArrowUpRight className="size-2.5" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </div>

            {/* Clean Navigation Footer */}
            <div className="mt-5 pt-3.5 border-t border-border/70 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => scrollToId("projects")}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <span>Explore Featured Work</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => scrollToId("contact")}
                className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column (5 Cols): Streamlined 2-Tab Dossier (Zero Duplicate Story) ── */}
        <div className="about-anim-col lg:col-span-5 flex flex-col">
          <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border bg-card shadow-xs before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/45 before:to-transparent transition-colors hover:border-border-strong"
            style={{
              backgroundImage:
                "radial-gradient(360px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), oklch(0.72 0.15 52 / 0.07), transparent 75%)",
            }}
          >
            {/* Clean Segmented WAI-ARIA Tab Bar (No Fake macOS Dots) */}
            <div className="border-b border-border/80 bg-surface/40 px-4 sm:px-5 pt-2.5">
              <div
                role="tablist"
                aria-label="About details switcher"
                className="about-tablist flex items-center gap-1 pb-2"
              >
                <button
                  ref={(el) => {
                    tabRefs.current[0] = el;
                  }}
                  type="button"
                  role="tab"
                  id="about-tab-pillars"
                  aria-selected={activeTab === "pillars"}
                  tabIndex={activeTab === "pillars" ? 0 : -1}
                  onClick={() => setActiveTab("pillars")}
                  onKeyDown={(e) => handleTabKeyDown(e, 0)}
                  className={cn(
                    "about-tab-item inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer",
                    activeTab === "pillars"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Core Pillars</span>
                </button>

                <button
                  ref={(el) => {
                    tabRefs.current[1] = el;
                  }}
                  type="button"
                  role="tab"
                  id="about-tab-education"
                  aria-selected={activeTab === "education"}
                  tabIndex={activeTab === "education" ? 0 : -1}
                  onClick={() => setActiveTab("education")}
                  onKeyDown={(e) => handleTabKeyDown(e, 1)}
                  className={cn(
                    "about-tab-item inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer",
                    activeTab === "education"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <GraduationCap className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Education</span>
                </button>
              </div>
            </div>

            {/* Active Tab Content Body */}
            <div
              ref={tabContentRef}
              role="tabpanel"
              aria-labelledby={
                activeTab === "pillars" ? "about-tab-pillars" : "about-tab-education"
              }
              className="p-4 sm:p-5 flex-1 flex flex-col justify-between"
            >
              {activeTab === "pillars" ? (
                <div className="flex flex-col justify-between h-full gap-4">
                  <div className="space-y-2.5">
                    {principles.map((item) => {
                      const Icon = PRINCIPLE_ICONS[item.icon] || Code2;
                      return (
                        <div
                          key={item.title}
                          className="tab-item skill-card-aurora flex items-start gap-3 rounded-xl border border-border/80 bg-surface/45 p-3 transition-colors hover:bg-surface/75"
                        >
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-card text-primary mt-0.5">
                            <Icon className="size-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display text-xs sm:text-[13px] font-semibold text-foreground">
                              {item.title}
                            </h4>
                            <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Stack &amp; tooling overview
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToId("skills")}
                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <span>View Tech Stack</span>
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between h-full gap-4">
                  <div className="space-y-3.5">
                    <div className="tab-item rounded-xl border border-border/80 bg-surface/45 p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[10.5px] text-muted-foreground">
                          {currentEducation.period}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                          <Award className="size-2.5" aria-hidden="true" />
                          <span>CGPA {cleanCgpa}</span>
                        </span>
                      </div>

                      <h4 className="mt-1.5 font-display text-sm sm:text-base font-semibold text-foreground leading-snug">
                        {currentEducation.title}
                      </h4>
                      <p className="mt-1 text-xs font-medium text-primary">{universityShortName}</p>
                    </div>

                    <div className="tab-item">
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground block mb-2">
                        Core Coursework
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {coursework.map((course) => (
                          <div
                            key={course}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/50 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground"
                          >
                            <BookOpen className="size-3 shrink-0 text-primary" aria-hidden="true" />
                            <span className="truncate">{course}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Campus milestones &amp; photos
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToId("gallery")}
                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <span>Academic Gallery</span>
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
