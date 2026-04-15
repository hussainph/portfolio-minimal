"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { useTagFilterToggle } from "@/lib/useTagFilterToggle";
import { Tag } from "./Tag";
import { Meta } from "./Meta";
import { Icon } from "./Icon";

interface NoteCardProps {
  tags: string[];
  timestamp: string;
  body: string;
  href?: string;
  engagement?: { replies?: number; likes?: number };
  className?: string;
}

export function NoteCard({
  tags,
  timestamp,
  body,
  href = "#",
  engagement = {},
  className,
}: NoteCardProps) {
  const stripeColor = tagColor(tags[0] ?? "building");
  const onFilterClick = useTagFilterToggle();

  return (
    <article
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3 rounded-card border bg-surface border-border pt-5 pb-4 px-5 transition-colors duration-200",
        "hover:bg-surface-hover hover:border-border-hover",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ backgroundColor: stripeColor }}
      />

      <div className="flex items-center gap-2">
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
        <Link
          href={href}
          className="text-inherit no-underline before:absolute before:inset-0 before:content-[''] before:rounded-[inherit]"
        >
          <Meta>· {timestamp}</Meta>
        </Link>
      </div>

      <p className="font-sans text-[15px] leading-[25px] tracking-[-0.03em] text-text">
        {body}
      </p>

      <div className="mt-1 flex items-center gap-5 text-faint transition-colors duration-200 group-hover:text-muted">
        {engagement.replies !== undefined ? (
          <span className="flex items-center gap-1.5">
            <Icon name="reply" />
            <span className="font-mono text-[11px] leading-[14px]">
              {engagement.replies}
            </span>
          </span>
        ) : null}
        {engagement.likes !== undefined ? (
          <span className="flex items-center gap-1.5">
            <Icon name="like" />
            <span className="font-mono text-[11px] leading-[14px]">
              {engagement.likes}
            </span>
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Save"
          className="relative z-10 hover:text-text"
        >
          <Icon name="bookmark" />
        </button>
        <button
          type="button"
          aria-label="Share"
          className="relative z-10 hover:text-text"
        >
          <Icon name="share" />
        </button>
      </div>
    </article>
  );
}
