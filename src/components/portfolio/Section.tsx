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
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!animate || animatedRef.current || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    animatedRef.current = true;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sect-anim-eyebrow",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        },
      );

      gsap.fromTo(
        ".sect-anim-title",
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          delay: 0.06,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        },
      );

      gsap.fromTo(
        ".sect-anim-desc",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.16,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        },
      );
    }, ref);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
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
