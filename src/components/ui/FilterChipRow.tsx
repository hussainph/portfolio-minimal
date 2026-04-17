"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  parseTagsQuery,
  serializeTagsQuery,
  toggleTagInList,
} from "@/lib/tagParams";
import { Tag } from "./Tag";

interface FilterChipRowProps {
  /** The tag pool to show as chips — usually derived from feed content. */
  tags: string[];
  className?: string;
}

/**
 * Sticky row of filter chips pinned above the feed. Multi-select, AND logic:
 * clicking a chip toggles it into/out of the `?tags=a,b,c` csv. Active chips
 * render in their selected state; clicking an active chip removes it from the
 * set (so the last click clears the filter entirely).
 *
 * `useSearchParams` forces dynamic rendering in Next 16 unless wrapped in
 * `<Suspense>` — we wrap here so callers don't have to remember.
 */
function FilterChipRowInner({ tags, className }: FilterChipRowProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const activeTags = parseTagsQuery(
    [params.get("tags"), params.get("tag")].filter(Boolean) as string[],
  );
  const activeSet = new Set(activeTags);

  return (
    <div
      className={cn(
        "sticky top-0 z-20 -mx-5 flex flex-wrap items-center gap-2 border-b border-border/60 bg-background/80 px-5 py-3 backdrop-blur-[8px] sm:-mx-8 sm:px-8 md:-mx-12 md:px-12",
        className,
      )}
      aria-label="Filter by tag"
    >
      <span className="font-mono text-[10px] leading-3 tracking-[0.08em] uppercase text-faint">
        filter
      </span>
      {tags.map((t) => {
        const isActive = activeSet.has(t);
        const nextTags = toggleTagInList(activeTags, t);
        const suffix = serializeTagsQuery(nextTags);
        const href = suffix ? `${pathname}${suffix}` : pathname;
        return (
          <Tag
            key={t}
            as="link"
            name={t}
            href={href}
            state={isActive ? "active" : "default"}
          >
            #{t}
          </Tag>
        );
      })}
    </div>
  );
}

export function FilterChipRow(props: FilterChipRowProps) {
  return (
    <Suspense fallback={<FilterChipRowSkeleton className={props.className} />}>
      <FilterChipRowInner {...props} />
    </Suspense>
  );
}

/**
 * Reserves the row height while useSearchParams suspends so the feed below
 * doesn't jump on first paint. Matches the inner row's padding + border.
 * Forwards className so callers can override the viewport-edge bleed (e.g.
 * neutralizing the negative margins inside a column layout).
 */
function FilterChipRowSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "sticky top-0 z-20 -mx-5 flex h-[44px] items-center border-b border-border/60 bg-background/80 px-5 py-3 backdrop-blur-[8px] sm:-mx-8 sm:px-8 md:-mx-12 md:px-12",
        className,
      )}
    />
  );
}
