import { Download, ExternalLink, FileText, Sparkles } from "lucide-react";

import { PERSONAL_INFO } from "@/data/profile";
import { Reveal } from "./Reveal";

export function ResumeCTA() {
  return (
    <section id="resume" className="scroll-mt-20 sm:scroll-mt-24 border-t border-border py-12 sm:py-16 lg:py-20">
      <div className="container-page">
        <Reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-12 shadow-soft">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Text details */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-primary font-medium">
                <FileText className="size-3.5" aria-hidden="true" />
                <span>Resume / Curriculum Vitae</span>
              </div>

              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
                Interested in my profile for an internship or role?
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                My single-page resume covers my academic coursework at SRMU, core competencies in
                Java &amp; DSA, full-stack project portfolio, and coding profile achievements.
              </p>

              {/* Quick tags */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5">
                  <Sparkles className="size-3 text-primary" />
                  Single-Page PDF
                </span>
                <span>•</span>
                <span>Java &amp; Full-Stack Focus</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 w-full lg:justify-end">
              <a
                href={PERSONAL_INFO.resume}
                download="Gopal_Maddheshiya_Resume.pdf"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
              >
                <Download className="size-4 shrink-0" aria-hidden="true" />
                <span>Download Resume</span>
              </a>

              <a
                href={PERSONAL_INFO.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-secondary/60 px-5 py-3 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer"
              >
                <ExternalLink className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span>View in Browser</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
