import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Layers,
  Maximize2,
  Play,
  Sparkles,
  Tag,
  Video,
  X,
} from "lucide-react";

import { ModalDialog } from "@/components/common/ModalDialog";
import { usePortfolio } from "@/context/PortfolioContext";
import { DEFAULT_SECTION_HEADERS, type AcademicMediaItem } from "@/data/profile";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

const MAX_DESKTOP_GRID_INITIAL = 6;

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
  );
  return match?.[1] ?? null;
}

function buildYouTubeEmbedUrl(url: string): string {
  const id = extractYouTubeId(url);
  if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
  return url;
}

function resolveMediaPoster(item: AcademicMediaItem): string | null {
  if (item.thumbnailUrl?.trim()) return item.thumbnailUrl.trim();
  if (item.type === "video") {
    const ytId = extractYouTubeId(item.url);
    if (ytId) return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
    return null;
  }
  return item.url || null;
}

/* ─────────────── Card Media Visual (Auto Photo / Video Frame / Poster) ─────────────── */
function GalleryMediaVisual({
  item,
  imgClassName,
}: {
  item: AcademicMediaItem;
  imgClassName?: string;
}) {
  const posterSrc = resolveMediaPoster(item);
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setHasError(false);
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [posterSrc]);

  if (item.type === "video" && !posterSrc) {
    return (
      <div className="relative size-full overflow-hidden bg-zinc-950">
        {item.url ? (
          <video
            src={`${item.url}#t=0.5`}
            preload="metadata"
            muted
            playsInline
            className="size-full object-cover opacity-90 transition-transform duration-500 group-hover/media:scale-[1.03]"
          />
        ) : (
          <div className="size-full flex flex-col items-center justify-center text-zinc-400 gap-2">
            <Video className="size-10 text-primary/80" aria-hidden="true" />
            <span className="font-mono text-xs">Video Demo</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative size-full overflow-hidden bg-surface/80">
      {hasMounted && !isLoaded && !hasError ? (
        <div className="pointer-events-none absolute inset-0 z-1 flex items-center justify-center bg-card/40">
          <div className="size-6 rounded-full border-2 border-border border-t-primary animate-spin opacity-55" />
        </div>
      ) : null}

      {hasError || !posterSrc ? (
        <div className="size-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 gap-2 p-4 text-center">
          <Camera className="size-8 text-zinc-600" aria-hidden="true" />
          <span className="text-xs">Media preview unavailable</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={posterSrc}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "size-full object-cover transition-transform duration-500 group-hover/media:scale-[1.04]",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}

function MediaOverlayBadges({
  item,
  spotlight = false,
}: {
  item: AcademicMediaItem;
  spotlight?: boolean;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/65 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white border border-white/15">
          {item.type === "video" ? (
            <>
              <Video className="size-3.5 text-rose-400" aria-hidden="true" />
              <span>Video</span>
            </>
          ) : (
            <>
              <Camera className="size-3.5 text-primary" aria-hidden="true" />
              <span>Photo</span>
            </>
          )}
        </span>

        {spotlight ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 font-mono text-[10px] font-semibold text-primary-foreground shadow-xs">
            <Sparkles className="size-3" aria-hidden="true" />
            <span>Spotlight</span>
          </span>
        ) : null}
      </div>

      {item.category ? (
        <div className="absolute top-3 right-3 z-10 max-w-[46%]">
          <span className="inline-flex items-center truncate rounded-lg bg-black/65 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] sm:text-[11px] text-zinc-100 border border-white/12">
            {item.category}
          </span>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        {item.type === "video" ? (
          <div className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/35 transition-transform duration-300 group-hover/media:scale-110">
            <Play className="size-5 fill-current translate-x-0.5" aria-hidden="true" />
          </div>
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-black/65 backdrop-blur-md text-white border border-white/25 opacity-0 group-hover/media:opacity-100 transition-all duration-200 group-hover/media:scale-105">
            <Maximize2 className="size-4" aria-hidden="true" />
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────── Desktop Spotlight Card ─────────────── */
function GallerySpotlightCard({
  item,
  onSelect,
}: {
  item: AcademicMediaItem;
  onSelect: () => void;
}) {
  return (
    <Reveal>
      <button
        type="button"
        onClick={onSelect}
        className="group group/media relative hidden md:grid md:grid-cols-12 w-full text-left overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:border-primary/50 hover:shadow-soft transition-[border-color,box-shadow] duration-200 cursor-pointer before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-20 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent"
      >
        <div className="relative md:col-span-7 aspect-[16/10] md:min-h-[340px] w-full overflow-hidden bg-surface">
          <GalleryMediaVisual item={item} />
          <MediaOverlayBadges item={item} spotlight />
        </div>

        <div className="md:col-span-5 p-6 lg:p-8 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
              {item.category ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-primary font-medium">
                  <Tag className="size-3" aria-hidden="true" />
                  <span>{item.category}</span>
                </span>
              ) : null}
              {item.date ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-0.5">
                  <Calendar className="size-3 text-primary" aria-hidden="true" />
                  <span>{item.date}</span>
                </span>
              ) : null}
            </div>

            <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
              {item.title}
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-6">
              {item.caption || "Academic milestone and university memory."}
            </p>
          </div>

          <div className="pt-4 border-t border-border/70 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              {item.type === "video" ? (
                <>
                  <Play className="size-4 fill-current" aria-hidden="true" />
                  <span>Watch Video &amp; Full Context</span>
                </>
              ) : (
                <>
                  <Maximize2 className="size-4" aria-hidden="true" />
                  <span>Inspect Photo &amp; Story</span>
                </>
              )}
            </span>
            <ChevronRight
              className="size-4 text-primary transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </button>
    </Reveal>
  );
}

/* ─────────────── Editorial Tall Gallery Card (Grid & Mobile Carousel) ─────────────── */
function GalleryCardItem({ item, onSelect }: { item: AcademicMediaItem; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group group/media relative flex h-full w-full flex-col justify-between text-left overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:border-primary/45 hover:shadow-soft transition-[border-color,box-shadow] duration-200 cursor-pointer before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-20 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/40 before:to-transparent"
    >
      <div className="flex flex-1 flex-col w-full">
        {/* Generous 4:3 visual viewport (~45–55% taller media area than previous 16:9 marquee) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
          <GalleryMediaVisual item={item} />
          <MediaOverlayBadges item={item} />
        </div>

        {/* Rich Editorial Body */}
        <div className="flex flex-1 flex-col justify-between gap-3 p-5 sm:p-6">
          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-2.5">
              <h3 className="font-display text-base sm:text-lg font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              {item.date ? (
                <span className="font-mono text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-md shrink-0">
                  {item.date}
                </span>
              ) : null}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-4">
              {item.caption || "Academic milestone and university memory."}
            </p>
          </div>

          <div className="pt-3 border-t border-border/65 flex items-center justify-between text-xs font-medium text-foreground/90">
            <span className="inline-flex items-center gap-1.5 text-primary">
              {item.type === "video" ? (
                <>
                  <Play className="size-3.5 fill-current" aria-hidden="true" />
                  <span>Watch Video &amp; Details</span>
                </>
              ) : (
                <>
                  <Maximize2 className="size-3.5" aria-hidden="true" />
                  <span>View Full Details</span>
                </>
              )}
            </span>
            <ChevronRight
              className="size-4 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </button>
  );
}

/* ─────────────── Phone-First Native CSS Scroll-Snap Carousel ─────────────── */
function MobileGalleryCarousel({
  items,
  onSelectItem,
}: {
  items: AcademicMediaItem[];
  onSelectItem: (item: AcademicMediaItem) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const pendingTargetRef = useRef<number | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userInteractedRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [liveStatus, setLiveStatus] = useState("");

  useEffect(() => {
    setActiveIndex(0);
    pendingTargetRef.current = null;
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, [items]);

  const measureNearestIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;

    slideRefs.current.forEach((slide, idx) => {
      if (!slide) return;
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - trackCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    return bestIdx;
  }, []);

  const handleSettled = useCallback(() => {
    const settledIdx = pendingTargetRef.current ?? measureNearestIndex();
    pendingTargetRef.current = null;
    setActiveIndex(settledIdx);
    if (userInteractedRef.current && items[settledIdx]) {
      setLiveStatus(`Slide ${settledIdx + 1} of ${items.length}: ${items[settledIdx].title}`);
    }
  }, [items, measureNearestIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const supportsScrollEnd = "onscrollend" in window;

    const onScroll = () => {
      userInteractedRef.current = true;
      if (pendingTargetRef.current === null && rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          const idx = measureNearestIndex();
          setActiveIndex((prev) => (prev === idx ? prev : idx));
        });
      }

      if (!supportsScrollEnd) {
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
        settleTimerRef.current = setTimeout(handleSettled, 130);
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    if (supportsScrollEnd) {
      track.addEventListener("scrollend", handleSettled, { passive: true });
    }

    return () => {
      track.removeEventListener("scroll", onScroll);
      if (supportsScrollEnd) {
        track.removeEventListener("scrollend", handleSettled);
      }
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [handleSettled, measureNearestIndex]);

  const scrollToSlide = (targetIdx: number) => {
    const track = trackRef.current;
    const slide = slideRefs.current[targetIdx];
    if (!track || !slide) return;

    userInteractedRef.current = true;
    pendingTargetRef.current = targetIdx;
    setActiveIndex(targetIdx);

    const slideCenterOffset = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, slideCenterOffset) });
  };

  const handleStep = (delta: -1 | 1) => {
    if (items.length <= 1) return;
    const base = pendingTargetRef.current ?? activeIndex;
    const nextIdx = (base + delta + items.length) % items.length;
    scrollToSlide(nextIdx);
  };

  if (items.length <= 1) {
    return items[0] ? (
      <div className="md:hidden">
        <GalleryCardItem item={items[0]} onSelect={() => onSelectItem(items[0]!)} />
      </div>
    ) : null;
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Campus moments and highlights"
      className="md:hidden space-y-3"
    >
      {/* Top Bar: Slide Counter & Prev/Next Touch Buttons */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          Moment <span className="font-semibold text-foreground">{activeIndex + 1}</span> /{" "}
          {items.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            aria-label="Previous slide"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary/45 transition-colors cursor-pointer touch-manipulation"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleStep(1)}
            aria-label="Next slide"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary/45 transition-colors cursor-pointer touch-manipulation"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Native CSS Scroll-Snap Track */}
      <div
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Gallery slides"
        className="gallery-snap-track flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-xl"
      >
        {items.map((item, idx) => (
          <div
            key={item.id || `${item.title}-${idx}`}
            ref={(el) => {
              slideRefs.current[idx] = el;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${items.length}`}
            className="w-[88vw] max-w-[390px] shrink-0 snap-center flex"
          >
            <GalleryCardItem item={item} onSelect={() => onSelectItem(item)} />
          </div>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {liveStatus}
      </p>

      {/* Accessible Marker Dots (24x24px minimum target + non-color active indicator) */}
      <nav aria-label="Choose a slide" className="flex items-center justify-center gap-1 pt-1">
        {items.map((item, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${item.title}`}
              aria-current={isCurrent ? "true" : undefined}
              className="inline-flex min-h-6 min-w-6 items-center justify-center p-1 cursor-pointer touch-manipulation rounded-full"
            >
              <span
                className={cn(
                  "h-2 rounded-full transition-all duration-200",
                  isCurrent ? "w-6 bg-primary" : "w-2 bg-border-strong",
                )}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ─────────────── Native Top-Layer Gallery Lightbox & Video Dialog ─────────────── */
function GalleryMediaDialog({
  activeItem,
  items,
  onClose,
  onPrev,
  onNext,
}: {
  activeItem: AcademicMediaItem | null;
  items: AcademicMediaItem[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const touchStartXRef = useRef<number | null>(null);
  const currentIndex = activeItem ? items.findIndex((i) => i.id === activeItem.id) : -1;

  useEffect(() => {
    if (!activeItem || items.length <= 1) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        onNext();
      } else if (event.key === "ArrowLeft") {
        onPrev();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeItem, items.length, onNext, onPrev]);

  return (
    <ModalDialog
      open={Boolean(activeItem)}
      onClose={onClose}
      labelledBy="gallery-modal-title"
      className="max-w-4xl bg-zinc-950 text-white border-white/15"
    >
      {activeItem ? (
        <div
          className="flex max-h-[90dvh] flex-col"
          onTouchStart={(e) => {
            touchStartXRef.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const startX = touchStartXRef.current;
            const endX = e.changedTouches[0]?.clientX;
            touchStartXRef.current = null;
            if (startX == null || endX == null || items.length <= 1) return;
            const delta = endX - startX;
            if (delta > 50) onPrev();
            else if (delta < -50) onNext();
          }}
        >
          {/* Mobile sheet indicator */}
          <div className="flex justify-center pt-2.5 sm:hidden shrink-0" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-white/25" />
          </div>

          {/* Modal Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 sm:px-5 py-3.5 bg-zinc-900/85 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/20 text-primary px-2.5 py-1 text-xs font-semibold border border-primary/30 shrink-0">
                {activeItem.type === "video" ? (
                  <>
                    <Video className="size-3.5" aria-hidden="true" />
                    <span>Video</span>
                  </>
                ) : (
                  <>
                    <Camera className="size-3.5" aria-hidden="true" />
                    <span>Photo</span>
                  </>
                )}
              </span>

              {items.length > 1 && currentIndex >= 0 ? (
                <span className="font-mono text-[11px] text-zinc-400 shrink-0">
                  {currentIndex + 1}/{items.length}
                </span>
              ) : null}

              <h2
                id="gallery-modal-title"
                className="font-display font-semibold text-sm sm:text-base text-zinc-100 truncate"
              >
                {activeItem.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {activeItem.url ? (
                <a
                  href={activeItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-9 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Open original media in new tab"
                  title="Open original media"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-9 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close media viewer"
                title="Close (ESC)"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Media Stage */}
          <div className="relative bg-black flex items-center justify-center overflow-hidden min-h-[240px] max-h-[52dvh] sm:max-h-[60dvh]">
            {activeItem.type === "video" ? (
              extractYouTubeId(activeItem.url) ? (
                <iframe
                  key={activeItem.id}
                  src={buildYouTubeEmbedUrl(activeItem.url)}
                  title={activeItem.title}
                  className="w-full aspect-video max-h-[52dvh] sm:max-h-[60dvh] border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  key={activeItem.id}
                  src={activeItem.url}
                  poster={activeItem.thumbnailUrl || undefined}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[52dvh] sm:max-h-[60dvh] max-w-full object-contain"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              )
            ) : (
              <img
                src={activeItem.url}
                alt={activeItem.title}
                className="max-h-[52dvh] sm:max-h-[60dvh] max-w-full object-contain select-none"
              />
            )}

            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Previous item"
                  className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex size-10 items-center justify-center rounded-full bg-black/65 hover:bg-black/90 text-white border border-white/20 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Next item"
                  className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex size-10 items-center justify-center rounded-full bg-black/65 hover:bg-black/90 text-white border border-white/20 transition-colors cursor-pointer"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>

          {/* Story Context Footer */}
          <div className="border-t border-white/10 p-4 sm:p-5 bg-zinc-900/95 space-y-3 overflow-y-auto shrink-0 max-h-[28dvh]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {activeItem.category ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs font-mono text-zinc-200">
                    <Tag className="size-3 text-primary" aria-hidden="true" />
                    <span>{activeItem.category}</span>
                  </span>
                ) : null}
                {activeItem.date ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs font-mono text-zinc-200">
                    <Calendar className="size-3 text-primary" aria-hidden="true" />
                    <span>{activeItem.date}</span>
                  </span>
                ) : null}
              </div>

              {items.length > 1 ? (
                <div className="flex sm:hidden items-center gap-2">
                  <button
                    type="button"
                    onClick={onPrev}
                    aria-label="Previous item"
                    className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-white/15 bg-zinc-800 text-white"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    aria-label="Next item"
                    className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-white/15 bg-zinc-800 text-white"
                  >
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              {activeItem.caption || "Academic milestone and university memory."}
            </p>
          </div>
        </div>
      ) : null}
    </ModalDialog>
  );
}

/* ─────────────── Main Campus Gallery Section ─────────────── */
export function AcademicGallery() {
  const { data } = usePortfolio();
  const galleryItems: AcademicMediaItem[] = useMemo<AcademicMediaItem[]>(
    () => data.academicGallery || [],
    [data.academicGallery],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAllDesktop, setShowAllDesktop] = useState(false);
  const [activeItem, setActiveItem] = useState<AcademicMediaItem | null>(null);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          galleryItems
            .map((item) => item.category?.trim())
            .filter((cat): cat is string => Boolean(cat && cat.length > 0)),
        ),
      ),
    [galleryItems],
  );

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      if (selectedCategory === "all") return true;
      if (selectedCategory === "photos") return item.type === "image";
      if (selectedCategory === "videos") return item.type === "video";
      return item.category?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [galleryItems, selectedCategory]);

  // Promote featured spotlight item cleanly on desktop when showing >= 2 items in All tab
  const spotlightItem = useMemo(() => {
    if (selectedCategory !== "all" || filteredItems.length < 2) return null;
    return filteredItems.find((item) => item.featured) || filteredItems[0] || null;
  }, [filteredItems, selectedCategory]);

  const desktopGridItems = useMemo(() => {
    if (!spotlightItem) return filteredItems;
    return filteredItems.filter((item) => item.id !== spotlightItem.id);
  }, [filteredItems, spotlightItem]);

  const hasDesktopOverflow = desktopGridItems.length > MAX_DESKTOP_GRID_INITIAL;
  const visibleDesktopGridItems = showAllDesktop
    ? desktopGridItems
    : desktopGridItems.slice(0, MAX_DESKTOP_GRID_INITIAL);

  // Order mobile carousel items with spotlight item first for seamless parity
  const orderedMobileItems = useMemo(() => {
    if (!spotlightItem) return filteredItems;
    return [spotlightItem, ...desktopGridItems];
  }, [desktopGridItems, filteredItems, spotlightItem]);

  const handleNext = useCallback(() => {
    if (!activeItem || filteredItems.length <= 1) return;
    const idx = filteredItems.findIndex((i) => i.id === activeItem.id);
    const next = filteredItems[(idx + 1) % filteredItems.length];
    if (next) setActiveItem(next);
  }, [activeItem, filteredItems]);

  const handlePrev = useCallback(() => {
    if (!activeItem || filteredItems.length <= 1) return;
    const idx = filteredItems.findIndex((i) => i.id === activeItem.id);
    const prev = filteredItems[(idx - 1 + filteredItems.length) % filteredItems.length];
    if (prev) setActiveItem(prev);
  }, [activeItem, filteredItems]);

  if (!galleryItems || galleryItems.length === 0) {
    return null;
  }

  const galleryHeader = {
    eyebrow: data.sectionHeaders?.gallery?.eyebrow || DEFAULT_SECTION_HEADERS.gallery.eyebrow,
    title: data.sectionHeaders?.gallery?.title || DEFAULT_SECTION_HEADERS.gallery.title,
    description:
      data.sectionHeaders?.gallery?.description || DEFAULT_SECTION_HEADERS.gallery.description,
  };

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow={galleryHeader.eyebrow}
        title={galleryHeader.title}
        description={galleryHeader.description}
      />

      <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">
        {/* Category Filter Strip */}
        <div
          role="tablist"
          aria-label="Filter gallery media"
          className="skills-edge-mask flex items-center gap-2 overflow-x-auto flex-nowrap sm:flex-wrap pb-2 pt-0.5 sm:pb-0 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "all"}
            onClick={() => {
              setSelectedCategory("all");
              setShowAllDesktop(false);
            }}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            <Layers className="size-3.5" aria-hidden="true" />
            <span>All Media ({galleryItems.length})</span>
          </button>

          {galleryItems.some((i) => i.type === "image") ? (
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === "photos"}
              onClick={() => {
                setSelectedCategory("photos");
                setShowAllDesktop(false);
              }}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                selectedCategory === "photos"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <Camera className="size-3.5" aria-hidden="true" />
              <span>Photos ({galleryItems.filter((i) => i.type === "image").length})</span>
            </button>
          ) : null}

          {galleryItems.some((i) => i.type === "video") ? (
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === "videos"}
              onClick={() => {
                setSelectedCategory("videos");
                setShowAllDesktop(false);
              }}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                selectedCategory === "videos"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <Video className="size-3.5" aria-hidden="true" />
              <span>Videos ({galleryItems.filter((i) => i.type === "video").length})</span>
            </button>
          ) : null}

          {categories.map((cat) => {
            const count = galleryItems.filter(
              (i) => i.category?.toLowerCase() === cat.toLowerCase(),
            ).length;
            const active = selectedCategory === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setSelectedCategory(cat.toLowerCase());
                  setShowAllDesktop(false);
                }}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                <Tag className="size-3" aria-hidden="true" />
                <span>
                  {cat} ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile (< 768px): Native CSS Scroll-Snap Carousel with tall 4:3 cards */}
        <MobileGalleryCarousel
          items={orderedMobileItems}
          onSelectItem={(item) => setActiveItem(item)}
        />

        {/* Desktop & Tablet (768px+): Curated Spotlight Hero + Tall 4:3 Bento Grid */}
        <div className="hidden md:block space-y-6">
          {spotlightItem ? (
            <GallerySpotlightCard
              item={spotlightItem}
              onSelect={() => setActiveItem(spotlightItem)}
            />
          ) : null}

          {visibleDesktopGridItems.length > 0 ? (
            <div
              className={cn(
                "grid gap-5 lg:gap-6",
                visibleDesktopGridItems.length === 1
                  ? "max-w-xl"
                  : visibleDesktopGridItems.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-2 lg:grid-cols-3",
              )}
            >
              {visibleDesktopGridItems.map((item, idx) => (
                <Reveal key={item.id || `${item.title}-${idx}`} delay={Math.min(idx, 5) * 45}>
                  <GalleryCardItem item={item} onSelect={() => setActiveItem(item)} />
                </Reveal>
              ))}
            </div>
          ) : null}

          {hasDesktopOverflow ? (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (showAllDesktop) {
                    setShowAllDesktop(false);
                    scrollToId("gallery");
                  } else {
                    setShowAllDesktop(true);
                  }
                }}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border-strong bg-card px-5 py-2 text-xs sm:text-sm font-medium text-foreground shadow-2xs hover:border-primary/45 hover:bg-secondary transition-colors cursor-pointer"
              >
                {showAllDesktop ? (
                  <>
                    <ChevronUp className="size-4 text-primary" aria-hidden="true" />
                    <span>Show Fewer Moments</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-4 text-primary" aria-hidden="true" />
                    <span>View All {filteredItems.length} Moments</span>
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <GalleryMediaDialog
        activeItem={activeItem}
        items={filteredItems}
        onClose={() => setActiveItem(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </Section>
  );
}
