import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

function GalleryCardImage({
  src,
  alt,
  type,
  thumbnailUrl,
}: {
  src: string;
  alt: string;
  type: "image" | "video";
  thumbnailUrl?: string | undefined;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const displaySrc = type === "video" && thumbnailUrl ? thumbnailUrl : src;

  // Handle cached images where onLoad doesn't fire after hydration
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [displaySrc]);

  return (
    <div className="relative size-full overflow-hidden bg-muted/20">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-1 flex items-center justify-center bg-card/40 pointer-events-none transition-opacity duration-300">
          <div className="size-6 rounded-full border-2 border-border border-t-primary animate-spin opacity-50" />
        </div>
      )}

      {hasError ? (
        <div className="size-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 gap-2 p-4 text-center">
          <Camera className="size-8 text-zinc-600" />
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={displaySrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className="size-full object-cover transition-transform duration-500 group-hover/media:scale-105"
        />
      )}
    </div>
  );
}

/* ─────────────── Gallery Card Item ─────────────── */
function GalleryCardItem({
  item,
  onClick,
}: {
  item: AcademicMediaItem;
  onClick: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-soft transition-all cursor-pointer select-none h-full"
    >
      <div className="flex-1 flex flex-col">
        {/* Media Visual Preview Area */}
        <div className="relative aspect-[16/10] sm:aspect-video w-full overflow-hidden bg-surface group/media">
          {item.type === "video" && !item.thumbnailUrl ? (
            <div className="size-full flex items-center justify-center bg-zinc-900 text-white">
              <Video className="size-10 text-primary/80" />
            </div>
          ) : (
            <GalleryCardImage
              src={item.url}
              alt={item.title}
              type={item.type}
              thumbnailUrl={item.thumbnailUrl}
            />
          )}

          {/* Media Type & Date Overlay Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white border border-white/15">
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
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[11px] font-mono text-zinc-200 border border-white/10">
                {item.category}
              </span>
            </div>
          )}

          {/* Play / Expand hover icon */}
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-90 group-hover/media:opacity-100 transition-opacity">
            {item.type === "video" ? (
              <div className="flex size-11 sm:size-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 group-hover/media:scale-110 transition-transform">
                <Play className="size-4 sm:size-5 fill-current translate-x-0.5" />
              </div>
            ) : (
              <div className="flex size-9 sm:size-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover/media:opacity-100 group-hover/media:scale-105 transition-all">
                <Maximize2 className="size-3.5 sm:size-4" />
              </div>
            )}
          </div>
        </div>

        {/* Card Content & Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold text-sm sm:text-base text-foreground line-clamp-2 leading-snug">
                {item.title}
              </h3>
              {item.date && (
                <span className="font-mono text-[11px] sm:text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md shrink-0">
                  {item.date}
                </span>
              )}
            </div>
          </div>

          {/* Dedicated Relation / Context Box */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-1 mt-auto">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
              <Tag className="size-3" />
              <span>Related Context &amp; Significance</span>
            </div>
            <p className="text-[11px] sm:text-xs text-foreground/90 leading-relaxed line-clamp-2">
              {item.caption || "Academic milestone and university memory."}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        <div className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface group-hover:bg-secondary text-foreground text-xs font-semibold py-2 transition-all">
          {item.type === "video" ? (
            <>
              <Play className="size-3.5 text-primary" />
              <span>Watch Video & Details</span>
            </>
          ) : (
            <>
              <Maximize2 className="size-3.5 text-primary" />
              <span>View Full Details</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─────────────── Infinite Draggable Gallery Carousel ─────────────── */
function InfiniteGalleryCarousel({
  items,
  onSelectItem,
}: {
  items: AcademicMediaItem[];
  onSelectItem: (item: AcademicMediaItem) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState<-1 | 1>(-1); // -1 = left, 1 = right

  const offsetRef = useRef(0);
  const directionRef = useRef<-1 | 1>(-1);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const inertiaSpeedRef = useRef(0);
  const singleSetWidthRef = useRef(0);

  // Sync state to ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Multiply items for infinite loop seamlessness
  const repeatCount = useMemo(() => {
    if (items.length <= 1) return 1;
    return Math.max(3, Math.ceil(12 / items.length));
  }, [items.length]);

  const loopedSets = useMemo(() => {
    const sets: AcademicMediaItem[][] = [];
    for (let i = 0; i < repeatCount; i++) {
      sets.push(items);
    }
    return sets;
  }, [items, repeatCount]);

  // Measure single set width accurately
  const measureSetWidth = useCallback(() => {
    if (singleSetRef.current) {
      const width = singleSetRef.current.getBoundingClientRect().width;
      if (width > 0) {
        singleSetWidthRef.current = width;
      }
    }
  }, []);

  useEffect(() => {
    measureSetWidth();
    window.addEventListener("resize", measureSetWidth);
    const observer = new ResizeObserver(measureSetWidth);
    if (singleSetRef.current) observer.observe(singleSetRef.current);

    return () => {
      window.removeEventListener("resize", measureSetWidth);
      observer.disconnect();
    };
  }, [measureSetWidth, items]);

  // Reset offset on category change
  useEffect(() => {
    offsetRef.current = 0;
    inertiaSpeedRef.current = 0;
  }, [items]);

  // Continuous animation loop at 60fps
  useEffect(() => {
    if (items.length <= 1) return;

    let animationFrameId: number;
    const BASE_SPEED = 0.75; // Smooth cinematic velocity (~45px/s)

    const animate = () => {
      const singleWidth = singleSetWidthRef.current;

      if (!isDraggingRef.current) {
        const targetSpeed = isHoveredRef.current ? 0 : BASE_SPEED * directionRef.current;

        if (Math.abs(inertiaSpeedRef.current) > 0.05) {
          offsetRef.current += inertiaSpeedRef.current;
          inertiaSpeedRef.current *= 0.94; // Smooth friction decay
          if (Math.abs(inertiaSpeedRef.current) < Math.abs(BASE_SPEED) && !isHoveredRef.current) {
            inertiaSpeedRef.current = 0;
          }
        } else {
          offsetRef.current += targetSpeed;
        }

        // Seamless wrap around single set width
        if (singleWidth > 0) {
          while (offsetRef.current <= -singleWidth) {
            offsetRef.current += singleWidth;
          }
          while (offsetRef.current > 0) {
            offsetRef.current -= singleWidth;
          }
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [items.length]);

  // Pointer drag events
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    dragVelocityRef.current = 0;
    hasDraggedRef.current = false;
    inertiaSpeedRef.current = 0;

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTimeRef.current);
    const dx = e.clientX - lastPointerXRef.current;

    if (Math.abs(e.clientX - dragStartXRef.current) > 6) {
      hasDraggedRef.current = true;
    }

    offsetRef.current += dx;

    // Wrap while dragging
    const singleWidth = singleSetWidthRef.current;
    if (singleWidth > 0) {
      while (offsetRef.current <= -singleWidth) {
        offsetRef.current += singleWidth;
      }
      while (offsetRef.current > 0) {
        offsetRef.current -= singleWidth;
      }
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }

    dragVelocityRef.current = (dx / dt) * 16.67;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}

    const velocity = dragVelocityRef.current;
    if (Math.abs(velocity) > 0.3) {
      if (velocity < 0) {
        directionRef.current = -1;
        setDirection(-1);
      } else {
        directionRef.current = 1;
        setDirection(1);
      }
      inertiaSpeedRef.current = Math.sign(velocity) * Math.min(Math.abs(velocity), 14);
    } else if (hasDraggedRef.current) {
      const totalDx = lastPointerXRef.current - dragStartXRef.current;
      if (totalDx < 0) {
        directionRef.current = -1;
        setDirection(-1);
      } else if (totalDx > 0) {
        directionRef.current = 1;
        setDirection(1);
      }
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
  };

  const handleCardClick = (item: AcademicMediaItem) => {
    if (hasDraggedRef.current) return;
    onSelectItem(item);
  };

  const handleManualNudge = (dir: -1 | 1) => {
    directionRef.current = dir;
    setDirection(dir);
    inertiaSpeedRef.current = dir * 6;
  };

  if (items.length <= 1) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-[84vw] max-w-[320px] sm:max-w-[380px]">
          {items[0] && (
            <GalleryCardItem
              item={items[0]}
              onClick={() => handleCardClick(items[0]!)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Draggable infinite track container */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        className="relative -mx-4 sm:-mx-8 lg:-mx-16 xl:-mx-24 overflow-hidden select-none py-2 cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {/* Ambient fade masks on edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-background/90 via-background/40 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-background/90 via-background/40 to-transparent z-10" />

        {/* Translating Track */}
        <div ref={trackRef} className="flex will-change-transform">
          {loopedSets.map((set, setIndex) => (
            <div
              key={setIndex}
              ref={setIndex === 0 ? singleSetRef : undefined}
              className="flex gap-4 sm:gap-6 pr-4 sm:pr-6 shrink-0"
            >
              {set.map((item, itemIndex) => (
                <div
                  key={`${item.id || item.title}-${setIndex}-${itemIndex}`}
                  className="w-[84vw] max-w-[310px] sm:w-[340px] lg:w-[370px] shrink-0"
                >
                  <GalleryCardItem
                    item={item}
                    onClick={() => handleCardClick(item)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export function AcademicGallery() {
  const { data } = usePortfolio();
  const galleryItems: AcademicMediaItem[] = useMemo<AcademicMediaItem[]>(
    () => data.academicGallery || [],
    [data.academicGallery],
  );

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
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      if (selectedCategory === "all") return true;
      if (selectedCategory === "photos") return item.type === "image";
      if (selectedCategory === "videos") return item.type === "video";
      return item.category?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [galleryItems, selectedCategory]);

  // Modal navigation helpers
  const handleNext = useCallback(() => {
    if (!activeItem || filteredItems.length <= 1) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    const nextItem = filteredItems[nextIndex];
    if (nextItem) setActiveItem(nextItem);
  }, [activeItem, filteredItems]);

  const handlePrev = useCallback(() => {
    if (!activeItem || filteredItems.length <= 1) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    const prevItem = filteredItems[prevIndex];
    if (prevItem) setActiveItem(prevItem);
  }, [activeItem, filteredItems]);

  // Lightbox accessibility: focus management, ESC/arrow keys, body scroll lock
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!activeItem) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveItem(null);
      } else if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrev();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    };
  }, [activeItem, filteredItems.length, handleNext, handlePrev]);

  if (!galleryItems || galleryItems.length === 0) {
    return null;
  }

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
              Campus highlights, hackathon presentations, lab sessions, and academic event
              photos/videos will be featured here soon.
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
          {/* Category Filter Pills — Single horizontal scrollable line on mobile, wrapping on desktop */}
          <div className="flex items-center gap-2 overflow-x-auto flex-nowrap sm:flex-wrap pb-2 pt-0.5 sm:pb-0 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
              const count = galleryItems.filter(
                (i) => i.category?.toLowerCase() === cat.toLowerCase(),
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat.toLowerCase())}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    selectedCategory === cat.toLowerCase()
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Tag className="size-3" />
                  <span>
                    {cat} ({count})
                  </span>
                </button>
              );
            })}
          </div>

                    {/* Infinite Smooth Draggable Carousel */}
          <InfiniteGalleryCarousel
            items={filteredItems}
            onSelectItem={(item) => setActiveItem(item)}
          />
        </div>
      )}

      {/* LIGHTBOX / VIDEO MODAL */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.title} — media viewer`}
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
                  ref={closeButtonRef}
                  onClick={() => setActiveItem(null)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close media viewer"
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
