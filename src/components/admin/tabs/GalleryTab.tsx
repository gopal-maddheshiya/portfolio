import { useMemo, useState, type ChangeEvent } from "react";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Layers,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { FileUploader } from "@/components/admin/ui/FileUploader";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { SectionHeadingEditor } from "@/components/admin/ui/SectionHeadingEditor";
import type { AcademicMediaItem } from "@/data/profile";
import { uploadPortfolioImage, type PortfolioData } from "@/lib/supabase";

const CATEGORY_PRESETS = [
  "Smart India Hackathon",
  "Coding Competition",
  "Tech Fest",
  "Project Demo",
  "Workshop",
  "Campus Life",
];

interface GalleryTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

function formatFileTitle(filename: string): string {
  return (
    filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Campus Highlight"
  );
}

export function GalleryTab({ data, updateData }: GalleryTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isBatchUploading, setIsBatchUploading] = useState(false);

  const gallery = useMemo(() => data.academicGallery || [], [data.academicGallery]);

  const handleAddGalleryItem = (mediaType: "image" | "video") => {
    const newItem: AcademicMediaItem = {
      id: crypto.randomUUID(),
      title: mediaType === "video" ? "New Video Demo / Highlight" : "New Photo / Event Highlight",
      caption: "Details about this milestone, event, problem solved, team members, or context.",
      type: mediaType,
      url: "",
      thumbnailUrl: "",
      category: mediaType === "video" ? "Project Demo" : "Campus Life",
      date: new Date().getFullYear().toString(),
      featured: false,
    };
    updateData({ academicGallery: [newItem, ...gallery] });
    setTypeFilter("all");
    setExpandedId(newItem.id);
    toast.success(
      mediaType === "video"
        ? "New video card added! Paste YouTube link or upload MP4/WebM."
        : "New photo card added! Upload image and fill context notes.",
    );
  };

  const handleBatchPhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsBatchUploading(true);
    const createdItems: AcademicMediaItem[] = [];
    const currentYear = new Date().getFullYear().toString();

    try {
      toast.info(`Optimizing & uploading ${files.length} photo(s) to Supabase...`);
      for (const file of files) {
        const res = await uploadPortfolioImage(file, "gallery");
        if (res.url) {
          createdItems.push({
            id: crypto.randomUUID(),
            title: formatFileTitle(file.name),
            caption: "Campus highlight, hackathon milestone, or engineering showcase moment.",
            type: "image",
            url: res.url,
            thumbnailUrl: "",
            category: "Campus Life",
            date: currentYear,
            featured: false,
          });
        }
      }

      if (createdItems.length > 0) {
        updateData((prev) => ({
          ...prev,
          academicGallery: [...createdItems, ...(prev.academicGallery || [])],
        }));
        setTypeFilter("all");
        setExpandedId(createdItems[0]?.id ?? null);
        toast.success(`Uploaded ${createdItems.length} photo(s)! Update titles/captions anytime.`);
      } else {
        toast.error("No photos could be uploaded. Check storage permissions or connection.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Batch upload failed";
      toast.error(msg);
    } finally {
      setIsBatchUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteGalleryItem = (originalIndex: number) => {
    const item = gallery[originalIndex];
    if (confirm(`Delete media "${item?.title || "item"}"?`)) {
      updateData({ academicGallery: gallery.filter((_, i) => i !== originalIndex) });
      if (item && expandedId === item.id) setExpandedId(null);
      toast.info("Media item removed.");
    }
  };

  const handleMoveGalleryItem = (originalIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? originalIndex - 1 : originalIndex + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;
    const itemA = gallery[originalIndex];
    const itemB = gallery[targetIndex];
    if (itemA && itemB) {
      const updated = [...gallery];
      updated[originalIndex] = itemB;
      updated[targetIndex] = itemA;
      updateData({ academicGallery: updated });
    }
  };

  const handleSetSpotlight = (originalIndex: number) => {
    const current = gallery[originalIndex];
    if (!current) return;
    const nextState = !current.featured;
    updateData({
      academicGallery: gallery.map((item, idx) => ({
        ...item,
        featured: idx === originalIndex ? nextState : false,
      })),
    });
    toast.success(nextState ? "Pinned as Gallery Spotlight!" : "Removed Featured Spotlight pin.");
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return gallery
      .map((item, idx) => ({ item, originalIndex: idx }))
      .filter(({ item }) => {
        if (typeFilter !== "all" && item.type !== typeFilter) return false;
        if (!q) return true;
        return (
          item.title?.toLowerCase().includes(q) ||
          item.caption?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.date?.toLowerCase().includes(q)
        );
      });
  }, [gallery, searchQuery, typeFilter]);

  const photoCount = gallery.filter((i) => i.type === "image").length;
  const videoCount = gallery.filter((i) => i.type === "video").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <SectionHeadingEditor
        sectionKey="gallery"
        sectionLabel="Academic Gallery"
        data={data}
        updateData={updateData}
      />

      {/* Header + Multi-Upload / Quick Add Bar */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
              <Camera className="size-6 text-primary" />
              <span>Academic Media &amp; Gallery ({gallery.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Batch-upload multiple event photos or add video demos &amp; YouTube showcases. Pin one
              item as the Spotlight hero banner.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 px-3.5 py-2 text-xs font-semibold text-primary transition-colors cursor-pointer">
              <Upload className="size-3.5" />
              <span>{isBatchUploading ? "Uploading Photos..." : "Upload Multiple Photos"}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isBatchUploading}
                onChange={handleBatchPhotoUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => handleAddGalleryItem("image")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Add Photo</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddGalleryItem("video")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border-strong bg-surface hover:bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition-colors cursor-pointer"
            >
              <Video className="size-3.5 text-primary" />
              <span>Add Video</span>
            </button>
          </div>
        </div>

        {/* Filter Pills + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/70">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all" as const, label: `All (${gallery.length})`, icon: Layers },
              { id: "image" as const, label: `Photos (${photoCount})`, icon: Camera },
              { id: "video" as const, label: `Videos (${videoCount})`, icon: Video },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  typeFilter === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search titles, events, dates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl border border-border bg-surface/60 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none w-full sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Media Accordion List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/60 p-10 text-center flex flex-col items-center justify-center space-y-3">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Camera className="size-6" />
          </div>
          <h3 className="font-display font-semibold text-base text-foreground">
            {searchQuery || typeFilter !== "all"
              ? "No Media Matches Filter"
              : "No Academic Media Added Yet"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md">
            {searchQuery || typeFilter !== "all"
              ? "Try clearing your search or switching back to All."
              : "Upload multiple photos at once or click Add Video above to start building your gallery."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(({ item, originalIndex }) => {
            const itemKey = item.id || String(originalIndex);
            const isExpanded = expandedId === itemKey;
            const thumbSrc = item.type === "video" ? item.thumbnailUrl : item.url;

            return (
              <div
                key={itemKey}
                className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden"
              >
                {/* Summary Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6 bg-surface/35">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : itemKey)}
                    aria-expanded={isExpanded}
                    className="flex-1 min-w-0 flex items-center gap-3.5 text-left cursor-pointer"
                  >
                    <div className="size-14 sm:w-20 sm:h-14 rounded-lg border border-border bg-surface overflow-hidden shrink-0 flex items-center justify-center">
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      ) : item.type === "video" ? (
                        <Video className="size-5 text-primary" />
                      ) : (
                        <Camera className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-primary">
                          #{originalIndex + 1}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-card border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {item.type === "video" ? (
                            <>
                              <Video className="size-3 text-rose-500" /> Video
                            </>
                          ) : (
                            <>
                              <Camera className="size-3 text-primary" /> Photo
                            </>
                          )}
                        </span>
                        {item.category ? (
                          <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                            {item.category}
                          </span>
                        ) : null}
                      </div>
                      <p className="font-display font-semibold text-sm text-foreground truncate">
                        {item.title || "Untitled Media"}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSetSpotlight(originalIndex)}
                      title={
                        item.featured
                          ? "Spotlight Hero Card (pinned)"
                          : "Set as Gallery Spotlight Hero"
                      }
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                        item.featured
                          ? "border-primary/35 bg-primary/15 text-primary"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Sparkles className="size-3" />
                      <span className="hidden sm:inline">
                        {item.featured ? "Spotlight" : "Set Spotlight"}
                      </span>
                    </button>

                    <ReorderControls
                      index={originalIndex}
                      total={gallery.length}
                      onMove={handleMoveGalleryItem}
                      label="media item"
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(originalIndex)}
                      title="Delete media"
                      className="p-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer shadow-2xs"
                    >
                      <Trash2 className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : itemKey)}
                      aria-label={isExpanded ? "Collapse media form" : "Expand media form"}
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

                {/* Expanded Edit Body */}
                {isExpanded ? (
                  <div className="border-t border-border/80 p-5 sm:p-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Media Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...gallery];
                            updated[originalIndex] = { ...item, type: "image" };
                            updateData({ academicGallery: updated });
                          }}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer ${
                            item.type === "image"
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-card border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Camera className="size-3.5" />
                          <span>Photo / Image</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...gallery];
                            updated[originalIndex] = { ...item, type: "video" };
                            updateData({ academicGallery: updated });
                          }}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer ${
                            item.type === "video"
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-card border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Video className="size-3.5" />
                          <span>Video Demo</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Milestone / Event Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        placeholder="e.g. Smart India Hackathon internal finals presentation"
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[originalIndex] = { ...item, title: e.target.value };
                          updateData({ academicGallery: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Category Tag
                      </label>
                      <input
                        type="text"
                        value={item.category || ""}
                        placeholder="Smart India Hackathon, Coding Competition..."
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[originalIndex] = { ...item, category: e.target.value };
                          updateData({ academicGallery: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {CATEGORY_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              const updated = [...gallery];
                              updated[originalIndex] = { ...item, category: preset };
                              updateData({ academicGallery: updated });
                            }}
                            className="rounded-md border border-border bg-surface hover:border-primary/40 hover:text-primary px-2 py-0.5 text-[10px] font-mono text-muted-foreground transition-colors cursor-pointer"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Date / Year
                      </label>
                      <input
                        type="text"
                        value={item.date || ""}
                        placeholder="e.g. Feb 2026 or 2026"
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[originalIndex] = { ...item, date: e.target.value };
                          updateData({ academicGallery: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2 rounded-xl border-2 border-primary/20 bg-primary/5 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Tag className="size-3.5 text-primary" />
                          <span>Story &amp; Related Context Details</span>
                        </label>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          Shown in card narrative &amp; modal
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={item.caption || ""}
                        placeholder="Explain what happened here, project presented, team role, or achievement details..."
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[originalIndex] = { ...item, caption: e.target.value };
                          updateData({ academicGallery: updated });
                        }}
                        className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[80px]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      {item.type === "image" ? (
                        <ImageUploader
                          label="Photo Image File"
                          value={item.url || ""}
                          onChange={(url) => {
                            const updated = [...gallery];
                            updated[originalIndex] = { ...item, url };
                            updateData({ academicGallery: updated });
                          }}
                          folder="gallery"
                          aspectRatio="video"
                          aspectRatioLabel="4:3 or 16:10 Landscape Recommended"
                          helpText="Automatically compressed to fast WebP before uploading to Supabase."
                        />
                      ) : (
                        <FileUploader
                          label="Video File (MP4/WebM) or YouTube / Shorts Link"
                          value={item.url || ""}
                          onChange={(url) => {
                            const updated = [...gallery];
                            updated[originalIndex] = { ...item, url };
                            updateData({ academicGallery: updated });
                          }}
                          folder="gallery-videos"
                          accept="video/*"
                          formatBadge="MP4 / WebM / YouTube"
                          placeholder="Paste YouTube URL or upload MP4/WebM video"
                          helpText="YouTube posters & MP4 preview frames auto-generate if custom poster below is left empty."
                        />
                      )}
                    </div>

                    {item.type === "video" ? (
                      <div className="sm:col-span-2">
                        <ImageUploader
                          label="Custom Video Poster / Thumbnail (Optional)"
                          value={item.thumbnailUrl || ""}
                          onChange={(url) => {
                            const updated = [...gallery];
                            updated[originalIndex] = { ...item, thumbnailUrl: url };
                            updateData({ academicGallery: updated });
                          }}
                          folder="gallery-thumbnails"
                          aspectRatio="video"
                          aspectRatioLabel="4:3 or 16:9 Custom Poster"
                          helpText="Optional custom cover frame shown before playing the video."
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
