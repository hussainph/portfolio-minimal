"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { Tag } from "./Tag";
import { Meta } from "./Meta";
import { Icon } from "./Icon";
import { StatusChip } from "./StatusChip";
import type { PostStatus } from "./types";

interface NoteCardProps {
  tags: string[];
  timestamp: string;
  body: string;
  engagement?: { replies?: number; likes?: number };
  status?: PostStatus;
  className?: string;
}

export function NoteCard({
  tags,
  timestamp,
  body,
  engagement = {},
  status = "shipped",
  className,
}: NoteCardProps) {
  const router = useRouter();
  const stripeColor = tagColor(tags[0] ?? "building");
  const onFilterClick = (name: string) =>
    router.replace(`?tag=${encodeURIComponent(name)}`, { scroll: false });

  return (
    <div
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3 rounded-card border bg-surface border-border pt-5 pb-4 px-5 transition-colors duration-200",
        "hover:bg-elevated hover:border-border-hover",
        status === "thinking" && "border-dashed",
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
          <Tag key={t} as="filter" name={t} onClick={() => onFilterClick(t)}>
            #{t}
          </Tag>
        ))}
        <StatusChip status={status} />
        <Meta>· {timestamp}</Meta>
      </div>

      <p
        className={cn(
          "font-sans text-[15px] leading-[25px] tracking-[-0.03em] text-text",
          status === "parked" && "opacity-70",
        )}
      >
        {body}
      </p>

      <div
        className={cn(
          "mt-1 flex items-center gap-5 text-faint transition-colors duration-200 group-hover:text-muted",
          status === "parked" && "opacity-70",
        )}
      >
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
        <button type="button" aria-label="Save" className="hover:text-text">
          <Icon name="bookmark" />
        </button>
        <button type="button" aria-label="Share" className="hover:text-text">
          <Icon name="share" />
        </button>
      </div>
    </div>
  );
}
