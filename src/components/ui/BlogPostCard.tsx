"use client";

import Link from "next/link";
import { GrainGradient } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";
import {
  shaderPaletteHover,
  shaderPaletteRest,
} from "@/lib/cardChrome";
import { tagColor } from "@/lib/tagColor";
import { useTagFilterToggle } from "@/lib/useTagFilterToggle";
import { Tag } from "./Tag";
import { Meta } from "./Meta";
import { Icon } from "./Icon";
import { EngagementButton } from "./EngagementButton";

interface BlogPostCardProps {
  tags: string[];
  timestamp: string;
  readTime: string;
  title: string;
  excerpt: string;
  href?: string;
  engagement?: { replies?: number; likes?: number };
  className?: string;
}

/**
 * Long-form feed card. Under the content sits a two-layer `GrainGradient`
 * shader (rest + hover crossfade) whose tag-derived HSL palette provides
 * the primary tag-signal for blog posts — no stripe, no rail. A heavy
 * `backdrop-blur-3xl` pane with a surface-tinted CSS-var alpha diffuses
 * the shader to ambient atmosphere so the serif title and excerpt hold
 * contrast; the alpha thins slightly on hover so the buffed vivid layer
 * peeks through. Title / excerpt / Read CTA carry `text-shadow` halos to
 * keep readability even then. `isolation: isolate` scopes the
 * backdrop-filter to the card so it samples only the shader inside.
 */
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
  const primaryTag = tags[0] ?? "building";
  const onFilterClick = useTagFilterToggle();

  return (
    <article
      className={cn(
        "group relative max-w-[600px] overflow-hidden rounded-card border border-border transition-colors duration-500",
        "hover:border-border-hover",
        "[--overlay-alpha:0.76] hover:[--overlay-alpha:0.70]",
        className,
      )}
      style={{ isolation: "isolate" }}
    >
      {/* Ambient GrainGradient — desaturated, barely moving. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
      >
        <GrainGradient
          colorBack="#141416"
          colors={shaderPaletteRest(tags)}
          softness={0.85}
          intensity={0.5}
          noise={0.42}
          speed={0.025}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Vivid GrainGradient — fades in on hover. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <GrainGradient
          colorBack="#141416"
          colors={shaderPaletteHover(tags)}
          softness={0.8}
          intensity={0.58}
          noise={0.4}
          speed={0.055}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Frosted pane — surface-tinted overlay, thins slightly on hover. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 backdrop-blur-3xl transition-[background-color] duration-500"
        style={{ backgroundColor: "rgba(20, 20, 22, var(--overlay-alpha))" }}
      />

      {/* Content — text-shadow halos protect readability over the shader. */}
      <div className="relative flex flex-col gap-3.5 p-5 sm:p-7">
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
          <Meta className="[text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
            · {timestamp} · {readTime}
          </Meta>
        </div>

        <h3 className="font-serif text-[22px] leading-[28px] tracking-[-0.015em] text-text sm:text-[28px] sm:leading-[34px] [text-shadow:0_1px_12px_rgba(0,0,0,0.65),_0_1px_3px_rgba(0,0,0,0.4)]">
          <Link
            href={href}
            className="text-inherit no-underline before:absolute before:inset-0 before:content-[''] before:rounded-[inherit]"
          >
            {title}
          </Link>
        </h3>

        <p className="font-sans text-[15px] leading-6 tracking-[-0.03em] text-muted transition-colors duration-200 group-hover:text-body [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
          {excerpt}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-3 text-faint sm:gap-4">
            {engagement.replies !== undefined ? (
              <EngagementButton
                icon="reply"
                label="Reply"
                count={engagement.replies}
                iconSize={14}
              />
            ) : null}
            {engagement.likes !== undefined ? (
              <LikeIndicator count={engagement.likes} tagName={primaryTag} />
            ) : null}
            <EngagementButton icon="bookmark" label="Save" iconSize={14} />
          </div>

          <div className="flex items-center gap-1.5 text-muted transition-[color,gap] duration-200 group-hover:gap-2.5 group-hover:text-accent-orange">
            <span className="font-sans text-[13px] leading-4 tracking-[-0.03em] [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
              Read
            </span>
            <Icon
              name="arrow-right"
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </div>
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
    <EngagementButton
      icon="like"
      label="Like"
      count={count}
      iconSize={14}
      className="hover:[color:var(--like-hover)]"
      style={{ "--like-hover": color } as React.CSSProperties}
    />
  );
}
