import { forwardRef, useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  animate = true,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  className?: string;
  /** Sections with their own heading animation (Hero, Projects) set this to false. */
  animate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sect-anim-eyebrow",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        },
      );

      gsap.fromTo(
        ".sect-anim-title",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.52,
          delay: 0.04,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        },
      );

      gsap.fromTo(
        ".sect-anim-desc",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.52,
          delay: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        },
      );
    }, ref);

    return () => {
      ctx.revert();
    };
  }, [animate]);

  return (
    <div ref={ref} className={cn("max-w-2xl", className)}>
      <p className="sect-anim-eyebrow font-mono text-xs uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </p>
      <h2 className="sect-anim-title mt-2.5 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="sect-anim-desc mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export const Section = forwardRef<
  HTMLElement,
  {
    id: string;
    children: ReactNode;
    className?: string;
    tone?: "default" | "surface";
  }
>(function Section({ id, children, className, tone = "default" }, ref) {
  return (
    <section
      ref={ref}
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
});
