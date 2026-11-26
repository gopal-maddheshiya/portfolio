import { useMemo, useRef, useState } from "react";
import {
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  Sparkles,
  X,
} from "lucide-react";

import { ModalDialog } from "@/components/common/ModalDialog";
import { usePortfolio } from "@/context/PortfolioContext";
import { DEFAULT_SECTION_HEADERS, type Certification } from "@/data/profile";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

const MAX_VISIBLE_INITIAL = 6;
const MAX_CARD_SKILLS = 4;

function isPdfDocument(url: string): boolean {
  return /\.pdf($|[?#])/i.test(url);
}

function CertificationPreviewDialog({
  certification,
  onClose,
}: {
  certification: Certification | null;
  onClose: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = certification?.certificateUrl?.trim() || "";
  const isPdf = Boolean(url && isPdfDocument(url));

  return (
    <ModalDialog
      open={Boolean(certification)}
      onClose={onClose}
      labelledBy="cert-preview-dialog-title"
      bodyScrollRef={bodyRef}
      className="max-w-3xl"
    >
      {certification ? (
        <div className="flex max-h-[90dvh] flex-col">
          {/* Mobile bottom-sheet handle */}
          <div className="flex justify-center pt-2.5 sm:hidden shrink-0" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-border-strong" />
          </div>

          {/* Sticky Modal Header */}
          <div className="flex items-start justify-between gap-3 border-b border-border/80 bg-surface/50 px-5 py-4 shrink-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <span className="font-semibold text-primary">
                  {certification.category || "Certification"}
                </span>
                <span>&bull;</span>
                <span>{certification.period}</span>
                {certification.featured ? (
                  <>
                    <span>&bull;</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      <Sparkles className="size-2.5" aria-hidden="true" />
                      <span>Featured</span>
                    </span>
                  </>
                ) : null}
              </div>
              <h2
                id="cert-preview-dialog-title"
                className="mt-1 font-display text-base sm:text-xl font-bold tracking-tight text-foreground"
              >
                {certification.title}
              </h2>
              <p className="text-xs font-mono text-primary mt-0.5">{certification.org}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close certificate preview"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Preview Body */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {url ? (
              isPdf ? (
                <div className="space-y-2">
                  <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    <iframe
                      src={`${url}#view=FitH`}
                      title={`${certification.title} Certificate PDF`}
                      className="h-[52dvh] sm:h-[60dvh] w-full bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono text-center sm:text-left">
                    Mobile browsers that restrict inline PDFs can use &ldquo;Open File&rdquo; or
                    &ldquo;Download&rdquo; below.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border bg-surface p-2 flex items-center justify-center">
                  <img
                    src={url}
                    alt={`${certification.title} certificate`}
                    className="max-h-[58dvh] w-auto max-w-full rounded-lg object-contain"
                  />
                </div>
              )
            ) : null}

            <div className="rounded-xl border border-border/80 bg-surface/50 p-3.5 space-y-2">
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {certification.detail}
              </p>
              {certification.skills?.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {certification.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {/* Sticky Action Footer */}
          {url ? (
            <div className="border-t border-border/80 bg-surface/60 px-5 py-3.5 flex flex-col sm:flex-row gap-2.5 shrink-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <ExternalLink className="size-4 text-primary shrink-0" aria-hidden="true" />
                <span>Open Full File</span>
              </a>
              <a
                href={url}
                download
                className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Download className="size-4 shrink-0" aria-hidden="true" />
                <span>Download Certificate</span>
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
    </ModalDialog>
  );
}

export function Certifications() {
  const { data } = usePortfolio();
  const certifications = useMemo(() => data.certifications || [], [data.certifications]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);

  const certHeader = {
    eyebrow:
      data.sectionHeaders?.certifications?.eyebrow ||
      DEFAULT_SECTION_HEADERS.certifications.eyebrow,
    title:
      data.sectionHeaders?.certifications?.title || DEFAULT_SECTION_HEADERS.certifications.title,
    description:
      data.sectionHeaders?.certifications?.description ||
      DEFAULT_SECTION_HEADERS.certifications.description,
  };

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          certifications
            .map((c) => c.category?.trim())
            .filter((cat): cat is string => Boolean(cat && cat.length > 0)),
        ),
      ),
    [certifications],
  );

  const filteredCerts = useMemo(() => {
    if (selectedCategory === "all") return certifications;
    return certifications.filter(
      (c) => (c.category?.trim() || "").toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [certifications, selectedCategory]);

  const hasOverflow = filteredCerts.length > MAX_VISIBLE_INITIAL;
  const visibleCerts = showAll ? filteredCerts : filteredCerts.slice(0, MAX_VISIBLE_INITIAL);

  return (
    <Section id="certifications" tone="surface">
      <SectionHeading
        eyebrow={certHeader.eyebrow}
        title={certHeader.title}
        description={certHeader.description}
      />

      {/* Category Filter Strip (shown when 2+ categories or > 3 certificates exist) */}
      {(categories.length >= 2 || certifications.length > 3) && (
        <div
          role="tablist"
          aria-label="Filter certificates by category"
          className="mt-6 sm:mt-8 flex items-center gap-2 overflow-x-auto flex-nowrap sm:flex-wrap pb-2 pt-0.5 sm:pb-0 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "all"}
            onClick={() => {
              setSelectedCategory("all");
              setShowAll(false);
            }}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            <span>All Credentials ({certifications.length})</span>
          </button>

          {categories.map((cat) => {
            const count = certifications.filter(
              (c) => (c.category?.trim() || "").toLowerCase() === cat.toLowerCase(),
            ).length;
            const active = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowAll(false);
                }}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                <span>
                  {cat} ({count})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Certifications Grid */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCerts.map((cert, index) => {
          const skills = cert.skills || [];
          const displayedSkills = skills.slice(0, MAX_CARD_SKILLS);
          const overflowCount = Math.max(0, skills.length - MAX_CARD_SKILLS);

          return (
            <Reveal
              key={`${cert.title}-${cert.period}-${index}`}
              delay={Math.min(index, 5) * 50}
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-[border-color,box-shadow] duration-200 hover:shadow-soft before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:to-transparent",
                cert.featured
                  ? "border-primary/40 before:via-primary/65 hover:border-primary/70"
                  : "border-border before:via-primary/30 hover:border-primary/45",
              )}
            >
              <div>
                {/* Top Row: Icon, Category/Featured, Period */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      {cert.featured ? (
                        <Sparkles className="size-4.5 shrink-0" aria-hidden="true" />
                      ) : (
                        <Award className="size-5 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                    {cert.category ? (
                      <span className="inline-flex items-center rounded-md border border-border/80 bg-surface px-2 py-0.5 font-mono text-[10px] font-medium text-foreground/85 truncate">
                        {cert.category}
                      </span>
                    ) : null}
                  </div>

                  <span className="font-mono text-[11px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-md shrink-0">
                    {cert.period}
                  </span>
                </div>

                {/* Title & Issuer */}
                <h3 className="mt-4 font-display text-base sm:text-lg font-semibold text-foreground line-clamp-2 leading-snug">
                  {cert.title}
                </h3>
                <p className="mt-1 text-xs font-mono text-primary font-medium truncate">
                  {cert.org}
                </p>

                {/* Detail description */}
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {cert.detail}
                </p>

                {/* Skills Tags */}
                {displayedSkills.length > 0 ? (
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <ul className="flex flex-wrap items-center gap-1.5">
                      {displayedSkills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                        >
                          {skill}
                        </li>
                      ))}
                      {overflowCount > 0 ? (
                        <li className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
                          +{overflowCount}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Action Links: In-Page Preview Modal + Direct Download */}
              <div className="mt-4 pt-3.5 border-t border-border/80">
                {cert.certificateUrl ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewCert(cert)}
                      className="flex-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors active:scale-[0.98] cursor-pointer"
                    >
                      <Eye className="size-3.5 shrink-0" aria-hidden="true" />
                      <span>Preview Certificate</span>
                    </button>

                    <a
                      href={cert.certificateUrl}
                      download
                      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-border bg-secondary hover:bg-secondary/80 px-2.5 text-muted-foreground hover:text-foreground transition-colors active:scale-[0.98] cursor-pointer"
                      aria-label={`Download ${cert.title} certificate`}
                      title="Download Certificate"
                    >
                      <Download className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                ) : (
                  <span className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-secondary px-4 py-2 text-xs font-mono text-muted-foreground">
                    <FileCheck className="size-3.5 text-primary" aria-hidden="true" />
                    <span>Verified Credential</span>
                  </span>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Expand / Collapse All Certificates */}
      {hasOverflow ? (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (showAll) {
                setShowAll(false);
                scrollToId("certifications");
              } else {
                setShowAll(true);
              }
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border-strong bg-card px-5 py-2 text-xs sm:text-sm font-medium text-foreground shadow-2xs hover:border-primary/45 hover:bg-secondary transition-colors cursor-pointer"
          >
            {showAll ? (
              <>
                <ChevronUp className="size-4 text-primary" aria-hidden="true" />
                <span>Show Fewer Certificates</span>
              </>
            ) : (
              <>
                <ChevronDown className="size-4 text-primary" aria-hidden="true" />
                <span>View All {filteredCerts.length} Certificates</span>
              </>
            )}
          </button>
        </div>
      ) : null}

      <CertificationPreviewDialog
        certification={previewCert}
        onClose={() => setPreviewCert(null)}
      />
    </Section>
  );
}
