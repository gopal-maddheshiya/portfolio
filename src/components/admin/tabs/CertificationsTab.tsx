import { useState } from "react";
import { Award, ChevronDown, ChevronUp, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { FileUploader } from "@/components/admin/ui/FileUploader";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { SectionHeadingEditor } from "@/components/admin/ui/SectionHeadingEditor";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import type { Certification } from "@/data/profile";
import type { PortfolioData } from "@/lib/supabase";

const CATEGORY_PRESETS = ["Contest Win", "Coursework", "Hackathon", "Cloud / Backend"];

interface CertificationsTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function CertificationsTab({ data, updateData }: CertificationsTabProps) {
  const certifications = data.certifications || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleAddCertification = () => {
    const newCert: Certification = {
      title: "New Certificate / Contest",
      org: "Issuing Organization",
      period: "2026",
      category: "Coursework",
      featured: false,
      detail: "Description of skills verified and contest performance.",
      skills: ["Problem Solving", "Java"],
      certificateUrl: "",
    };
    updateData({ certifications: [newCert, ...certifications] });
    setExpandedIndex(0);
    toast.success("New certificate added at top! Fill in its details.");
  };

  const handleDeleteCertification = (index: number) => {
    const item = certifications[index];
    if (confirm(`Delete certificate "${item?.title || "item"}"?`)) {
      updateData({ certifications: certifications.filter((_, i) => i !== index) });
      setExpandedIndex((prev) => {
        if (prev === null) return null;
        if (prev === index) return null;
        return prev > index ? prev - 1 : prev;
      });
      toast.info("Certificate removed.");
    }
  };

  const handleMoveCertification = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certifications.length) return;
    const itemA = certifications[index];
    const itemB = certifications[targetIndex];
    if (itemA && itemB) {
      const updated = [...certifications];
      updated[index] = itemB;
      updated[targetIndex] = itemA;
      updateData({ certifications: updated });
      if (expandedIndex === index) setExpandedIndex(targetIndex);
      else if (expandedIndex === targetIndex) setExpandedIndex(index);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <SectionHeadingEditor
        sectionKey="certifications"
        sectionLabel="Certifications"
        data={data}
        updateData={updateData}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
            <Award className="size-6 text-primary" />
            <span>Certifications &amp; Contests ({certifications.length})</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Add unlimited certificates, contest awards, categories, and PDF/image credentials.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCertification}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={`${cert.title}-${idx}`}
              className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden"
            >
              {/* Collapsible Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6 sm:py-4 bg-surface/35">
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  aria-expanded={isExpanded}
                  className="flex-1 min-w-0 flex items-center gap-3 text-left cursor-pointer"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    {cert.featured ? (
                      <Sparkles className="size-4" aria-hidden="true" />
                    ) : (
                      <Award className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary">#{idx + 1}</span>
                      <span className="font-display font-semibold text-sm text-foreground truncate">
                        {cert.title || "Untitled Certificate"}
                      </span>
                      {cert.category ? (
                        <span className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {cert.category}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {cert.org} &bull; {cert.period}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...certifications];
                      updated[idx] = { ...cert, featured: !cert.featured };
                      updateData({ certifications: updated });
                    }}
                    title={cert.featured ? "Unpin Featured badge" : "Mark as Featured"}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                      cert.featured
                        ? "border-primary/35 bg-primary/15 text-primary"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="size-3" />
                    <span className="hidden sm:inline">
                      {cert.featured ? "Featured" : "Feature"}
                    </span>
                  </button>

                  <ReorderControls
                    index={idx}
                    total={certifications.length}
                    onMove={handleMoveCertification}
                    label="certificate"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteCertification(idx)}
                    title="Delete certificate"
                    className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Editor Body */}
              {isExpanded ? (
                <div className="border-t border-border/80 p-5 sm:p-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Certificate / Award Title
                    </label>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, title: e.target.value };
                        updateData({ certifications: updated });
                      }}
                      className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      value={cert.org}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, org: e.target.value };
                        updateData({ certifications: updated });
                      }}
                      className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Period / Date
                    </label>
                    <input
                      type="text"
                      value={cert.period}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, period: e.target.value };
                        updateData({ certifications: updated });
                      }}
                      className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Category Tag (Used for Live Filter Pills)
                    </label>
                    <input
                      type="text"
                      value={cert.category || ""}
                      placeholder="e.g. Contest Win, Coursework, Hackathon"
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, category: e.target.value };
                        updateData({ certifications: updated });
                      }}
                      className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {CATEGORY_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            const updated = [...certifications];
                            updated[idx] = { ...cert, category: preset };
                            updateData({ certifications: updated });
                          }}
                          className="rounded-md border border-border bg-surface hover:border-primary/40 hover:text-primary px-2 py-0.5 text-[11px] font-mono text-muted-foreground transition-colors cursor-pointer"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Description / Impact
                    </label>
                    <textarea
                      rows={2}
                      value={cert.detail}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, detail: e.target.value };
                        updateData({ certifications: updated });
                      }}
                      className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[65px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <TagListInput
                      label="Skills Verified / Tested"
                      tags={cert.skills || []}
                      onChange={(newSkills) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, skills: newSkills };
                        updateData({ certifications: updated });
                      }}
                      placeholder="Add verified skill (e.g. Java, OOP, Problem Solving)..."
                      badgeColorClass="bg-primary/10 text-primary border-primary/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FileUploader
                      label="Certificate PDF / Image Document"
                      value={cert.certificateUrl || ""}
                      onChange={(url) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, certificateUrl: url };
                        updateData({ certifications: updated });
                      }}
                      folder="certificates"
                      accept="application/pdf,image/*"
                      formatBadge="PDF or Image"
                      placeholder="/certificates/... or Cloud Storage URL"
                      helpText="Opens directly in the in-page Certificate Preview modal with Download button."
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
