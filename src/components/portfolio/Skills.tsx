import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, FolderGit2, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { canHoverFinePointer, prefersReducedMotion } from "@/components/common/MagneticWrap";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  DEFAULT_SECTION_HEADERS,
  PROJECTS,
  SKILL_GROUPS,
  type Project,
  type SkillGroup,
} from "@/data/profile";
import { cn } from "@/lib/utils";
import { Section } from "./Section";
import { resolveTechIcon } from "./skills/TechBrandIcons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CORE_TAB = "__core__";

const CORE_PRIORITY_TOKENS = [
  "java",
  "react",
  "typescript",
  "tailwind",
  "node",
  "express",
  "mongo",
  "supabase",
];

/** Concise label helper for horizontal tab bar while supporting custom Admin category names. */
function getShortTabLabel(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("programming") && lower.includes("dsa")) return "Java & DSA";
  if (lower.includes("frontend")) return "Frontend";
  if (lower.includes("backend")) return "Backend";
  if (lower.includes("database")) return "Cloud & DB";
  if (lower.includes("developer tools")) return "Tools";
  if (lower.includes("cs fundamentals")) return "CS Core";
  return title;
}

/** Concise 2-word role descriptor per technology so every card shares balanced rhythm. */
function getSkillSubtitle(skillName: string, fallbackCategory: string): string {
  const lower = skillName.toLowerCase();
  if (lower.includes("java") && !lower.includes("javascript")) return "OOP & Core";
  if (lower.includes("react")) return "UI · v19";
  if (lower.includes("typescript")) return "Strict Types";
  if (lower.includes("javascript")) return "ES6+ · Async";
  if (lower.includes("tailwind")) return "Design System";
  if (lower.includes("html")) return "Semantic Web";
  if (lower.includes("node")) return "Async Runtime";
  if (lower.includes("express")) return "REST Routing";
  if (lower.includes("rest")) return "HTTP · JSON";
  if (lower.includes("jwt")) return "Token Security";
  if (lower.includes("postman")) return "API Testing";
  if (lower.includes("mongo")) return "NoSQL · Atlas";
  if (lower.includes("mongoose")) return "Schema ODM";
  if (lower.includes("supabase")) return "Postgres · RLS";
  if (lower.includes("postgres")) return "Relational SQL";
  if (lower.includes("mysql")) return "ACID SQL";
  if (lower.includes("data structure")) return "Trees · Graphs";
  if (lower.includes("algorithm")) return "DP · Greedy";
  if (lower.includes("complexity")) return "Big-O Tuning";
  if (lower.includes("oop")) return "System Design";
  if (lower.includes("dbms")) return "Normalization";
  if (lower.includes("operating")) return "OS · Threads";
  if (lower.includes("network")) return "TCP/IP · HTTP";
  if (lower.includes("git") && !lower.includes("github")) return "Version Control";
  if (lower.includes("github")) return "Repos & CI";
  if (lower.includes("vercel")) return "Edge Deploy";
  if (lower.includes("render")) return "Cloud Host";
  if (lower.includes("leetcode")) return "DSA Arena";
  if (lower.includes("vs code")) return "Code Editor";
  if (lower.includes("intellij")) return "Java IDE";
  return getShortTabLabel(fallbackCategory);
}

/** Loose token matching between a skill name and a project's declared technology tags. */
function doesSkillMatchTech(skill: string, projectTech: string): boolean {
  const normalize = (val: string) =>
    val
      .toLowerCase()
      .replace(/\.js|\(es6\+\)|\(oop\)|\(dbms\)|atlas|odm|api testing|concepts/gi, "")
      .replace(/[^a-z0-9]/g, " ")
      .trim();

  const s = normalize(skill);
  const p = normalize(projectTech);
  if (!s || !p) return false;

  if (s === "java" && p.includes("javascript")) return false;
  if (s.includes("javascript") && p === "java") return false;

  const sTokens = s.split(/\s+/).filter((t) => t.length >= 2);
  return sTokens.some((token) => p.includes(token)) || p.includes(s);
}

function getMatchingProjects(skillNames: string[], projects: Project[]): Project[] {
  if (!skillNames.length || !projects.length) return [];
  return projects.filter((project) =>
    project.technologies.some((tech) =>
      skillNames.some((skill) => doesSkillMatchTech(skill, tech)),
    ),
  );
}

/** Choose symmetric grid columns by item count to avoid orphan gaps. */
function getSymmetricGridClasses(count: number): string {
  if (count === 5) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
  if (count === 3) return "grid-cols-2 sm:grid-cols-3";
  return "grid-cols-2 md:grid-cols-4";
}

interface CardItem {
  name: string;
  category: string;
}

/** Unique animated showcase card: conic aurora border trace, subtle desktop 3D tilt, and pointer spotlight. */
function AnimatedSkillCard({
  item,
  isSelected,
  spanFullOnLastOddMobile,
  onSelect,
}: {
  item: CardItem;
  isSelected: boolean;
  spanFullOnLastOddMobile: boolean;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const quickRotXRef = useRef<gsap.QuickToFunc | null>(null);
  const quickRotYRef = useRef<gsap.QuickToFunc | null>(null);
  const quickYRef = useRef<gsap.QuickToFunc | null>(null);
  const { Icon, toneClass } = resolveTechIcon(item.name);
  const subtitle = getSkillSubtitle(item.name, item.category);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { transformPerspective: 650 });
      quickRotXRef.current = gsap.quickTo(el, "rotateX", { duration: 0.25, ease: "power2.out" });
      quickRotYRef.current = gsap.quickTo(el, "rotateY", { duration: 0.25, ease: "power2.out" });
      quickYRef.current = gsap.quickTo(el, "y", { duration: 0.25, ease: "power2.out" });
    }, cardRef);

    return () => {
      quickRotXRef.current = null;
      quickRotYRef.current = null;
      quickYRef.current = null;
      ctx.revert();
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const el = cardRef.current;
    if (
      !el ||
      !quickRotXRef.current ||
      !quickRotYRef.current ||
      !quickYRef.current ||
      !canHoverFinePointer()
    ) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 8;
    const rotateX = (y / rect.height - 0.5) * -8;

    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
    quickRotXRef.current(rotateX);
    quickRotYRef.current(rotateY);
    quickYRef.current(-2);
  }, []);

  const handlePointerLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--spot-x", "-300px");
    el.style.setProperty("--spot-y", "-300px");
    if (canHoverFinePointer()) {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    }
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-pressed={isSelected}
      data-active={isSelected}
      title={item.name}
      className={cn(
        "skill-card-item skill-card-aurora group flex items-center gap-3 rounded-xl border p-3 sm:p-3.5 text-left transition-[background-color,border-color,box-shadow] duration-200 cursor-pointer active:scale-[0.97]",
        "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
        spanFullOnLastOddMobile && "max-sm:col-span-2",
        isSelected
          ? "border-transparent bg-card shadow-soft"
          : "border-border bg-card hover:bg-surface/80 hover:shadow-xs",
      )}
      style={{
        backgroundImage:
          "radial-gradient(220px circle at var(--spot-x, -300px) var(--spot-y, -300px), oklch(0.72 0.15 52 / 0.09), transparent 72%)",
      }}
    >
      <span
        className={cn(
          "flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-surface transition-transform duration-200 group-hover:scale-105",
          toneClass,
        )}
      >
        <Icon className="size-4.5 sm:size-5" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[13px] sm:text-sm font-semibold text-foreground leading-snug">
          {item.name}
        </span>
        <span className="block truncate font-mono text-[10.5px] sm:text-[11px] text-muted-foreground mt-0.5">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

export function Skills() {
  const { data } = usePortfolio();
  const skillGroups: SkillGroup[] =
    data.skillGroups && data.skillGroups.length > 0 ? data.skillGroups : SKILL_GROUPS;
  const projects: Project[] = data.projects && data.projects.length > 0 ? data.projects : PROJECTS;

  const [activeTab, setActiveTab] = useState<string>(CORE_TAB);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevTabRef = useRef<string>(CORE_TAB);

  // Build balanced up-to-8-card Core Stack dynamically from Admin selections or canonical tokens
  const coreCards: CardItem[] = useMemo(() => {
    const allItems: CardItem[] = [];
    skillGroups.forEach((group) => {
      (group.skills || []).forEach((name) => {
        allItems.push({ name, category: group.title });
      });
    });

    const picked: CardItem[] = [];
    const seen = new Set<string>();

    const adminFeatured = (data.featuredSkills || []).map((s) => s.trim()).filter(Boolean);
    adminFeatured.slice(0, 8).forEach((skillName) => {
      const lower = skillName.toLowerCase();
      if (seen.has(lower)) return;
      seen.add(lower);
      const matched = allItems.find((item) => item.name.toLowerCase() === lower);
      picked.push(matched || { name: skillName, category: "Core Stack" });
    });

    if (picked.length < 8) {
      CORE_PRIORITY_TOKENS.forEach((token) => {
        if (picked.length >= 8) return;
        const match = allItems.find((item) => {
          const lower = item.name.toLowerCase();
          if (token === "java" && lower.includes("javascript")) return false;
          return lower.includes(token) && !seen.has(lower);
        });
        if (match) {
          seen.add(match.name.toLowerCase());
          picked.push(match);
        }
      });
    }

    if (picked.length < 8) {
      const primaryPool = allItems.filter((item) => !seen.has(item.name.toLowerCase()));
      for (const candidate of primaryPool) {
        if (picked.length >= 8) break;
        seen.add(candidate.name.toLowerCase());
        picked.push(candidate);
      }
    }

    return picked.slice(0, 8);
  }, [skillGroups, data.featuredSkills]);

  const activeCategoryGroup = useMemo(() => {
    if (activeTab === CORE_TAB) return null;
    return skillGroups.find((g) => g.title === activeTab) || null;
  }, [activeTab, skillGroups]);

  const visibleCards: CardItem[] = useMemo(() => {
    if (activeTab === CORE_TAB) return coreCards;
    if (!activeCategoryGroup) return coreCards;
    return (activeCategoryGroup.skills || []).map((name) => ({
      name,
      category: activeCategoryGroup.title,
    }));
  }, [activeTab, coreCards, activeCategoryGroup]);

  const footerProjects = useMemo(() => {
    if (selectedSkill) return getMatchingProjects([selectedSkill], projects);
    if (activeCategoryGroup) return getMatchingProjects(activeCategoryGroup.skills || [], projects);
    return projects.filter((p) => p.featured).slice(0, 3);
  }, [selectedSkill, activeCategoryGroup, projects]);

  const handleToggleSkill = useCallback((skillName: string) => {
    setSelectedSkill((prev) => (prev === skillName ? null : skillName));
  }, []);

  const handleTabSelect = useCallback((tabId: string, index: number) => {
    setActiveTab(tabId);
    setSelectedSkill(null);
    tabRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, []);

  const tabIds = useMemo(() => [CORE_TAB, ...skillGroups.map((g) => g.title)], [skillGroups]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIndex: number | null = null;
      if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabIds.length;
      else if (e.key === "ArrowLeft")
        nextIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
      else if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = tabIds.length - 1;

      if (nextIndex !== null) {
        e.preventDefault();
        const targetId = tabIds[nextIndex];
        if (targetId) {
          handleTabSelect(targetId, nextIndex);
          tabRefs.current[nextIndex]?.focus();
        }
      }
    },
    [tabIds, handleTabSelect],
  );

  // Initial GSAP ScrollTrigger entrance (once on scroll into view; StrictMode safe)
  useEffect(() => {
    if (!gridRef.current || !sectionRef.current || prefersReducedMotion()) return;

    const cards = gridRef.current.querySelectorAll(".skill-card-item");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.04,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Staggered card reveal only when activeTab changes interactively (StrictMode-safe)
  useEffect(() => {
    if (prevTabRef.current === activeTab) return;
    prevTabRef.current = activeTab;
    if (!gridRef.current || prefersReducedMotion()) return;

    const cards = gridRef.current.querySelectorAll(".skill-card-item");
    if (!cards.length) return;

    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 10, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        stagger: 0.032,
        ease: "power2.out",
        clearProps: "transform,opacity",
      },
    );

    return () => {
      tween.kill();
    };
  }, [activeTab]);

  const activeTabDomId =
    activeTab === CORE_TAB
      ? "skills-tab-core"
      : `skills-tab-${Math.max(
          0,
          skillGroups.findIndex((g) => g.title === activeTab),
        )}`;

  const sectionHeader = {
    eyebrow: data.sectionHeaders?.skills?.eyebrow || DEFAULT_SECTION_HEADERS.skills.eyebrow,
    title: data.sectionHeaders?.skills?.title || "Skills & Core Stack",
    description: data.sectionHeaders?.skills?.description || "",
  };

  return (
    <Section id="skills" ref={sectionRef} tone="surface" className="py-12 sm:py-16">
      {/* ── Ultra-Clean Compact Header + Inline Tabs ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {sectionHeader.eyebrow}
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {sectionHeader.title}
          </h2>
          {sectionHeader.description ? (
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-xl">
              {sectionHeader.description}
            </p>
          ) : null}
        </div>

        {/* Accessible Scrollable Domain Switcher */}
        <div className="border-b border-border/80 lg:border-none max-w-full">
          <div className="skills-edge-mask overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              role="tablist"
              aria-label="Filter skills by engineering category"
              className="skills-tablist inline-flex min-w-max items-center gap-1 pr-6 md:pr-0 pb-1.5"
            >
              <button
                ref={(el) => {
                  tabRefs.current[0] = el;
                }}
                type="button"
                role="tab"
                id="skills-tab-core"
                aria-selected={activeTab === CORE_TAB}
                tabIndex={activeTab === CORE_TAB ? 0 : -1}
                onClick={() => handleTabSelect(CORE_TAB, 0)}
                onKeyDown={(e) => handleTabKeyDown(e, 0)}
                className={cn(
                  "skills-tab-item shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer",
                  activeTab === CORE_TAB
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60",
                )}
              >
                Core Stack
              </button>

              {skillGroups.map((group, idx) => {
                const tabIndex = idx + 1;
                const isSelected = activeTab === group.title;
                return (
                  <button
                    key={group.title}
                    ref={(el) => {
                      tabRefs.current[tabIndex] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`skills-tab-${idx}`}
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => handleTabSelect(group.title, tabIndex)}
                    onKeyDown={(e) => handleTabKeyDown(e, tabIndex)}
                    className={cn(
                      "skills-tab-item shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer",
                      isSelected
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/60",
                    )}
                  >
                    {getShortTabLabel(group.title)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Compact Animated Bento Card Grid ── */}
      <div
        ref={gridRef}
        role="tabpanel"
        aria-labelledby={activeTabDomId}
        className={cn(
          "mt-5 sm:mt-6 grid gap-2.5 sm:gap-3.5",
          getSymmetricGridClasses(visibleCards.length),
        )}
      >
        {visibleCards.map((item, index) => {
          const isLastOddMobile =
            visibleCards.length % 2 === 1 && index === visibleCards.length - 1;
          return (
            <AnimatedSkillCard
              key={`${item.category}-${item.name}`}
              item={item}
              isSelected={selectedSkill === item.name}
              spanFullOnLastOddMobile={isLastOddMobile}
              onSelect={() => handleToggleSkill(item.name)}
            />
          );
        })}
      </div>

      {/* ── Minimal Contextual Project Evidence Strip ── */}
      <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
          {selectedSkill ? (
            <>
              <span className="text-foreground font-medium">
                {footerProjects.length > 0
                  ? `Used in (${selectedSkill}):`
                  : `${selectedSkill} — Core Engineering Foundation`}
              </span>
              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                aria-label="Clear selected skill"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-2.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </>
          ) : (
            <span>Tap a card to filter related work:</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {footerProjects.length > 0 ? (
            footerProjects.slice(0, 3).map((proj) => (
              <a
                key={proj.title}
                href={proj.liveUrl || proj.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <FolderGit2 className="size-3 shrink-0 text-primary" aria-hidden="true" />
                <span>{proj.title.split("—")[0]?.trim()}</span>
                <ExternalLink
                  className="size-2.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </a>
            ))
          ) : (
            <span className="font-mono text-[11px] text-muted-foreground">
              Applied across coursework &amp; engineering architecture
            </span>
          )}
        </div>
      </div>
    </Section>
  );
}
