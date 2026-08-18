import { SKILL_GROUPS } from "@/data/profile";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

export function Skills() {
  return (
    <Section id="skills" tone="surface">
      <SectionHeading
        eyebrow="Technical skills"
        title="What I work with"
        description="Grouped by domain. Highlighted groups represent my primary active focus right now."
      />

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, index) => (
          <Reveal
            key={group.title}
            delay={index * 50}
            className={cn(
              "rounded-xl border bg-card p-5 sm:p-6 transition-all hover:shadow-soft flex flex-col justify-between",
              group.primary ? "border-primary/40 shadow-xs" : "border-border",
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {group.title}
                </h3>
                {group.primary ? (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary font-medium">
                    Focus
                  </span>
                ) : null}
              </div>

              <ul className="mt-3.5 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground hover:border-border-strong"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
