import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canHoverFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion();
}

interface MagneticWrapProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/** Desktop-only magnetic pointer lift backed by reusable gsap.quickTo setters (zero tween churn). */
export function MagneticWrap({ children, className, strength = 0.25 }: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const quickXRef = useRef<gsap.QuickToFunc | null>(null);
  const quickYRef = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      quickXRef.current = gsap.quickTo(node, "x", { duration: 0.32, ease: "power3.out" });
      quickYRef.current = gsap.quickTo(node, "y", { duration: 0.32, ease: "power3.out" });
    }, ref);

    return () => {
      quickXRef.current = null;
      quickYRef.current = null;
      ctx.revert();
    };
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const node = ref.current;
      if (!node || !quickXRef.current || !quickYRef.current || !canHoverFinePointer()) return;
      const rect = node.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      quickXRef.current(x);
      quickYRef.current(y);
    },
    [strength],
  );

  const handlePointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    if (!canHoverFinePointer()) return;
    gsap.to(node, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}
