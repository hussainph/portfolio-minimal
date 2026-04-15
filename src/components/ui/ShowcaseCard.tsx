"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { GLOW_NEUTRAL_BASE, tileGlow } from "@/lib/tagGlow";
import { Tag } from "./Tag";
import { Meta } from "./Meta";
import { Label } from "./Label";
import { Icon } from "./Icon";
import { StatusChip } from "./StatusChip";
import type { PostStatus } from "./types";

export interface ShowcaseImage {
  /** Bottom-right (single) or bottom-left (multi) caption inside the tile. */
  caption: string;
  /** Marks a tile as the chosen variant — border + caption pick up the first tag's color. */
  picked?: boolean;
}

interface ShowcaseCardProps {
  tags: string[];
  timestamp: string;
  body: string;
  images: ShowcaseImage[];
  href?: string;
  engagement?: { replies?: number; likes?: number };
  status?: PostStatus;
  className?: string;
}

export function ShowcaseCard({
  tags,
  timestamp,
  body,
  images,
  href = "#",
  engagement = {},
  status = "shipped",
  className,
}: ShowcaseCardProps) {
  const router = useRouter();
  const primaryTag = tags[0] ?? "building";
  const onFilterClick = (name: string) =>
    router.replace(`?tag=${encodeURIComponent(name)}`, { scroll: false });

  return (
    <article
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3.5 rounded-card border border-border bg-surface p-5 transition-colors duration-200",
        "hover:bg-elevated hover:border-border-hover",
        status === "thinking" && "border-dashed",
        className,
      )}
    >
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
        <Link
          href={href}
          className="text-inherit no-underline before:absolute before:inset-0 before:content-[''] before:rounded-[inherit]"
        >
          <Meta>· {timestamp}</Meta>
        </Link>
      </div>

      <p
        className={cn(
          "font-sans text-[15px] leading-[25px] tracking-[-0.03em] text-text",
          status === "parked" && "opacity-70",
        )}
      >
        {body}
      </p>

      <div className={cn(status === "parked" && "opacity-70")}>
        {images.length === 1 ? (
          <SingleTile image={images[0]!} primaryTag={primaryTag} />
        ) : (
          <EqualTiles images={images} primaryTag={primaryTag} />
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-5 text-faint",
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
        <Icon name="bookmark" />
      </div>
    </article>
  );
}

function SingleTile({
  image,
  primaryTag,
}: {
  image: ShowcaseImage;
  primaryTag: string;
}) {
  return (
    <div
      className={cn(
        "relative h-60 w-full overflow-hidden rounded-[3px] border border-border bg-gradient-to-br",
        GLOW_NEUTRAL_BASE,
      )}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: tileGlow(primaryTag, "strong") }}
      />
      <div className="absolute bottom-3 right-3">
        <Label tone="faint" size="xs">
          {image.caption}
        </Label>
      </div>
    </div>
  );
}

function EqualTiles({
  images,
  primaryTag,
}: {
  images: ShowcaseImage[];
  primaryTag: string;
}) {
  const pickedColor = tagColor(primaryTag);
  return (
    <div className="flex gap-1.5">
      {images.map((image, idx) => (
        <div
          key={idx}
          className={cn(
            "relative aspect-square flex-1 overflow-hidden rounded-[3px] border bg-gradient-to-br",
            GLOW_NEUTRAL_BASE,
            image.picked ? "border-transparent" : "border-border",
          )}
          style={image.picked ? { borderColor: pickedColor } : undefined}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: tileGlow(
                primaryTag,
                image.picked ? "strong" : "weak",
              ),
            }}
          />
          <div className="absolute bottom-2 left-2">
            <span
              className={cn(
                "font-mono text-[9px] leading-3 tracking-[0.05em]",
                image.picked ? "font-bold" : "text-faint",
              )}
              style={image.picked ? { color: pickedColor } : undefined}
            >
              {image.caption}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
