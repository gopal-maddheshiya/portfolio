import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "portfolio-theme";

let transitionTimer: ReturnType<typeof setTimeout> | null = null;

function applyTheme(theme: Theme, transition = false) {
  const root = document.documentElement;

  if (transitionTimer) {
    clearTimeout(transitionTimer);
    transitionTimer = null;
  }

  if (transition) {
    root.classList.add("theme-transition");
    transitionTimer = setTimeout(() => {
      root.classList.remove("theme-transition");
      transitionTimer = null;
    }, 320);
  } else {
    root.classList.remove("theme-transition");
  }

  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  // Synchronize mobile browser status bar / navigation bar theme color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", theme === "dark" ? "#161618" : "#fbfbfa");
  }
}

/** Theme state persisted in localStorage, defaulting to the system preference. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const isDark = document.documentElement.classList.contains("dark");
    const initial: Theme = stored ?? (isDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial, false);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);

    const hasViewTransition =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasViewTransition) {
      document.startViewTransition(() => {
        applyTheme(next, false);
        setTheme(next);
      });
    } else {
      applyTheme(next, true);
      setTheme(next);
    }
  }, [theme]);

  return { theme, toggleTheme, mounted };
}
