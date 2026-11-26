import {
  BookOpen,
  Braces,
  Code2,
  Cpu,
  Database,
  Gauge,
  GitFork,
  Globe,
  HardDrive,
  Layers,
  Network,
  Server,
  ShieldCheck,
  Table2,
  Terminal,
  Workflow,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  type BrandIconComponent,
  ExpressBrandIcon,
  GitBrandIcon,
  JavaBrandIcon,
  JavaScriptBrandIcon,
  LeetCodeBrandIcon,
  MongoBrandIcon,
  NodeBrandIcon,
  ReactBrandIcon,
  SupabaseBrandIcon,
  TailwindBrandIcon,
  TypeScriptBrandIcon,
  VercelBrandIcon,
} from "./BrandSvgIcons";

export interface TechIconMeta {
  Icon: BrandIconComponent | LucideIcon;
  toneClass: string;
}

/** Map a skill name cleanly to a lightweight brand SVG or Lucide icon within the warm palette. */
export function resolveTechIcon(skillName: string): TechIconMeta {
  const lower = skillName.toLowerCase();

  if (lower.includes("java") && !lower.includes("javascript")) {
    return { Icon: JavaBrandIcon, toneClass: "text-primary" };
  }
  if (lower.includes("react")) {
    return { Icon: ReactBrandIcon, toneClass: "text-accent" };
  }
  if (lower.includes("typescript")) {
    return { Icon: TypeScriptBrandIcon, toneClass: "text-accent" };
  }
  if (lower.includes("javascript")) {
    return { Icon: JavaScriptBrandIcon, toneClass: "text-amber-600 dark:text-amber-400" };
  }
  if (lower.includes("tailwind")) {
    return { Icon: TailwindBrandIcon, toneClass: "text-accent" };
  }
  if (lower.includes("node")) {
    return { Icon: NodeBrandIcon, toneClass: "text-primary" };
  }
  if (lower.includes("express")) {
    return { Icon: ExpressBrandIcon, toneClass: "text-foreground" };
  }
  if (lower.includes("mongo")) {
    return { Icon: MongoBrandIcon, toneClass: "text-primary" };
  }
  if (lower.includes("supabase")) {
    return { Icon: SupabaseBrandIcon, toneClass: "text-primary" };
  }
  if (lower.includes("leetcode")) {
    return { Icon: LeetCodeBrandIcon, toneClass: "text-primary" };
  }
  if (lower.includes("git") || lower.includes("github")) {
    return { Icon: GitBrandIcon, toneClass: "text-primary" };
  }
  if (lower.includes("vercel")) {
    return { Icon: VercelBrandIcon, toneClass: "text-foreground" };
  }
  if (lower.includes("mongoose")) {
    return { Icon: Braces, toneClass: "text-primary" };
  }
  if (lower.includes("postgres")) {
    return { Icon: Table2, toneClass: "text-accent" };
  }
  if (lower.includes("mysql") || (lower.includes("database") && !lower.includes("management"))) {
    return { Icon: Database, toneClass: "text-accent" };
  }
  if (lower.includes("dbms") || lower.includes("database management")) {
    return { Icon: Layers, toneClass: "text-accent" };
  }
  if (lower.includes("postman") || lower.includes("rest") || lower.includes("api")) {
    return { Icon: Globe, toneClass: "text-primary" };
  }
  if (lower.includes("jwt") || lower.includes("auth")) {
    return { Icon: ShieldCheck, toneClass: "text-primary" };
  }
  if (lower.includes("network")) {
    return { Icon: Network, toneClass: "text-accent" };
  }
  if (lower.includes("operating")) {
    return { Icon: HardDrive, toneClass: "text-muted-foreground" };
  }
  if (lower.includes("oop") || lower.includes("object")) {
    return { Icon: Cpu, toneClass: "text-primary" };
  }
  if (lower.includes("data structure")) {
    return { Icon: GitFork, toneClass: "text-primary" };
  }
  if (lower.includes("algorithm")) {
    return { Icon: Workflow, toneClass: "text-accent" };
  }
  if (lower.includes("complexity") || lower.includes("time & space")) {
    return { Icon: Gauge, toneClass: "text-amber-600 dark:text-amber-400" };
  }
  if (lower.includes("html") || lower.includes("css")) {
    return { Icon: Code2, toneClass: "text-accent" };
  }
  if (lower.includes("render")) {
    return { Icon: Server, toneClass: "text-foreground" };
  }
  if (lower.includes("vs code") || lower.includes("intellij")) {
    return { Icon: Terminal, toneClass: "text-muted-foreground" };
  }
  if (lower.includes("tool")) {
    return { Icon: Wrench, toneClass: "text-muted-foreground" };
  }

  return { Icon: BookOpen, toneClass: "text-primary" };
}
