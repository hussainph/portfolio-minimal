"use client";

import Link from "next/link";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import {
  buildStripeStyle,
  FROSTED_CHROME_CLASSES,
  FROSTED_SURFACE,
} from "@/lib/cardChrome";
import { tagColor } from "@/lib/tagColor";
import { useTagFilterToggle } from "@/lib/useTagFilterToggle";
import { GLOW_NEUTRAL_BASE, tileGlow } from "@/lib/tagGlow";
import { Tag } from "./Tag";
import { Meta } from "./Meta";
import { Label } from "./Label";
import { EngagementButton } from "./EngagementButton";

type TileSlot = "solo" | "equal" | "featured" | "alt";
type Layout = "auto" | "single" | "grid" | "bento";

interface BaseAttachmentProps {
  caption: string;
  picked?: boolean;
  /** Injected by the shell when rendered as a ShowcaseCard child. */
  slot?: TileSlot;
  /** Injected by the shell when rendered as a ShowcaseCard child. */
  primaryTag?: string;
}

interface ImageAttachmentProps extends BaseAttachmentProps {
  src?: string;
  alt?: string;
}

interface VideoAttachmentProps extends BaseAttachmentProps {
  src: string;
  poster?: string;
}

interface CodeAttachmentProps extends BaseAttachmentProps {
  code: string;
  language?: string;
}

interface EmbedAttachmentProps extends BaseAttachmentProps {
  children: ReactNode;
}

interface ShowcaseCardShellProps {
  tags: string[];
  timestamp: string;
  body: string;
  href?: string;
  engagement?: { replies?: number; likes?: number };
  /**
   * Layout strategy. `auto` (default) picks `single` for 1 child, `bento`
   * for 3 children with one `picked`, and `grid` otherwise. Pass an explicit
   * value to override — frontmatter-driven call sites should always pass
   * `variant` through so author intent wins.
   */
  layout?: Layout;
  className?: string;
  children: ReactNode;
}

function resolveLayout(
  explicit: Layout,
  count: number,
  hasPicked: boolean,
): "single" | "grid" | "bento" {
  if (explicit !== "auto") return explicit;
  if (count === 1) return "single";
  if (count === 3 && hasPicked) return "bento";
  return "grid";
}

/**
 * Unified showcase card — one component, three layouts, four attachment
 * kinds. Shell renders the shared chrome (frosted surface, rail, ambient
 * glow, tags + timestamp, body, engagement row); children declare the
 * attachments via the sibling subcomponents (`ShowcaseImage`,
 * `ShowcaseVideo`, `ShowcaseCode`, `ShowcaseEmbed`) — these are sibling
 * named exports rather than `ShowcaseCard.*` statics because static
 * properties don't cross the RSC server/client boundary in Next. Layout
 * auto-picks from child count + `picked` — the `layout` prop is an
 * explicit override.
 *
 * Each subcomponent is a thin shell around `TileFrame`; the parent clones
 * them with a `slot` prop so the same attachment renders differently in a
 * solo/equal/featured/alt context (caption placement, glow intensity,
 * border treatment).
 */
export function ShowcaseCard({
  tags,
  timestamp,
  body,
  href = "#",
  engagement = {},
  layout: layoutProp = "auto",
  className,
  children,
}: ShowcaseCardShellProps) {
  const primaryTag = tags[0] ?? "building";
  const railStyle = buildStripeStyle(tags);
  const onFilterClick = useTagFilterToggle();

  const elements = Children.toArray(children).filter(
    (c): c is ReactElement<BaseAttachmentProps> => isValidElement(c),
  );
  const hasPicked = elements.some((el) => el.props.picked);
  const layout = resolveLayout(layoutProp, elements.length, hasPicked);
  const isBento = layout === "bento";

  return (
    <article
      className={cn(
        "group relative flex max-w-[600px] flex-col gap-3.5 overflow-hidden p-4 transition duration-200 sm:p-5",
        isBento ? "rounded-panel" : "rounded-card",
        FROSTED_CHROME_CLASSES,
        className,
      )}
      style={FROSTED_SURFACE}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-full w-2 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-[0.12]",
          isBento ? "rounded-l-panel" : "rounded-l-card",
        )}
        style={railStyle}
      />
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-[3px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={railStyle}
      />

      <div
        className={cn(
          "flex flex-wrap items-center gap-y-1.5",
          isBento ? "gap-x-2.5" : "gap-x-2",
        )}
      >
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

      <p
        className={cn(
          "font-sans text-[15px] tracking-[-0.03em]",
          isBento
            ? "leading-[22px] text-text-link"
            : "leading-[25px] text-text",
        )}
      >
        {body}
      </p>

      {renderAttachments(layout, elements, primaryTag)}

      <div
        className={cn(
          "flex items-center gap-3 text-faint sm:gap-4",
          isBento && "pt-0.5",
        )}
      >
        {engagement.replies !== undefined ? (
          <EngagementButton
            icon="reply"
            label="Reply"
            count={engagement.replies}
            iconSize={isBento ? 14 : undefined}
          />
        ) : null}
        {engagement.likes !== undefined ? (
          <EngagementButton
            icon="like"
            label="Like"
            count={engagement.likes}
            iconSize={isBento ? 14 : undefined}
          />
        ) : null}
        <EngagementButton
          icon="bookmark"
          label="Save"
          iconSize={isBento ? 14 : undefined}
        />
      </div>
    </article>
  );
}

function renderAttachments(
  layout: "single" | "grid" | "bento",
  elements: ReactElement<BaseAttachmentProps>[],
  primaryTag: string,
): ReactNode {
  if (layout === "single") {
    const first = elements[0];
    if (!first) return null;
    return <div>{cloneElement(first, { slot: "solo", primaryTag })}</div>;
  }

  if (layout === "bento") {
    const pickedIdx = elements.findIndex((el) => el.props.picked);
    const featuredIdx = pickedIdx === -1 ? 0 : pickedIdx;
    const featured = elements[featuredIdx];
    if (!featured) return null;
    const alts = elements.filter((_, idx) => idx !== featuredIdx);
    return (
      <div className="flex h-[220px] gap-2 sm:h-[280px]">
        {cloneElement(featured, { slot: "featured", primaryTag })}
        <div className="flex grow flex-col gap-2">
          {alts.map((el, idx) =>
            cloneElement(el, { key: `alt-${idx}`, slot: "alt", primaryTag }),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1.5">
      {elements.map((el, idx) =>
        cloneElement(el, { key: `eq-${idx}`, slot: "equal", primaryTag }),
      )}
    </div>
  );
}

/**
 * Framed tile shell shared by every attachment kind. Handles the outer
 * border, glow layer, caption overlay, and — for bento featured tiles —
 * the "FEATURED" sublabel. Inner content (image, video, code, embed) is
 * passed as `children` and absolutely positioned over the glow.
 */
function TileFrame({
  slot,
  primaryTag,
  caption,
  picked,
  children,
}: {
  slot: TileSlot;
  primaryTag: string;
  caption: string;
  picked?: boolean;
  children?: ReactNode;
}) {
  const accentColor = tagColor(primaryTag);

  const container = cn(
    "relative overflow-hidden bg-gradient-to-br",
    GLOW_NEUTRAL_BASE,
    slot === "solo" &&
      "h-48 w-full rounded-[3px] border border-border sm:h-60",
    slot === "equal" &&
      cn(
        "aspect-square flex-1 rounded-[3px] border",
        picked ? "border-transparent" : "border-border",
      ),
    slot === "featured" &&
      "grow-[1.1] rounded-panel border border-[#1a1a1d]",
    slot === "alt" && "grow rounded-panel border border-[#1a1a1d]",
  );

  const isEqualPicked = slot === "equal" && picked;
  const glowIntensity =
    slot === "alt" || (slot === "equal" && !picked) ? "weak" : "strong";

  return (
    <div
      className={container}
      style={isEqualPicked ? { borderColor: accentColor } : undefined}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: tileGlow(primaryTag, glowIntensity) }}
      />
      {children}
      <TileCaption
        slot={slot}
        caption={caption}
        picked={picked}
        accentColor={accentColor}
      />
      {slot === "featured" ? (
        <span className="absolute bottom-2.5 left-3 font-mono text-[10px] leading-3 tracking-[0.04em] uppercase text-faint">
          FEATURED
        </span>
      ) : null}
    </div>
  );
}

function TileCaption({
  slot,
  caption,
  picked,
  accentColor,
}: {
  slot: TileSlot;
  caption: string;
  picked?: boolean;
  accentColor: string;
}) {
  if (slot === "solo") {
    return (
      <div className="absolute bottom-3 right-3">
        <Label tone="faint" size="xs">
          {caption}
        </Label>
      </div>
    );
  }
  if (slot === "equal") {
    return (
      <div className="absolute bottom-2 left-2">
        <span
          className={cn(
            "font-mono text-[9px] leading-3 tracking-[0.05em]",
            picked ? "font-bold" : "text-faint",
          )}
          style={picked ? { color: accentColor } : undefined}
        >
          {caption}
        </span>
      </div>
    );
  }
  if (slot === "featured") {
    return (
      <span
        className="absolute top-2.5 left-3 font-mono text-[10px] leading-3 tracking-[0.06em] uppercase"
        style={{ color: accentColor }}
      >
        {caption}
      </span>
    );
  }
  return (
    <span className="absolute top-2.5 left-3 font-mono text-[10px] leading-3 tracking-[0.06em] uppercase text-muted">
      {caption}
    </span>
  );
}

export function ShowcaseImage({
  caption,
  picked,
  slot = "solo",
  primaryTag = "building",
  src,
  alt,
}: ImageAttachmentProps) {
  return (
    <TileFrame
      slot={slot}
      primaryTag={primaryTag}
      caption={caption}
      picked={picked}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? caption}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </TileFrame>
  );
}

export function ShowcaseVideo({
  caption,
  picked,
  slot = "solo",
  primaryTag = "building",
  src,
  poster,
}: VideoAttachmentProps) {
  return (
    <TileFrame
      slot={slot}
      primaryTag={primaryTag}
      caption={caption}
      picked={picked}
    >
      <video
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    </TileFrame>
  );
}

export function ShowcaseCode({
  caption,
  picked,
  slot = "solo",
  primaryTag = "building",
  code,
  language,
}: CodeAttachmentProps) {
  return (
    <TileFrame
      slot={slot}
      primaryTag={primaryTag}
      caption={caption}
      picked={picked}
    >
      <pre className="absolute inset-0 overflow-hidden px-3 pt-7 pb-9 font-mono text-[11px] leading-[16px] text-text/85">
        <code className={language ? `language-${language}` : undefined}>
          {code}
        </code>
      </pre>
    </TileFrame>
  );
}

export function ShowcaseEmbed({
  caption,
  picked,
  slot = "solo",
  primaryTag = "building",
  children,
}: EmbedAttachmentProps) {
  return (
    <TileFrame
      slot={slot}
      primaryTag={primaryTag}
      caption={caption}
      picked={picked}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </TileFrame>
  );
}

