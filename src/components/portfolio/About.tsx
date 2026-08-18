import {
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";

import { EDUCATION, FOCUS_AREAS, PERSONAL_INFO } from "@/data/profile";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About Me"
        title="Passionate about problem solving &amp; engineering web apps."
        description="A computer science student combining algorithmic rigor in Java with practical full-stack product development."
      />

      <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Story & Engineering Principles */}
        <div className="space-y-6 lg:col-span-7">
          <Reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 font-mono text-xs text-primary font-medium">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>Background &amp; Philosophy</span>
            </div>

            <h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-foreground">
              A developer who learns by building, solving, and iterating.
            </h3>

            <div className="mt-4 space-y-3.5 text-sm sm:text-base leading-relaxed text-muted-foreground">
              <p>
                I&apos;m a Computer Science Engineering student at{" "}
                <span className="font-medium text-foreground">
                  Shri Ramswaroop Memorial University
                </span>
                , actively preparing for software engineering roles. My daily work revolves around
                two pillars: solving algorithmic problems in Java and engineering end-to-end web applications.
              </p>
              <p>
                On the algorithmic side, I practice problem-solving daily on LeetCode with deliberate
                focus on time and space complexity. On the development side, I turn ideas into responsive
                React interfaces backed by Express REST APIs and MongoDB databases.
              </p>
            </div>

            {/* 3 Core Principles */}
            <div className="mt-6 pt-6 border-t border-border grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border/80 bg-surface/60 p-3.5 transition-colors hover:border-primary/30">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Code2 className="size-4" />
                </div>
                <h4 className="mt-2 text-xs font-semibold text-foreground">Java &amp; DSA</h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                  Algorithmic thinking &amp; Big-O complexity analysis.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-surface/60 p-3.5 transition-colors hover:border-primary/30">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Cpu className="size-4" />
                </div>
                <h4 className="mt-2 text-xs font-semibold text-foreground">MERN Stack</h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                  End-to-end full stack web applications.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-surface/60 p-3.5 transition-colors hover:border-primary/30">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="size-4" />
                </div>
                <h4 className="mt-2 text-xs font-semibold text-foreground">Clean Code</h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                  Modular architecture &amp; structured git commits.
                </p>
              </div>
            </div>

            {/* Quick Context Footer */}
            <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-mono">
                <MapPin className="size-3.5 text-primary" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-primary">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <span>Open for Summer 2026 Opportunities</span>
              </div>
            </div>
          </Reveal>

          {/* Core Focus Pills */}
          <Reveal delay={60} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Current Learning &amp; Focus Areas
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FOCUS_AREAS.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/80 px-2.5 py-1 text-xs text-secondary-foreground"
                >
                  <CheckCircle2 className="size-3 text-primary" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right Column: Quick Snapshot + Education & Certifications */}
        <div className="space-y-6 lg:col-span-5">
          {/* Quick Snapshot Grid */}
          <Reveal delay={40} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <h4 className="font-mono text-xs text-primary font-medium uppercase tracking-wider">
              Profile Snapshot
            </h4>
            <div className="mt-3.5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/80 bg-surface/60 p-3">
                <p className="text-[11px] font-mono text-muted-foreground">Degree</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">B.Tech CSE</p>
                <p className="text-[11px] font-mono text-primary mt-0.5">CGPA 7.62</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-surface/60 p-3">
                <p className="text-[11px] font-mono text-muted-foreground">DSA Practice</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">50+ Solved</p>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">LeetCode Java</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-surface/60 p-3">
                <p className="text-[11px] font-mono text-muted-foreground">Primary Stack</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">Java &amp; MERN</p>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">Full-Stack</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-surface/60 p-3">
                <p className="text-[11px] font-mono text-muted-foreground">Graduation</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">2028 Batch</p>
                <p className="text-[11px] font-mono text-primary mt-0.5">SRMU University</p>
              </div>
            </div>
          </Reveal>

          {/* Education & Academic Coursework */}
          <Reveal delay={80} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 font-display text-base font-semibold text-foreground">
              <GraduationCap className="size-4.5 text-primary" />
              <span>Education</span>
            </div>

            <ul className="space-y-4">
              {EDUCATION.map((item) => (
                <li key={item.title} className="border-l-2 border-border pl-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    {item.detail ? (
                      <span className="font-mono text-xs text-primary font-medium">
                        {item.detail}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.org}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/70">
                    {item.period}
                  </p>
                </li>
              ))}
            </ul>

            {/* Key Relevant Coursework */}
            <div className="pt-4 border-t border-border/80">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Relevant Coursework
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[
                  "Data Structures & Algorithms",
                  "Design & Analysis of Algorithms",
                  "Object-Oriented Programming (Java)",
                  "Database Management Systems",
                  "Operating Systems",
                  "Software Engineering",
                  "Cloud Computing (AWS)",
                  "Web Development",
                ].map((course) => (
                  <span
                    key={course}
                    className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
