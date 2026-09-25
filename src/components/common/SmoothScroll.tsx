import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

// Register ScrollTrigger globally once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Respect user's motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Set scroll restoration to manual so the browser doesn't do an uncoordinated jump before Lenis is ready
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis directly from GSAP ticker for frame-perfect sync
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    // If there is an anchor hash in the URL (e.g. #projects), scroll smoothly after mount
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        window.setTimeout(() => {
          lenis.scrollTo(target as HTMLElement, { offset: -80 });
        }, 120);
      }
    }

    // Single centralized debounced refresh for content updates and window load
    let timeoutId: number;
    const debouncedRefresh = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    // Re-measure after initial frame so all triggers know accurate positions
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    // Single centralized listeners instead of dozens across components
    window.addEventListener("load", debouncedRefresh, { once: true });
    window.addEventListener("app:content-updated", debouncedRefresh);

    return () => {
      cancelAnimationFrame(refreshId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("load", debouncedRefresh);
      window.removeEventListener("app:content-updated", debouncedRefresh);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
