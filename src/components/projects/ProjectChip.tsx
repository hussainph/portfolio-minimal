"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { useTagFilterToggle } from "@/lib/useTagFilterToggle";
import { Icon } from "@/components/ui/Icon";
import { Meta } from "@/components/ui/Meta";
import { Tag } from "@/components/ui/Tag";

interface ProjectChipProps {
  slug: string;
  title: string;
  tags: string[];
  /** Optional one-liner appended after the title in muted body copy. */
  subtitle?: string;
  /** Optional status line rendered as Meta after the subtitle. */
  status?: string;
  className?: string;
}

/**
 * Lightweight compact row for the `bitesized` tier. A single-line (~40–52px
 * tall) clickable entry with title, optional one-liner subtitle, tags, and a
 * status meta. Uses the overlay-link pattern so tag chips stay independently
 * clickable while the whole row navigates to `/projects/[slug]`.
 */
export function ProjectChip({
  slug,
  title,
  tags,
  subtitle,
  status,
  className,
}: ProjectChipProps) {
  const stripeColor = tagColor(tags[0] ?? "building");
  const onFilterClick = useTagFilterToggle();

  return (
    <article
      className={cn(
        "group relative flex max-w-[600px] items-center gap-4 rounded-card border bg-surface border-border py-3 pl-5 pr-4 transition-colors duration-200",
        "hover:bg-surface-hover hover:border-border-hover",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-card opacity-40 transition-opacity duration-200 group-hover:opacity-100"
        style={{ backgroundColor: stripeColor }}
      />

      <div className="flex min-w-0 grow items-baseline gap-2">
        <h3 className="shrink-0 font-serif text-[18px] leading-[24px] tracking-[-0.01em] text-text">
          <Link
            href={`/projects/${slug}`}
            className="text-inherit no-underline before:absolute before:inset-0 before:content-[''] before:rounded-[inherit]"
          >
            {title}
          </Link>
        </h3>
        {subtitle ? (
          <span className="min-w-0 truncate font-sans text-[13px] leading-[20px] tracking-[-0.03em] text-muted">
            · {subtitle}
          </span>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {tags.map((t) => (
          <Tag
            key={t}
            as="filter"
            name={t}
            onClick={() => onFilterClick(t)}
            className="relative z-10"
          >
            #{t}
          </Tag>
        ))}
        {status ? <Meta>· {status}</Meta> : null}
        <Icon
          name="arrow-right"
          size={14}
          className="text-faint transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-accent-orange"
        />
      </div>
    </article>
  );
}
