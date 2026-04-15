"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { useTagFilterToggle } from "@/lib/useTagFilterToggle";
import { GLOW_NEUTRAL_BASE, tileGlow } from "@/lib/tagGlow";
import { Tag } from "./Tag";
import { Meta } from "./Meta";
import { Icon } from "./Icon";
import type { ShowcaseImage } from "./ShowcaseCard";

interface BentoShowcaseProps {
  tags: string[];
  timestamp: string;
  body: string;
  /** Exactly three tiles — a picked featured tile + two stacked alternates. */
  images: [ShowcaseImage, ShowcaseImage, ShowcaseImage];
  href?: string;
  engagement?: { replies?: number; likes?: number };
  className?: string;
}

/**
 * Asymmetric v4 bento: one featured tile (55%) + two stacked alternates (45%)
 * at a fixed 280px height. The featured tile is whichever image has
 * `picked: true`, otherwise the first image. Glow hues derive from the
 * primary tag via `tileGlow()`; no per-image color choices to maintain.
 */
export function BentoShowcase({
  tags,
  timestamp,
  body,
  images,
  href = "#",
  engagement = {},
  className,
}: BentoShowcaseProps) {
  const primaryTag = tags[0] ?? "building";
  const accentColor = tagColor(primaryTag);
  const onFilterClick = useTagFilterToggle();

  const pickedIdx = images.findIndex((image) => image.picked);
  const featuredIdx = pickedIdx === -1 ? 0 : pickedIdx;
  const featured = images[featuredIdx]!;
  const alts = images.filter((_, idx) => idx !== featuredIdx);

  return (
    <article
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3.5 rounded-panel border border-[#1a1a1d] bg-sunken p-5 transition-colors duration-200",
        "hover:bg-sunken-hover hover:border-border-hover",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
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

      <p className="font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-[#e8e1d4]">
        {body}
      </p>

      <div className="flex h-[280px] gap-2">
        <FeaturedTile
          image={featured}
          primaryTag={primaryTag}
          accentColor={accentColor}
        />
        <div className="flex grow flex-col gap-2">
          {alts.map((image, idx) => (
            <AltTile key={idx} image={image} primaryTag={primaryTag} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-[18px] pt-0.5 text-faint">
        {engagement.replies !== undefined ? (
          <span className="flex items-center gap-1.5">
            <Icon name="reply" size={14} />
            <span className="font-mono text-[11px] leading-[14px]">
              {engagement.replies}
            </span>
          </span>
        ) : null}
        {engagement.likes !== undefined ? (
          <span className="flex items-center gap-1.5">
            <Icon name="like" size={14} />
            <span className="font-mono text-[11px] leading-[14px]">
              {engagement.likes}
            </span>
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Save"
          className="relative z-10 flex items-center gap-1 hover:text-muted"
        >
          <Icon name="bookmark" size={14} />
        </button>
      </div>
    </article>
  );
}

function FeaturedTile({
  image,
  primaryTag,
  accentColor,
}: {
  image: ShowcaseImage;
  primaryTag: string;
  accentColor: string;
}) {
  return (
    <div
      className={cn(
        "relative grow-[1.1] overflow-hidden rounded-panel border border-[#1a1a1d] bg-gradient-to-br",
        GLOW_NEUTRAL_BASE,
      )}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: tileGlow(primaryTag, "strong") }}
      />
      <span
        className="absolute top-2.5 left-3 font-mono text-[10px] leading-3 tracking-[0.06em] uppercase"
        style={{ color: accentColor }}
      >
        {image.caption}
      </span>
      <span className="absolute bottom-2.5 left-3 font-mono text-[10px] leading-3 tracking-[0.04em] uppercase text-faint">
        FEATURED
      </span>
    </div>
  );
}

function AltTile({
  image,
  primaryTag,
}: {
  image: ShowcaseImage;
  primaryTag: string;
}) {
  return (
    <div
      className={cn(
        "relative grow overflow-hidden rounded-panel border border-[#1a1a1d] bg-gradient-to-br",
        GLOW_NEUTRAL_BASE,
      )}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: tileGlow(primaryTag, "weak") }}
      />
      <span className="absolute top-2.5 left-3 font-mono text-[10px] leading-3 tracking-[0.06em] uppercase text-muted">
        {image.caption}
      </span>
    </div>
  );
}
