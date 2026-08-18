import { Code2, Github, Linkedin, Mail } from "lucide-react";

import { NAV_LINKS, PERSONAL_INFO } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 sm:py-12">
      <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-base font-semibold">{PERSONAL_INFO.name}</p>
          <p className="mt-1 max-w-xs text-xs sm:text-sm text-muted-foreground">
            Software Engineer — Java, DSA and full-stack web development.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap gap-2">
          <li>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={PERSONAL_INFO.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LeetCode profile"
              className="flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Code2 className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              aria-label="Send an email"
              className="flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>

      <div className="container-page mt-8 sm:mt-10 border-t border-border pt-5 sm:pt-6">
        <p className="text-[11px] sm:text-xs text-muted-foreground">
          © {new Date().getFullYear()} {PERSONAL_INFO.name}. Built with code and continuous
          learning.
        </p>
      </div>
    </footer>
  );
}
