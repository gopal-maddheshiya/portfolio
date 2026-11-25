import { useCallback, useEffect, useRef, type ReactNode, type RefObject } from "react";

import { pauseSmoothScroll, resumeSmoothScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";

interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  /** Optional inner scrollable element to reset to top whenever modal opens. */
  bodyScrollRef?: RefObject<HTMLElement | null>;
}

/**
 * Shared accessible native `<dialog closedby="any">` wrapper.
 * Handles Lenis scroll pause/resume, `closedby="any"` progressive pointer-outside
 * light-dismiss fallback, and clean top-layer dismissal without body scroll mutation.
 */
export function ModalDialog({
  open,
  onClose,
  labelledBy,
  children,
  className,
  bodyScrollRef,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    pauseSmoothScroll();
    return () => resumeSmoothScroll();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      if (bodyScrollRef?.current) {
        bodyScrollRef.current.scrollTop = 0;
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, bodyScrollRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    let pressedOutside = false;
    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    const handleDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const handleUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener("pointerdown", handleDown);
    dialog.addEventListener("pointerup", handleUp);
    return () => {
      dialog.removeEventListener("pointerdown", handleDown);
      dialog.removeEventListener("pointerup", handleUp);
    };
  }, []);

  const handleNativeClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog) dialog.returnValue = "";
    onClose();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      data-lenis-prevent=""
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby={labelledBy}
      onClose={handleNativeClose}
      className={cn(
        "portfolio-modal-dialog max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-lift p-0",
        className,
      )}
    >
      {children}
    </dialog>
  );
}
