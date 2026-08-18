import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  tone = "default",
}: {
  id: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "surface";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 sm:scroll-mt-24 border-t border-border py-12 sm:py-18 lg:py-24",
        tone === "surface" && "bg-surface",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}
