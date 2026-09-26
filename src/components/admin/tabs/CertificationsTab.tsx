import React from "react";
import { Award, Plus, Trash2 } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import type { Certification } from "@/data/profile";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import { FileUploader } from "@/components/admin/ui/FileUploader";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { toast } from "sonner";

interface CertificationsTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function CertificationsTab({ data, updateData }: CertificationsTabProps) {
  const certifications = data.certifications || [];

  const handleAddCertification = () => {
    const newCert: Certification = {
      title: "New Certificate / Contest",
      org: "Issuing Organization",
      period: "2026",
      detail: "Description of skills verified and contest performance.",
      skills: ["Problem Solving", "Java"],
      certificateUrl: "",
    };
    updateData({ certifications: [newCert, ...certifications] });
    toast.success("New certificate added at top! Fill in its details.");
  };

  const handleDeleteCertification = (index: number) => {
    const item = certifications[index];
    if (confirm(`Delete certificate "${item?.title || "item"}"?`)) {
      updateData({ certifications: certifications.filter((_, i) => i !== index) });
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
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
            <Award className="size-6 text-primary" />
            <span>Certifications &amp; Contests ({certifications.length})</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Add or edit verified certifications, issuing universities, contest prizes, and
            credential documents.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCertification}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="space-y-5">
        {certifications.map((cert, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono font-bold text-primary">
                Certificate #{idx + 1}
              </span>

              <div className="flex items-center gap-2">
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
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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

              {/* Skills Verified using TagListInput */}
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

              {/* Certificate File Uploader */}
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
                  helpText="Upload the official certificate document. Direct link opens in preview modal on the certificates section."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
