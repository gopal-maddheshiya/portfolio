import React, { useState } from "react";
import { Upload, ExternalLink, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { uploadPortfolioFile } from "@/lib/supabase";

interface FileUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  formatBadge?: string;
  placeholder?: string;
  helpText?: string;
}

export function FileUploader({
  label,
  value,
  onChange,
  folder = "resumes",
  accept = "application/pdf,.pdf",
  formatBadge = "PDF Document",
  placeholder = "File URL (/resume.pdf or Cloud Storage URL)",
  helpText,
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.info(`Uploading file (${(file.size / 1024).toFixed(0)} KB)...`);
      const res = await uploadPortfolioFile(file, folder);
      if (res.url) {
        onChange(res.url);
        toast.success("Document uploaded successfully! Click 'Save Live' to publish.");
      } else {
        toast.error(`Upload error: ${res.error || "Failed to upload document"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border-2 border-border/80 bg-surface/50 p-4 sm:p-5 space-y-3.5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-border/60 pb-2.5">
        <label className="block text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
          <FileText className="size-4 text-primary" />
          <span>{label}</span>
        </label>
        {formatBadge && (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            {formatBadge}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-border-strong bg-card pl-3.5 pr-8 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              title="Clear file URL"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <label className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground cursor-pointer transition-all shrink-0 shadow-xs active:scale-[0.98]">
          <Upload className="size-3.5" />
          <span>{isUploading ? "Uploading..." : "Upload File"}</span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={isUploading}
            onChange={handleFileChange}
          />
        </label>

        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0 shadow-2xs"
          >
            <ExternalLink className="size-3.5 text-primary" />
            <span>Open Document</span>
          </a>
        )}
      </div>

      {helpText && <p className="text-[11px] text-muted-foreground">{helpText}</p>}
    </div>
  );
}
