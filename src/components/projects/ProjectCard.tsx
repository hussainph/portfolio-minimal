"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { Icon } from "@/components/ui/Icon";
import { Meta } from "@/components/ui/Meta";
import { Tag } from "@/components/ui/Tag";

interface ProjectCardProps {
  slug: string;
  tags: string[];
  title: string;
  subtitle: string;
  /** Optional short status line (e.g. "v0.4 · in progress"). Falls back to nothing. */
  status?: string;
  /** Optional CTA nudge, e.g. "See the thread". Defaults to "Open project". */
  ctaLabel?: string;
  className?: string;
}

/**
 * Mid-weight project card for the `smaller` tier. Smaller than `ProjectHero`,
 * bigger than `ProjectChip`. Renders tags, serif title, muted subtitle, a small
 * status meta row, and a CTA nudge. The whole card is clickable via a
 * pseudo-element overlay so inner tag chips stay independently interactive —
 * the same pattern `NoteCard` and `BlogPostCard` use.
 */
export function ProjectCard({
  slug,
  tags,
  title,
  subtitle,
  status,
  ctaLabel = "Open project",
  className,
}: ProjectCardProps) {
  const router = useRouter();
  const stripeColor = tagColor(tags[0] ?? "building");
  const onFilterClick = (name: string) =>
    router.replace(`?tag=${encodeURIComponent(name)}`, { scroll: false });

  return (
    <article
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3.5 rounded-card border bg-surface border-border p-7 transition-colors duration-200",
        "hover:bg-surface-hover hover:border-border-hover",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-card opacity-0 transition-opacity duration-200 group-hover:opacity-100"
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

      <h3 className="font-serif text-[26px] leading-[32px] tracking-[-0.015em] text-text">
        <Link
          href={`/projects/${slug}`}
          className="text-inherit no-underline before:absolute before:inset-0 before:content-[''] before:rounded-[inherit]"
        >
          {title}
        </Link>
      </h3>

      <p className="font-sans text-[15px] leading-6 tracking-[-0.03em] text-muted transition-colors duration-200 group-hover:text-body">
        {subtitle}
      </p>

      <div className="mt-1 flex items-center justify-end gap-1.5 text-muted transition-[color,gap] duration-200 group-hover:gap-2.5 group-hover:text-accent-orange">
        <span className="font-sans text-[13px] leading-4 tracking-[-0.03em]">
          {ctaLabel}
        </span>
        <Icon
          name="arrow-right"
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </div>
    </article>
  );
}
