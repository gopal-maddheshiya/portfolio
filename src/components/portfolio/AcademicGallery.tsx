import { useState } from "react";
import {
  Camera,
  Video,
  Play,
  Maximize2,
  X,
  Sparkles,
  Tag,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";
import type { AcademicMediaItem } from "@/data/profile";

export function AcademicGallery() {
  const { data } = usePortfolio();
  const galleryItems: AcademicMediaItem[] = data.academicGallery || [];

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<AcademicMediaItem | null>(null);

  // Extract unique categories
  const categories = Array.from(
    new Set(
      galleryItems
        .map((item) => item.category?.trim())
        .filter((cat): cat is string => Boolean(cat && cat.length > 0)),
    ),
  );

  // Filter items based on active tab
  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "photos") return item.type === "image";
    if (selectedCategory === "videos") return item.type === "video";
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Modal navigation helpers
  const handleNext = () => {
    if (!activeItem || filteredItems.length <= 1) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    const nextItem = filteredItems[nextIndex];
    if (nextItem) setActiveItem(nextItem);
  };

  const handlePrev = () => {
    if (!activeItem || filteredItems.length <= 1) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    const prevItem = filteredItems[prevIndex];
    if (prevItem) setActiveItem(prevItem);
  };

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Campus Life & Highlights"
        title="Academic Moments & Media"
        description="A visual showcase of university milestones, hackathon participations, campus workshops, and technical demonstrations."
      />

      {/* When gallery is empty (default state requested) */}
      {galleryItems.length === 0 ? (
        <Reveal className="mt-8 sm:mt-10">
          <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-8 sm:p-14 text-center flex flex-col items-center justify-center max-w-3xl mx-auto shadow-2xs backdrop-blur-xs">
            <div className="relative flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-4 shadow-sm">
              <Camera className="size-8 sm:size-10" />
              <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs shadow-md">
                <Sparkles className="size-3.5" />
              </span>
            </div>

            <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
              Academic Gallery Under Curation
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              Campus highlights, hackathon presentations, lab sessions, and academic event photos/videos will be featured here soon.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border px-3 py-1">
                <Camera className="size-3 text-primary" /> Photos &amp; Events
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border px-3 py-1">
                <Video className="size-3 text-primary" /> Demos &amp; Videos
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border px-3 py-1">
                <Tag className="size-3 text-primary" /> Detailed Context Notes
              </span>
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="mt-8 sm:mt-10 space-y-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Layers className="size-3.5" />
              <span>All Media ({galleryItems.length})</span>
            </button>

            {galleryItems.some((i) => i.type === "image") && (
              <button
                onClick={() => setSelectedCategory("photos")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === "photos"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Camera className="size-3.5" />
                <span>Photos ({galleryItems.filter((i) => i.type === "image").length})</span>
              </button>
            )}

            {galleryItems.some((i) => i.type === "video") && (
              <button
                onClick={() => setSelectedCategory("videos")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === "videos"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Video className="size-3.5" />
                <span>Videos ({galleryItems.filter((i) => i.type === "video").length})</span>
              </button>
            )}

            {categories.map((cat) => {
              const count = galleryItems.filter((i) => i.category?.toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat.toLowerCase())}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.toLowerCase()
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Tag className="size-3" />
                  <span>{cat} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <Reveal
                key={item.id || index}
                delay={index * 50}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-soft transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Media Visual Preview Area */}
                  <div
                    onClick={() => setActiveItem(item)}
                    className="relative aspect-video w-full overflow-hidden bg-surface cursor-pointer group/media"
                  >
                    {item.type === "video" ? (
                      item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="size-full object-cover transition-transform duration-500 group-hover/media:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center bg-zinc-900 text-white">
                          <Video className="size-10 text-primary/80" />
                        </div>
                      )
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="size-full object-cover transition-transform duration-500 group-hover/media:scale-105"
                        loading="lazy"
                      />
                    )}

                    {/* Media Type & Date Overlay Badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white border border-white/15">
                        {item.type === "video" ? (
                          <>
                            <Video className="size-3 text-red-400" />
                            <span>Video</span>
                          </>
                        ) : (
                          <>
                            <Camera className="size-3 text-primary" />
                            <span>Photo</span>
                          </>
                        )}
                      </span>
                    </div>

                    {item.category && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-2 py-1 text-[11px] font-mono text-zinc-200 border border-white/10">
                          {item.category}
                        </span>
                      </div>
                    )}

                    {/* Play / Expand hover icon */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-90 group-hover/media:opacity-100 transition-opacity">
                      {item.type === "video" ? (
                        <div className="flex size-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 group-hover/media:scale-110 transition-transform">
                          <Play className="size-5 fill-current translate-x-0.5" />
                        </div>
                      ) : (
                        <div className="flex size-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover/media:opacity-100 group-hover/media:scale-105 transition-all">
                          <Maximize2 className="size-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-5 space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold text-base sm:text-lg text-foreground line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      {item.date && (
                        <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md shrink-0">
                          {item.date}
                        </span>
                      )}
                    </div>

                    {/* BOTTOM DEDICATED RELATION / CONTEXT BOX (User's Key Feature) */}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
                        <Tag className="size-3" />
                        <span>Related Context &amp; Significance</span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                        {item.caption || "Academic milestone and university memory."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-1">
                  <button
                    onClick={() => setActiveItem(item)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface hover:bg-secondary text-foreground text-xs font-semibold py-2.5 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    {item.type === "video" ? (
                      <>
                        <Play className="size-3.5 text-primary" />
                        <span>Watch Video</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="size-3.5 text-primary" />
                        <span>View Full Photo</span>
                      </>
                    )}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* LIGHTBOX / VIDEO MODAL */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-zinc-950 text-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-zinc-900/80">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/20 text-primary px-2.5 py-1 text-xs font-semibold border border-primary/30">
                  {activeItem.type === "video" ? (
                    <>
                      <Video className="size-3.5" /> Video
                    </>
                  ) : (
                    <>
                      <Camera className="size-3.5" /> Photo
                    </>
                  )}
                </span>
                <span className="font-display font-semibold text-sm sm:text-base text-zinc-100 truncate">
                  {activeItem.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeItem.url && (
                  <a
                    href={activeItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Open original media"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
                <button
                  onClick={() => setActiveItem(null)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Close (ESC)"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Media Viewer */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[260px] max-h-[60vh]">
              {activeItem.type === "video" ? (
                activeItem.url.includes("youtube.com") || activeItem.url.includes("youtu.be") ? (
                  <iframe
                    src={
                      activeItem.url.includes("embed")
                        ? activeItem.url
                        : `https://www.youtube.com/embed/${
                            activeItem.url.split("v=")[1]?.split("&")[0] ||
                            activeItem.url.split("/").pop()
                          }`
                    }
                    title={activeItem.title}
                    className="size-full aspect-video border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeItem.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[60vh] max-w-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <img
                  src={activeItem.url}
                  alt={activeItem.title}
                  className="max-h-[60vh] max-w-full object-contain select-none"
                />
              )}

              {/* Prev / Next buttons if multiple items */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous item"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next item"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer: Detailed Story & Significance */}
            <div className="border-t border-white/10 p-5 bg-zinc-900/90 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {activeItem.category && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs font-mono text-zinc-300">
                      <Tag className="size-3 text-primary" /> {activeItem.category}
                    </span>
                  )}
                  {activeItem.date && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs font-mono text-zinc-300">
                      <Calendar className="size-3 text-primary" /> {activeItem.date}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-zinc-950/80 border border-white/10 p-3.5 space-y-1">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Tag className="size-3" /> Related Context &amp; Details:
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {activeItem.caption || "Academic milestone and university memory."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
