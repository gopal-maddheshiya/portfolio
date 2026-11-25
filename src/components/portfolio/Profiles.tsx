import {
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code,
  Code2,
  Cpu,
  Database,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Linkedin,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { usePortfolio } from "@/context/PortfolioContext";
import { DEFAULT_SECTION_HEADERS } from "@/data/profile";
import { useLeetCodeStats } from "@/hooks/useLeetCodeStats";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

type ProfileCard = {
  name: string;
  handle?: string | undefined;
  description: string;
  cta: string;
  url: string;
  badge?: string | undefined;
  liveBadge?: boolean | undefined;
  Icon: LucideIcon;
};

const CODING_PROFILE_ICONS: Record<string, LucideIcon> = {
  code: Code2,
  terminal: Terminal,
  codechef: Code,
  trophy: Trophy,
  braces: Code,
  cpu: Cpu,
  zap: Zap,
  db: Database,
  award: Award,
  sparkles: Sparkles,
  grad: GraduationCap,
  globe: Globe,
  layers: Layers,
  book: BookOpen,
  briefcase: Briefcase,
  star: Star,
  check: CheckCircle2,
};

export function Profiles() {
  const { data } = usePortfolio();
  const info = data.personalInfo;
  const codingProfiles = data.codingProfiles || [];
  const { total: leetCodeTotal, isLive: isLeetCodeLive } = useLeetCodeStats(info.leetcodeUsername);

  const linkedInHandle = info.linkedin?.replace(/\/+$/, "").split("/").pop() || "gopal-maddheshiya";
  const profilesHeader = {
    eyebrow: data.sectionHeaders?.profiles?.eyebrow || DEFAULT_SECTION_HEADERS.profiles.eyebrow,
    title: data.sectionHeaders?.profiles?.title || DEFAULT_SECTION_HEADERS.profiles.title,
    description:
      data.sectionHeaders?.profiles?.description || DEFAULT_SECTION_HEADERS.profiles.description,
  };

  const visibleCodingProfiles = codingProfiles.filter((p) => Boolean(p.url) && !p.hidden);
  const leetCodeProfile = visibleCodingProfiles.find((p) => p.name.toLowerCase() === "leetcode");
  const otherCodingProfiles = visibleCodingProfiles.filter(
    (p) => p.name.toLowerCase() !== "leetcode",
  );

  // Top Spotlight Row: GitHub + LeetCode (live stats synced)
  const spotlightCards: ProfileCard[] = [
    {
      name: "GitHub",
      handle: info.githubUsername,
      description:
        "Production repositories, REST APIs, open-source source code, and documented DSA work.",
      cta: "Explore GitHub",
      url: info.github,
      badge: `${data.projects.length} Public Projects`,
      Icon: Github,
    },
    ...(leetCodeProfile
      ? [
          {
            name: leetCodeProfile.name,
            handle: leetCodeProfile.username || info.leetcodeUsername,
            description: leetCodeProfile.description,
            cta: `View ${leetCodeProfile.name}`,
            url: leetCodeProfile.url,
            badge:
              leetCodeTotal > 0
                ? `${leetCodeTotal}+ Solved`
                : leetCodeProfile.highlight || "Java & DSA",
            liveBadge: Boolean(isLeetCodeLive),
            Icon: CODING_PROFILE_ICONS[leetCodeProfile.icon] || Code2,
          },
        ]
      : []),
  ];

  // Secondary Compact Grid: Other visible coding profiles + LinkedIn
  const secondaryCards: ProfileCard[] = [
    ...otherCodingProfiles.map((profile) => ({
      name: profile.name,
      handle: profile.username,
      description: profile.description,
      cta: `View ${profile.name}`,
      url: profile.url,
      badge: profile.highlight,
      Icon: CODING_PROFILE_ICONS[profile.icon] || Code2,
    })),
    {
      name: "LinkedIn",
      handle: linkedInHandle,
      description: "Engineering updates, hackathon milestones, and direct recruiter network.",
      cta: "Connect on LinkedIn",
      url: info.linkedin,
      badge: info.universityShort || "Professional",
      Icon: Linkedin,
    },
  ];

  return (
    <Section id="profiles">
      <SectionHeading
        eyebrow={profilesHeader.eyebrow}
        title={profilesHeader.title}
        description={profilesHeader.description}
      />

      {/* Primary Engineering Profiles (GitHub + Live LeetCode Spotlight) */}
      <div
        className={
          spotlightCards.length > 1
            ? "mt-8 sm:mt-10 grid gap-4 sm:gap-5 md:grid-cols-2"
            : "mt-8 sm:mt-10 grid gap-4 sm:gap-5 max-w-2xl"
        }
      >
        {spotlightCards.map((profile, index) => (
          <Reveal key={profile.name} delay={index * 50} className="h-full">
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${profile.cta} (opens in a new tab)`}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 transition-[border-color,box-shadow] duration-200 hover:border-primary/50 hover:shadow-soft before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/45 before:to-transparent"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <profile.Icon className="size-5 shrink-0" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base sm:text-lg font-semibold text-foreground truncate">
                        {profile.name}
                      </h3>
                      {profile.handle ? (
                        <p className="font-mono text-xs text-muted-foreground truncate">
                          @{profile.handle}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {profile.badge ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[11px] font-medium text-primary shrink-0">
                      {profile.liveBadge ? (
                        <span
                          className="size-1.5 rounded-full bg-emerald-500 animate-pulse"
                          aria-hidden="true"
                        />
                      ) : null}
                      <span>{profile.badge}</span>
                    </span>
                  ) : null}
                </div>

                <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {profile.description}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary">
                  <span>{profile.cta}</span>
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70 hidden sm:inline">
                  Open Profile
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      {/* Secondary Coding Platforms & LinkedIn Grid */}
      {secondaryCards.length > 0 ? (
        <div className="mt-4 sm:mt-5 grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {secondaryCards.map((profile, index) => (
            <Reveal key={profile.name} delay={(index + 2) * 45} className="h-full">
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${profile.cta} (opens in a new tab)`}
                className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4 sm:p-5 transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-soft"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                      <profile.Icon className="size-4 shrink-0" aria-hidden="true" />
                    </div>
                    {profile.badge ? (
                      <span className="rounded-md border border-border bg-surface/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground truncate max-w-[140px]">
                        {profile.badge}
                      </span>
                    ) : (
                      <ArrowUpRight
                        className="size-4 text-muted-foreground/60 transition-transform duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-sm sm:text-base font-semibold text-foreground">
                    {profile.name}
                  </h3>
                  {profile.handle ? (
                    <p className="font-mono text-[11px] text-muted-foreground truncate">
                      @{profile.handle}
                    </p>
                  ) : null}

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {profile.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <span>{profile.cta}</span>
                    <ArrowUpRight
                      className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
