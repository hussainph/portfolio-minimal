import { cn } from "@/lib/utils";
import { Tag, type TagVariant } from "./Tag";
import { Meta } from "./Meta";
import { Icon } from "./Icon";

interface NoteCardProps {
  tags: TagVariant[];
  timestamp: string;
  body: string;
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

export function NoteCard({
  tags,
  timestamp,
  body,
  engagement = {},
  className,
}: NoteCardProps) {
  const stripeColor = STRIPE[tags[0] ?? "building"];

  return (
    <div
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3 rounded-card border bg-surface border-border pt-5 pb-4 px-5 transition-colors duration-200",
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
        <Meta>· {timestamp}</Meta>
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
