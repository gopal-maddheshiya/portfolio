import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently in view for navbar highlighting.
 * Correctly accounts for page top (hero), current scroll position, and document end.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number | null = null;

    const checkActiveSection = () => {
      rafId = null;
      const scrollY = window.__lenis ? window.__lenis.scroll : window.scrollY;

      // 1. If user is at or near the top of the page (Hero section), no section link should be active
      if (scrollY < 200) {
        setActive((prev) => (prev === "" ? prev : ""));
        return;
      }

      // 2. If user is scrolled to the very bottom of the document, highlight the last section ('contact')
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight >= documentHeight - 60) {
        const lastId = ids[ids.length - 1];
        if (lastId) setActive((prev) => (prev === lastId ? prev : lastId));
        return;
      }

      // 3. Offset for header pill (accounting for navbar height + top margin)
      const headerOffset = 130;

      let currentId = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= headerOffset && rect.bottom > headerOffset) {
          currentId = id;
          break;
        }
      }

      // 4. Fallback if between sections: pick the closest section near headerOffset
      if (!currentId) {
        let minDistance = Infinity;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.5) {
            const distance = Math.abs(rect.top - headerOffset);
            if (distance < minDistance) {
              minDistance = distance;
              currentId = id;
            }
          }
        }
      }

      if (currentId) {
        setActive((prev) => (prev === currentId ? prev : currentId));
      }
    };

    const scheduleCheck = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(checkActiveSection);
    };

    checkActiveSection();

    let lenisAttached = false;
    const attachLenis = () => {
      if (window.__lenis && !lenisAttached) {
        window.__lenis.on("scroll", scheduleCheck);
        lenisAttached = true;
        return true;
      }
      return false;
    };

    if (!attachLenis()) {
      window.addEventListener("lenis:ready", attachLenis, { once: true });
    }

    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("lenis:ready", attachLenis);
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
      if (window.__lenis && lenisAttached) {
        window.__lenis.off("scroll", scheduleCheck);
      }
    };
  }, [ids]);

  return active;
}
