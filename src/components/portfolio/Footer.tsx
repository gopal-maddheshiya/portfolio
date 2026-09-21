import { Code2, Github, Linkedin, Mail } from "lucide-react";

import { usePortfolio } from "@/context/PortfolioContext";
import { NAV_LINKS } from "@/data/profile";
import { handleAnchorClick } from "@/lib/scroll";
import { Reveal } from "./Reveal";

export function Footer() {
  const { data } = usePortfolio();
  const info = data.personalInfo;

  return (
    <footer className="border-t border-border py-8 sm:py-12">
      <Reveal className="container-page flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-base font-semibold">{info.name}</p>
          <p className="mt-1 max-w-xs text-xs sm:text-sm text-muted-foreground">{info.role}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm">
            {NAV_LINKS.filter(
              (link) =>
                link.id !== "gallery" ||
                Boolean(data.academicGallery && data.academicGallery.length > 0),
            ).map((link) => (
              <li key={link.id}>
                <a
                  onClick={handleAnchorClick}
                  href={`#${link.id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap gap-2" aria-label="Social links">
          <li>
            <a
              href={info.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Gopal's GitHub profile"
              className="flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={info.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Gopal's LeetCode profile"
              className="flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Code2 className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={info.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Gopal's LinkedIn profile"
              className="flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={`mailto:${info.email}`}
              aria-label="Send email to Gopal"
              className="flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </Reveal>

      <Reveal
        delay={80}
        className="container-page mt-8 sm:mt-10 border-t border-border pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <p className="text-[11px] sm:text-xs text-muted-foreground">
          © {new Date().getFullYear()} {info.name}. Built with code and continuous learning.
        </p>
      </Reveal>
    </footer>
  );
}
