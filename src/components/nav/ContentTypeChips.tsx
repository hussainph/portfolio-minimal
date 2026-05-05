"use client";

import { cn } from "@/lib/utils";
import type { ContentKind } from "./types";

interface ContentTypeChipsProps {
  selected: Set<ContentKind>;
  onToggle: (k: ContentKind) => void;
  size?: "sm" | "md";
  className?: string;
}

export const CONTENT_KINDS: { id: ContentKind; label: string; plural: string }[] = [
  { id: "note", label: "note", plural: "notes" },
  { id: "post", label: "writing", plural: "writing" },
  { id: "showcase", label: "showcase", plural: "showcases" },
];

const KIND_GLYPH: Record<ContentKind, string> = {
  note: "·",
  post: "¶",
  showcase: "◰",
};

export function ContentTypeChips({
  selected,
  onToggle,
  size = "sm",
  className,
}: ContentTypeChipsProps) {
  const empty = selected.size === 0;
  return (
    <div
      role="group"
      aria-label="Content type filter"
      className={cn("flex items-center gap-1", className)}
    >
      {CONTENT_KINDS.map((k) => {
        // When no selection, treat "all" as implicit — everything is visible.
        const active = selected.has(k.id);
        return (
          <button
            key={k.id}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(k.id)}
            className={cn(
              "group/chip inline-flex items-center gap-1.5 rounded-pill border transition-colors duration-150",
              size === "sm"
                ? "px-2.5 py-1 font-mono text-[11px] leading-[14px] tracking-[0.02em]"
                : "px-3 py-1.5 font-sans text-[12px] leading-[16px] tracking-[-0.02em]",
              active
                ? "border-text/80 bg-text text-background"
                : empty
                  ? "border-border bg-transparent text-muted hover:border-border-hover hover:text-text"
                  : "border-border/50 bg-transparent text-faint hover:border-border hover:text-muted",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "font-mono text-[10px] leading-[10px]",
                active ? "opacity-70" : "opacity-60",
              )}
            >
              {KIND_GLYPH[k.id]}
            </span>
            {k.label}
          </button>
        );
      })}
    </div>
  );
}
