"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { useTagFilterToggle } from "@/lib/useTagFilterToggle";
import { GLOW_NEUTRAL_BASE, tileGlow } from "@/lib/tagGlow";
import { Tag } from "./Tag";
import { Meta } from "./Meta";
import { Label } from "./Label";
import { EngagementButton } from "./EngagementButton";

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
  className?: string;
}

export function ShowcaseCard({
  tags,
  timestamp,
  body,
  images,
  href = "#",
  engagement = {},
  className,
}: ShowcaseCardProps) {
  const primaryTag = tags[0] ?? "building";
  const onFilterClick = useTagFilterToggle();

  return (
    <article
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3.5 rounded-card border border-border bg-surface p-4 transition-colors duration-200 sm:p-5",
        "hover:bg-surface-hover hover:border-border-hover",
        className,
      )}
    >
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

      <p className="font-sans text-[15px] leading-[25px] tracking-[-0.03em] text-text">
        {body}
      </p>

      <div>
        {images.length === 1 ? (
          <SingleTile image={images[0]!} primaryTag={primaryTag} />
        ) : (
          <EqualTiles images={images} primaryTag={primaryTag} />
        )}
      </div>

      <div className="flex items-center gap-3 text-faint sm:gap-4">
        {engagement.replies !== undefined ? (
          <EngagementButton icon="reply" label="Reply" count={engagement.replies} />
        ) : null}
        {engagement.likes !== undefined ? (
          <EngagementButton icon="like" label="Like" count={engagement.likes} />
        ) : null}
        <EngagementButton icon="bookmark" label="Save" />
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
        "relative h-48 w-full overflow-hidden rounded-[3px] border border-border bg-gradient-to-br sm:h-60",
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
