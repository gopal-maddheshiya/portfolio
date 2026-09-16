import { useEffect, useRef } from "react";
import { CheckCircle2, Code2, Cpu, GraduationCap, MapPin, Sparkles, Zap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePortfolio } from "@/context/PortfolioContext";
import { ABOUT_DATA } from "@/data/profile";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function About() {
  const { data } = usePortfolio();
  const info = data.personalInfo;
  const education = data.education || [];
  const focusAreas = data.focusAreas || [];
  const about = data.aboutData || ABOUT_DATA;

  const sectionRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current || !sectionRef.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    animatedRef.current = true;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-anim-heading",
        { opacity: 0, y: 30, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ".about-anim-heading", start: "top 88%", once: true },
        },
      );

      gsap.fromTo(
        ".about-anim-principle",
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.12,
          clearProps: "all",
          scrollTrigger: { trigger: ".about-anim-principles", start: "top 85%", once: true },
        },
      );

      gsap.fromTo(
        ".about-anim-snap-cell",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.09,
          clearProps: "all",
          scrollTrigger: { trigger: ".about-anim-snapshot", start: "top 85%", once: true },
        },
      );

      gsap.fromTo(
        ".about-anim-pill",
        { opacity: 0, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
          clearProps: "all",
          scrollTrigger: { trigger: ".about-anim-focus", start: "top 88%", once: true },
        },
      );

      gsap.fromTo(
        ".about-anim-edu-item",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.12,
          clearProps: "all",
          scrollTrigger: { trigger: ".about-anim-education", start: "top 86%", once: true },
        },
      );

      gsap.fromTo(
        ".about-anim-course",
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "back.out(2)",
          stagger: 0.04,
          clearProps: "all",
          scrollTrigger: { trigger: ".about-anim-coursework", start: "top 92%", once: true },
        },
      );
    }, sectionRef);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  const getPrincipleIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case "cpu":
        return <Cpu className="size-4" />;
      case "zap":
        return <Zap className="size-4" />;
      case "code":
      default:
        return <Code2 className="size-4" />;
    }
  };

  return (
    <Section id="about" ref={sectionRef}>
      <div className="about-anim-heading">
        <SectionHeading
          animate={false}
          eyebrow={about.eyebrow || "About Me"}
          title={about.title || "Passionate about problem solving & engineering web apps."}
          description={
            about.description ||
            "A computer science student combining algorithmic rigor in Java with practical full-stack product development."
          }
        />
      </div>

      <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Story & Engineering Principles */}
        <div className="space-y-6 lg:col-span-7">
          <Reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 font-mono text-xs text-primary font-medium">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>Background &amp; Philosophy</span>
            </div>

            <h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-foreground">
              {about.storyTitle || "A developer who learns by building, solving, and iterating."}
            </h3>

            <div className="mt-4 space-y-3.5 text-sm sm:text-base leading-relaxed text-muted-foreground">
              {about.storyParagraphs && about.storyParagraphs.length > 0 ? (
                about.storyParagraphs.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
              ) : (
                <>
                  <p>
                    I&apos;m a Computer Science Engineering student at{" "}
                    <span className="font-medium text-foreground">
                      Shri Ramswaroop Memorial University
                    </span>
                    , actively preparing for software engineering roles.
                  </p>
                </>
              )}
            </div>

            {/* Core Principles */}
            <div className="about-anim-principles mt-6 pt-6 border-t border-border grid gap-3 sm:grid-cols-3">
              {(about.principles || ABOUT_DATA.principles).map((principle, idx) => (
                <div
                  key={idx}
                  className="about-anim-principle rounded-xl border border-border/80 bg-surface/60 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
                >
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {getPrincipleIcon(principle.icon)}
                  </div>
                  <h4 className="mt-2 text-xs font-semibold text-foreground">{principle.title}</h4>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Context Footer */}
            <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-mono">
                <MapPin className="size-3.5 text-primary" />
                <span>{info.location}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-primary">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <span>Open to Internship Opportunities</span>
              </div>
            </div>
          </Reveal>

          {/* Core Focus Pills */}
          <Reveal
            delay={60}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs"
          >
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Current Learning &amp; Focus Areas
            </p>
            <div className="about-anim-focus mt-3 flex flex-wrap gap-2">
              {focusAreas.map((item) => (
                <span
                  key={item}
                  className="about-anim-pill inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/80 px-2.5 py-1 text-xs text-secondary-foreground transition-transform duration-200 hover:scale-105"
                >
                  <CheckCircle2 className="size-3 text-primary" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right Column: Quick Snapshot + Education & Certifications */}
        <div className="space-y-6 lg:col-span-5">
          {/* Quick Snapshot Grid */}
          <Reveal
            delay={40}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs"
          >
            <h4 className="font-mono text-xs text-primary font-medium uppercase tracking-wider">
              Profile Snapshot
            </h4>
            <div className="about-anim-snapshot mt-3.5 grid grid-cols-2 gap-3">
              <div className="about-anim-snap-cell rounded-xl border border-border/80 bg-surface/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xs">
                <p className="text-[11px] font-mono text-muted-foreground">Degree</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {about.snapshot?.degree || "B.Tech CSE"}
                </p>
                <p className="text-[11px] font-mono text-primary mt-0.5">
                  {about.snapshot?.cgpa || "CGPA 7.62"}
                </p>
              </div>
              <div className="about-anim-snap-cell rounded-xl border border-border/80 bg-surface/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xs">
                <p className="text-[11px] font-mono text-muted-foreground">DSA Practice</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {about.snapshot?.dsaPractice || "Java · LeetCode"}
                </p>
                <p className="text-[11px] font-mono text-primary mt-0.5">Active Practice</p>
              </div>
              <div className="about-anim-snap-cell rounded-xl border border-border/80 bg-surface/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xs">
                <p className="text-[11px] font-mono text-muted-foreground">Primary Stack</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {about.snapshot?.stack || "Java & Full-Stack"}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  React · Node · Mongo
                </p>
              </div>
              <div className="about-anim-snap-cell rounded-xl border border-border/80 bg-surface/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xs">
                <p className="text-[11px] font-mono text-muted-foreground">Graduation</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {about.snapshot?.batch || "2028 Batch"}
                </p>
                <p className="text-[11px] font-mono text-primary mt-0.5">
                  {about.snapshot?.university || "SRMU University"}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Education & Academic Coursework */}
          <Reveal
            delay={80}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5 font-display text-base font-semibold text-foreground">
              <GraduationCap className="size-4.5 text-primary" />
              <span>Education</span>
            </div>

            <ul className="about-anim-education space-y-4">
              {education.map((item) => (
                <li
                  key={item.title}
                  className="about-anim-edu-item border-l-2 border-border pl-3.5 transition-colors duration-300 hover:border-primary/50"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    {item.detail ? (
                      <span className="font-mono text-xs text-primary font-medium">
                        {item.detail}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.org}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/70">
                    {item.period}
                  </p>
                </li>
              ))}
            </ul>

            {/* Key Relevant Coursework */}
            <div className="pt-4 border-t border-border/80">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Relevant Coursework
              </p>
              <div className="about-anim-coursework mt-2.5 flex flex-wrap gap-1.5">
                {(about.coursework || ABOUT_DATA.coursework).map((course) => (
                  <span
                    key={course}
                    className="about-anim-course rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-foreground"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
