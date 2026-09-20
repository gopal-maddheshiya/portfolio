import { ArrowUpRight, Code, Code2, Github, Linkedin, Terminal, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { usePortfolio } from "@/context/PortfolioContext";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

type ProfileCard = {
  name: string;
  handle?: string;
  description: string;
  cta: string;
  url: string;
  Icon: LucideIcon;
};

const CODING_PROFILE_ICONS: Record<string, LucideIcon> = {
  code: Code2,
  terminal: Terminal,
  codechef: Code,
  trophy: Trophy,
  braces: Code,
};

export function Profiles() {
  const { data } = usePortfolio();
  const info = data.personalInfo;
  const codingProfiles = data.codingProfiles;

  const profileCards: ProfileCard[] = [
    {
      name: "GitHub",
      handle: info.githubUsername,
      description: "Projects, repositories, and source code for all my work.",
      cta: "View GitHub",
      url: info.github,
      Icon: Github,
    },
    ...codingProfiles.flatMap((profile) =>
      profile.url && !profile.hidden
        ? [
            {
              name: profile.name,
              handle: profile.username,
              description: profile.description,
              cta: `View ${profile.name}`,
              url: profile.url,
              Icon: CODING_PROFILE_ICONS[profile.icon] || Code2,
            },
          ]
        : [],
    ),
    {
      name: "LinkedIn",
      handle: "gopal-maddheshiya",
      description: "Professional profile, experience, and academic updates.",
      cta: "View LinkedIn",
      url: info.linkedin,
      Icon: Linkedin,
    },
  ];

  return (
    <Section id="profiles" tone="surface">
      <SectionHeading
        eyebrow="Coding Profiles"
        title="Platforms &amp; Practice"
        description="Public problem solving, open-source work, and competitive programming profiles."
      />

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {profileCards.map((profile, index) => (
          <Reveal key={profile.name} delay={index * 50} className="h-full">
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${profile.cta} (opens in a new tab)`}
              className="group flex h-full min-h-48 sm:min-h-52 flex-col justify-between rounded-xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-border-strong hover:shadow-soft"
            >
              <div>
                {/* Top Row: Icon & Arrow */}
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                    <profile.Icon className="size-5 shrink-0" aria-hidden="true" />
                  </div>
                  <ArrowUpRight
                    className="size-4 text-muted-foreground/60 transition-transform duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>

                {/* Name & Handle */}
                <h3 className="mt-3.5 font-display text-base sm:text-lg font-semibold text-foreground">
                  {profile.name}
                </h3>
                {profile.handle ? (
                  <p className="font-mono text-xs text-muted-foreground">@{profile.handle}</p>
                ) : null}

                {/* Description */}
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {profile.description}
                </p>
              </div>

              {/* Action text */}
              <div className="mt-4 pt-3 border-t border-border/60">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary">
                  <span>{profile.cta}</span>
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
