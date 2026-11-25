import type { SVGProps } from "react";
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

type BrandIconComponent = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

/** Crisp React atom mark */
function ReactBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}

/** Crisp TypeScript monogram badge */
function TypeScriptBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <path d="M7.5 11.5h4.5M9.75 11.5v6" strokeLinecap="round" />
      <path
        d="M16.7 12.2c-.35-.45-.9-.7-1.6-.7-1 0-1.65.52-1.65 1.3 0 .85.65 1.15 1.75 1.48 1.05.32 1.65.62 1.65 1.52 0 .88-.72 1.45-1.8 1.45-.82 0-1.5-.3-1.92-.85"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Crisp JavaScript monogram badge */
function JavaScriptBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <path d="M10.5 11.5v4.4a1.6 1.6 0 0 1-3.1.5" strokeLinecap="round" />
      <path
        d="M16.7 12.2c-.35-.45-.9-.7-1.6-.7-1 0-1.65.52-1.65 1.3 0 .85.65 1.15 1.75 1.48 1.05.32 1.65.62 1.65 1.52 0 .88-.72 1.45-1.8 1.45-.82 0-1.5-.3-1.92-.85"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Crisp Java steaming cup mark */
function JavaBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M5 10h11v4.5a5.5 5.5 0 0 1-11 0V10Z" strokeLinejoin="round" />
      <path d="M16 11h2.2a2.2 2.2 0 0 1 0 4.4H16" strokeLinecap="round" />
      <path d="M4.5 20.5h13" strokeLinecap="round" />
      <path d="M8.5 3.5c1 1.2-.5 2.4.5 3.6M12.5 3.5c1 1.2-.5 2.4.5 3.6" strokeLinecap="round" />
    </svg>
  );
}

/** Crisp Tailwind double wave mark */
function TailwindBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path
        d="M6.5 9.5C7.7 6.8 9.6 5.5 12 5.5c3.6 0 4.2 2.7 6 3 1.2.2 2.3-.2 3.3-1.2-1.2 2.7-3.1 4-5.5 4-3.6 0-4.2-2.7-6-3-1.2-.2-2.3.2-3.3 1.2ZM3 15.5c1.2-2.7 3.1-4 5.5-4 3.6 0 4.2 2.7 6 3 1.2.2 2.3-.2 3.3-1.2-1.2 2.7-3.1 4-5.5 4-3.6 0-4.2-2.7-6-3-1.2-.2-2.3.2-3.3 1.2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Crisp Node.js hexagon mark */
function NodeBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M12 2.5 20 7.1v9.8L12 21.5 4 16.9V7.1L12 2.5Z" strokeLinejoin="round" />
      <path d="M9.2 15V9l5.6 6V9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Crisp Express.js routing monogram */
function ExpressBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M10.5 8.5H5.5v7h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 12h4.2" strokeLinecap="round" />
      <path d="M13.5 9.5 19 15.5M19 9.5l-5.5 6" strokeLinecap="round" />
    </svg>
  );
}

/** Crisp MongoDB leaf mark */
function MongoBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path
        d="M12 2.5c3.5 4.2 5 8 5 11.4 0 3.2-2 5.4-5 6.6-3-1.2-5-3.4-5-6.6 0-3.4 1.5-7.2 5-11.4Z"
        strokeLinejoin="round"
      />
      <path d="M12 7v14.5" strokeLinecap="round" />
    </svg>
  );
}

/** Crisp Supabase angled bolt mark */
function SupabaseBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M13.3 2.8 4.8 13.5h6.7l-.8 7.7 8.5-10.7h-6.7l.8-7.7Z" strokeLinejoin="round" />
    </svg>
  );
}

/** Crisp LeetCode bracket & spark mark */
function LeetCodeBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14.5 4.5 7 12l7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 15.5 14 19l4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 12h7" strokeLinecap="round" />
    </svg>
  );
}

/** Crisp Git branching mark */
function GitBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="7" cy="6" r="2.2" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M7 8.2v7.6M7 14c0-2.5 3-3.5 7.8-4.5" strokeLinecap="round" />
    </svg>
  );
}

/** Crisp Vercel prism mark */
function VercelBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M12 4.5 20.5 19H3.5L12 4.5Z" strokeLinejoin="round" />
    </svg>
  );
}

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
