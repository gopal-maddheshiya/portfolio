import React, { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

interface TagListInputProps {
  label?: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
  placeholder?: string;
  helpText?: string;
  badgeColorClass?: string;
}

export function TagListInput({
  label,
  tags = [],
  onChange,
  placeholder = "Add item and press Enter or comma...",
  helpText,
  badgeColorClass = "bg-primary/10 text-primary border-primary/20",
}: TagListInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Handle comma-separated pasted or typed text
    const parts = trimmed
      .split(/[,]+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const nextTags = [...tags];
    for (const part of parts) {
      if (!nextTags.includes(part)) {
        nextTags.push(part);
      }
    }
    onChange(nextTags);
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
          <span className="text-[11px] font-mono text-muted-foreground">
            {tags.length} {tags.length === 1 ? "item" : "items"}
          </span>
        </div>
      )}

      {/* Chips Container */}
      <div className="min-h-[46px] w-full rounded-xl border border-border-strong bg-card p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-2xs flex flex-wrap items-center gap-1.5">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border transition-all ${badgeColorClass}`}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              title={`Remove "${tag}"`}
              className="p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}

        <div className="flex-1 min-w-[160px] flex items-center gap-1.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) {
                addTag(inputValue);
              }
            }}
            placeholder={tags.length === 0 ? placeholder : "Add another..."}
            className="flex-1 bg-transparent px-1.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => addTag(inputValue)}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="size-3" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {helpText && <p className="text-[11px] text-muted-foreground leading-normal">{helpText}</p>}
    </div>
  );
}
