import { useState } from "react";
import { Download, ExternalLink, Eye, FileText, Sparkles, X } from "lucide-react";

import { ModalDialog } from "@/components/common/ModalDialog";
import { usePortfolio } from "@/context/PortfolioContext";
import { PERSONAL_INFO, RESUME_CTA_DATA } from "@/data/profile";
import { Reveal } from "./Reveal";

function ResumePreviewDialog({
  open,
  onClose,
  resumeUrl,
  downloadName,
  ownerName,
}: {
  open: boolean;
  onClose: () => void;
  resumeUrl: string;
  downloadName: string;
  ownerName: string;
}) {
  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      labelledBy="resume-preview-dialog-title"
      className="max-w-3xl"
    >
      <div className="flex max-h-[90dvh] flex-col">
        {open ? (
          <>
            {/* Mobile drag handle */}
            <div className="flex justify-center pt-2.5 sm:hidden shrink-0" aria-hidden="true">
              <span className="h-1 w-10 rounded-full bg-border-strong" />
            </div>

            {/* Sticky Dialog Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border/80 bg-surface/50 px-5 py-4 shrink-0">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-primary font-medium">
                  <FileText className="size-3.5" aria-hidden="true" />
                  <span>Curriculum Vitae Preview</span>
                </span>
                <h2
                  id="resume-preview-dialog-title"
                  className="mt-1 font-display text-base sm:text-xl font-bold tracking-tight text-foreground truncate"
                >
                  {ownerName} — Resume
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close resume preview"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Embedded PDF Viewer (mounted lazily only while dialog is open) */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
              <div className="overflow-hidden rounded-xl border border-border bg-surface">
                <iframe
                  src={`${resumeUrl}#view=FitH`}
                  title={`${ownerName} Resume PDF Preview`}
                  className="h-[55dvh] sm:h-[64dvh] w-full bg-white"
                />
              </div>
              <p className="text-[11px] text-muted-foreground font-mono text-center sm:text-left">
                On phones where inline PDF viewers are restricted, tap &ldquo;Open PDF Tab&rdquo; or
                &ldquo;Download Resume&rdquo; below.
              </p>
            </div>

            {/* Sticky Bottom Action Footer */}
            <div className="border-t border-border/80 bg-surface/60 px-5 py-3.5 flex flex-col sm:flex-row gap-2.5 shrink-0">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <ExternalLink className="size-4 text-primary shrink-0" aria-hidden="true" />
                <span>Open PDF Tab</span>
              </a>
              <a
                href={resumeUrl}
                download={downloadName}
                className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Download className="size-4 shrink-0" aria-hidden="true" />
                <span>Download Resume</span>
              </a>
            </div>
          </>
        ) : (
          <h2 id="resume-preview-dialog-title" className="sr-only">
            {ownerName} — Resume
          </h2>
        )}
      </div>
    </ModalDialog>
  );
}

export function ResumeCTA() {
  const { data } = usePortfolio();
  const info = data?.personalInfo || PERSONAL_INFO;
  const cta = data?.resumeCTA || RESUME_CTA_DATA;
  const [previewOpen, setPreviewOpen] = useState(false);

  const ownerName = info.name || "Gopal Maddheshiya";
  const downloadFilename = `${ownerName.trim().replace(/\s+/g, "_")}_Resume.pdf`;
  const updatedLabel = cta.updatedLabel?.trim() || "Updated 2026 · 1-Page PDF";

  return (
    <section
      id="resume"
      className="scroll-mt-20 sm:scroll-mt-24 border-t border-border py-12 sm:py-16 lg:py-20"
    >
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-soft before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/45 before:to-transparent">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl opacity-60"
          />

          <div className="relative grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Copy & Credentials */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-primary font-medium">
                  <FileText className="size-3.5" aria-hidden="true" />
                  <span>{cta.eyebrow || RESUME_CTA_DATA.eyebrow}</span>
                </span>
                <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-medium text-primary">
                  {updatedLabel}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display leading-snug">
                {cta.title || RESUME_CTA_DATA.title}
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                {cta.description || RESUME_CTA_DATA.description}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                {(cta.tags || RESUME_CTA_DATA.tags).map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-2.5 py-1"
                  >
                    <Sparkles className="size-3 text-primary shrink-0" aria-hidden="true" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right Tactile Resume Document Dock */}
            <div className="lg:col-span-5 rounded-xl border border-border/80 bg-surface/65 p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <FileText className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold text-foreground truncate">
                    {downloadFilename}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {info.universityShort || "B.Tech CSE"} &bull; Verified Resume PDF
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5">
                <a
                  href={info.resume}
                  download={downloadFilename}
                  className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer"
                >
                  <Download className="size-4 shrink-0" aria-hidden="true" />
                  <span>{cta.buttonText || RESUME_CTA_DATA.buttonText}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.98] cursor-pointer"
                >
                  <Eye className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>Preview CV</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <ResumePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        resumeUrl={info.resume}
        downloadName={downloadFilename}
        ownerName={ownerName}
      />
    </section>
  );
}
