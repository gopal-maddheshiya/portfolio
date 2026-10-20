import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const circleRef = useRef<SVGCircleElement>(null);

  // Synchronize directly with AI Assistant's visibility state so the two components never collide
  useEffect(() => {
    const handleAssistantVisibility = (e: Event) => {
      const customEvent = e as CustomEvent<{ isVisible: boolean }>;
      if (typeof customEvent.detail?.isVisible === "boolean") {
        setIsScrollingDown(!customEvent.detail.isVisible);
      }
    };

    window.addEventListener("ai-assistant-visibility", handleAssistantVisibility);
    return () => {
      window.removeEventListener("ai-assistant-visibility", handleAssistantVisibility);
    };
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      let scrollY = 0;
      let progressFraction = 0;

      if (window.__lenis) {
        scrollY = window.__lenis.scroll;
        progressFraction = window.__lenis.progress; // Normalized 0.0 to 1.0 from Lenis
      } else {
        scrollY = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        progressFraction = Math.min(1, Math.max(0, scrollY / maxScroll));
      }

      // Smooth visibility toggle (appears after scrolling 280px)
      const shouldShow = scrollY > 280;
      setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev));

      // Fallback: If near top of page, ensure arrow is at resting upper position
      if (scrollY <= 80) {
        setIsScrollingDown(false);
      }

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
    <div
      className={cn(
        "fixed right-4 sm:right-6 bottom-18 sm:bottom-20 z-45 pointer-events-none transition-transform duration-200 ease-out",
        isScrollingDown ? "translate-y-14" : "translate-y-0",
      )}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className={cn(
          "flex size-10 sm:size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:border-primary/50 hover:bg-accent hover:scale-105 active:scale-95 cursor-pointer",
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
    </div>
  );
}
