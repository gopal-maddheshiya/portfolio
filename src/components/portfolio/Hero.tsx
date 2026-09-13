import { useEffect, useState } from "react";
import { ArrowRight, Code2, FileText, Github, Linkedin, MapPin } from "lucide-react";

import profilePhoto from "@/assets/gopal-profile.jpg";
import { usePortfolio } from "@/context/PortfolioContext";

const DEFAULT_TYPING_ROLES = [
  "Java & DSA Developer",
  "Full-Stack Web Engineer",
  "MERN Stack Specialist",
  "B.Tech CSE Student",
];

function TypewriterRole({ roles = DEFAULT_TYPING_ROLES }: { roles?: string[] }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const activeRoles = roles && roles.length > 0 ? roles : DEFAULT_TYPING_ROLES;

  useEffect(() => {
    const currentRole = activeRoles[roleIndex % activeRoles.length] || "";
    const typingSpeed = isDeleting ? 35 : 75;
    const pauseTime = isDeleting ? 300 : 2000;

    if (!isDeleting && currentText === currentRole) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % activeRoles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentText(
        isDeleting
          ? currentRole.slice(0, currentText.length - 1)
          : currentRole.slice(0, currentText.length + 1),
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, roleIndex, activeRoles]);

  return (
    <span className="text-primary inline-flex items-baseline whitespace-nowrap">
      <span>{currentText}</span>
      <span
        className="inline-block w-[3px] h-[0.85em] ml-1 bg-primary align-middle animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
}

function JavaIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.5 17.5c2.5.5 5.5.5 7.5-.2 0 0 .5.8-.8 1.4-2.5 1-6.5.9-8.5-.1 0 0-.4-.7 1.8-1.1z"
        fill="#5382A1"
      />
      <path
        d="M7.8 15.2c2.2.4 4.8.4 6.6-.1 0 0 .4.7-.7 1.2-2.2.9-5.7.8-7.5-.1 0 0-.3-.6 1.6-1z"
        fill="#5382A1"
      />
      <path
        d="M12.4 11.2c1 .9 2.1 2 1.3 3.5-1.2 2.3-4.5 1.2-6.3.8 0 0-.3.5.3.7 2.1.8 6.5 1 7.6-1.5 1-2.4-.7-3.9-1.9-4.8-.8-.6-1.4-1.3-.8-2.2-1.7.9-1.5 2.5-.2 3.5z"
        fill="#E76F00"
      />
      <path
        d="M15.1 8.5c.7.8 1.4 1.7.9 3-1 2-3.8 1.1-5.3.7 0 0-.2.5.3.6 1.8.7 5.5.9 6.4-1.3.9-2.1-.6-3.3-1.6-4.1-.7-.5-1.2-1.1-.7-1.9-1.4.8-1.2 2.2 0 3z"
        fill="#EA2D2E"
      />
      <path
        d="M11 20.3c3.5.2 7-.1 9.5-1.2 0 0 .7.8-.9 1.4-3.2 1.1-8.5 1.1-11.2 0 0 0-.5-.8 2.6-.2z"
        fill="#5382A1"
      />
    </svg>
  );
}

function ReactIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function Hero() {
  const { data } = usePortfolio();
  const info = data.personalInfo;
  const hero = data.heroData || {
    greetingBadge: `Hi, I'm ${info.name}`,
    headlinePrefix: "Building software as a",
    typewriterRoles: DEFAULT_TYPING_ROLES,
    floatingBadge1: "Java • DSA",
    floatingBadge2: "Full-Stack",
    availabilityStatus: "Online",
  };

  return (
    <section id="top" className="relative overflow-hidden pt-6 pb-12 sm:py-16 md:py-20 lg:py-24">
      {/* Background grid */}
      <div aria-hidden="true" className="grid-backdrop pointer-events-none absolute inset-0" />

      <div className="container-page relative grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
        {/* Left Column: Intro & Call to Actions */}
        <div className="flex flex-col items-start min-w-0">
          {/* Greeting Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span>{hero.greetingBadge || `Hi, I'm ${info.name}`}</span>
          </div>

          {/* Heading with Typewriter */}
          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-[3.1rem] font-bold leading-[1.22] tracking-tight text-foreground">
            <span>{hero.headlinePrefix || "Building software as a"} </span>
            <br />
            <span className="inline-block min-h-[1.25em] whitespace-nowrap">
              <TypewriterRole roles={hero.typewriterRoles} />
            </span>
          </h1>

          {/* Bio Description */}
          <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {info.siteDescription}
          </p>

          {/* Location */}
          <p className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary shrink-0" aria-hidden="true" />
            <span>{info.location}</span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-row items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
            <a
              href="#projects"
              className="inline-flex flex-1 sm:flex-initial sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-md bg-primary px-3.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 active:scale-[0.99] cursor-pointer whitespace-nowrap"
            >
              <span>View my work</span>
              <ArrowRight className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
            </a>

            <a
              href={info.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 sm:flex-initial sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-md border border-border-strong bg-card px-3.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.99] cursor-pointer whitespace-nowrap"
            >
              <FileText className="size-3.5 sm:size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>View Resume</span>
            </a>
          </div>

          {/* Social Profiles */}
          <ul className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-5">
            <li>
              <a
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
                href={info.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4 shrink-0" aria-hidden="true" />
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
                href={info.leetcode}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 className="size-4 shrink-0" aria-hidden="true" />
                <span>LeetCode</span>
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
                href={info.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="size-4 shrink-0" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Right Column: Clean Profile Photo with Floating Badges & Status */}
        <div className="flex justify-center lg:justify-end min-w-0">
          <div className="relative group shrink-0">
            {/* Floating Mini Tech Badge 1 (Top Left): Java & DSA */}
            <div className="absolute -top-3.5 -left-2 sm:-top-4 sm:-left-5 z-20 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/95 dark:bg-card/90 px-3 py-1.5 shadow-lift backdrop-blur-md animate-float-slow transition-transform hover:scale-105 pointer-events-auto select-none">
              <div className="flex size-5 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                <JavaIcon className="size-3.5" />
              </div>
              <span className="font-semibold text-xs text-foreground">{hero.floatingBadge1 || "Java • DSA"}</span>
            </div>

            {/* Floating Mini Tech Badge 2 (Bottom Right): Full-Stack */}
            <div className="absolute -bottom-4 -right-2 sm:-bottom-5 sm:-right-5 z-20 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/95 dark:bg-card/90 px-3 py-1.5 shadow-lift backdrop-blur-md animate-float-reverse transition-transform hover:scale-105 pointer-events-auto select-none">
              <div className="flex size-5 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <ReactIcon className="size-3.5" />
              </div>
              <span className="font-semibold text-xs text-foreground">{hero.floatingBadge2 || "Full-Stack"}</span>
            </div>

            {/* Main Photo Card Container */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-soft">
              <img
                src={
                  (info as { profilePhoto?: string }).profilePhoto &&
                  (info as { profilePhoto?: string }).profilePhoto !== "/assets/gopal-profile.jpg"
                    ? (info as { profilePhoto?: string }).profilePhoto!
                    : profilePhoto
                }
                alt={info.name || "Gopal Maddheshiya"}
                width={420}
                height={500}
                className="w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 lg:w-[21rem] lg:h-[25rem] object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
              />

              {/* Bottom overlay with dark scrim gradient (eliminates light mode white glare) */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-sm sm:text-base font-semibold text-white">
                    {info.name}
                  </p>
                  <p className="text-xs text-zinc-300">
                    {info.subtitle}
                  </p>
                </div>
                <span
                  title="Available for Summer 2026 SWE / Full-Stack Internships"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow-xs cursor-default transition-transform hover:scale-105"
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary-foreground" />
                  </span>
                  <span>{hero.availabilityStatus || "Online"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
