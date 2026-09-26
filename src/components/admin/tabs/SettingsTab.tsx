import React, { useRef } from "react";
import { Settings, Download, Upload, RotateCcw, ShieldCheck, Share2 } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import { toast } from "sonner";

interface SettingsTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
  resetToDefaults: () => void;
  saveData: (customData?: PortfolioData) => Promise<boolean>;
}

export function SettingsTab({ data, updateData, resetToDefaults, saveData }: SettingsTabProps) {
  const info = data.personalInfo;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export JSON Backup
  const handleExportJson = () => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `gopal_portfolio_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Portfolio backup JSON downloaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to export JSON";
      toast.error(msg);
    }
  };

  // Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as PortfolioData;

        // Basic verification
        if (!parsed.personalInfo || !parsed.projects) {
          throw new Error("Invalid portfolio backup file structure.");
        }

        updateData(parsed);
        toast.success("Portfolio data loaded from backup! Click 'Save Live' to publish.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid JSON file";
        toast.error(`Import failed: ${msg}`);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* 1. SEO & Social Meta */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Share2 className="size-5 text-primary" />
            <span>SEO &amp; Open Graph Social Share Settings</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure metadata displayed when your portfolio URL is shared on LinkedIn, Twitter, and
            WhatsApp.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Production Portfolio Site URL
            </label>
            <input
              type="text"
              value={info.siteUrl || ""}
              placeholder="https://gopal-maddheshiya.vercel.app"
              onChange={(e) => updateData({ personalInfo: { ...info, siteUrl: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Global Meta Description
            </label>
            <textarea
              rows={2}
              value={info.siteDescription || ""}
              onChange={(e) =>
                updateData({ personalInfo: { ...info, siteDescription: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[65px]"
            />
          </div>

          {/* Social Share Preview Image */}
          <div className="sm:col-span-2">
            <ImageUploader
              label="Open Graph Social Share Preview Image (og:image)"
              value={info.ogImage || ""}
              onChange={(url) => updateData({ personalInfo: { ...info, ogImage: url } })}
              folder="seo"
              aspectRatio="wide"
              aspectRatioLabel="Recommended: 1200 × 630 px (1.91:1 Banner)"
              helpText="This image is displayed automatically in Twitter/X cards, LinkedIn link previews, and WhatsApp messages."
            />
          </div>
        </div>
      </div>

      {/* 2. Backup, Restore & Reset Operations */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-500" />
            <span>Data Safeguards, Backup &amp; Restore</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download an offline JSON snapshot of your entire portfolio or restore previous settings.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Download JSON Backup Card */}
          <div className="rounded-xl border border-border bg-surface/50 p-5 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <Download className="size-4 text-primary" />
              <span>Export Offline Backup</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Downloads a complete JSON snapshot of all your projects, DSA stats, certificates, and
              profile configurations to your computer.
            </p>
            <button
              type="button"
              onClick={handleExportJson}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-card border border-border-strong hover:bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Restore JSON Backup Card */}
          <div className="rounded-xl border border-border bg-surface/50 p-5 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <Upload className="size-4 text-primary" />
              <span>Restore from Backup</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a previously downloaded `.json` backup file to instantly restore all portfolio
              sections.
            </p>
            <label className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-card border border-border-strong hover:bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer">
              <Upload className="size-3.5" />
              <span>Select Backup File</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportJson}
              />
            </label>
          </div>

          {/* Reset to Factory Defaults Card */}
          <div className="sm:col-span-2 rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                <RotateCcw className="size-4" />
                <span>Reset to Factory Code Defaults</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to reset all data back to the default profile.ts constants? This cannot be undone.",
                    )
                  ) {
                    resetToDefaults();
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Reset All Fields</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Reverts all sections (hero, about, projects, skills, DSA, gallery, journey, contact)
              to the default code constants. Remember to click "Save Live" if you want to publish
              the reset state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
