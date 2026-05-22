"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { useTagFilterToggle } from "@/lib/useTagFilterToggle";
import { Meta } from "@/components/ui/Meta";
import { Tag } from "@/components/ui/Tag";

interface ProjectChipProps {
  slug: string;
  title: string;
  tags: string[];
  /** Optional status line rendered as Meta under the title. */
  status?: string;
  className?: string;
}

/**
 * Mini-card for the `bitesized` tier. Slots into the same grid as ProjectCard
 * but with tighter padding and a smaller title. Shows the primary tag only —
 * additional tags are reachable from the detail page. Overlay-link pattern
 * keeps the tag chip independently interactive.
 */
export function ProjectChip({
  slug,
  title,
  tags,
  status,
  className,
}: ProjectChipProps) {
  const primaryTag = tags[0];
  const stripeColor = tagColor(primaryTag ?? "building");
  const onFilterClick = useTagFilterToggle();

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-2.5 rounded-card border bg-surface border-border p-3.5 transition-colors duration-200 sm:p-4",
        "hover:bg-surface-hover hover:border-border-hover",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-[2px] rounded-l-card opacity-30 transition-opacity duration-200 group-hover:opacity-80"
        style={{ backgroundColor: stripeColor }}
      />

      {primaryTag ? (
        <div className="flex flex-wrap items-center gap-2">
          <Tag
            as="filter"
            name={primaryTag}
            onClick={() => onFilterClick(primaryTag)}
            className="relative z-10"
          >
            #{primaryTag}
          </Tag>
        </div>
      ) : null}

      <h3 className="font-serif text-[15px] leading-[20px] tracking-[-0.01em] text-text sm:text-[16px] sm:leading-[22px]">
        <Link
          href={`/projects/${slug}`}
          className="text-inherit no-underline before:absolute before:inset-0 before:content-[''] before:rounded-[inherit]"
        >
          {title}
        </Link>
      </h3>

      {status ? <Meta>{status}</Meta> : null}
    </article>
  );
}
