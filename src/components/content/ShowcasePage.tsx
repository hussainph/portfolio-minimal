import Link from "next/link";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { Label } from "@/components/ui/Label";
import { Meta } from "@/components/ui/Meta";
import { Tag } from "@/components/ui/Tag";
import { tagColor } from "@/lib/tagColor";
import { GLOW_NEUTRAL_BASE, tileGlow } from "@/lib/tagGlow";
import { cn } from "@/lib/utils";
import { formatFeedTimestamp } from "@/lib/content";
import type { ShowcaseItem } from "@/lib/content";
import type { ShowcaseImage } from "@/lib/content";

interface ShowcasePageProps {
  item: ShowcaseItem;
}

/**
 * Detail page for a `showcase`. Reads as a small reading surface, not a feed
 * card — so the hero tile group is rebuilt locally (using the same `tagGlow`
 * + `tagColor` primitives) instead of dropping a `<ShowcaseCard>` /
 * `<BentoShowcase>` inside, which would carry feed-only chrome
 * (engagement row, hover overlay link, 600px max-width).
 */
export function ShowcasePage({ item }: ShowcasePageProps) {
  const { frontmatter } = item;
  const timestamp = formatFeedTimestamp(frontmatter.published);
  const primaryTag = frontmatter.tags[0] ?? "building";

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-5 pt-10 pb-36 sm:gap-7 sm:px-8 sm:pt-14 sm:pb-44 md:gap-8 md:px-12 md:pt-16 md:pb-48">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>back</span>
        </Link>

        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {frontmatter.tags.map((t) => (
              <Tag key={t} as="display" name={t}>
                #{t}
              </Tag>
            ))}
            <Meta>· {timestamp}</Meta>
          </div>

          {frontmatter.title ? (
            <h2 className="font-serif text-[20px] leading-[28px] tracking-[-0.01em] text-text sm:text-[22px] sm:leading-[30px] md:text-[24px] md:leading-[32px]">
              {frontmatter.title}
            </h2>
          ) : null}
        </header>

        <ShowcaseHero
          variant={frontmatter.variant}
          images={frontmatter.images}
          primaryTag={primaryTag}
        />

        <article className="prose-dark">{item.content}</article>
      </div>

      <BottomToolbar activeTab="stream" />
    </main>
  );
}

interface HeroProps {
  variant: "single" | "grid" | "bento";
  images: ShowcaseImage[];
  primaryTag: string;
}

function ShowcaseHero({ variant, images, primaryTag }: HeroProps) {
  if (variant === "single") {
    const image = images[0];
    if (!image) return null;
    return <SingleHero image={image} primaryTag={primaryTag} />;
  }

  if (variant === "bento" && images.length === 3) {
    return (
      <BentoHero
        images={images as [ShowcaseImage, ShowcaseImage, ShowcaseImage]}
        primaryTag={primaryTag}
      />
    );
  }

  return <GridHero images={images} primaryTag={primaryTag} />;
}

function SingleHero({
  image,
  primaryTag,
}: {
  image: ShowcaseImage;
  primaryTag: string;
}) {
  return (
    <div
      className={cn(
        "relative h-[360px] w-full overflow-hidden rounded-panel border border-border bg-gradient-to-br",
        GLOW_NEUTRAL_BASE,
      )}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: tileGlow(primaryTag, "strong") }}
      />
      <div className="absolute right-3.5 bottom-3.5">
        <Label tone="faint" size="xs">
          {image.caption}
        </Label>
      </div>
    </div>
  );
}

function BentoHero({
  images,
  primaryTag,
}: {
  images: [ShowcaseImage, ShowcaseImage, ShowcaseImage];
  primaryTag: string;
}) {
  const accentColor = tagColor(primaryTag);
  const pickedIdx = images.findIndex((image) => image.picked);
  const featuredIdx = pickedIdx === -1 ? 0 : pickedIdx;
  const featured = images[featuredIdx]!;
  const alts = images.filter((_, idx) => idx !== featuredIdx);

  return (
    <div className="flex h-[340px] gap-2">
      <div
        className={cn(
          "relative grow-[1.1] overflow-hidden rounded-panel border border-border bg-gradient-to-br",
          GLOW_NEUTRAL_BASE,
        )}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: tileGlow(primaryTag, "strong") }}
        />
        <span
          className="absolute top-3 left-3.5 font-mono text-[10px] leading-3 tracking-[0.06em] uppercase"
          style={{ color: accentColor }}
        >
          {featured.caption}
        </span>
        <span className="absolute bottom-3 left-3.5 font-mono text-[10px] leading-3 tracking-[0.04em] uppercase text-faint">
          FEATURED
        </span>
      </div>
      <div className="flex grow flex-col gap-2">
        {alts.map((image, idx) => (
          <div
            key={idx}
            className={cn(
              "relative grow overflow-hidden rounded-panel border border-border bg-gradient-to-br",
              GLOW_NEUTRAL_BASE,
            )}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundImage: tileGlow(primaryTag, "weak") }}
            />
            <span className="absolute top-3 left-3.5 font-mono text-[10px] leading-3 tracking-[0.06em] uppercase text-muted">
              {image.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridHero({
  images,
  primaryTag,
}: {
  images: ShowcaseImage[];
  primaryTag: string;
}) {
  const accentColor = tagColor(primaryTag);
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {images.map((image, idx) => (
        <div
          key={idx}
          className={cn(
            "relative aspect-square overflow-hidden rounded-panel border bg-gradient-to-br",
            GLOW_NEUTRAL_BASE,
            image.picked ? "border-transparent" : "border-border",
          )}
          style={image.picked ? { borderColor: accentColor } : undefined}
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
          <span
            className={cn(
              "absolute bottom-2.5 left-3 font-mono text-[10px] leading-3 tracking-[0.05em] uppercase",
              image.picked ? "font-bold" : "text-faint",
            )}
            style={image.picked ? { color: accentColor } : undefined}
          >
            {image.caption}
          </span>
        </div>
      ))}
    </div>
  );
}
