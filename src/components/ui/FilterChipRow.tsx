"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tag } from "./Tag";

interface FilterChipRowProps {
  /** The tag pool to show as chips — usually derived from feed content. */
  tags: string[];
  className?: string;
}

/**
 * Sticky row of filter chips pinned above the feed. Each chip is a
 * `<Tag as="link">` that navigates to `?tag={name}`; clicking the active
 * chip links back to the bare pathname, clearing the filter.
 *
 * `useSearchParams` forces dynamic rendering in Next 16 unless wrapped in
 * `<Suspense>` — we wrap here so callers don't have to remember.
 */
function FilterChipRowInner({ tags, className }: FilterChipRowProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const activeTag = params.get("tag");

  return (
    <div
      className={cn(
        "sticky top-0 z-20 -mx-12 flex flex-wrap items-center gap-2 border-b border-border/60 bg-background/80 py-3 px-12 backdrop-blur-[8px]",
        className,
      )}
      aria-label="Filter by tag"
    >
      <span className="font-mono text-[10px] leading-3 tracking-[0.08em] uppercase text-faint">
        filter
      </span>
      {tags.map((t) => {
        const isActive = t === activeTag;
        const href = isActive
          ? pathname
          : `${pathname}?tag=${encodeURIComponent(t)}`;
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
    <Suspense fallback={null}>
      <FilterChipRowInner {...props} />
    </Suspense>
  );
}
