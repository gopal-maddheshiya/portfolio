import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "portfolio-theme";

function applyTheme(theme: Theme, transition = false) {
  const root = document.documentElement;
  if (transition) {
    root.classList.add("theme-transition");
    window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);
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
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next, true);
      return next;
    });
  }, []);

  return { theme, toggleTheme, mounted };
}
