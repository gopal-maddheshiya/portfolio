import { useEffect, useState } from "react";
import { ArrowRight, Code2, Download, Github, Linkedin, MapPin } from "lucide-react";

import profilePhoto from "@/assets/gopal-profile.jpg";
import { PERSONAL_INFO } from "@/data/profile";

const TYPING_ROLES = [
  "Software Engineer",
  "Full-Stack Developer",
  "Java & DSA Developer",
  "Problem Solver",
];

function TypewriterRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = TYPING_ROLES[roleIndex] || "";
    const typingSpeed = isDeleting ? 35 : 75;
    const pauseTime = isDeleting ? 300 : 2000;

    if (!isDeleting && currentText === currentRole) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % TYPING_ROLES.length);
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
  }, [currentText, isDeleting, roleIndex]);

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

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-6 pb-12 sm:py-16 md:py-20 lg:py-24">
      {/* Background grid */}
      <div aria-hidden="true" className="grid-backdrop pointer-events-none absolute inset-0" />

      <div className="container-page relative grid gap-10 sm:gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        {/* Left Column: Intro & Call to Actions */}
        <div className="flex flex-col items-start">
          {/* Greeting Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span>Hi, I&apos;m Gopal Maddheshiya</span>
          </div>

          {/* Heading with Typewriter */}
          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-[3.1rem] font-bold leading-[1.22] tracking-tight text-foreground">
            <span>Building software as a </span>
            <br />
            <span className="inline-block min-h-[1.25em] whitespace-nowrap">
              <TypewriterRole />
            </span>
          </h1>

          {/* Bio Description */}
          <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Computer Science student at SRMU. I practice Data Structures &amp; Algorithms in Java
            daily, and build practical full-stack web applications with React, Node.js, Express, and
            MongoDB.
          </p>

          {/* Location */}
          <p className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary shrink-0" aria-hidden="true" />
            <span>{PERSONAL_INFO.location}</span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
            <a
              href="#projects"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 active:scale-[0.99] cursor-pointer"
            >
              <span>View my work</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </a>

            <a
              href={PERSONAL_INFO.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-border-strong bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.99] cursor-pointer"
            >
              <Download className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>Download resume</span>
            </a>
          </div>

          {/* Social Profiles */}
          <ul className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-5">
            <li>
              <a
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
                href={PERSONAL_INFO.github}
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
                href={PERSONAL_INFO.leetcode}
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
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="size-4 shrink-0" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Right Column: Clean Profile Photo with Online Status Badge */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-soft">
              <img
                src={profilePhoto}
                alt="Gopal Maddheshiya"
                width={420}
                height={500}
                className="w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 lg:w-[21rem] lg:h-[25rem] object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
              />

              {/* Bottom overlay with blinking Online badge */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-sm sm:text-base font-semibold text-foreground">
                    Gopal Maddheshiya
                  </p>
                  <p className="text-xs text-muted-foreground">Java &amp; MERN Developer</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow-xs">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary-foreground" />
                  </span>
                  <span>Online</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
