"use client";

import { cn } from "@/lib/utils";
import { PRESS_FEEDBACK } from "@/lib/motion";
import { UI_LABEL, UI_LABEL_SM } from "./typography";
import type { ContentKind } from "./types";

interface ContentTypeChipsProps {
  selected: Set<ContentKind>;
  onToggle: (k: ContentKind) => void;
  size?: "sm" | "md";
  className?: string;
}

export const CONTENT_KINDS: { id: ContentKind; label: string }[] = [
  { id: "note", label: "Note" },
  { id: "post", label: "Writing" },
  { id: "showcase", label: "Showcase" },
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
              "group/chip inline-flex items-center gap-1.5 rounded-pill border",
              PRESS_FEEDBACK,
              size === "sm"
                ? cn("px-2.5 py-1", UI_LABEL_SM)
                : cn("px-3 py-1.5", UI_LABEL),
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
