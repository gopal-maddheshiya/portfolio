import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Code2,
  Cpu,
  Flame,
  GraduationCap,
  MapPin,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePortfolio } from "@/context/PortfolioContext";
import { ABOUT_DATA, DSA_INFO } from "@/data/profile";
import { useLeetCodeStats } from "@/hooks/useLeetCodeStats";
import { scrollToId } from "@/lib/scroll";
import { Section, SectionHeading } from "./Section";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type AboutTab = "bio" | "dsa" | "education";

export function About() {
  const { data } = usePortfolio();
  const info = data.personalInfo;
  const education = data.education || [];
  const about = data.aboutData || ABOUT_DATA;
  const { total: leetCodeTotal } = useLeetCodeStats();

  const [activeTab, setActiveTab] = useState<AboutTab>("bio");

  const sectionRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);
  const tabContentRef = useRef<HTMLDivElement>(null);

  const countRefs = useRef<{
    dsa: HTMLSpanElement | null;
    cgpa: HTMLSpanElement | null;
    batch: HTMLSpanElement | null;
  }>({ dsa: null, cgpa: null, batch: null });

  const currentEducation = education[0] || {
    title: "B.Tech in Computer Science & Engineering",
    org: "Shri Ramswaroop Memorial University (SRMU)",
    period: "2024 – 2028",
    detail: "CGPA 7.63",
  };

  // Synchronized directly with the DSA section & live LeetCode stats
  const dsaSolvedNumber =
    leetCodeTotal > 0 ? leetCodeTotal : (DSA_INFO.totalSolvedCount || 53);
  const dsaCount = `${dsaSolvedNumber}+`;
  const cgpaValue = about.snapshot?.cgpa || currentEducation.detail || "7.63";
  const batchYear =
    about.snapshot?.batch?.replace(/[^0-9]/g, "") ||
    currentEducation.period?.split("–")?.[1]?.trim() ||
    "2028";
  const universityShortName =
    about.snapshot?.university ||
    currentEducation.org ||
    "Shri Ramswaroop Memorial University (SRMU)";

  // GSAP Entrance & Number Ticker Animations
  useEffect(() => {
    if (animatedRef.current || !sectionRef.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    animatedRef.current = true;
    const ctx = gsap.context(() => {
      // 1. Heading entrance with subtle blur clear
      gsap.fromTo(
        ".about-anim-heading",
        { opacity: 0, y: 24, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ".about-anim-heading", start: "top 88%", once: true },
        },
      );

      // 2. Both Dossier Cards entrance
      gsap.fromTo(
        ".about-anim-col",
        { opacity: 0, y: 32, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.12,
          clearProps: "all",
          scrollTrigger: { trigger: ".about-layout-grid", start: "top 85%", once: true },
        },
      );

      // 3. Smooth Live Number Tickers
      const targetDsa = dsaSolvedNumber || parseInt(dsaCount.replace(/[^0-9]/g, ""), 10) || 53;
      const targetCgpa = parseFloat(cgpaValue.replace(/[^0-9.]/g, "")) || 7.63;
      const targetBatch = parseInt(batchYear.replace(/[^0-9]/g, ""), 10) || 2028;

      const counterObj = { dsa: 0, cgpa: 0, batch: 2024 };

      gsap.to(counterObj, {
        dsa: targetDsa,
        cgpa: targetCgpa,
        batch: targetBatch,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-stats-grid",
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          if (countRefs.current.dsa) {
            countRefs.current.dsa.textContent = `${Math.floor(counterObj.dsa)}+`;
          }
          if (countRefs.current.cgpa) {
            countRefs.current.cgpa.textContent = counterObj.cgpa.toFixed(2);
          }
          if (countRefs.current.batch) {
            countRefs.current.batch.textContent = Math.floor(counterObj.batch).toString();
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [dsaCount, cgpaValue, batchYear]);

  // GSAP Smooth Tab Switch Transition
  useEffect(() => {
    if (!tabContentRef.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.fromTo(
      tabContentRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
    );

    const items = tabContentRef.current.querySelectorAll(".tab-item");
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.28, stagger: 0.04, ease: "power2.out" },
      );
    }
  }, [activeTab]);

  // Ambient Cursor Spotlight on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Section id="about" ref={sectionRef}>
      <div className="about-anim-heading">
        <SectionHeading
          animate={false}
          eyebrow={about.eyebrow || "About Me"}
          title={about.title || "Passionate about problem solving & engineering web apps."}
          description={
            about.description ||
            "A computer science student combining algorithmic practice in Java with full-stack web development."
          }
        />
      </div>

      {/* ─────────────── Equal-Height Linear/Vercel Minimalist Dossier ─────────────── */}
      <div className="about-layout-grid mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full max-w-full">
        {/* ── Left Column (5 Cols): Clean Story & Direct Keywords ── */}
        <div className="about-anim-col lg:col-span-5 flex flex-col">
          <div
            onMouseMove={handleMouseMove}
            className="relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-xs before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent transition-all duration-300 hover:border-border-strong hover:shadow-soft"
            style={{
              backgroundImage:
                "radial-gradient(450px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), oklch(0.72 0.15 52 / 0.07), transparent 75%)",
            }}
          >
            <div>
              {/* Card Sub-Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-2 rounded-full bg-primary" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Overview · {info.name || "Gopal Maddheshiya"}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground bg-surface px-2 py-0.5 rounded-md border border-border/60">
                  Click to inspect
                </span>
              </div>

              {/* Clear Story Headline */}
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground leading-snug">
                {about.storyTitle ||
                  "A developer who learns by building, solving problems, and iterating."}
              </h3>

              {/* Simple, honest narrative */}
              <p className="mt-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {about.storyParagraphs?.[0] ? (
                  <span>{about.storyParagraphs[0]}</span>
                ) : (
                  <>
                    I am a Computer Science Engineering student currently based in{" "}
                    <span className="text-foreground font-medium">{info.location}</span>. My main
                    focus is practicing problem-solving with{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("dsa")}
                      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                        activeTab === "dsa"
                          ? "border border-primary/60 bg-primary/15 text-primary font-semibold ring-1 ring-primary/25"
                          : "border border-border/80 bg-surface/60 text-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                      title="View Java & DSA details"
                    >
                      <Code2 className="size-3 text-primary" /> Java &amp; DSA
                    </button>{" "}
                    and building responsive web applications using{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("bio")}
                      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                        activeTab === "bio"
                          ? "border border-primary/60 bg-primary/15 text-primary font-semibold ring-1 ring-primary/25"
                          : "border border-border/80 bg-surface/60 text-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                      title="View Web Development details"
                    >
                      <Terminal className="size-3 text-primary" /> React &amp; Node.js
                    </button>{" "}
                    at{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("education")}
                      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                        activeTab === "education"
                          ? "border border-primary/60 bg-primary/15 text-primary font-semibold ring-1 ring-primary/25"
                          : "border border-border/80 bg-surface/60 text-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                      title="View SRMU Education details"
                    >
                      <GraduationCap className="size-3 text-primary" /> SRMU
                    </button>
                    .
                  </>
                )}
              </p>

              {/* 3 Interactive Highlight Counters (Animated with GSAP Ticker) */}
              <div className="about-stats-grid mt-5 grid grid-cols-3 gap-2.5 pt-4 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => setActiveTab("dsa")}
                  className={`group rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                    activeTab === "dsa"
                      ? "border-primary/50 bg-surface ring-1 ring-primary/20"
                      : "border-border/70 bg-surface/40 hover:border-primary/40 hover:bg-surface/70"
                  }`}
                  title="Click to view DSA details"
                >
                  <div className="flex items-center justify-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                    <Flame className="size-3 text-primary" />
                    <span className="font-mono text-[10px] uppercase">LeetCode</span>
                  </div>
                  <span
                    ref={(el) => {
                      countRefs.current.dsa = el;
                    }}
                    className="block font-display text-base sm:text-lg font-bold text-foreground mt-0.5"
                  >
                    {dsaCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("education")}
                  className={`group rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                    activeTab === "education"
                      ? "border-primary/50 bg-surface ring-1 ring-primary/20"
                      : "border-border/70 bg-surface/40 hover:border-primary/40 hover:bg-surface/70"
                  }`}
                  title="Click to view CGPA & Education"
                >
                  <div className="flex items-center justify-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                    <Award className="size-3 text-primary" />
                    <span className="font-mono text-[10px] uppercase">CGPA</span>
                  </div>
                  <span
                    ref={(el) => {
                      countRefs.current.cgpa = el;
                    }}
                    className="block font-display text-base sm:text-lg font-bold text-primary mt-0.5"
                  >
                    {cgpaValue}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("education")}
                  className={`group rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                    activeTab === "education"
                      ? "border-primary/50 bg-surface ring-1 ring-primary/20"
                      : "border-border/70 bg-surface/40 hover:border-primary/40 hover:bg-surface/70"
                  }`}
                  title="Click to view Batch details"
                >
                  <div className="flex items-center justify-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                    <Calendar className="size-3 text-primary" />
                    <span className="font-mono text-[10px] uppercase">Batch</span>
                  </div>
                  <span
                    ref={(el) => {
                      countRefs.current.batch = el;
                    }}
                    className="block font-display text-base sm:text-lg font-bold text-foreground mt-0.5"
                  >
                    {batchYear}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Footer: Location & Internship Status (Unified theme, NO green) */}
            <div className="mt-6 pt-3.5 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <MapPin className="size-3.5 text-primary shrink-0" />
                <span>{info.location}</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-primary font-medium">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <span>Open to Internships</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column (7 Cols): The Simple Tabbed Inspector ── */}
        <div className="about-anim-col lg:col-span-7 flex flex-col">
          <div
            onMouseMove={handleMouseMove}
            className="relative flex flex-col justify-between h-full rounded-2xl border border-border bg-card shadow-soft overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent transition-all duration-300 hover:border-border-strong hover:shadow-soft"
            style={{
              backgroundImage:
                "radial-gradient(450px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), oklch(0.72 0.15 52 / 0.07), transparent 75%)",
            }}
          >
            {/* Window Header & Tab Bar (Clean, Unified Theme) */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 bg-surface/40 p-3 sm:px-5">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary/60" />
                <span className="size-2 rounded-full bg-primary/40" />
                <span className="size-2 rounded-full bg-primary/20" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground/80 hidden sm:inline">
                  about.info
                </span>
              </div>

              {/* Clean Segmented Tab Controls */}
              <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-surface/70 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("bio")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 font-mono text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "bio"
                      ? "bg-card text-foreground shadow-xs border border-border/80"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Terminal className="size-3.5 text-primary" />
                  <span>Bio &amp; Skills</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("dsa")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 font-mono text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "dsa"
                      ? "bg-card text-foreground shadow-xs border border-border/80"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code2 className="size-3.5 text-primary" />
                  <span>Java &amp; DSA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("education")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 font-mono text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "education"
                      ? "bg-card text-foreground shadow-xs border border-border/80"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GraduationCap className="size-3.5 text-primary" />
                  <span>Education</span>
                </button>
              </div>
            </div>

            {/* Dossier Content Body (Animated with GSAP) */}
            <div ref={tabContentRef} className="p-5 sm:p-7 flex-1 flex flex-col justify-between">
              {/* ── TAB 1: Bio & What I Do (Simple & Honest) ── */}
              {activeTab === "bio" && (
                <div className="space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary mb-1.5">
                      <Sparkles className="size-3" />
                      What I Do
                    </span>
                    <h4 className="font-display text-lg sm:text-xl font-bold text-foreground leading-snug">
                      Learning by building projects and solving problems regularly.
                    </h4>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {about.storyParagraphs?.[1] ||
                        "I am actively preparing for software engineering roles. My focus is on solving algorithmic problems in Java and creating full-stack web applications with React, Node.js, Express, and databases."}
                    </p>
                  </div>

                  {/* 3 Clear, Simple Points */}
                  <div className="space-y-2 pt-1">
                    <div className="tab-item flex items-start gap-3 rounded-xl border border-border/60 bg-surface/30 p-3 hover:border-primary/40 hover:bg-surface/60 transition-all">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 mt-0.5">
                        <Code2 className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Java &amp; DSA</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Solving Data Structures and Algorithms problems regularly on LeetCode
                          using Java.
                        </p>
                      </div>
                    </div>

                    <div className="tab-item flex items-start gap-3 rounded-xl border border-border/60 bg-surface/30 p-3 hover:border-primary/40 hover:bg-surface/60 transition-all">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 mt-0.5">
                        <Terminal className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Full-Stack Development</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Building responsive web applications with React, Node.js, Express, and
                          MongoDB.
                        </p>
                      </div>
                    </div>

                    <div className="tab-item flex items-start gap-3 rounded-xl border border-border/60 bg-surface/30 p-3 hover:border-primary/40 hover:bg-surface/60 transition-all">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 mt-0.5">
                        <Zap className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Clean &amp; Readable Code
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Writing structured, easy-to-understand code with proper Git version
                          control.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Jump Action (Delegates to Lenis) */}
                  <div className="pt-3.5 border-t border-border/80 flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      Check out the projects I have built
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToId("projects")}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <span>Explore Projects</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB 2: Java & DSA (Simple, Clear & Factual) ── */}
              {activeTab === "dsa" && (
                <div className="space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary mb-1.5">
                      <Code2 className="size-3" />
                      Problem Solving
                    </span>
                    <h4 className="font-display text-lg sm:text-xl font-bold text-foreground leading-snug">
                      Data Structures &amp; Algorithms in Java
                    </h4>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      I practice coding questions regularly on LeetCode using Java. I focus on
                      writing clean logic with optimal time and space complexity.
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="tab-item rounded-xl border border-border/70 bg-surface/40 p-3 text-center">
                      <span className="block font-mono text-[10px] text-muted-foreground">
                        Language
                      </span>
                      <span className="font-display text-sm font-bold text-foreground mt-0.5 block">
                        Java
                      </span>
                    </div>

                    <div className="tab-item rounded-xl border border-border/70 bg-surface/40 p-3 text-center">
                      <span className="block font-mono text-[10px] text-muted-foreground">
                        Platform
                      </span>
                      <span className="font-display text-sm font-bold text-primary mt-0.5 block">
                        LeetCode
                      </span>
                    </div>

                    <div className="tab-item rounded-xl border border-border/70 bg-surface/40 p-3 text-center">
                      <span className="block font-mono text-[10px] text-muted-foreground">
                        Problems
                      </span>
                      <span className="font-display text-sm font-bold text-foreground mt-0.5 block">
                        {dsaCount} Solved
                      </span>
                    </div>
                  </div>

                  {/* Mastered Patterns Grid */}
                  <div>
                    <span className="font-mono text-[11px] text-muted-foreground block mb-2 font-medium">
                      Topics Practiced:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Arrays & Strings",
                        "Two Pointers",
                        "Binary Search",
                        "Linked Lists",
                        "Trees & Recursion",
                        "Hash Maps",
                        "Stacks & Queues",
                        "Dynamic Programming",
                      ].map((topic) => (
                        <span
                          key={topic}
                          className="tab-item inline-flex items-center gap-1 rounded-lg border border-border bg-surface/60 px-2.5 py-1 font-mono text-[11px] text-foreground/80 hover:border-primary/40 transition-colors"
                        >
                          <CheckCircle2 className="size-3 text-primary" />
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Jump Action (Delegates to Lenis) */}
                  <div className="pt-3.5 border-t border-border/80 flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      View full LeetCode breakdown
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToId("dsa")}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <span>Jump to LeetCode Section</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB 3: Education & SRMU (Simple & Clear) ── */}
              {activeTab === "education" && (
                <div className="space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary mb-1.5">
                      <GraduationCap className="size-3" />
                      College &amp; Degree
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-display text-lg sm:text-xl font-bold text-foreground leading-snug">
                        {currentEducation.title}
                      </h4>
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/25 px-2.5 py-0.5 rounded-full">
                        {currentEducation.detail || "CGPA 7.63"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-primary">
                      {universityShortName}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Batch {currentEducation.period}
                    </p>
                  </div>

                  {/* University Highlights */}
                  <div className="tab-item rounded-xl border border-border/70 bg-surface/30 p-3.5 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Award className="size-3.5 text-primary shrink-0" />
                      <span>Consistent academic performance with CGPA {cgpaValue}.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                      <span>Regular lab coursework in Java Programming, DBMS, and Web Tech.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                      <span>Targeting software developer internships for 2026/27.</span>
                    </div>
                  </div>

                  {/* Coursework Chips */}
                  <div>
                    <span className="font-mono text-[11px] text-muted-foreground block mb-2 font-medium">
                      Core Subjects Studied:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(about.coursework || ABOUT_DATA.coursework).map((course) => (
                        <span
                          key={course}
                          className="tab-item inline-flex items-center rounded-lg border border-border bg-surface/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                        >
                          <BookOpen className="size-3 text-primary mr-1" />
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Jump Action (Delegates to Lenis) */}
                  <div className="pt-3.5 border-t border-border/80 flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      Campus photos, events &amp; milestones
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToId("gallery")}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <span>Academic Gallery</span>
                      <ArrowRight className="size-3.5" />
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
