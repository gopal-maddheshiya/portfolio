import { useState, useEffect } from "react";
import gopalCutout from "@/assets/gopal-cutout.webp";
import defaultProfilePhoto from "@/assets/gopal-profile.jpg";

interface CutoutPortraitProps {
  photoSrc?: string | undefined;
  name?: string | undefined;
  badge1?: string | undefined;
  badgeRole?: string | undefined;
}

function JavaIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.5 17.5c2.5.5 5.5.5 7.5-.2 0 0 .5.8-.8 1.4-2.5 1-6.5.9-8.5-.1 0 0-.4-.7 1.8-1.1z"
        fill="#5382A1"
      />
      <path
        d="M7.8 15.2c2.2.4 4.8.4 6.6-.1 0 0 .4.7-.7 1.2-2.2.9-5.7.8-7.5-.1 0 0-.3-.6 1.6-1z"
        fill="#5382A1"
      />
      <path
        d="M12.4 11.2c1 .9 2.1 2 1.3 3.5-1.2 2.3-4.5 1.2-6.3.8 0 0-.3.5.3.7 2.1.8 6.5 1 7.6-1.5 1-2.4-.7-3.9-1.9-4.8-.8-.6-1.4-1.3-.8-2.2-1.7.9-1.5 2.5-.2 3.5z"
        fill="#E76F00"
      />
      <path
        d="M15.1 8.5c.7.8 1.4 1.7.9 3-1 2-3.8 1.1-5.3.7 0 0-.2.5.3.6 1.8.7 5.5.9 6.4-1.3.9-2.1-.6-3.3-1.6-4.1-.7-.5-1.2-1.1-.7-1.9-1.4.8-1.2 2.2 0 3z"
        fill="#EA2D2E"
      />
      <path
        d="M11 20.3c3.5.2 7-.1 9.5-1.2 0 0 .7.8-.9 1.4-3.2 1.1-8.5 1.1-11.2 0 0 0-.5-.8 2.6-.2z"
        fill="#5382A1"
      />
    </svg>
  );
}

function ReactIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-11.5 -10.23174 23 20.46348"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function CutoutPortrait({
  photoSrc,
  name = "Gopal Maddheshiya",
  badge1 = "Java • DSA",
  badgeRole = "Full-Stack Developer",
}: CutoutPortraitProps) {
  // Helper to test if image is Gopal's photo (default asset, uploaded me-b.png, or gopal-profile)
  const isGopalPhoto = (src?: string) => {
    if (!src || src.trim().length === 0) return true;
    const clean = src.trim().toLowerCase();
    return (
      clean.includes("gopal-profile") ||
      clean.includes("me-b") ||
      clean.includes("gopal-cutout") ||
      clean.includes("default")
    );
  };

  const initialSource = isGopalPhoto(photoSrc) ? gopalCutout : photoSrc!.trim();
  const [currentPhoto, setCurrentPhoto] = useState<string>(initialSource);

  useEffect(() => {
    if (isGopalPhoto(photoSrc)) {
      setCurrentPhoto(gopalCutout);
      return;
    }

    const cleanSrc = photoSrc!.trim();
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (isCancelled) return;
      try {
        const canvas = document.createElement("canvas");
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setCurrentPhoto(cleanSrc);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Check if image already has transparent pixels
        let hasAlpha = false;
        for (let i = 3; i < data.length; i += 40) {
          const a = data[i] ?? 255;
          if (a < 200) {
            hasAlpha = true;
            break;
          }
        }

        if (hasAlpha) {
          setCurrentPhoto(cleanSrc);
          return;
        }

        // If opaque image, knock out outer background from left/right/top so it never overrides the orange shape
        const bgR = data[0] ?? 0;
        const bgG = data[1] ?? 0;
        const bgB = data[2] ?? 0;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w * 0.48; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx] ?? 0;
            const g = data[idx + 1] ?? 0;
            const b = data[idx + 2] ?? 0;
            const d = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
            if (d < 30) {
              data[idx + 3] = 0;
            } else {
              break;
            }
          }
          for (let x = w - 1; x > w * 0.52; x--) {
            const idx = (y * w + x) * 4;
            const r = data[idx] ?? 0;
            const g = data[idx + 1] ?? 0;
            const b = data[idx + 2] ?? 0;
            const d = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
            if (d < 30) {
              data[idx + 3] = 0;
            } else {
              break;
            }
          }
        }

        for (let x = 0; x < w; x++) {
          for (let y = 0; y < h * 0.35; y++) {
            const idx = (y * w + x) * 4;
            const r = data[idx] ?? 0;
            const g = data[idx + 1] ?? 0;
            const b = data[idx + 2] ?? 0;
            const d = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
            if (d < 30) {
              data[idx + 3] = 0;
            } else {
              break;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setCurrentPhoto(canvas.toDataURL("image/webp", 0.95));
      } catch {
        setCurrentPhoto(cleanSrc);
      }
    };
    img.onerror = () => {
      if (!isCancelled) setCurrentPhoto(gopalCutout);
    };
    img.src = cleanSrc;

    return () => {
      isCancelled = true;
    };
  }, [photoSrc]);

  return (
    <div className="relative w-full max-w-[275px] xs:max-w-[315px] sm:max-w-[360px] md:max-w-[395px] lg:max-w-[420px] xl:max-w-[430px] aspect-square flex items-center justify-center select-none isolate">
      {/* ── Layer 0: Controlled, Softened Ambient Glow Behind Blob & Portrait ── */}
      <div
        className="absolute inset-0 -inset-x-4 -inset-y-4 rounded-full bg-[radial-gradient(ellipse_at_50%_45%,rgba(249,115,22,0.14),rgba(249,115,22,0.03)_50%,transparent_70%)] blur-xl sm:blur-2xl pointer-events-none opacity-55 animate-ambient-glow -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 right-1/4 size-32 sm:size-40 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* ── Layer 1: Large Organic Orange Abstract Blob with Soft Shadow ── */}
      <div className="absolute inset-0 size-[92%] sm:size-[90%] m-auto pointer-events-none z-10 flex items-center justify-center">
        <svg
          viewBox="0 0 500 500"
          className="size-full cutout-blob-floating filter drop-shadow-[0_8px_18px_rgba(234,88,12,0.16)]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cutoutBlobGrad" x1="15%" y1="5%" x2="85%" y2="95%">
              <stop offset="0%" stopColor="#FFA24C" />
              <stop offset="25%" stopColor="#FF7300" />
              <stop offset="70%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="blobInnerShine" x1="25%" y1="0%" x2="75%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="blobCoreGlow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFB366" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FF7300" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Main Organic Blob Path - Balanced to cradle head, left shoulder, and right shoulder */}
          <path
            d="M 255 45 C 370 40, 458 115, 464 230 C 470 345, 420 445, 260 454 C 115 462, 52 375, 56 248 C 60 120, 140 50, 255 45 Z"
            fill="url(#cutoutBlobGrad)"
          />
          {/* Core Radial Inner Glow for extra 3D warmth */}
          <path
            d="M 255 45 C 370 40, 458 115, 464 230 C 470 345, 420 445, 260 454 C 115 462, 52 375, 56 248 C 60 120, 140 50, 255 45 Z"
            fill="url(#blobCoreGlow)"
          />
          {/* Top highlight curve for sleek dimensional depth */}
          <path
            d="M 125 125 C 165 75, 255 52, 345 68 C 390 76, 425 110, 442 150"
            stroke="url(#blobInnerShine)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* ── Layer 2: Ultra High Classy Animated Cosmic Rings & Orbiting Satellites ── */}
      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 size-full pointer-events-none z-10 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Sweeping gradient from warm orange to electric cyan */}
          <linearGradient id="orbitalArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" stopOpacity="0.1" />
            <stop offset="25%" stopColor="#F97316" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.15" />
          </linearGradient>

          {/* Secondary outer dashed orbit track gradient */}
          <linearGradient id="outerTrackGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FB923C" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Counter-rotating subtle dashed outer cosmic orbit (44s reverse drift) */}
        <g className="cutout-orbit-counter">
          <circle
            cx="250"
            cy="250"
            r="238"
            stroke="url(#outerTrackGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 16"
            className="opacity-40"
          />
          {/* Micro star satellites on the outer ring */}
          <circle cx="250" cy="12" r="2" fill="#06B6D4" className="opacity-75" />
          <circle cx="488" cy="250" r="1.5" fill="#FB923C" className="opacity-70" />
          <circle cx="250" cy="488" r="2" fill="#06B6D4" className="opacity-65" />
        </g>

        {/* Clockwise rotating primary halo & glowing energy satellites (26s silky spin) */}
        <g className="cutout-orbit-clockwise cutout-shimmer">
          {/* Primary elegant sweeping orbital arc */}
          <path
            d="M 120 75 C 220 20, 395 35, 455 145 C 500 225, 475 355, 410 420"
            stroke="url(#orbitalArcGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Bright neon accent segment with radiant glow */}
          <path
            d="M 280 32 C 375 52, 452 135, 462 230"
            stroke="#06B6D4"
            strokeWidth="2.6"
            strokeLinecap="round"
            filter="drop-shadow(0 0 6px #06B6D4)"
          />

          {/* Cyan Lead Satellite with energetic pulse */}
          <g transform="translate(462, 230)">
            <circle r="4" fill="#06B6D4" filter="drop-shadow(0 0 10px #06B6D4)" />
            <circle
              r="7"
              fill="#06B6D4"
              className="animate-ping [animation-duration:2.8s] opacity-75"
            />
          </g>

          {/* Vibrant Orange Secondary Satellite */}
          <g transform="translate(455, 145)">
            <circle r="3.5" fill="#F97316" filter="drop-shadow(0 0 8px #F97316)" />
          </g>

          {/* Golden Amber Orbital Accent */}
          <circle cx="410" cy="420" r="2.5" fill="#FB923C" filter="drop-shadow(0 0 5px #FB923C)" />

          {/* North-west Cyan Energy Node */}
          <circle cx="120" cy="75" r="2.5" fill="#06B6D4" className="opacity-80" />
        </g>
      </svg>

      {/* ── Layer 3: Foreground Background-Free Portrait Cutout with Softened Shadow ── */}
      <div className="relative z-20 w-[92%] sm:w-[88%] h-auto max-h-[96%] flex items-end justify-center pointer-events-none">
        <img
          src={currentPhoto}
          alt={name}
          width={520}
          height={520}
          onError={() => {
            if (currentPhoto !== gopalCutout) {
              setCurrentPhoto(gopalCutout);
            } else {
              setCurrentPhoto(defaultProfilePhoto);
            }
          }}
          className="w-full h-auto object-contain object-bottom drop-shadow-[0_6px_14px_rgba(0,0,0,0.22)] transition-transform duration-500 hover:scale-[1.015] pointer-events-auto"
        />
      </div>

      {/* ── Layer 4A: Top-Left Floating Aurora Pill (Java • DSA) ── */}
      {badge1 && (
        <div className="absolute top-4 sm:top-6 -left-1 sm:-left-3 z-30 pointer-events-auto select-none transition-transform hover:scale-105 duration-300">
          <div className="aurora-badge-wrapper rounded-full shadow-md shadow-black/25">
            <div className="inline-flex items-center gap-2 rounded-full bg-card/95 dark:bg-[#0f1016]/95 px-3 py-1.5 sm:px-3.5 sm:py-1.5 backdrop-blur-md">
              <div className="flex size-5 sm:size-5.5 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-[#E76F00] shrink-0">
                <JavaIcon className="size-3.5" />
              </div>
              <span className="font-display font-semibold text-xs text-foreground tracking-tight whitespace-nowrap">
                {badge1}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Layer 4B: Bottom-Right Floating Aurora Pill (Full-Stack Developer) ── */}
      <div className="absolute -bottom-2 sm:-bottom-1 right-0 sm:-right-2 z-30 pointer-events-auto select-none transition-transform hover:scale-105 duration-300">
        <div className="aurora-badge-wrapper rounded-full shadow-md shadow-black/25">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-card/95 dark:bg-[#0f1016]/95 px-3.5 py-1.5 sm:px-4 sm:py-2 backdrop-blur-md">
            <div className="flex size-5.5 sm:size-6 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[#61DAFB] shrink-0 shadow-[0_0_8px_rgba(97,218,251,0.25)]">
              <ReactIcon className="size-3.5 sm:size-4" />
            </div>
            <span className="font-display font-semibold text-xs sm:text-sm text-foreground tracking-tight whitespace-nowrap">
              {badgeRole}
            </span>
            <span className="relative flex size-2 shrink-0 ml-0.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CutoutPortrait;
