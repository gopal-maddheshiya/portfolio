import { Mail, FileText } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import { FileUploader } from "@/components/admin/ui/FileUploader";

interface ContactTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function ContactTab({ data, updateData }: ContactTabProps) {
  const contact = data.contactData;
  const cta = data.resumeCTA;
  const info = data.personalInfo;

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* 1. Contact Section Heading */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Mail className="size-5 text-primary" />
            <span>Contact Section Headings &amp; Availability</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure contact section title, description, and status banner.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Eyebrow Tag
            </label>
            <input
              type="text"
              value={contact.eyebrow}
              onChange={(e) => updateData({ contactData: { ...contact, eyebrow: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Main Title
            </label>
            <input
              type="text"
              value={contact.title}
              onChange={(e) => updateData({ contactData: { ...contact, title: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={contact.description}
              onChange={(e) =>
                updateData({ contactData: { ...contact, description: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[65px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Direct Contact Card Heading
            </label>
            <input
              type="text"
              value={contact.directHeading || ""}
              placeholder="Direct contact"
              onChange={(e) =>
                updateData({ contactData: { ...contact, directHeading: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Availability Highlight Title
            </label>
            <input
              type="text"
              value={contact.availabilityTitle || ""}
              placeholder="Open for Internship & Full-Time Roles"
              onChange={(e) =>
                updateData({ contactData: { ...contact, availabilityTitle: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Availability Details Subtitle
            </label>
            <input
              type="text"
              value={contact.availabilitySubtitle || ""}
              placeholder="B.Tech CSE at SRMU · Verified DSA & Full-Stack track record · Typical response within 24 hours."
              onChange={(e) =>
                updateData({ contactData: { ...contact, availabilitySubtitle: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Footer Tagline (Shown Next to Copyright)
            </label>
            <input
              type="text"
              value={info.footerTagline || ""}
              placeholder="Built with code and continuous learning."
              onChange={(e) =>
                updateData({ personalInfo: { ...info, footerTagline: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Resume CTA Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <span>Resume CTA Banner (Placed Above Contact Section)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure download callout card and resume details.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Eyebrow Tag
            </label>
            <input
              type="text"
              value={cta.eyebrow}
              onChange={(e) => updateData({ resumeCTA: { ...cta, eyebrow: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Banner Title
            </label>
            <input
              type="text"
              value={cta.title}
              onChange={(e) => updateData({ resumeCTA: { ...cta, title: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Banner Description
            </label>
            <textarea
              rows={2}
              value={cta.description}
              onChange={(e) => updateData({ resumeCTA: { ...cta, description: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[65px]"
            />
          </div>

          <div className="sm:col-span-2">
            <TagListInput
              label="Banner Pill Tags"
              tags={cta.tags || []}
              onChange={(newTags) => updateData({ resumeCTA: { ...cta, tags: newTags } })}
              placeholder="Add tag (e.g. Single-Page PDF) and press Enter..."
              badgeColorClass="bg-secondary text-foreground border-border"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Download Button Text
            </label>
            <input
              type="text"
              value={cta.buttonText || ""}
              placeholder="Download Resume"
              onChange={(e) => updateData({ resumeCTA: { ...cta, buttonText: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Document Status Badge
            </label>
            <input
              type="text"
              value={cta.updatedLabel || ""}
              placeholder="Updated 2026 · 1-Page PDF"
              onChange={(e) => updateData({ resumeCTA: { ...cta, updatedLabel: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Attached Resume PDF */}
          <div className="sm:col-span-2">
            <FileUploader
              label="Attached Resume PDF File"
              value={info.resume || ""}
              onChange={(url) => updateData({ personalInfo: { ...info, resume: url } })}
              folder="resumes"
              formatBadge="PDF Document"
              helpText="Synchronized with the Hero and Navbar resume download links."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
