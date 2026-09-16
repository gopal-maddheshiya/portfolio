import type { MouseEvent } from "react";

/** Smoothly scroll to a section id, delegating to Lenis when available. */
export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.scrollIntoView({ block: "start" });
    return;
  }

  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -88, duration: 1.1 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Scroll to an href hash (e.g. "#projects") and sync the URL without a jump. */
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  scrollToId(id);
  if (typeof window !== "undefined") {
    history.replaceState(null, "", hash);
  }
}

/** Attach to an anchor's onClick to upgrade native jumps to Lenis-smooth ones. */
export function handleAnchorClick<T extends HTMLElement>(event: MouseEvent<T>) {
  const href = event.currentTarget.getAttribute("href") || "";
  if (!href.startsWith("#")) return;
  event.preventDefault();
  scrollToHash(href);
}
