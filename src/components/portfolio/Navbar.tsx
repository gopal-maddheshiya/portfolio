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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-all duration-200",
        scrolled ? "shadow-soft bg-background/98" : "bg-background/90",
      )}
    >
      <nav
        aria-label="Main Navigation"
        className="container-page flex h-16 items-center justify-between gap-3 sm:gap-4"
      >
        {/* Brand Logo & Name */}
        <a
          href="#top"
          className="group flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight shrink-0"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-mono text-xs font-bold text-primary-foreground shadow-xs transition-transform duration-200 group-hover:scale-105">
            GM
          </span>
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[130px] min-[400px]:max-w-none text-foreground group-hover:text-primary transition-colors">
              {PERSONAL_INFO.name}
            </span>
            <span className="relative flex size-2 shrink-0" title="Online & Available">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs xl:text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/70",
                  )}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right Actions: Theme Toggle & Resume CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              mounted && theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
            className="flex size-9 sm:size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
          >
            {mounted && theme === "dark" ? (
              <Sun className="size-4 text-primary" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </button>

          <a
            href={PERSONAL_INFO.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Download className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
            <span>Resume</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-9 sm:size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-secondary hover:text-foreground lg:hidden active:scale-95"
          >
            {open ? (
              <X className="size-5 text-primary" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background/98 backdrop-blur-lg lg:hidden animate-in slide-in-from-top-2 duration-200 shadow-lift"
        >
          <ul className="container-page flex flex-col py-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive ? <span className="size-1.5 rounded-full bg-primary" /> : null}
                  </a>
                </li>
              );
            })}
            <li className="pt-2">
              <a
                href={PERSONAL_INFO.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-soft"
              >
                <Download className="size-4" aria-hidden="true" />
                <span>Download Resume</span>
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
