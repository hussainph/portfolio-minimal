"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { Tag } from "./Tag";
import { Meta } from "./Meta";
import { Icon } from "./Icon";
import { StatusChip } from "./StatusChip";
import type { PostStatus } from "./types";

interface BlogPostCardProps {
  tags: string[];
  timestamp: string;
  readTime: string;
  title: string;
  excerpt: string;
  href?: string;
  engagement?: { replies?: number; likes?: number };
  status?: PostStatus;
  className?: string;
}

export function BlogPostCard({
  tags,
  timestamp,
  readTime,
  title,
  excerpt,
  href = "#",
  engagement = {},
  status = "shipped",
  className,
}: BlogPostCardProps) {
  const router = useRouter();
  const primaryTag = tags[0] ?? "building";
  const stripeColor = tagColor(primaryTag);
  const onFilterClick = (name: string) =>
    router.replace(`?tag=${encodeURIComponent(name)}`, { scroll: false });

  return (
    <article
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3.5 rounded-card border bg-surface border-border p-7 transition-colors duration-200",
        "hover:bg-surface-hover hover:border-border-hover",
        status === "thinking" && "border-dashed",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-card opacity-0 transition-opacity duration-200 group-hover:opacity-100"
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
        <StatusChip status={status} />
        <Meta>
          · {timestamp} · {readTime}
        </Meta>
      </div>

      <h3
        className={cn(
          "font-serif text-[28px] leading-[34px] tracking-[-0.015em] text-text",
          status === "parked" && "opacity-70",
        )}
      >
        <Link
          href={href}
          className="text-inherit no-underline before:absolute before:inset-0 before:content-[''] before:rounded-[inherit]"
        >
          {title}
        </Link>
      </h3>

      <p
        className={cn(
          "font-sans text-[15px] leading-6 tracking-[-0.03em] text-muted transition-colors duration-200 group-hover:text-body",
          status === "parked" && "opacity-70",
        )}
      >
        {excerpt}
      </p>

      <div
        className={cn(
          "mt-1 flex items-center justify-between",
          status === "parked" && "opacity-70",
        )}
      >
        <div className="flex items-center gap-[18px] text-faint transition-colors duration-200 group-hover:text-muted">
          {engagement.replies !== undefined ? (
            <span className="flex items-center gap-1.5">
              <Icon name="reply" size={14} />
              <span className="font-mono text-[11px] leading-[14px]">
                {engagement.replies}
              </span>
            </span>
          ) : null}
          {engagement.likes !== undefined ? (
            <LikeIndicator count={engagement.likes} tagName={primaryTag} />
          ) : null}
          <Icon name="bookmark" size={14} />
        </div>

        <div className="flex items-center gap-1.5 text-muted transition-[color,gap] duration-200 group-hover:gap-2.5 group-hover:text-accent-orange">
          <span className="font-sans text-[13px] leading-4 tracking-[-0.03em]">
            Read
          </span>
          <Icon
            name="arrow-right"
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </article>
  );
}

function LikeIndicator({ count, tagName }: { count: number; tagName: string }) {
  // Hover color comes from the hash — can't use a static utility class, so
  // swap via CSS custom property at the group level.
  const color = tagColor(tagName);
  return (
    <span
      className="flex items-center gap-1.5 transition-colors duration-200 group-hover:[color:var(--like-hover)]"
      style={{ "--like-hover": color } as React.CSSProperties}
    >
      <Icon name="like" size={14} />
      <span className="font-mono text-[11px] leading-[14px]">{count}</span>
    </span>
  );
}
