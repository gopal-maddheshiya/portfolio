import React, { useEffect, useState } from "react";
import { Save, RotateCcw, ExternalLink, Sparkles } from "lucide-react";

interface FloatingSaveBarProps {
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export function FloatingSaveBar({ onSave, onReset, isSaving }: FloatingSaveBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 160);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  if (!isScrolled) return null;

  return (
    <aside
      aria-label="Floating quick-save action bar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-[calc(50%+8rem)] lg:left-[calc(50%+9rem)] z-50 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-3 rounded-full border border-border/80 bg-card/90 backdrop-blur-xl px-4 py-2.5 shadow-2xl shadow-black/25 ring-1 ring-border/50">
        <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-border text-xs text-muted-foreground font-medium">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Studio Active</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground border border-border">
            Ctrl+S
          </kbd>
        </div>

        <button
          type="button"
          onClick={onReset}
          title="Reset to local profile defaults"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Preview Site in new tab"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          <ExternalLink className="size-3.5 text-primary" />
          <span className="hidden sm:inline">Preview</span>
        </a>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary/90 px-5 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Save className="size-3.5" />
          )}
          <span>{isSaving ? "Saving Live..." : "Save Live"}</span>
        </button>
      </div>
    </aside>
  );
}
