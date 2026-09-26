import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ReorderControlsProps {
  index: number;
  total: number;
  onMove: (index: number, direction: "up" | "down") => void;
  label?: string;
}

export function ReorderControls({ index, total, onMove, label = "item" }: ReorderControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onMove(index, "up")}
        disabled={index === 0}
        title={`Move ${label} up`}
        aria-label={`Move ${label} up`}
        className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:hover:bg-card disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
      >
        <ArrowUp className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index, "down")}
        disabled={index === total - 1}
        title={`Move ${label} down`}
        aria-label={`Move ${label} down`}
        className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:hover:bg-card disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
      >
        <ArrowDown className="size-3.5" />
      </button>
    </div>
  );
}
