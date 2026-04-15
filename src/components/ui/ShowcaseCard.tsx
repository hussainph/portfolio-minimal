import { cn } from "@/lib/utils";
import { Tag, type TagVariant } from "./Tag";
import { Meta } from "./Meta";
import { Label } from "./Label";
import { Icon } from "./Icon";

export interface ShowcaseImage {
  /** Bottom-left caption inside the tile. */
  caption: string;
  /** Color tint of the radial glow. Maps to a tag variant. */
  glow?: "warm" | "cool" | "pink" | "amber";
  /** Square or wide tile aspect. */
  aspect?: "square" | "wide";
  picked?: boolean;
}

interface ShowcaseCardProps {
  tags: TagVariant[];
  timestamp: string;
  body: string;
  images: ShowcaseImage[];
  engagement?: { replies?: number; likes?: number };
  className?: string;
}

const GLOW: Record<NonNullable<ShowcaseImage["glow"]>, string> = {
  warm: "from-[#1f1f22] to-[#161618]",
  cool: "from-[#1d2422] to-[#15191a]",
  pink: "from-[#22191c] to-[#181416]",
  amber: "from-[#22201a] to-[#171614]",
};

const GLOW_OVERLAY: Record<NonNullable<ShowcaseImage["glow"]>, string> = {
  warm: "bg-[radial-gradient(circle_at_30%_40%,rgba(255,184,68,0.18),transparent_55%)]",
  cool: "bg-[radial-gradient(circle_at_50%_50%,rgba(74,224,180,0.22),transparent_60%)]",
  pink: "bg-[radial-gradient(circle_at_60%_60%,rgba(255,122,148,0.16),transparent_60%)]",
  amber: "bg-[radial-gradient(circle_at_30%_40%,rgba(255,204,85,0.16),transparent_55%)]",
};

export function ShowcaseCard({
  tags,
  timestamp,
  body,
  images,
  engagement = {},
  className,
}: ShowcaseCardProps) {
  return (
    <div
      className={cn(
        "relative flex max-w-[600px] flex-col gap-3.5 rounded-card border border-border bg-surface p-5",
        className,
      )}
    >
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

      {images.length === 1 ? (
        <SingleTile image={images[0]!} />
      ) : (
        <BentoTiles images={images} />
      )}

      <div className="flex items-center gap-5 text-faint">
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
    </div>
  );
}

function SingleTile({ image }: { image: ShowcaseImage }) {
  const glow = image.glow ?? "warm";
  return (
    <div
      className={cn(
        "relative h-60 w-full overflow-hidden rounded-[3px] border border-border bg-gradient-to-br",
        GLOW[glow],
      )}
    >
      <div className={cn("absolute inset-0", GLOW_OVERLAY[glow])} />
      <div className="absolute bottom-3 right-3">
        <Label tone="faint" size="xs">
          {image.caption}
        </Label>
      </div>
    </div>
  );
}

function BentoTiles({ images }: { images: ShowcaseImage[] }) {
  return (
    <div className="flex gap-1.5">
      {images.map((image, idx) => (
        <BentoTile key={idx} image={image} />
      ))}
    </div>
  );
}

function BentoTile({ image }: { image: ShowcaseImage }) {
  const glow = image.glow ?? "warm";
  return (
    <div
      className={cn(
        "relative aspect-square flex-1 overflow-hidden rounded-[3px] border bg-gradient-to-br",
        GLOW[glow],
        image.picked ? "border-tag-code" : "border-border",
      )}
    >
      <div className={cn("absolute inset-0", GLOW_OVERLAY[glow])} />
      <div className="absolute bottom-2 left-2">
        <span
          className={cn(
            "font-mono text-[9px] leading-3 tracking-[0.05em]",
            image.picked ? "text-tag-code font-bold" : "text-faint",
          )}
        >
          {image.caption}
        </span>
      </div>
    </div>
  );
}
