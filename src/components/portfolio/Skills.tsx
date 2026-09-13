import {
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
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";

import { SKILL_GROUPS } from "@/data/profile";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

// Map category title to its header icon
const CATEGORY_ICONS: Record<string, typeof Code2> = {
  "Programming & DSA": Code2,
  "Frontend Development": Layout,
  "Backend & APIs": Server,
  "Databases & Cloud": Database,
  "Developer Tools": Wrench,
  "CS Fundamentals": Cpu,
};

// Map individual skills to specialized icons and accent colors
function getSkillIcon(skill: string) {
  const lower = skill.toLowerCase();

  if (lower.includes("java") && !lower.includes("javascript")) {
    return { icon: Code2, color: "text-amber-500", bg: "bg-amber-500/10" };
  }
  if (lower.includes("react")) {
    return { icon: Layers, color: "text-cyan-400", bg: "bg-cyan-500/10" };
  }
  if (lower.includes("typescript")) {
    return { icon: Code2, color: "text-blue-400", bg: "bg-blue-500/10" };
  }
  if (lower.includes("javascript")) {
    return { icon: Code2, color: "text-yellow-400", bg: "bg-yellow-500/10" };
  }
  if (lower.includes("tailwind")) {
    return { icon: Layout, color: "text-teal-400", bg: "bg-teal-500/10" };
  }
  if (lower.includes("node")) {
    return { icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" };
  }
  if (lower.includes("express") || lower.includes("rest")) {
    return { icon: Zap, color: "text-primary", bg: "bg-primary/10" };
  }
  if (lower.includes("mongo")) {
    return { icon: Database, color: "text-emerald-400", bg: "bg-emerald-500/10" };
  }
  if (lower.includes("supabase")) {
    return { icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" };
  }
  if (lower.includes("postgres") || lower.includes("mysql") || lower.includes("dbms")) {
    return { icon: Database, color: "text-blue-400", bg: "bg-blue-500/10" };
  }
  if (lower.includes("git")) {
    return { icon: Terminal, color: "text-orange-500", bg: "bg-orange-500/10" };
  }
  if (lower.includes("postman")) {
    return { icon: Globe, color: "text-orange-400", bg: "bg-orange-500/10" };
  }
  if (lower.includes("jwt") || lower.includes("auth")) {
    return { icon: ShieldCheck, color: "text-rose-400", bg: "bg-rose-500/10" };
  }
  if (lower.includes("network")) {
    return { icon: Network, color: "text-purple-400", bg: "bg-purple-500/10" };
  }
  if (lower.includes("oop") || lower.includes("operating")) {
    return { icon: Cpu, color: "text-indigo-400", bg: "bg-indigo-500/10" };
  }

  return { icon: BookOpen, color: "text-primary", bg: "bg-primary/10" };
}

export function Skills() {
  return (
    <Section id="skills" tone="surface">
      <SectionHeading
        eyebrow="Technical Stack"
        title="Skills &amp; Technologies"
        description="Core programming languages, full-stack frameworks, cloud databases, and development tooling."
      />

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, index) => {
          const CategoryIcon = CATEGORY_ICONS[group.title] || Code2;

          return (
            <Reveal
              key={group.title}
              delay={index * 40}
              className={cn(
                "group rounded-2xl border bg-card p-4 sm:p-5 transition-all duration-300 hover:shadow-soft flex flex-col justify-between",
                group.primary
                  ? "border-primary/40 shadow-xs hover:border-primary/60"
                  : "border-border hover:border-border-strong",
              )}
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                      <CategoryIcon className="size-4" />
                    </div>
                    <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                      {group.title}
                    </h3>
                  </div>

                  {group.primary ? (
                    <span className="shrink-0 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary font-semibold">
                      Primary
                    </span>
                  ) : null}
                </div>

                {/* Skill Chips with Icons */}
                <ul className="mt-3.5 flex flex-wrap gap-1.5 sm:gap-2">
                  {group.skills.map((skill) => {
                    const { icon: SkillIcon, color, bg } = getSkillIcon(skill);

                    return (
                      <li
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-2.5 py-1 text-xs font-medium text-foreground transition-all duration-200 hover:border-border-strong hover:bg-surface hover:scale-[1.02]"
                      >
                        <span className={cn("flex size-4 items-center justify-center rounded", bg)}>
                          <SkillIcon className={cn("size-2.5", color)} />
                        </span>
                        <span className="font-mono text-[11px] sm:text-xs text-muted-foreground group-hover/item:text-foreground">
                          {skill}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
