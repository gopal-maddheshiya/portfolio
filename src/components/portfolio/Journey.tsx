import { CheckCircle2, CircleDot, Clock } from "lucide-react";

import { JOURNEY } from "@/data/profile";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

const STATUS_CONFIG = {
  done: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    cardClass: "border-border hover:border-primary/40",
  },
  active: {
    label: "In Progress",
    icon: CircleDot,
    badgeClass: "bg-primary/15 text-primary border-primary/30 font-semibold",
    cardClass: "border-primary/40 shadow-xs",
  },
  next: {
    label: "Next Up",
    icon: Clock,
    badgeClass: "bg-secondary text-muted-foreground border-border",
    cardClass: "border-border hover:border-border-strong",
  },
} as const;

export function Journey() {
  return (
    <Section id="journey">
      <SectionHeading
        eyebrow="Learning Roadmap"
        title="Continuous Skill Development"
        description="A structured view of my engineering journey — from algorithmic foundations to full-stack systems."
      />

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {JOURNEY.map((step, index) => {
          const config = STATUS_CONFIG[step.status];
          const StatusIcon = config.icon;

          return (
            <Reveal
              key={step.title}
              delay={index * 50}
              className={cn(
                "rounded-2xl border bg-card p-5 sm:p-6 transition-all hover:shadow-soft flex flex-col justify-between",
                config.cardClass,
              )}
            >
              <div>
                {/* Top Row: Phase Number & Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-muted-foreground">
                    Phase {step.phase}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                      config.badgeClass,
                    )}
                  >
                    <StatusIcon className="size-3 shrink-0" aria-hidden="true" />
                    <span>{config.label}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-3.5 font-display text-base sm:text-lg font-semibold text-foreground">
                  {step.title}
                </h3>

                {/* Details */}
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-4 pt-3 border-t border-border/60">
                <ul className="flex flex-wrap gap-1.5">
                  {step.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
