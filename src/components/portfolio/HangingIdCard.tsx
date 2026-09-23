

import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import defaultProfilePhoto from "@/assets/gopal-profile.jpg";
import { cn } from "@/lib/utils";

// ─── Physics Constants ────────────────────────────────────────────────────────
const DAMPING = 0.95;        // Smooth air resistance
const GRAVITY = 2500;       // Snappy pendulum gravity
const MASS = 1;             // Virtual mass
const PIVOT_OFFSET_Y = 22;  // Distance in px from card top edge to the anchor pin

// Initial natural swing parameters (upright vertical start, no 24-degree left tilt!)
const INITIAL_SWING_ANGLE = 0;
const INITIAL_SWING_VEL = 0.5;

interface CardPhysicsState {
  angle: number; // Radians from vertical (free rotation, can exceed 2*PI for full 360°+)
  vel: number;   // Angular velocity (rad/s)
}

export interface HangingIdCardProps {
  photoSrc: string;
  name?: string;
  subtitle?: string;
  className?: string;
  floatingBadge1?: React.ReactNode;
  floatingBadge2?: React.ReactNode;
}

// ─── Compact Realistic Top Hanger (Fastener Pin + Swivel Ring + Clamp) ───────
const SmallHanger = React.memo(function SmallHanger() {
  return (
    <div className="flex flex-col items-center select-none pointer-events-none">
      {/* Wall/Ceiling Fastener Pin */}
      <div className="size-2.5 sm:size-3 rounded-full bg-gradient-to-br from-zinc-300 via-zinc-600 to-black border border-zinc-400/80 shadow-[0_1px_3px_rgba(0,0,0,0.6)] flex items-center justify-center">
        <div className="size-1 rounded-full bg-zinc-200 shadow-inner" />
      </div>

      {/* Realistic Metallic Hardware */}
      <svg
        width="36"
        height="24"
        viewBox="0 0 36 24"
        className="overflow-visible select-none drop-shadow-sm -mt-0.5"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="smallHangerMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e4e4e7" />
            <stop offset="35%" stopColor="#a1a1aa" />
            <stop offset="70%" stopColor="#52525b" />
            <stop offset="100%" stopColor="#27272a" />
          </linearGradient>
          <linearGradient id="smallHangerStrap" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="50%" stopColor="#3f3f46" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
        </defs>

        {/* Mini hanging strap cord */}
        <rect x="14.5" y="0" width="7" height="7" rx="1.5" fill="url(#smallHangerStrap)" />
        <line x1="16" y1="0" x2="16" y2="7" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="1 1" />
        <line x1="20" y1="0" x2="20" y2="7" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="1 1" />

        {/* Swivel metal loop */}
        <ellipse cx="18" cy="8" rx="3.8" ry="2.2" fill="none" stroke="url(#smallHangerMetal)" strokeWidth="1.6" />

        {/* Metallic clamp bracket holding the top edge of the card */}
        <rect x="6" y="9.5" width="24" height="10" rx="2" fill="url(#smallHangerMetal)" stroke="#18181b" strokeWidth="0.6" />
        <line x1="7" y1="14" x2="29" y2="14" stroke="#18181b" strokeWidth="0.5" strokeOpacity="0.6" />

        {/* Dual Rivets */}
        <circle cx="10" cy="14" r="1" fill="#f4f4f5" />
        <circle cx="26" cy="14" r="1" fill="#f4f4f5" />

        {/* Lower clamp lip overlapping card top border */}
        <rect x="11" y="18.5" width="14" height="4.5" rx="0.75" fill="#27272a" stroke="#18181b" strokeWidth="0.5" />
      </svg>
    </div>
  );
});

export function HangingIdCard({
  photoSrc,
  name = "Gopal Maddheshiya",
  subtitle = "Java & Full-Stack Developer · DSA & API Integration",
  className,
  floatingBadge1,
  floatingBadge2,
}: HangingIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const physRef = useRef<CardPhysicsState>({
    angle: INITIAL_SWING_ANGLE,
    vel: INITIAL_SWING_VEL,
  });
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const prevAngleRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  const [currentPhoto, setCurrentPhoto] = useState(photoSrc || defaultProfilePhoto);
  const [angle, setAngle] = useState(INITIAL_SWING_ANGLE);
  const [isDragging, setIsDragging] = useState(false);

  // Pivot coordinates & polar drag tracking
  const pivotPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevPointerAngle = useRef<number>(0);

  // Mobile scroll intent detection: distinguish between vertical page scroll and horizontal card drag
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isTouchScrolling = useRef(false);
  const dragLocked = useRef(false);

  useEffect(() => {
    setCurrentPhoto(photoSrc || defaultProfilePhoto);
  }, [photoSrc]);

  // Reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Stable anchor position using the unrotated parent container
  const getPivotPos = useCallback(() => {
    if (cardRef.current) {
      const parent = cardRef.current.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top - PIVOT_OFFSET_Y,
        };
      }
      const rect = cardRef.current.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top - PIVOT_OFFSET_Y,
      };
    }
    return { x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: 150 };
  }, []);

  // ── Physics Loop ────────────────────────────────────────────────────────────
  const tick = useCallback(
    (now: number) => {
      if (prefersReducedMotion) {
        setAngle(0);
        return;
      }

      if (prevTimeRef.current === null) {
        prevTimeRef.current = now;
      }
      const dt = Math.min((now - prevTimeRef.current) / 1000, 0.05);
      prevTimeRef.current = now;

      const s = physRef.current;

      if (!isDraggingRef.current) {
        const L = 180;
        // Natural pendulum equation: torque = - (g / L) * sin(theta) - (damping / m) * vel
        const torque =
          -(GRAVITY / L) * Math.sin(s.angle) -
          (DAMPING / MASS) * s.vel;

        s.vel += torque * dt;
        s.angle += s.vel * dt;

        setAngle(s.angle);

        // Check if settled near bottom equilibrium (any integer multiple of 2*PI)
        const normalizedSin = Math.sin(s.angle);
        if (Math.abs(s.vel) < 0.002 && Math.abs(normalizedSin) < 0.002) {
          s.angle = 0;
          s.vel = 0;
          setAngle(0);
        } else {
          rafRef.current = requestAnimationFrame(tick);
        }
      } else {
        if (dt > 0) {
          s.vel = (s.angle - prevAngleRef.current) / dt;
        }
        prevAngleRef.current = s.angle;
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [prefersReducedMotion]
  );

  const startPhysics = useCallback(() => {
    if (prefersReducedMotion) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    prevTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick, prefersReducedMotion]);

  // ── Start swinging immediately on refresh/mount (already in motion) ─────────
  useEffect(() => {
    if (prefersReducedMotion) {
      setAngle(0);
      physRef.current = { angle: 0, vel: 0 };
      return;
    }

    // Immediately start physics on refresh so it is ALREADY swinging!
    startPhysics();
  }, [startPhysics, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Drag & 360° Pointer Gestures with Mobile Scroll Intent Detection ────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const isTouch = e.pointerType === "touch";
      touchStartPos.current = { x: e.clientX, y: e.clientY };
      isTouchScrolling.current = false;
      dragLocked.current = !isTouch; // Mouse immediately locks to drag!

      pivotPos.current = getPivotPos();
      const dx = e.clientX - pivotPos.current.x;
      const dy = e.clientY - pivotPos.current.y;
      prevPointerAngle.current = Math.atan2(-dx, dy);
      prevAngleRef.current = physRef.current.angle;

      // For desktop mouse, capture immediately and start RAF
      if (!isTouch) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Safe fallback
        }
        isDraggingRef.current = true;
        setIsDragging(true);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        prevTimeRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [tick, getPivotPos]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      // If mobile user is scrolling the page vertically, don't drag card!
      if (isTouchScrolling.current) return;

      const isTouch = e.pointerType === "touch";

      // On mobile touch, detect directional intent before hijacking gesture
      if (isTouch && !dragLocked.current) {
        if (!touchStartPos.current) return;
        const deltaX = Math.abs(e.clientX - touchStartPos.current.x);
        const deltaY = Math.abs(e.clientY - touchStartPos.current.y);

        // Wait until finger has moved at least 8px to determine gesture intent
        if (deltaX < 8 && deltaY < 8) return;

        if (deltaY > deltaX) {
          // Vertical swipe: user is scrolling the page! Let native browser scroll proceed!
          isTouchScrolling.current = true;
          return;
        } else {
          // Horizontal/angular swipe: user deliberately wants to rotate the card!
          dragLocked.current = true;
          isDraggingRef.current = true;
          setIsDragging(true);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Safe fallback
          }

          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          prevTimeRef.current = null;
          rafRef.current = requestAnimationFrame(tick);
        }
      }

      if (!isDraggingRef.current) return;

      const dx = e.clientX - pivotPos.current.x;
      const dy = e.clientY - pivotPos.current.y;
      // Inverted dx (-dx) so that moving left rotates left, and moving right rotates right!
      const currentPointerAngle = Math.atan2(-dx, dy);

      let delta = currentPointerAngle - prevPointerAngle.current;
      // Handle wrap-around when crossing the -PI / +PI boundary (top dead center)
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      prevPointerAngle.current = currentPointerAngle;

      // Free 360° rotation
      physRef.current.angle += delta;
      setAngle(physRef.current.angle);
    },
    [tick]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      touchStartPos.current = null;
      const wasDragging = isDraggingRef.current;
      isTouchScrolling.current = false;
      dragLocked.current = false;
      isDraggingRef.current = false;
      setIsDragging(false);

      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Safe fallback
      }

      if (wasDragging) {
        startPhysics();
      }
    },
    [startPhysics]
  );

  // Click / Tap impulse: swings idhar-udhar playfully (ignored if it was a touch scroll)
  const handleClick = useCallback(() => {
    if (isDraggingRef.current || isTouchScrolling.current) return;
    const dir = Math.sin(physRef.current.angle) >= 0 ? -1 : 1;
    physRef.current.vel = dir * 3.5;
    startPhysics();
  }, [startPhysics]);

  const cardRotateDeg = angle * (180 / Math.PI);
  const sheenShiftPercent = 50 + Math.sin(angle) * 45;
  const tiltY = Math.sin(angle) * 8;
  const tiltX = (Math.cos(angle) - 1) * 4;

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ touchAction: "pan-y", perspective: "1200px" }}
    >
      {/* The Swinging Assembly (Attached Badges + Small Top Hanger + Original Photo Card) */}
      <div
        ref={cardRef}
        className={cn(
          "relative transition-shadow duration-300",
          isDragging ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={handleClick}
        style={{
          transform: `rotate(${cardRotateDeg}deg) rotateY(${tiltY}deg) rotateX(${tiltX}deg)`,
          transformOrigin: `50% -${PIVOT_OFFSET_Y}px`,
          transformStyle: "preserve-3d",
          touchAction: "pan-y",
          willChange: isDragging || Math.abs(angle) > 0.001 ? "transform" : "auto",
        }}
        title="Drag 360° or click to swing"
      >
        {/* Small Top Hanger positioned directly above the card (zero layout shift) */}
        <div className="hero-anim-float absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
          <SmallHanger />
        </div>

        {/* Levitating Badge 1 — top-left corner */}
        {floatingBadge1 && (
          <div className="hero-anim-float absolute -top-4 -left-4 sm:-top-5 sm:-left-6 z-20 levitate-badge-1">
            {floatingBadge1}
          </div>
        )}

        {/* Levitating Badge 2 — bottom-right corner */}
        {floatingBadge2 && (
          <div className="hero-anim-float absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-6 z-20 levitate-badge-2">
            {floatingBadge2}
          </div>
        )}

        {/* ── Aurora Glow Card ── rotating conic-gradient border ────────────── */}
        <div className="aurora-card-wrapper hero-anim-photo relative rounded-2xl">
          <div className="relative overflow-hidden rounded-2xl bg-card shadow-soft">
            <img
              src={currentPhoto}
              alt={name || "Gopal Maddheshiya"}
              onError={() => setCurrentPhoto(defaultProfilePhoto)}
              width={420}
              height={500}
              className="w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 lg:w-[21rem] lg:h-[25rem] object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105 pointer-events-none"
            />

            {/* Bottom overlay with dark scrim gradient */}
            <div className="hero-anim-photo-name absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 sm:p-5 text-left pointer-events-none">
              <p className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {name}
              </p>
              <p className="mt-1 text-xs text-zinc-300 leading-snug">{subtitle}</p>
            </div>

            {/* Dynamic Specular Glass Sheen reacting to swing angle */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-15 mix-blend-overlay transition-opacity duration-300"
              style={{
                background: `linear-gradient(${115 + (cardRotateDeg % 360) * 0.8}deg, transparent ${sheenShiftPercent - 30}%, rgba(255,255,255,0.7) ${sheenShiftPercent}%, transparent ${sheenShiftPercent + 30}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HangingIdCard;
