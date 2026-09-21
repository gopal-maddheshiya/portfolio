import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently in view for navbar highlighting.
 * Correctly accounts for page top (hero), current scroll position, and document end.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkActiveSection = () => {
      const scrollY = window.scrollY;

      // 1. If user is at or near the top of the page (Hero section), no section link should be active
      if (scrollY < 200) {
        setActive("");
        return;
      }

      // 2. If user is scrolled to the very bottom of the document, highlight the last section ('contact')
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight >= documentHeight - 60) {
        const lastId = ids[ids.length - 1];
        if (lastId) setActive(lastId);
        return;
      }

      // 3. Offset for header pill (accounting for navbar height + top margin)
      const headerOffset = 130;

      // Find section currently in view based on bounding client rect
      let currentId = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Check if the section spans across the reading offset
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
        setActive(currentId);
      }
    };

    // Run on mount
    checkActiveSection();

    window.addEventListener("scroll", checkActiveSection, { passive: true });
    window.addEventListener("resize", checkActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkActiveSection);
      window.removeEventListener("resize", checkActiveSection);
    };
  }, [ids]);

  return active;
}
