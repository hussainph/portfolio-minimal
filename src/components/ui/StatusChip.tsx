import { cn } from "@/lib/utils";
import type { PostStatus } from "./types";

interface StatusChipProps {
  status: PostStatus;
  className?: string;
}

/**
 * Signals a post's effort/maturity bucket alongside the tag chips.
 * Shipped posts render nothing — the chip only appears for thinking and
 * parked, so the default case adds no visual weight to the feed.
 */
export function StatusChip({ status, className }: StatusChipProps) {
  if (status === "shipped") return null;

  const base =
    "inline-flex items-center rounded-pill py-1 px-2.5 font-mono text-[10px] leading-3 tracking-[0.08em] uppercase";

  if (status === "thinking") {
    return (
      <span
        className={cn(
          base,
          "border border-dashed border-muted text-muted",
          className,
        )}
        aria-label="Status: thinking"
      >
        thinking
      </span>
    );
  }

  // parked
  return (
    <span
      className={cn(base, "border border-border bg-sunken text-faint", className)}
      aria-label="Status: parked"
    >
      parked
    </span>
  );
}
