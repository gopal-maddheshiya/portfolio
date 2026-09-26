import React, { useState } from "react";
import { Upload, ExternalLink, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { uploadPortfolioImage } from "@/lib/supabase";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: "portrait" | "video" | "square" | "wide";
  aspectRatioLabel?: string;
  placeholder?: string;
  helpText?: string;
}

export function ImageUploader({
  label,
  value,
  onChange,
  folder = "projects",
  aspectRatio = "video",
  aspectRatioLabel = "16:9 Landscape (1280 × 720 px)",
  placeholder = "Image URL or upload from device",
  helpText = "Uploads file directly to Supabase Storage bucket.",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.info(`Uploading image (${(file.size / 1024).toFixed(0)} KB) to Cloud Storage...`);
      const res = await uploadPortfolioImage(file, folder);
      if (res.url) {
        onChange(res.url);
        toast.success("Image uploaded successfully! Click 'Save Live' to persist.");
      } else {
        toast.error(`Upload error: ${res.error || "Failed"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be uploaded again if needed
      e.target.value = "";
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "portrait":
        return "w-28 h-36"; // 4:5 / portrait
      case "square":
        return "w-28 h-28";
      case "wide":
        return "w-full sm:w-72 aspect-[21/9]";
      case "video":
      default:
        return "w-full sm:w-64 aspect-video";
    }
  };

  return (
    <div className="rounded-2xl border-2 border-border/80 bg-surface/50 p-4 sm:p-5 space-y-3.5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-border/60 pb-2.5">
        <label className="block text-xs sm:text-sm font-bold text-foreground">{label}</label>
        {aspectRatioLabel && (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            {aspectRatioLabel}
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Live Preview Card */}
        <div
          className={`${getAspectClass()} rounded-xl border-2 border-border bg-card overflow-hidden shrink-0 shadow-xs relative flex items-center justify-center group`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover blur-sm opacity-25"
              />
              <img
                src={value}
                alt="Preview"
                className="relative z-10 w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => onChange("")}
                title="Remove image"
                className="absolute top-1 right-1 z-20 size-6 rounded-full bg-black/75 hover:bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-3 text-center">
              <ImageIcon className="size-7 stroke-1 mb-1 opacity-50 text-muted-foreground" />
              <span className="text-[10px] font-medium">No image selected</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-1.5">
              <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-[10px] font-mono">Uploading...</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="flex-1 space-y-2.5 w-full">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
            />
            <label className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground cursor-pointer transition-all shrink-0 shadow-xs active:scale-[0.98]">
              <Upload className="size-3.5" />
              <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/jpg"
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
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-card hover:bg-secondary px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0 shadow-2xs"
              >
                <ExternalLink className="size-3.5" />
                <span>Preview</span>
              </a>
            )}
          </div>
          {helpText && <p className="text-[11px] text-muted-foreground">{helpText}</p>}
        </div>
      </div>
    </div>
  );
}
