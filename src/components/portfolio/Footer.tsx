import type { SVGProps } from "react";
import { Code2, Github, Linkedin, Mail } from "lucide-react";

import { usePortfolio } from "@/context/PortfolioContext";
import { NAV_LINKS, PERSONAL_INFO } from "@/data/profile";
import { handleAnchorClick } from "@/lib/scroll";
import { Reveal } from "./Reveal";

function MediumIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <ellipse cx="6.2" cy="12" rx="4.2" ry="4.6" fill="currentColor" />
      <ellipse cx="14.2" cy="12" rx="2.1" ry="4.3" fill="currentColor" />
      <ellipse cx="19" cy="12" rx="1" ry="3.8" fill="currentColor" />
    </svg>
  );
}

function SubstackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M5 4h14v2.2H5V4zm0 4.2h14v2.2H5V8.2zM5 12.4h14V20l-7-4-7 4v-7.6z"
        fill="currentColor"
      />
    </svg>
  );
}

function RedditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="14" r="7" />
      <path d="M12 7 13.8 3.5l3.7.8" />
      <circle cx="18.3" cy="4.6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9.3" cy="13.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="13.2" r="1" fill="currentColor" stroke="none" />
      <path d="M9.6 16.4c.7.6 1.5.9 2.4.9s1.7-.3 2.4-.9" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  const { data } = usePortfolio();
  const info = data.personalInfo;

  const socialLinks = [
    {
      name: "GitHub",
      href: info.github || PERSONAL_INFO.github,
      label: "Visit Gopal's GitHub profile",
      external: true,
      Icon: Github,
    },
    {
      name: "LeetCode",
      href: info.leetcode || PERSONAL_INFO.leetcode,
      label: "Visit Gopal's LeetCode profile",
      external: true,
      Icon: Code2,
    },
    {
      name: "LinkedIn",
      href: info.linkedin || PERSONAL_INFO.linkedin,
      label: "Visit Gopal's LinkedIn profile",
      external: true,
      Icon: Linkedin,
    },
    {
      name: "Medium",
      href: info.medium ?? PERSONAL_INFO.medium ?? "",
      label: "Read Gopal's articles on Medium",
      external: true,
      Icon: MediumIcon,
    },
    {
      name: "Substack",
      href: info.substack ?? PERSONAL_INFO.substack ?? "",
      label: "Read Gopal's newsletter on Substack",
      external: true,
      Icon: SubstackIcon,
    },
    {
      name: "Reddit",
      href: info.reddit ?? PERSONAL_INFO.reddit ?? "",
      label: "Visit Gopal's Reddit profile",
      external: true,
      Icon: RedditIcon,
    },
    {
      name: "Facebook",
      href: info.facebook ?? PERSONAL_INFO.facebook ?? "",
      label: "Visit Gopal's Facebook profile",
      external: true,
      Icon: FacebookIcon,
    },
    {
      name: "Instagram",
      href: info.instagram ?? PERSONAL_INFO.instagram ?? "",
      label: "Visit Gopal's Instagram profile",
      external: true,
      Icon: InstagramIcon,
    },
    {
      name: "Email",
      href: info.email ? `mailto:${info.email}` : "",
      label: "Send email to Gopal",
      external: false,
      Icon: Mail,
    },
  ].filter((item) => Boolean(item.href && item.href.trim().length > 0));

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

        <ul
          className="flex flex-wrap gap-2 sm:max-w-[232px] sm:justify-end"
          aria-label="Social links"
        >
          {socialLinks.map(({ name, href, label, external, Icon }) => (
            <li key={name}>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer me" : undefined}
                aria-label={label}
                title={name}
                className="flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/45 hover:text-primary"
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal
        delay={80}
        className="container-page mt-8 sm:mt-10 border-t border-border pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-muted-foreground"
      >
        <p>
          © {new Date().getFullYear()} {info.name}.{" "}
          {info.footerTagline || "Built with code and continuous learning."}
        </p>

        <div className="flex items-center gap-4">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Sitemap
          </a>
          <span className="opacity-30">•</span>
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            title="Clean structured text designed for AI models & LLMs"
          >
            LLMs.txt (AI Profile)
          </a>
        </div>
      </Reveal>
    </footer>
  );
}
