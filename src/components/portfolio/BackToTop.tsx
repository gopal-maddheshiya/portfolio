import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const circleRef = useRef<SVGCircleElement>(null);
  const lastScrollYRef = useRef(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      let scrollY = 0;
      let progressFraction = 0;

      if (window.__lenis) {
        scrollY = window.__lenis.scroll;
        progressFraction = window.__lenis.progress; // Normalized 0.0 to 1.0 from Lenis
      } else {
        scrollY = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        progressFraction = Math.min(1, Math.max(0, scrollY / maxScroll));
      }

      // Smooth visibility toggle (appears after scrolling 280px)
      const shouldShow = scrollY > 280;
      setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev));

      // Scroll direction tracking for coordinated layout with AI Assistant
      const delta = scrollY - lastScrollYRef.current;

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      if (scrollY <= 80) {
        setIsScrollingDown(false);
      } else if (delta > 8) {
        // Scrolling down -> AI button hides, so BackToTop drops smoothly to bottom corner
        setIsScrollingDown(true);
      } else if (delta < -8) {
        // Scrolling up -> AI button shows, so BackToTop lifts smoothly above it
        setIsScrollingDown(false);
      }

      // When scroll stops for 1s, AI button returns, so BackToTop lifts to resting stacked position
      idleTimerRef.current = setTimeout(() => {
        setIsScrollingDown(false);
      }, 1000);

      lastScrollYRef.current = scrollY;

      // 120 FPS Direct Hardware DOM SVG Progress Update (Zero React re-render lag)
      if (circleRef.current) {
        const offset = CIRCUMFERENCE - Math.max(0, Math.min(1, progressFraction)) * CIRCUMFERENCE;
        circleRef.current.style.strokeDashoffset = `${offset}`;
      }
    };

    // Attach to Lenis ticker if available for 100% frame-perfect sync
    let lenisAttached = false;
    const attachLenis = () => {
      if (window.__lenis && !lenisAttached) {
        window.__lenis.on("scroll", updateProgress);
        lenisAttached = true;
        return true;
      }
      return false;
    };

    if (!attachLenis()) {
      const interval = setInterval(() => {
        if (attachLenis()) {
          clearInterval(interval);
        }
      }, 100);
      setTimeout(() => clearInterval(interval), 3000);
    }

    // Always keep window scroll and resize as standard listener/fallback
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      if (window.__lenis && lenisAttached) {
        window.__lenis.off("scroll", updateProgress);
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={cn(
        "fixed right-4 sm:right-6 z-40 flex size-10 sm:size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:border-primary/50 hover:bg-accent hover:scale-105 active:scale-95 cursor-pointer",
        // Coordinate vertical position with AI Assistant
        isScrollingDown
          ? "bottom-4 sm:bottom-6" // Drops to bottom corner when AI button is hidden
          : "bottom-18 sm:bottom-20", // Lifts cleanly above AI button when visible
        // Visibility toggle
        isVisible
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-90 pointer-events-none translate-y-3",
      )}
    >
      {/* Progress SVG Ring */}
      <svg
        className="absolute inset-0 size-full -rotate-90 pointer-events-none"
        viewBox="0 0 44 44"
        aria-hidden="true"
      >
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="opacity-15"
        />
        <circle
          ref={circleRef}
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          strokeLinecap="round"
          className="text-primary will-change-[stroke-dashoffset]"
        />
      </svg>

      <ArrowUp className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
