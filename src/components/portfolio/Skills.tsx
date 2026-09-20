import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  Layout,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePortfolio } from "@/context/PortfolioContext";
import { SKILL_GROUPS } from "@/data/profile";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "./Section";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Map category title to its header icon
const CATEGORY_ICONS: Record<string, typeof Code2> = {
  "Programming & DSA": Code2,
  "Frontend Development": Layout,
  "Backend & APIs": Server,
  "Databases & Cloud": Database,
  "Developer Tools": Wrench,
  "CS Fundamentals": Cpu,
};

// Map individual skills to specialized icons and accent colors (Strictly warm & harmonious, ZERO GREEN)
function getSkillIcon(skill: string) {
  const lower = skill.toLowerCase();

  if (lower.includes("java") && !lower.includes("javascript")) {
    return {
      icon: Code2,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
    };
  }
  if (lower.includes("react")) {
    return {
      icon: Layers,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/25",
    };
  }
  if (lower.includes("typescript")) {
    return {
      icon: Code2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/25",
    };
  }
  if (lower.includes("javascript")) {
    return {
      icon: Code2,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/25",
    };
  }
  if (lower.includes("tailwind")) {
    return {
      icon: Layout,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/25",
    };
  }
  if (lower.includes("node")) {
    return {
      icon: Server,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
    };
  }
  if (lower.includes("express") || lower.includes("rest")) {
    return {
      icon: Zap,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/25",
    };
  }
  if (lower.includes("mongo")) {
    return {
      icon: Database,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/25",
    };
  }
  if (lower.includes("supabase")) {
    return {
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/25",
    };
  }
  if (lower.includes("postgres") || lower.includes("mysql") || lower.includes("dbms")) {
    return {
      icon: Database,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/25",
    };
  }
  if (lower.includes("git") || lower.includes("github")) {
    return {
      icon: Terminal,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/25",
    };
  }
  if (lower.includes("postman")) {
    return {
      icon: Globe,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/25",
    };
  }
  if (lower.includes("jwt") || lower.includes("auth")) {
    return {
      icon: ShieldCheck,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/25",
    };
  }
  if (lower.includes("network")) {
    return {
      icon: Network,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/25",
    };
  }
  if (lower.includes("oop") || lower.includes("operating")) {
    return {
      icon: Cpu,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/25",
    };
  }
  if (lower.includes("leetcode")) {
    return {
      icon: Code2,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
    };
  }

  return {
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/25",
  };
}

type FilterKey = "all" | "primary" | "dsa" | "frontend" | "backend" | "database" | "tools";

export function Skills() {
  const { data } = usePortfolio();
  const skillGroups = data?.skillGroups || SKILL_GROUPS;

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  // Total technology count
  const totalSkillsCount = useMemo(() => {
    return skillGroups.reduce((acc, g) => acc + g.skills.length, 0);
  }, [skillGroups]);

  // Filter options with dynamic counts
  const filters: { key: FilterKey; label: string; count?: number }[] = [
    { key: "all", label: "All Stack", count: skillGroups.length },
    {
      key: "primary",
      label: "Core Pillars",
      count: skillGroups.filter((g) => g.primary).length,
    },
    { key: "dsa", label: "Java & DSA" },
    { key: "frontend", label: "Frontend" },
    { key: "backend", label: "Backend & APIs" },
    { key: "database", label: "Databases & Cloud" },
    { key: "tools", label: "Tools & CS" },
  ];

  // Filtered skill groups based on active tab
  const filteredGroups = useMemo(() => {
    if (activeFilter === "all") return skillGroups;
    if (activeFilter === "primary") return skillGroups.filter((g) => g.primary);
    if (activeFilter === "dsa") {
      return skillGroups.filter((g) => g.title.toLowerCase().includes("programming"));
    }
    if (activeFilter === "frontend") {
      return skillGroups.filter((g) => g.title.toLowerCase().includes("frontend"));
    }
    if (activeFilter === "backend") {
      return skillGroups.filter((g) => g.title.toLowerCase().includes("backend"));
    }
    if (activeFilter === "database") {
      return skillGroups.filter((g) => g.title.toLowerCase().includes("database"));
    }
    if (activeFilter === "tools") {
      return skillGroups.filter(
        (g) =>
          g.title.toLowerCase().includes("tools") || g.title.toLowerCase().includes("fundamentals"),
      );
    }
    return skillGroups;
  }, [skillGroups, activeFilter]);

  // GSAP ScrollTrigger Entrance Animation on Mount
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
      // Metrics Bar Entrance
      gsap.fromTo(
        ".skills-metrics-anim",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      // Filter Tabs Entrance
      gsap.fromTo(
        ".skills-filter-anim",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      // Cards Grid Staggered Slide & Scale
      gsap.fromTo(
        ".skill-card-item",
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsGridRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP Smooth Transition when Switching Filters
  useEffect(() => {
    if (!cardsGridRef.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.fromTo(
      ".skill-card-item",
      { opacity: 0, y: 16, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.38,
        stagger: 0.05,
        ease: "power2.out",
      },
    );
  }, [activeFilter]);

  // Ambient Cursor Spotlight on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Section id="skills" ref={sectionRef} tone="surface">
      <SectionHeading
        eyebrow="Technical Stack"
        title="Skills &amp; Modern Technologies"
        description="Production-tested engineering competencies across algorithmic problem solving, modern frontend frameworks, scalable backend APIs, and cloud databases."
      />

      {/* ── Top Metric Highlights Bar ── */}
      <div className="skills-metrics-anim mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-white/10 bg-card/90 p-3.5 sm:p-4 shadow-sm backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              Technologies
            </span>
            <Code2 className="size-3.5 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display text-xl sm:text-2xl font-bold text-foreground">
              {totalSkillsCount}+
            </span>
            <span className="text-[11px] font-mono text-primary font-medium">Stack Tools</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-card/90 p-3.5 sm:p-4 shadow-sm backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              Core Pillars
            </span>
            <Sparkles className="size-3.5 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display text-xl sm:text-2xl font-bold text-foreground">3</span>
            <span className="text-[11px] font-mono text-primary font-medium">Primary Focus</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-card/90 p-3.5 sm:p-4 shadow-sm backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              Algorithmic Core
            </span>
            <Zap className="size-3.5 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Java &amp; DSA
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">LeetCode</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-card/90 p-3.5 sm:p-4 shadow-sm backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              Architecture
            </span>
            <Layers className="size-3.5 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display text-xl sm:text-2xl font-bold text-foreground">
              MERN Stack
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">Full-Stack</span>
          </div>
        </div>
      </div>

      {/* ── Interactive Category Filter Pills ── */}
      <div className="skills-filter-anim mt-6 sm:mt-8 flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1">
        {filters.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "border border-primary/60 bg-primary/15 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
                  : "border border-border/80 bg-surface/60 text-muted-foreground hover:border-border-strong hover:text-foreground hover:bg-surface",
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 font-mono text-[10px]",
                    isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Technical Stack Cards Grid ── */}
      <div
        ref={cardsGridRef}
        className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredGroups.map((group) => {
          const CategoryIcon = CATEGORY_ICONS[group.title] || Code2;

          return (
            <div
              key={group.title}
              onMouseMove={handleMouseMove}
              className={cn(
                "skill-card-item group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300",
                "border border-white/10 bg-card/90 shadow-md ring-1 ring-white/5 backdrop-blur-xl",
                "hover:border-primary/50 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1",
                group.primary && "border-primary/35 shadow-primary/5",
              )}
              style={{
                backgroundImage:
                  "radial-gradient(400px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), oklch(0.72 0.15 52 / 0.08), transparent 75%)",
              }}
            >
              {/* Subtle top ember border line */}
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-[2px] transition-opacity duration-300",
                  group.primary
                    ? "bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"
                    : "bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40 group-hover:via-primary/50 group-hover:opacity-80",
                )}
              />

              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all duration-300 group-hover:scale-110",
                        group.primary
                          ? "bg-primary/20 text-primary ring-1 ring-primary/30 shadow-xs"
                          : "bg-secondary text-foreground group-hover:bg-primary/15 group-hover:text-primary",
                      )}
                    >
                      <CategoryIcon className="size-4.5" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {group.title}
                      </h3>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {group.skills.length} competencies
                      </span>
                    </div>
                  </div>

                  {group.primary ? (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary font-semibold shadow-2xs">
                      <Sparkles className="size-2.5" />
                      <span>Primary</span>
                    </span>
                  ) : null}
                </div>

                {/* Skill Chips with High-Fidelity Icons */}
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const { icon: SkillIcon, color, bg, border } = getSkillIcon(skill);

                    return (
                      <li
                        key={skill}
                        className={cn(
                          "group/chip inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-default",
                          "bg-surface/80 border-border/80 text-foreground",
                          "hover:border-primary/50 hover:bg-primary/10 hover:scale-[1.03] hover:shadow-xs",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-md border",
                            bg,
                            border,
                          )}
                        >
                          <SkillIcon className={cn("size-3 transition-transform", color)} />
                        </span>
                        <span className="font-mono text-[11px] sm:text-xs text-foreground/90 group-hover/chip:text-primary transition-colors">
                          {skill}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Bottom Card Footer Accent */}
              <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      group.primary ? "bg-primary" : "bg-muted-foreground/50",
                    )}
                  />
                  <span>
                    {group.primary ? "Verified Production Stack" : "Practical Proficiency"}
                  </span>
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary flex items-center gap-0.5">
                  <span>Explore</span>
                  <ArrowUpRight className="size-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Interactive Navigation Banner (Lenis Smooth Scroll) ── */}
      <div className="mt-8 sm:mt-12 rounded-2xl border border-white/10 bg-card/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display text-sm sm:text-base font-bold text-foreground">
            Want to see these technologies implemented in real applications?
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Inspect live deployed projects, GitHub source code, and algorithmic LeetCode solutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => scrollToId("projects")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <span>Explore Projects</span>
            <ArrowUpRight className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => scrollToId("dsa")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:border-primary/40 hover:bg-surface/90 active:scale-95 transition-all cursor-pointer"
          >
            <span>LeetCode Stats</span>
            <Code2 className="size-3.5 text-primary" />
          </button>
        </div>
      </div>
    </Section>
  );
}
