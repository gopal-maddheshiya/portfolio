import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Premium scroll reveal driven by GSAP ScrollTrigger for a silky,
 * Lenis-synced fade-up with a subtle blur settle. The `delay` prop
 * (in MILLISECONDS) staggers siblings cascade-style, matching the
 * old IO component's API.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.remove("reveal");
      return;
    }

    const viewH = window.innerHeight || 900;
    if (node.getBoundingClientRect().top <= viewH * 0.96) {
      node.classList.remove("reveal");
      return;
    }

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        node,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.52,
          ease: "power3.out",
          delay: delay / 1000,
          clearProps: "all",
          paused: true,
          onComplete: () => {
            node.classList.remove("reveal");
          },
        },
      );

      ScrollTrigger.create({
        trigger: node,
        start: "top 92%",
        once: true,
        fastScrollEnd: true,
        onEnter: () => tween.play(),
        onEnterBack: () => {
          tween.progress(1);
        },
        onLeave: () => {
          tween.progress(1);
        },
      });
    }, ref);

    return () => {
      ctx.revert();
    };
  }, [delay]);

  return (
    <Tag ref={ref as never} className={cn("reveal", className)}>
      {children}
    </Tag>
  );
}
