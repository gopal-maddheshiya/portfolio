import React, { useState, useMemo } from "react";
import {
  Camera,
  Video,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Tag,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import type { AcademicMediaItem } from "@/data/profile";
import { ReorderControls } from "@/components/admin/ui/ReorderControls";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import { FileUploader } from "@/components/admin/ui/FileUploader";
import { toast } from "sonner";

interface GalleryTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function GalleryTab({ data, updateData }: GalleryTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const gallery = useMemo(() => data.academicGallery || [], [data.academicGallery]);

  const handleAddGalleryItem = () => {
    const newItem: AcademicMediaItem = {
      id: crypto.randomUUID(),
      title: "New Academic Milestone / Event",
      caption: "Details about this milestone, event, problem solved, team members, or context.",
      type: "image",
      url: "",
      thumbnailUrl: "",
      category: "College Event",
      date: new Date().getFullYear().toString(),
    };
    updateData({ academicGallery: [newItem, ...gallery] });
    toast.success("New media card added at top! Upload image/video and fill details.");
  };

  const handleDeleteGalleryItem = (originalIndex: number) => {
    const item = gallery[originalIndex];
    if (confirm(`Delete media "${item?.title || "item"}"?`)) {
      updateData({ academicGallery: gallery.filter((_, i) => i !== originalIndex) });
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

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return gallery.map((item, idx) => ({ item, originalIndex: idx }));
    const q = searchQuery.toLowerCase();
    return gallery
      .map((item, idx) => ({ item, originalIndex: idx }))
      .filter(
        ({ item }) =>
          item.title?.toLowerCase().includes(q) ||
          item.caption?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.date?.toLowerCase().includes(q),
      );
  }, [gallery, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Quick Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2.5">
            <Camera className="size-6 text-primary" />
            <span>Academic Media &amp; Gallery ({gallery.length})</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Upload university event photos, SIH hackathon pictures, lab demo videos, and context
            notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none w-44 sm:w-56 shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={handleAddGalleryItem}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
            <span>Add Media</span>
          </button>
        </div>
      </div>

      {/* 2. Media List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/60 p-10 text-center flex flex-col items-center justify-center space-y-3">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Camera className="size-6" />
          </div>
          <h3 className="font-display font-semibold text-base text-foreground">
            {searchQuery ? "No Media Matches Search" : "No Academic Media Added Yet"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md">
            {searchQuery
              ? "Try adjusting your search query."
              : "Click the button below to add your first hackathon photo, event presentation, or video demo."}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={handleAddGalleryItem}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Add First Media Item</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredItems.map(({ item, originalIndex }) => (
            <div
              key={item.id || originalIndex}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-5"
            >
              {/* Header with Type badge, Move up/down, Delete */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-primary">
                    Media Item #{originalIndex + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {item.type === "video" ? (
                      <>
                        <Video className="size-3 text-red-500" /> Video Demo
                      </>
                    ) : (
                      <>
                        <Camera className="size-3 text-primary" /> Photo
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
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
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Media Type Selector */}
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

                {/* Milestone Title */}
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

                {/* Category Tag */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={item.category || ""}
                    placeholder="Smart India Hackathon, Coding Competition, Tech Fest"
                    onChange={(e) => {
                      const updated = [...gallery];
                      updated[originalIndex] = { ...item, category: e.target.value };
                      updateData({ academicGallery: updated });
                    }}
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Date / Period */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Date / Year
                  </label>
                  <input
                    type="text"
                    value={item.date || ""}
                    placeholder="e.g. Feb 2026 or 2025"
                    onChange={(e) => {
                      const updated = [...gallery];
                      updated[originalIndex] = { ...item, date: e.target.value };
                      updateData({ academicGallery: updated });
                    }}
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                {/* What this photo/video relates to (User requirement note) */}
                <div className="sm:col-span-2 rounded-xl border-2 border-primary/20 bg-primary/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Tag className="size-3.5 text-primary" />
                      <span>Card Bottom Note: "Related To &amp; Context Details"</span>
                    </label>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Displayed on card footer
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Write what this photo/video relates to (e.g. project demonstrated, problem
                    solved, team members, or competition round):
                  </p>
                  <textarea
                    rows={2}
                    value={item.caption || ""}
                    placeholder="e.g. Delivering a technical walkthrough for project 'KisanSarthi', explaining multimodal AI diagnosis to jury members."
                    onChange={(e) => {
                      const updated = [...gallery];
                      updated[originalIndex] = { ...item, caption: e.target.value };
                      updateData({ academicGallery: updated });
                    }}
                    className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none min-h-[70px]"
                  />
                </div>

                {/* Media File Upload or Direct Link */}
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
                      aspectRatioLabel="Recommended: 16:9 or 4:3 Landscape"
                      helpText="Upload an image from your device or paste a cloud image URL."
                    />
                  ) : (
                    <FileUploader
                      label="Video File or Direct Embed Link"
                      value={item.url || ""}
                      onChange={(url) => {
                        const updated = [...gallery];
                        updated[originalIndex] = { ...item, url };
                        updateData({ academicGallery: updated });
                      }}
                      folder="gallery-videos"
                      accept="video/*"
                      formatBadge="Video MP4 / WebM"
                      placeholder="Video URL or upload MP4/WebM"
                      helpText="Upload a demo video or paste a video URL. You can also upload a custom thumbnail poster below."
                    />
                  )}
                </div>

                {/* Video Poster Thumbnail if type is video */}
                {item.type === "video" && (
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
                      aspectRatioLabel="16:9 Video Thumbnail"
                      helpText="Poster frame image displayed before the video is played."
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
