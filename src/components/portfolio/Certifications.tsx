import { Award, Download, ExternalLink, FileCheck } from "lucide-react";

import { CERTIFICATIONS } from "@/data/profile";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

export function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeading
        eyebrow="Certifications &amp; Achievements"
        title="Verified Credentials"
        description="Course completions, technical certifications, and university academic achievements."
      />

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((cert, index) => (
          <Reveal
            key={cert.title}
            delay={index * 60}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-soft"
          >
            <div>
              {/* Top Row: Icon & Issue Date */}
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                  <Award className="size-5 shrink-0" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
                  {cert.period}
                </span>
              </div>

              {/* Title & Issuer */}
              <h3 className="mt-4 font-display text-base sm:text-lg font-semibold text-foreground">
                {cert.title}
              </h3>
              <p className="mt-0.5 text-xs font-mono text-primary font-medium">
                {cert.org}
              </p>

              {/* Detail description */}
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {cert.detail}
              </p>

              {/* Skills Tags */}
              <div className="mt-4 pt-3 border-t border-border/60">
                <ul className="flex flex-wrap gap-1.5">
                  {cert.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Links: View Certificate in New Tab & Download */}
            <div className="mt-5 pt-4 border-t border-border/80">
              {cert.certificateUrl ? (
                <div className="flex items-center gap-2">
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>View Certificate</span>
                  </a>

                  <a
                    href={cert.certificateUrl}
                    download
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary hover:bg-secondary/80 p-2.5 text-muted-foreground hover:text-foreground transition-colors active:scale-[0.98] cursor-pointer"
                    aria-label={`Download ${cert.title} certificate`}
                    title="Download Certificate"
                  >
                    <Download className="size-4" aria-hidden="true" />
                  </a>
                </div>
              ) : (
                <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-xs font-mono text-muted-foreground">
                  <FileCheck className="size-3.5 text-primary" />
                  <span>Verified Credential</span>
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
