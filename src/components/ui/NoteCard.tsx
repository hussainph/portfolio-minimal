"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { useTagFilterToggle } from "@/lib/useTagFilterToggle";
import { Tag } from "./Tag";
import { Meta } from "./Meta";
import { EngagementButton } from "./EngagementButton";

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
        "group relative flex max-w-[600px] flex-col gap-3 rounded-card border bg-surface border-border pt-4 pb-3 px-4 transition-colors duration-200 sm:pt-5 sm:pb-4 sm:px-5",
        "hover:bg-surface-hover hover:border-border-hover",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ backgroundColor: stripeColor }}
      />

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
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

      <p className="font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-text sm:text-[15px] sm:leading-[25px]">
        {body}
      </p>

      <div className="mt-1 flex items-center gap-3 text-faint sm:gap-4">
        {engagement.replies !== undefined ? (
          <EngagementButton icon="reply" label="Reply" count={engagement.replies} />
        ) : null}
        {engagement.likes !== undefined ? (
          <EngagementButton icon="like" label="Like" count={engagement.likes} />
        ) : null}
        <EngagementButton icon="bookmark" label="Save" />
        <EngagementButton icon="share" label="Share" />
      </div>
    </article>
  );
}
