"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  buildStripeStyle,
  FROSTED_CHROME_CLASSES,
  FROSTED_SURFACE,
} from "@/lib/cardChrome";
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
  const railStyle = buildStripeStyle(tags);
  const onFilterClick = useTagFilterToggle();

  return (
    <article
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3 rounded-card pt-4 pb-3 px-4 transition-colors duration-200 sm:pt-5 sm:pb-4 sm:px-5",
        FROSTED_CHROME_CLASSES,
        className,
      )}
      style={FROSTED_SURFACE}
    >
      {/* Ambient glow — wider, blurred sibling; faint bleed into the frosted
          pane on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-full w-2 rounded-l-card opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-[0.12]"
        style={railStyle}
      />
      {/* Crisp rail — solid color for single-tag, animated gradient for multi. */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={railStyle}
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
