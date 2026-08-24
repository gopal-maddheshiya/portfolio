import { ArrowUpRight, CheckCircle2, Code2, Github } from "lucide-react";

import { DSA_INFO, PERSONAL_INFO } from "@/data/profile";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

export function DSA() {
  return (
    <Section id="dsa" tone="surface">
      <SectionHeading
        eyebrow="DSA &amp; Problem Solving"
        title="Consistent Practice in Java"
        description="Daily algorithmic problem solving focused on writing efficient code and understanding time &amp; space complexity."
      />

      <div className="mt-8 sm:mt-10 grid gap-6 lg:grid-cols-2">
        {/* Card 1: LeetCode Practice */}
        <Reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            {/* Header / Eyebrow */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-primary font-medium">
                <Code2 className="size-4 shrink-0" aria-hidden="true" />
                <span>LeetCode Practice</span>
              </div>
              <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary">
                {DSA_INFO.language}
              </span>
            </div>

            {/* Metric */}
            <div className="mt-4 flex items-baseline gap-3">
              <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {DSA_INFO.problemsSolved}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Problems Solved Daily</p>
            </div>

            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Practicing fundamental and intermediate problem patterns on LeetCode with full
              complexity notes.
            </p>

            {/* Topics */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Topics Covered
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5 sm:gap-2">
                {DSA_INFO.topics.map((topic) => (
                  <li
                    key={topic}
                    className="inline-flex items-center rounded-md border border-border bg-secondary/80 px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Link */}
          <div className="mt-6 pt-4 border-t border-border">
            <a
              href={PERSONAL_INFO.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
            >
              <span>View LeetCode Profile</span>
              <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        {/* Card 2: GitHub Solutions Repository */}
        <Reveal
          delay={80}
          className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs"
        >
          <div>
            {/* Header / Eyebrow */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-primary font-medium">
                <Github className="size-4 shrink-0" aria-hidden="true" />
                <span>DSA Solutions Repository</span>
              </div>
              <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                GitHub Repo
              </span>
            </div>

            {/* Repo Title */}
            <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
              {DSA_INFO.repoName}
            </h3>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              A structured public repository containing Java solutions organized by topic, data
              structure, and problem patterns.
            </p>

            {/* Highlights List */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Key Repository Highlights
              </p>
              <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-muted-foreground">
                {DSA_INFO.notes.map((note) => (
                  <li key={note} className="flex items-start gap-2">
                    <CheckCircle2
                      className="size-3.5 shrink-0 mt-0.5 text-primary"
                      aria-hidden="true"
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Link */}
          <div className="mt-6 pt-4 border-t border-border">
            <a
              href={DSA_INFO.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border-strong bg-secondary/60 px-5 py-3 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer"
            >
              <Github className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>Explore DSA Repository</span>
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
