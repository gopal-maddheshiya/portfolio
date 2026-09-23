import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Code2, FileText, Github, Linkedin, MapPin } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import profilePhoto from "@/assets/gopal-profile.jpg";
import { HangingIdCard } from "@/components/portfolio/HangingIdCard";
import { usePortfolio } from "@/context/PortfolioContext";
import { handleAnchorClick } from "@/lib/scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_TYPING_ROLES = [
  "Java & DSA Developer",
  "Full-Stack Web Engineer",
  "MERN Stack Specialist",
  "B.Tech CSE Student",
];

const REDUCED_MOTION =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function TypewriterRole({
  roles = DEFAULT_TYPING_ROLES,
  startDelay = 0,
}: {
  roles?: string[];
  startDelay?: number;
}) {
  const activeRoles = roles && roles.length > 0 ? roles : DEFAULT_TYPING_ROLES;
  const initialRole = activeRoles[0] || "";

  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState(initialRole);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (REDUCED_MOTION) return;
    const initialWait = startDelay > 0 ? startDelay : 2000;
    const timeout = setTimeout(() => {
      setStarted(true);
      setIsDeleting(true);
    }, initialWait);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  useEffect(() => {
    if (!started || REDUCED_MOTION) return;
    const currentRole = activeRoles[roleIndex % activeRoles.length] || "";
    const typingSpeed = isDeleting ? 35 : 75;
    const pauseTime = isDeleting ? 350 : 2200;

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
  }, [started, currentText, isDeleting, roleIndex, activeRoles]);

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
    <svg
      className={className}
      viewBox="-11.5 -10.23174 23 20.46348"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

/* Magnetic hover lift for the primary CTA buttons */
function MagneticWrap({
  children,
  className,
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || REDUCED_MOTION) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      gsap.to(ref.current, { x, y, duration: 0.35, ease: "power2.out" });
    },
    [strength],
  );

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  }, []);

  return (
    <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
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

  const containerRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false);

  // Cinematic first-page entrance sequence.
  useEffect(() => {
    if (hasAnimatedRef.current || !containerRef.current) return;
    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      // Synchronously set initial hidden states at t=0 so there is no 650ms FOUC flash before GSAP starts
      gsap.set(".hero-anim-grid", { opacity: 0 });
      gsap.set(".hero-anim-badge", { opacity: 0, y: -14, scale: 0.9 });
      gsap.set(".hero-anim-line-inner", { opacity: 0, yPercent: 115, filter: "blur(6px)" });
      gsap.set(".hero-anim-bio", { opacity: 0, y: 22 });
      gsap.set(".hero-anim-location", { opacity: 0, x: -16 });
      gsap.set(".hero-anim-btn", { opacity: 0, y: 16, scale: 0.96 });
      gsap.set(".hero-anim-social", { opacity: 0, y: 12 });
      gsap.set(".hero-anim-photo", { opacity: 0, clipPath: "inset(10% 16% 10% 16% round 16px)" });
      gsap.set(".hero-anim-photo-name", { opacity: 0, y: 24 });
      gsap.set(".hero-anim-float", { opacity: 0 });
      gsap.set(".hero-anim-scroll", { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });

      tl.to(
        ".hero-anim-grid",
        { opacity: 1, duration: 1.2, ease: "power2.out", clearProps: "opacity" },
        0,
      )
        .to(
          ".hero-anim-badge",
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.7)", clearProps: "all" },
          0.3,
        )
        .to(
          ".hero-anim-line-inner",
          {
            opacity: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.85,
            stagger: 0.16,
            ease: "expo.out",
            clearProps: "all",
          },
          0.5,
        )
        .to(
          ".hero-anim-bio",
          { opacity: 1, y: 0, duration: 0.6, clearProps: "all" },
          0.98,
        )
        .to(
          ".hero-anim-location",
          { opacity: 1, x: 0, duration: 0.5, clearProps: "all" },
          1.12,
        )
        .to(
          ".hero-anim-btn",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.09,
            ease: "back.out(1.5)",
            clearProps: "all",
          },
          1.22,
        )
        .to(
          ".hero-anim-social",
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, clearProps: "all" },
          1.5,
        )
        .to(
          ".hero-anim-photo",
          {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            duration: 1.05,
            ease: "expo.inOut",
            clearProps: "all",
          },
          0.65,
        )
        .to(
          ".hero-anim-photo-name",
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", clearProps: "all" },
          1.55,
        )
        .to(
          ".hero-anim-float",
          { opacity: 1, duration: 0.6, stagger: 0.14, ease: "power2.out", clearProps: "opacity" },
          1.7,
        )
        .to(
          ".hero-anim-scroll",
          { opacity: 1, duration: 0.6, clearProps: "all" },
          2.1,
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Scroll-connected fade-out + background parallax for a cinematic exit.
  useEffect(() => {
    if (!containerRef.current) return;
    if (REDUCED_MOTION) return;

    const ctx = gsap.context(() => {
      gsap.to(".hero-anim-content", {
        opacity: 0,
        y: -36,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom 28%",
          scrub: 0.6,
        },
      });

      gsap.to(".hero-anim-grid", {
        yPercent: 28,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative overflow-hidden pt-6 pb-16 sm:py-16 md:py-20 lg:py-24"
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="hero-anim-grid grid-backdrop pointer-events-none absolute inset-0"
      />

      {/* Scroll cue */}
      <div className="hero-anim-scroll pointer-events-none absolute inset-x-0 bottom-3 z-20 hidden sm:flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Scroll
          </span>
          <span className="hero-scroll-line" aria-hidden="true" />
        </div>
      </div>

      <div className="hero-anim-content container-page relative grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
        {/* Left Column: Intro & Call to Actions */}
        <div className="flex flex-col items-start min-w-0">
          {/* Greeting Badge */}
          <div className="hero-anim-badge inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span>{hero.greetingBadge || `Hi, I'm ${info.name}`}</span>
          </div>

          {/* Heading with masked line reveals + typewriter that starts after the reveal */}
          <h1 className="hero-anim-title mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-[3.1rem] font-bold leading-[1.22] tracking-tight text-foreground">
            {/* Semantic full heading for screen readers & search engines (WCAG 2.4.6) */}
            <span className="sr-only">
              {hero.headlinePrefix || "Building software as a"}{" "}
              {(hero.typewriterRoles && hero.typewriterRoles[0]) || DEFAULT_TYPING_ROLES[0]}
            </span>

            {/* Visual animated presentation */}
            <span aria-hidden="true" className="block">
              <span className="hero-anim-line block overflow-hidden">
                <span className="hero-anim-line-inner block">
                  {hero.headlinePrefix || "Building software as a"}
                </span>
              </span>
              <span className="hero-anim-line block overflow-hidden pt-0.5">
                <span className="hero-anim-line-inner block min-h-[1.25em]">
                  <TypewriterRole roles={hero.typewriterRoles} startDelay={1800} />
                </span>
              </span>
            </span>
          </h1>

          {/* Bio Description */}
          <p className="hero-anim-bio mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {info.siteDescription}
          </p>

          {/* Location */}
          <p className="hero-anim-location mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary shrink-0" aria-hidden="true" />
            <span>{info.location}</span>
          </p>

          {/* CTA Buttons with magnetic hover */}
          <div className="mt-6 sm:mt-8 flex flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <MagneticWrap className="flex-1 sm:flex-initial sm:w-auto">
              <a
                onClick={handleAnchorClick}
                href="#projects"
                className="hero-anim-btn inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 active:scale-[0.99] cursor-pointer whitespace-nowrap"
              >
                <span>View my work</span>
                <ArrowRight className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
              </a>
            </MagneticWrap>

            <MagneticWrap className="flex-1 sm:flex-initial sm:w-auto">
              <a
                href={info.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-anim-btn inline-flex w-full items-center justify-center gap-2 rounded-md border border-border-strong bg-card px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.99] cursor-pointer whitespace-nowrap"
              >
                <FileText
                  className="size-3.5 sm:size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>View Resume</span>
              </a>
            </MagneticWrap>
          </div>

          {/* Social Profiles */}
          <ul
            className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-5"
            aria-label="Social profiles"
          >
            <li className="hero-anim-social">
              <a
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
                href={info.github}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="Visit Gopal's GitHub profile"
              >
                <Github className="size-4 shrink-0" aria-hidden="true" />
                <span>GitHub</span>
              </a>
            </li>
            <li className="hero-anim-social">
              <a
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
                href={info.leetcode}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="Visit Gopal's LeetCode profile"
              >
                <Code2 className="size-4 shrink-0" aria-hidden="true" />
                <span>LeetCode</span>
              </a>
            </li>
            <li className="hero-anim-social">
              <a
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
                href={info.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="Visit Gopal's LinkedIn profile"
              >
                <Linkedin className="size-4 shrink-0" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Right Column: Clean Profile Photo with Attached Floating Badges & Compact Top Hanger */}
        <div className="flex justify-center lg:justify-end min-w-0">
          <div className="relative group shrink-0">
            {/* Main Photo Card Container with Attached Badges & Compact Top Hanger */}
            <HangingIdCard
              photoSrc={
                info.profilePhoto &&
                  (info.profilePhoto.startsWith("http://") ||
                    info.profilePhoto.startsWith("https://") ||
                    info.profilePhoto.startsWith("data:"))
                  ? info.profilePhoto
                  : profilePhoto
              }
              name={info.name || "Gopal Maddheshiya"}
              subtitle={info.subtitle || "Java & Full-Stack Developer · DSA & API Integration"}
              floatingBadge1={
                <div className="aurora-badge-wrapper rounded-full">
                  <div className="inline-flex items-center gap-2 rounded-full bg-card/95 dark:bg-card/90 px-3 py-1.5 backdrop-blur-md transition-transform hover:scale-105 pointer-events-auto select-none">
                    <div className="flex size-5 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                      <JavaIcon className="size-3.5" />
                    </div>
                    <span className="font-semibold text-xs text-foreground">
                      {hero.floatingBadge1 || "Java • DSA"}
                    </span>
                  </div>
                </div>
              }
              floatingBadge2={
                <div className="aurora-badge-wrapper rounded-full">
                  <div className="inline-flex items-center gap-2 rounded-full bg-card/95 dark:bg-card/90 px-3 py-1.5 backdrop-blur-md transition-transform hover:scale-105 pointer-events-auto select-none">
                    <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <ReactIcon className="size-3.5" />
                    </div>
                    <span className="font-semibold text-xs text-foreground">
                      {hero.floatingBadge2 || "Full-Stack"}
                    </span>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
