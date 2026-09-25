import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import defaultProfilePhoto from "@/assets/gopal-profile.jpg";
import { cn } from "@/lib/utils";

// ─── Physics Constants ────────────────────────────────────────────────────────
const DAMPING = 2.4; // Crisp, natural air damping
const GRAVITY = 3600; // Crisp pendulum gravity for realistic snapback
const MASS = 1; // Virtual mass
const PIVOT_OFFSET_Y = 20; // Distance in px from card top edge to stationary wall pin

interface CardPhysicsState {
  angle: number; // Radians from vertical
  vel: number; // Angular velocity (rad/s)
}

export interface HangingIdCardProps {
  photoSrc: string;
  name?: string;
  subtitle?: string;
  className?: string;
  floatingBadge1?: React.ReactNode;
  floatingBadge2?: React.ReactNode;
}

// ─── Stationary Wall Mount Anchor Pin (Fixed to wall, does NOT tilt with card) ──
const WallAnchorPin = React.memo(function WallAnchorPin() {
  return (
    <div
      className="absolute -top-[27px] left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none flex flex-col items-center"
      aria-hidden="true"
    >
      {/* Wall contact shadow cast by mounting pin */}
      <div className="absolute top-1 size-4 rounded-full bg-black/60 blur-[1.5px] -z-10" />

      {/* Heavy-duty metallic mounting pin/bolt head */}
      <div className="size-3.5 sm:size-4 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-900 border border-zinc-300 shadow-[0_2px_5px_rgba(0,0,0,0.6)] flex items-center justify-center">
        {/* Inner chrome ring */}
        <div className="size-2 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 border border-zinc-500/60 flex items-center justify-center shadow-inner">
          {/* Hex screw slot */}
          <div className="size-1 rounded-xs bg-zinc-300/90 shadow-xs" />
        </div>
      </div>
    </div>
  );
});

// ─── Swivel Ring & Metallic Badge Clamp (Rotates with the card) ───────────────
const HangerSwivelClamp = React.memo(function HangerSwivelClamp() {
  return (
    <div
      className="absolute -top-[23px] left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none flex flex-col items-center"
      aria-hidden="true"
    >
      <svg
        width="40"
        height="28"
        viewBox="0 0 40 28"
        className="overflow-visible select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
      >
        <defs>
          {/* Chrome metal finish */}
          <linearGradient id="clampChrome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4f4f5" />
            <stop offset="25%" stopColor="#d4d4d8" />
            <stop offset="50%" stopColor="#a1a1aa" />
            <stop offset="75%" stopColor="#71717a" />
            <stop offset="100%" stopColor="#3f3f46" />
          </linearGradient>

          {/* Stainless steel loop gradient */}
          <linearGradient id="loopSteel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#71717a" />
            <stop offset="50%" stopColor="#f4f4f5" />
            <stop offset="100%" stopColor="#52525b" />
          </linearGradient>

          {/* Nylon strap textured cord */}
          <linearGradient id="strapCord" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="50%" stopColor="#3f3f46" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
        </defs>

        {/* Top Swivel Ring loop connecting to the wall pin */}
        <ellipse
          cx="20"
          cy="4"
          rx="4.5"
          ry="3"
          fill="none"
          stroke="url(#loopSteel)"
          strokeWidth="1.8"
        />

        {/* Swivel eyelet collar */}
        <rect
          x="18"
          y="4.5"
          width="4"
          height="3"
          rx="1"
          fill="url(#clampChrome)"
          stroke="#27272a"
          strokeWidth="0.5"
        />

        {/* Reinforced woven strap connector */}
        <rect x="16" y="7" width="8" height="6.5" rx="1.5" fill="url(#strapCord)" />
        <line
          x1="18"
          y1="7.5"
          x2="18"
          y2="13"
          stroke="#a1a1aa"
          strokeOpacity="0.4"
          strokeWidth="0.6"
          strokeDasharray="1 1"
        />
        <line
          x1="22"
          y1="7.5"
          x2="22"
          y2="13"
          stroke="#a1a1aa"
          strokeOpacity="0.4"
          strokeWidth="0.6"
          strokeDasharray="1 1"
        />

        {/* Heavy-duty metallic badge clamp bracket */}
        <rect
          x="7"
          y="13"
          width="26"
          height="10"
          rx="2"
          fill="url(#clampChrome)"
          stroke="#27272a"
          strokeWidth="0.6"
        />

        {/* Clamp horizontal grip ridge */}
        <line
          x1="8"
          y1="17.5"
          x2="32"
          y2="17.5"
          stroke="#27272a"
          strokeWidth="0.6"
          strokeOpacity="0.7"
        />
        <line
          x1="8"
          y1="18.5"
          x2="32"
          y2="18.5"
          stroke="#ffffff"
          strokeWidth="0.5"
          strokeOpacity="0.6"
        />

        {/* Dual chrome rivets */}
        <circle cx="11.5" cy="17.5" r="1.3" fill="#ffffff" stroke="#52525b" strokeWidth="0.5" />
        <circle cx="28.5" cy="17.5" r="1.3" fill="#ffffff" stroke="#52525b" strokeWidth="0.5" />

        {/* Clamp jaw lip wrapping firmly over the card's top edge */}
        <rect
          x="12"
          y="22"
          width="16"
          height="5.5"
          rx="1"
          fill="#27272a"
          stroke="#18181b"
          strokeWidth="0.6"
        />
        <line
          x1="13"
          y1="25.5"
          x2="27"
          y2="25.5"
          stroke="#71717a"
          strokeWidth="0.5"
          strokeOpacity="0.8"
        />
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
  const shadowRef = useRef<HTMLDivElement>(null);

  const physRef = useRef<CardPhysicsState>({
    angle: 0,
    vel: 0,
  });
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const prevAngleRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  const [currentPhoto, setCurrentPhoto] = useState(photoSrc || defaultProfilePhoto);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

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

  // Listen for the initial refresh swing CSS animation to finish naturally without abrupt timer cuts
  const handleAnimationEnd = useCallback((e: React.AnimationEvent) => {
    if (e.animationName === "hanging-card-refresh") {
      setIsSettled(true);
      if (cardRef.current) {
        cardRef.current.style.transform = "rotate(0deg) rotateY(0deg) rotateX(0deg)";
      }
      if (shadowRef.current) {
        shadowRef.current.style.transform = "translateX(0px) scale(1)";
        shadowRef.current.style.opacity = "0.5";
      }
    }
  }, []);

  // Reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    return (
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // ── High-Performance Zero-Latency Direct DOM Transform (120 FPS, No React State Lag) ──
  const applyTransform = useCallback((rad: number, tiltXDeg = 0, tiltYDeg = 0) => {
    if (!cardRef.current) return;
    const deg = rad * (180 / Math.PI);
    const y3d = Math.sin(rad) * 6 + tiltYDeg;
    const x3d = (Math.cos(rad) - 1) * 3 + tiltXDeg;

    cardRef.current.style.transform = `rotate(${deg}deg) rotateY(${y3d}deg) rotateX(${x3d}deg)`;

    if (shadowRef.current) {
      const shadowX = -Math.sin(rad) * 28;
      const scale = 1 - Math.abs(Math.sin(rad)) * 0.04;
      shadowRef.current.style.transform = `translateX(${shadowX}px) scale(${scale})`;
      shadowRef.current.style.opacity = `${Math.max(0.2, 0.45 - Math.abs(Math.sin(rad)) * 0.15)}`;
    }
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

  // ── Physics Loop (Active ONLY during manual drag/click interaction) ───────────
  const tick = useCallback(
    (now: number) => {
      if (prefersReducedMotion) {
        applyTransform(0);
        return;
      }

      if (prevTimeRef.current === null) {
        prevTimeRef.current = now;
      }
      const dt = Math.min((now - prevTimeRef.current) / 1000, 0.032);
      prevTimeRef.current = now;

      const s = physRef.current;

      if (!isDraggingRef.current) {
        const L = 160;
        // Crisp pendulum equation: torque = - (g / L) * sin(theta) - (damping / m) * vel
        const torque = -(GRAVITY / L) * Math.sin(s.angle) - (DAMPING / MASS) * s.vel;

        s.vel += torque * dt;
        s.angle += s.vel * dt;

        applyTransform(s.angle);

        // When physics dampens to near zero, lock cleanly to rest at 0°!
        const normalizedSin = Math.sin(s.angle);
        if (Math.abs(s.vel) < 0.02 && Math.abs(normalizedSin) < 0.02) {
          s.angle = 0;
          s.vel = 0;
          applyTransform(0);
          rafRef.current = null;
        } else {
          rafRef.current = requestAnimationFrame(tick);
        }
      } else {
        if (dt > 0) {
          s.vel = (s.angle - prevAngleRef.current) / dt;
        }
        prevAngleRef.current = s.angle;
        applyTransform(s.angle);
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [prefersReducedMotion, applyTransform],
  );

  const startPhysics = useCallback(() => {
    if (prefersReducedMotion) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    prevTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick, prefersReducedMotion]);

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

      if (!isTouch) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Safe fallback
        }
        setHasInteracted(true);
        setIsSettled(true);
        isDraggingRef.current = true;
        setIsDragging(true);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        prevTimeRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [tick, getPivotPos],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isTouchScrolling.current) return;
      const isTouch = e.pointerType === "touch";

      if (isTouch && !dragLocked.current) {
        if (!touchStartPos.current) return;
        const deltaX = Math.abs(e.clientX - touchStartPos.current.x);
        const deltaY = Math.abs(e.clientY - touchStartPos.current.y);

        if (deltaX < 8 && deltaY < 8) return;

        if (deltaY > deltaX) {
          isTouchScrolling.current = true;
          return;
        } else {
          dragLocked.current = true;
          setHasInteracted(true);
          setIsSettled(true);
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
      const currentPointerAngle = Math.atan2(-dx, dy);

      let delta = currentPointerAngle - prevPointerAngle.current;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      prevPointerAngle.current = currentPointerAngle;
      physRef.current.angle += delta;

      // Direct synchronous DOM update for ZERO drag latency!
      applyTransform(physRef.current.angle);
    },
    [applyTransform],
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
    [startPhysics],
  );

  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't interrupt the initial refresh swing unless user clicks or drags!
      if (!isSettled && !hasInteracted) return;
      if (isDraggingRef.current || !cardRef.current || rafRef.current !== null) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) / (rect.width / 2);
      const offsetY = (e.clientY - centerY) / (rect.height / 2);

      const tiltY = Math.max(-5, Math.min(5, offsetX * 5));
      const tiltX = Math.max(-5, Math.min(5, -offsetY * 5));

      applyTransform(physRef.current.angle, tiltX, tiltY);

      if (Math.abs(e.movementX) > 5) {
        physRef.current.vel += e.movementX > 0 ? 0.07 : -0.07;
      }
    },
    [applyTransform],
  );

  const handleCardMouseLeave = useCallback(() => {
    if (rafRef.current === null && !isDraggingRef.current) {
      applyTransform(physRef.current.angle, 0, 0);
    }
  }, [applyTransform]);

  // Click / Tap impulse: swings playfully on click and settles to rest
  const handleClick = useCallback(() => {
    if (isDraggingRef.current || isTouchScrolling.current) return;
    setHasInteracted(true);
    setIsSettled(true);
    const dir = Math.sin(physRef.current.angle) >= 0 ? -1 : 1;
    physRef.current.vel = dir * 4.2;
    startPhysics();
  }, [startPhysics]);

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ touchAction: "pan-y", perspective: "1200px" }}
    >
      {/* ── Stationary Wall Mount Anchor Pin (Does NOT tilt or rotate) ──────── */}
      <WallAnchorPin />

      {/* ── Dynamic Reactive Wall Contact Shadow ────────────────────────────── */}
      <div
        ref={shadowRef}
        className={cn(
          "pointer-events-none absolute -inset-3 rounded-3xl bg-black/30 dark:bg-black/55 blur-xl -z-10",
          !hasInteracted && !isSettled && "hanging-shadow-on-load",
        )}
        aria-hidden="true"
      />

      {/* ── The Swinging Assembly (Attached Badges + Clamp + ID Badge Card) ── */}
      <div
        ref={cardRef}
        className={cn(
          "relative",
          !hasInteracted && !isSettled && "hanging-card-on-load",
          isDragging ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing",
        )}
        onAnimationEnd={handleAnimationEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        onClick={handleClick}
        style={{
          transformOrigin: `50% -${PIVOT_OFFSET_Y}px`,
          transformStyle: "preserve-3d",
          touchAction: "pan-y",
          willChange: "transform",
        }}
        title="Drag to rotate or click to swing"
      >
        {/* Swivel Ring & Clamp (rotates precisely beneath the stationary wall pin) */}
        <HangerSwivelClamp />

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
            {/* Clean Photo: 100% visible, no dark bars or strips */}
            <img
              src={currentPhoto}
              alt={name || "Gopal Maddheshiya"}
              onError={() => setCurrentPhoto(defaultProfilePhoto)}
              width={420}
              height={500}
              className="w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 lg:w-[21rem] lg:h-[25rem] object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105 pointer-events-none"
            />
          </div>
        </div>

        {/* Subtle interactive hint cue on desktop */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none hidden sm:block whitespace-nowrap z-20">
          <span className="rounded-full bg-card/90 dark:bg-card/90 border border-border/80 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground shadow-xs backdrop-blur-md">
            ✦ Click or drag to swing
          </span>
        </div>
      </div>
    </div>
  );
}

export default HangingIdCard;


