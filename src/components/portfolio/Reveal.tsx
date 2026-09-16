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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      node,
      { opacity: 0, y: 26, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
        ease: "power3.out",
        delay: delay / 1000,
        clearProps: "all",
        scrollTrigger: {
          trigger: node,
          start: "top 88%",
          once: true,
        },
        onComplete: () => {
          // Strip the CSS hiding class so clearProps leaves a clean element.
          node.classList.remove("reveal");
        },
      },
    );

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      (tween.scrollTrigger as ScrollTrigger | undefined)?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <Tag ref={ref as never} className={cn("reveal", className)}>
      {children}
    </Tag>
  );
}
