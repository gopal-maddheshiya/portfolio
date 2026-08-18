import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Award,
  Code2,
  Database,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { HIGHLIGHTS } from "@/data/profile";

const ICONS_MAP: Record<string, LucideIcon> = {
  grad: GraduationCap,
  code: Code2,
  trophy: Trophy,
  db: Database,
  award: Award,
  sparkles: Sparkles,
};

// Quadruple items to create an unbroken seamless infinite loop
const MARQUEE_ITEMS = [
  ...HIGHLIGHTS,
  ...HIGHLIGHTS,
  ...HIGHLIGHTS,
  ...HIGHLIGHTS,
];

export function Highlights() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Position and physics refs for 60fps RAF loop
  const posRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const directionRef = useRef(-1); // default moves left

  // Dragging refs
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    // Track scroll velocity and direction
    let scrollTimeout: NodeJS.Timeout;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (Math.abs(delta) > 0.5) {
        // Scrolling down -> moves one way, scrolling up -> moves the other way
        directionRef.current = delta > 0 ? -1 : 1;
        // Boost speed based on scroll velocity
        scrollVelocityRef.current = Math.min(Math.abs(delta) * 0.18, 4) * directionRef.current;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollVelocityRef.current = 0;
      }, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    let animId: number;

    const animate = () => {
      const track = trackRef.current;
      if (track && !isDragging) {
        // Base constant speed when not hovering (0.7px per frame)
        const baseSpeed = isHovered ? 0.2 : 0.7;
        const currentSpeed = baseSpeed * directionRef.current + scrollVelocityRef.current;

        // Friction to decay scroll velocity back to base speed
        scrollVelocityRef.current *= 0.94;

        posRef.current += currentSpeed;

        // Loop seamlessly once half the width is traversed
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          if (posRef.current <= -halfWidth) {
            posRef.current += halfWidth;
          } else if (posRef.current >= 0) {
            posRef.current -= halfWidth;
          }
        }

        track.style.transform = `translate3d(${posRef.current.toFixed(2)}px, 0, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, isDragging]);

  // Drag handlers for desktop mouse & mobile swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = posRef.current;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }
    posRef.current = dragStartPosRef.current + deltaX;

    const track = trackRef.current;
    if (track) {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        if (posRef.current <= -halfWidth) posRef.current += halfWidth;
        else if (posRef.current >= 0) posRef.current -= halfWidth;
      }
      track.style.transform = `translate3d(${posRef.current.toFixed(2)}px, 0, 0)`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section
      aria-label="Profile highlights"
      className="relative py-4 sm:py-6 overflow-hidden border-y border-border/70 bg-surface/40 backdrop-blur-xs select-none"
    >
      {/* Left Edge Gradient Fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-28 bg-gradient-to-r from-background via-background/80 to-transparent"
      />

      {/* Right Edge Gradient Fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-28 bg-gradient-to-l from-background via-background/80 to-transparent"
      />

      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`w-full overflow-hidden flex items-center ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-3.5 sm:gap-5 whitespace-nowrap will-change-transform py-1"
        >
          {MARQUEE_ITEMS.map((item, index) => {
            const Icon = (item.icon && ICONS_MAP[item.icon]) || Code2;
            const isOpportunity = item.label.includes("Summer");

            return (
              <a
                key={`${item.label}-${index}`}
                href={item.section ? `#${item.section}` : undefined}
                onClick={(e) => {
                  if (hasDraggedRef.current) {
                    e.preventDefault();
                  }
                }}
                className="group inline-flex items-center gap-3 sm:gap-3.5 rounded-2xl border border-border bg-card px-4 py-3 sm:px-5 sm:py-3.5 shadow-xs transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-soft active:scale-[0.98]"
              >
                <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-xs transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:scale-105">
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-display text-sm sm:text-base font-bold text-foreground tracking-tight transition-colors group-hover:text-primary">
                      {item.label}
                    </p>
                    {isOpportunity ? (
                      <span className="relative flex size-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-primary" />
                      </span>
                    ) : (
                      <ArrowUpRight className="size-3 text-muted-foreground/50 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground font-mono">
                    {item.detail}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
