"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { useTagFilterToggle } from "@/lib/useTagFilterToggle";
import { Meta } from "@/components/ui/Meta";
import { Tag } from "@/components/ui/Tag";

interface ProjectCardProps {
  slug: string;
  tags: string[];
  title: string;
  /** Optional short status line (e.g. "v0.4 · in progress"). */
  status?: string;
  className?: string;
}

/**
 * Mid-weight grid card for the `smaller` tier. Tag chips + optional status meta
 * on top, serif title below. Overlay-link pseudo so inner tags stay
 * independently interactive — same pattern NoteCard/BlogPostCard use.
 */
export function ProjectCard({
  slug,
  tags,
  title,
  status,
  className,
}: ProjectCardProps) {
  const stripeColor = tagColor(tags[0] ?? "building");
  const onFilterClick = useTagFilterToggle();

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-card border bg-surface border-border p-4 transition-colors duration-200 sm:p-5",
        "hover:bg-surface-hover hover:border-border-hover",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-[2px] rounded-l-card opacity-30 transition-opacity duration-200 group-hover:opacity-80"
        style={{ backgroundColor: stripeColor }}
      />

      <div className="flex flex-wrap items-center gap-2">
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
      </div>

      <h3 className="font-serif text-[20px] leading-[26px] tracking-[-0.015em] text-text sm:text-[24px] sm:leading-[30px]">
        <Link
          href={`/projects/${slug}`}
          className="text-inherit no-underline before:absolute before:inset-0 before:content-[''] before:rounded-[inherit]"
        >
          {title}
        </Link>
      </h3>
    </article>
  );
}
