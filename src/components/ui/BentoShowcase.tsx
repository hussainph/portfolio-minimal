"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
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
  engagement?: { replies?: number; likes?: number };
  className?: string;
}

const GLOW_BASE: Record<NonNullable<ShowcaseImage["glow"]>, string> = {
  warm: "from-[#1f1f22] to-[#161618]",
  cool: "from-[#1d2422] to-[#15191a]",
  pink: "from-[#22191c] to-[#181416]",
  amber: "from-[#22201a] to-[#171614]",
};

const GLOW_OVERLAY_STRONG: Record<
  NonNullable<ShowcaseImage["glow"]>,
  string
> = {
  warm: "bg-[radial-gradient(circle_at_40%_45%,rgba(255,184,68,0.22),transparent_60%)]",
  cool: "bg-[radial-gradient(circle_at_40%_45%,rgba(74,224,180,0.26),transparent_60%)]",
  pink: "bg-[radial-gradient(circle_at_40%_45%,rgba(255,122,148,0.22),transparent_60%)]",
  amber: "bg-[radial-gradient(circle_at_40%_45%,rgba(255,204,85,0.22),transparent_60%)]",
};

const GLOW_OVERLAY_WEAK: Record<
  NonNullable<ShowcaseImage["glow"]>,
  string
> = {
  warm: "bg-[radial-gradient(circle_at_60%_40%,rgba(255,184,68,0.12),transparent_65%)]",
  cool: "bg-[radial-gradient(circle_at_60%_40%,rgba(74,224,180,0.12),transparent_65%)]",
  pink: "bg-[radial-gradient(circle_at_55%_55%,rgba(255,122,148,0.12),transparent_70%)]",
  amber: "bg-[radial-gradient(circle_at_55%_55%,rgba(255,204,85,0.12),transparent_70%)]",
};

/**
 * Asymmetric v4 bento: one featured tile (55%) + two stacked alternates (45%)
 * at a fixed 280px height. The featured tile is whichever image has
 * `picked: true`, otherwise the first image. Tag-colored caption on the
 * featured tile; faint labels on the alts.
 */
export function BentoShowcase({
  tags,
  timestamp,
  body,
  images,
  engagement = {},
  className,
}: BentoShowcaseProps) {
  const router = useRouter();
  const primaryTag = tags[0] ?? "building";
  const accentColor = tagColor(primaryTag);
  const onFilterClick = (name: string) =>
    router.replace(`?tag=${encodeURIComponent(name)}`, { scroll: false });

  const pickedIdx = images.findIndex((image) => image.picked);
  const featuredIdx = pickedIdx === -1 ? 0 : pickedIdx;
  const featured = images[featuredIdx]!;
  const alts = images.filter((_, idx) => idx !== featuredIdx);

  return (
    <div
      className={cn(
        "relative flex max-w-[600px] flex-col gap-3.5 rounded-panel border border-[#1a1a1d] bg-sunken p-5",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        {tags.map((t) => (
          <Tag key={t} as="filter" name={t} onClick={() => onFilterClick(t)}>
            #{t}
          </Tag>
        ))}
        <Meta>· {timestamp}</Meta>
      </div>

      <p className="font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-[#e8e1d4]">
        {body}
      </p>

      <div className="flex h-[280px] gap-2">
        <FeaturedTile image={featured} accentColor={accentColor} />
        <div className="flex grow flex-col gap-2">
          {alts.map((image, idx) => (
            <AltTile key={idx} image={image} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-[18px] pt-0.5 text-faint">
        {engagement.replies !== undefined ? (
          <span className="flex items-center gap-1">
            <span className="font-mono text-[11px] leading-[14px]">↩</span>
            <span className="font-mono text-[11px] leading-[14px]">
              {engagement.replies}
            </span>
          </span>
        ) : null}
        {engagement.likes !== undefined ? (
          <span className="flex items-center gap-1">
            <span className="font-mono text-[11px] leading-[14px]">♡</span>
            <span className="font-mono text-[11px] leading-[14px]">
              {engagement.likes}
            </span>
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Save"
          className="flex items-center gap-1 hover:text-muted"
        >
          <Icon name="bookmark" size={14} />
        </button>
      </div>
    </div>
  );
}

function FeaturedTile({
  image,
  accentColor,
}: {
  image: ShowcaseImage;
  accentColor: string;
}) {
  const glow = image.glow ?? "warm";
  return (
    <div
      className={cn(
        "relative grow-[1.1] overflow-hidden rounded-panel border border-[#1a1a1d] bg-gradient-to-br",
        GLOW_BASE[glow],
      )}
    >
      <div className={cn("absolute inset-0", GLOW_OVERLAY_STRONG[glow])} />
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

function AltTile({ image }: { image: ShowcaseImage }) {
  const glow = image.glow ?? "warm";
  return (
    <div
      className={cn(
        "relative grow overflow-hidden rounded-panel border border-[#1a1a1d] bg-gradient-to-br",
        GLOW_BASE[glow],
      )}
    >
      <div className={cn("absolute inset-0", GLOW_OVERLAY_WEAK[glow])} />
      <span className="absolute top-2.5 left-3 font-mono text-[10px] leading-3 tracking-[0.06em] uppercase text-muted">
        {image.caption}
      </span>
    </div>
  );
}
