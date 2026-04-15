import { cn } from "@/lib/utils";
import { Tag, type TagVariant } from "./Tag";
import { Meta } from "./Meta";
import { Icon } from "./Icon";

interface BlogPostCardProps {
  tags: TagVariant[];
  timestamp: string;
  readTime: string;
  title: string;
  excerpt: string;
  href?: string;
  engagement?: { replies?: number; likes?: number };
  className?: string;
}

const STRIPE: Record<TagVariant, string> = {
  ai: "bg-tag-ai",
  building: "bg-tag-building",
  design: "bg-tag-design",
  thinking: "bg-tag-thinking",
  code: "bg-tag-code",
  reading: "bg-tag-reading",
};

const LIKE_HOVER: Record<TagVariant, string> = {
  ai: "group-hover:text-tag-ai",
  building: "group-hover:text-tag-building",
  design: "group-hover:text-tag-design",
  thinking: "group-hover:text-tag-thinking",
  code: "group-hover:text-tag-code",
  reading: "group-hover:text-tag-reading",
};

export function BlogPostCard({
  tags,
  timestamp,
  readTime,
  title,
  excerpt,
  href = "#",
  engagement = {},
  className,
}: BlogPostCardProps) {
  const stripeColor = STRIPE[tags[0] ?? "building"];
  const likeHover = LIKE_HOVER[tags[0] ?? "design"];

  return (
    <a
      href={href}
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3.5 rounded-card border bg-surface border-border p-7 no-underline transition-colors duration-200",
        "hover:bg-elevated hover:border-[#2e2e32]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 left-0 h-full w-[3px] rounded-l-card opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          stripeColor,
        )}
      />

      <div className="flex items-center gap-2">
        {tags.map((t) => (
          <Tag key={t} variant={t}>
            #{t}
          </Tag>
        ))}
        <Meta>
          · {timestamp} · {readTime}
        </Meta>
      </div>

      <h3 className="font-serif text-[28px] leading-[34px] tracking-[-0.015em] text-text">
        {title}
      </h3>

      <p className="font-sans text-[15px] leading-6 tracking-[-0.03em] text-muted transition-colors duration-200 group-hover:text-[#bfb8ae]">
        {excerpt}
      </p>

      <div className="mt-1 flex items-center justify-between">
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
            <span
              className={cn(
                "flex items-center gap-1.5 transition-colors duration-200",
                likeHover,
              )}
            >
              <Icon name="like" size={14} />
              <span className="font-mono text-[11px] leading-[14px]">
                {engagement.likes}
              </span>
            </span>
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
    </a>
  );
}
