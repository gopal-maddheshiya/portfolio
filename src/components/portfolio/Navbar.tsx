import { useEffect, useRef, useState } from "react";
import {
  Award,
  Briefcase,
  Code2,
  Cpu,
  Download,
  Github,
  Globe,
  Image as ImageIcon,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react";
import { gsap } from "gsap";

import { usePortfolio } from "@/context/PortfolioContext";
import { NAV_LINKS } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { handleAnchorClick } from "@/lib/scroll";

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

const NAV_ICONS: Record<string, typeof User> = {
  about: User,
  skills: Cpu,
  projects: Briefcase,
  dsa: Code2,
  profiles: Globe,
  certifications: Award,
  gallery: ImageIcon,
  contact: Mail,
};

export function Navbar() {
  const { data } = usePortfolio();
  const info = data.personalInfo;

  const { theme, toggleTheme, mounted } = useTheme();
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hasGallery = Boolean(data.academicGallery && data.academicGallery.length > 0);
  const visibleNavLinks = NAV_LINKS.filter((link) => link.id !== "gallery" || hasGallery);

  const headerRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false);

  // Premium entrance: the glass pill drops in from above, items cascade.
  useEffect(() => {
    if (hasAnimatedRef.current || !headerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hasAnimatedRef.current = true;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.05 });
      tl.fromTo(
        ".nav-anim-bar",
        { yPercent: -130, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9 },
      ).fromTo(
        ".nav-anim-item",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, clearProps: "all" },
        "-=0.55",
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

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
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4 pt-2 sm:pt-4 transition-all duration-300"
    >
      <div className="nav-anim-bar w-full max-w-7xl pointer-events-auto flex flex-col items-center">
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
              onClick={handleAnchorClick}
              href="#top"
              className="nav-anim-item group flex items-center gap-2 sm:gap-3 font-display text-sm sm:text-[0.9375rem] font-bold tracking-tight shrink-0 pl-0.5"
            >
              <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground shadow-soft transition-transform duration-200 group-hover:scale-105">
                GM
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate max-w-[170px] min-[360px]:max-w-none text-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] group-hover:text-primary transition-colors">
                  {info.name}
                </span>
              </div>
            </a>

            {/* Center Desktop Navigation Links */}
            <ul className="hidden items-center gap-0.5 lg:flex">
              {visibleNavLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      onClick={handleAnchorClick}
                      href={`#${link.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "nav-anim-item rounded-full px-4 py-1.5 text-[0.875rem] font-medium transition-all duration-200",
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
            <div className="nav-anim-item flex items-center gap-2 shrink-0 pr-0.5">
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
                href={info.resume}
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

        {/* Mobile Drawer Menu — Enhanced with App-like Card Layout & Full Responsiveness */}
        {open ? (
          <>
            {/* Backdrop overlay for outside tap */}
            <div
              className="fixed inset-0 bg-background/60 backdrop-blur-xs lg:hidden pointer-events-auto z-[-1] animate-in fade-in duration-200"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <div
              id="mobile-menu"
              className="w-full max-w-lg mt-2 overflow-hidden rounded-2xl border border-border/90 bg-card/95 dark:bg-card/90 backdrop-blur-2xl text-card-foreground shadow-lift lg:hidden animate-in slide-in-from-top-3 fade-in duration-200 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain"
            >
              {/* Mini Profile Header */}
              <div className="flex items-center justify-between gap-3 border-b border-border/70 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-surface/50">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground shadow-xs">
                    GM
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display text-xs sm:text-sm font-bold text-foreground leading-tight truncate">
                      {info.name}
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground truncate">
                      Full-Stack (MERN) Developer
                    </span>
                  </div>
                </div>

                <div className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                  <span className="relative flex size-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span>Open to Work</span>
                </div>
              </div>

              {/* Navigation Grid (2 Columns) */}
              <div className="p-2.5 sm:p-3">
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {visibleNavLinks.map((link) => {
                    const isActive = active === link.id;
                    const Icon = NAV_ICONS[link.id] || User;
                    return (
                      <a
                        key={link.id}
                        onClick={(event) => {
                          handleAnchorClick(event);
                          setOpen(false);
                        }}
                        href={`#${link.id}`}
                        className={cn(
                          "group flex items-center gap-2 sm:gap-2.5 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs font-medium transition-all duration-200 cursor-pointer",
                          isActive
                            ? "bg-primary/15 text-primary font-semibold border border-primary/30 shadow-xs"
                            : "bg-surface/60 border border-border/60 text-foreground/80 hover:bg-surface hover:text-foreground hover:border-border",
                        )}
                      >
                        <div
                          className={cn(
                            "flex size-6 sm:size-7 items-center justify-center rounded-lg transition-colors shrink-0",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10",
                          )}
                        >
                          <Icon className="size-3 sm:size-3.5" aria-hidden="true" />
                        </div>
                        <span className="truncate text-[11px] sm:text-xs">{link.label}</span>
                        {isActive && (
                          <span className="ml-auto size-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </a>
                    );
                  })}
                </div>

                {/* Quick Social Links Bar */}
                <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-border/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={info.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile"
                      className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-surface border border-border/80 text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
                    >
                      <Github className="size-3.5 sm:size-4" />
                    </a>
                    <a
                      href={info.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                      className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-surface border border-border/80 text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
                    >
                      <Linkedin className="size-3.5 sm:size-4" />
                    </a>
                    <a
                      href={info.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LeetCode Profile"
                      className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-surface border border-border/80 text-muted-foreground hover:text-[#00b8a3] hover:border-[#00b8a3]/40 transition-colors cursor-pointer"
                    >
                      <Code2 className="size-3.5 sm:size-4" />
                    </a>
                    <a
                      href={`mailto:${info.email}`}
                      aria-label="Send Email"
                      className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-surface border border-border/80 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                    >
                      <Mail className="size-3.5 sm:size-4" />
                    </a>
                  </div>

                  <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground shrink-0">
                    SRMU · CSE '28
                  </span>
                </div>

                {/* Resume Action Button */}
                <div className="mt-2 sm:mt-2.5">
                  <a
                    href={info.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Download className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
                    <span>Download Resume (PDF)</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}
