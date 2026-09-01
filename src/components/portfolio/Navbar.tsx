import { useEffect, useState } from "react";
import { Download, FileText, Menu, Moon, Sun, X } from "lucide-react";

import { NAV_LINKS, PERSONAL_INFO } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4 pt-2 sm:pt-4 transition-all duration-300">
      <div className="w-full max-w-7xl pointer-events-auto flex flex-col items-center">
        {/* Main Nav Bar — glass pill */}
        <div className="relative w-full flex items-center justify-center">
          <nav
            aria-label="Main Navigation"
            className={cn(
              "flex w-full items-center justify-between gap-3 sm:gap-6 px-4 sm:px-7 h-14 sm:h-16 rounded-full border transition-all duration-300 backdrop-blur-3xl backdrop-saturate-[2]",
              scrolled
                ? "bg-white/[0.04] dark:bg-white/[0.03] border-white/[0.12] dark:border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                : "bg-white/[0.025] dark:bg-white/[0.02] border-white/[0.08] dark:border-white/[0.06] hover:border-white/[0.15] dark:hover:border-white/[0.1] hover:bg-white/[0.06] dark:hover:bg-white/[0.04]",
            )}
          >
            {/* Brand Logo & Name */}
            <a
              href="#top"
              className="group flex items-center gap-2.5 sm:gap-3 font-display text-sm sm:text-[0.9375rem] font-bold tracking-tight shrink-0 pl-0.5"
            >
              <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground shadow-soft transition-transform duration-200 group-hover:scale-105">
                GM
              </span>
              <div className="flex items-center gap-2">
                <span className="truncate max-w-[120px] min-[400px]:max-w-none text-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] group-hover:text-primary transition-colors">
                  {PERSONAL_INFO.name}
                </span>
                <span className="relative flex size-2 shrink-0" title="Online & Available">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
              </div>
            </a>

            {/* Center Desktop Navigation Links */}
            <ul className="hidden items-center gap-0.5 lg:flex">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-[0.875rem] font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/15 text-primary font-semibold shadow-[inset_0_0_0_1px_rgba(var(--primary),0.2)]"
                          : "text-foreground/70 dark:text-foreground/80 hover:text-foreground hover:bg-foreground/[0.05] dark:hover:bg-white/[0.06]",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Right Actions — inside the pill */}
            <div className="flex items-center gap-2 shrink-0 pr-0.5">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  mounted && theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
                }
                className="flex size-8 sm:size-9 items-center justify-center rounded-full border border-foreground/[0.06] dark:border-white/[0.08] bg-foreground/[0.03] dark:bg-white/[0.05] text-foreground/70 transition-all hover:bg-foreground/[0.07] dark:hover:bg-white/[0.09] hover:text-foreground active:scale-95"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="size-3.5 sm:size-4 text-primary" aria-hidden="true" />
                ) : (
                  <Moon className="size-3.5 sm:size-4" aria-hidden="true" />
                )}
              </button>

              {/* Resume CTA — inside pill, hidden on mobile */}
              <a
                href={PERSONAL_INFO.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.97]"
              >
                <Download className="size-3.5 shrink-0" aria-hidden="true" />
                <span>Resume</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="flex size-8 sm:size-9 items-center justify-center rounded-full border border-foreground/[0.06] dark:border-white/[0.08] bg-foreground/[0.03] dark:bg-white/[0.05] text-foreground/70 transition-all hover:bg-foreground/[0.07] dark:hover:bg-white/[0.09] hover:text-foreground lg:hidden active:scale-95"
              >
                {open ? (
                  <X className="size-4 text-primary" aria-hidden="true" />
                ) : (
                  <Menu className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Drawer Menu — same width as pill, body-sized */}
        {open ? (
          <div
            id="mobile-menu"
            className="w-full max-w-sm mt-2 overflow-hidden rounded-2xl border border-white/[0.06] dark:border-white/[0.04] bg-white/[0.025] dark:bg-white/[0.015] backdrop-blur-3xl backdrop-saturate-[2] shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_48px_rgba(0,0,0,0.35)] lg:hidden animate-in slide-in-from-top-3 fade-in duration-300"
          >
            <ul className="flex flex-col gap-0.5 p-2">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/20 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.3)]"
                          : "text-foreground/75 hover:bg-white/[0.06] dark:hover:bg-white/[0.04] hover:text-foreground",
                      )}
                    >
                      <span>{link.label}</span>
                      {isActive ? (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-primary" />
                        </span>
                      ) : (
                        <span className="size-1.5 rounded-full bg-foreground/20 group-hover:bg-foreground/40 transition-colors" />
                      )}
                    </a>
                  </li>
                );
              })}
              <li className="pt-1">
                <a
                  href={PERSONAL_INFO.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_rgba(var(--primary),0.35)] hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Download className="size-4" aria-hidden="true" />
                  <span>Download Resume</span>
                </a>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
