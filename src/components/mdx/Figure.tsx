import Image from "next/image";
import { GLOW_NEUTRAL_BASE } from "@/lib/tagGlow";
import { cn } from "@/lib/utils";

export type FigureGlow = "warm" | "cool" | "pink" | "amber";

interface FigureProps {
  src: string;
  alt?: string;
  caption?: string;
  glow?: FigureGlow;
  /** Set on the first above-the-fold figure so next/image skips lazy-loading. */
  priority?: boolean;
  className?: string;
}

/**
 * Framed image for MDX bodies. Visual language echoes `ShowcaseCard`'s tile —
 * neutral gradient base, optional radial glow, 4px radius, hairline border —
 * so figures inside posts feel native to the rest of the feed.
 *
 * The `glow` prop maps to four fixed moods (`warm | cool | pink | amber`),
 * matching the showcase frontmatter schema so an author can set the same
 * value in either place. Omit `glow` for a neutral frame.
 *
 * Image rendering uses `next/image` with `fill` because MDX authors don't
 * supply intrinsic dimensions. The 16:9 aspect ratio is the safe default
 * for full-width prose figures; if a future post needs a square or vertical
 * crop, expose it as a prop. Remote image hosts would need a `remotePatterns`
 * entry in `next.config.ts`; today's content is local-only so we skip that.
 */
export function Figure({
  src,
  alt = "",
  caption,
  glow,
  priority,
  className,
}: FigureProps) {
  return (
    <figure className={cn("my-6 flex flex-col gap-2 sm:my-8", className)}>
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-card border border-border",
          "bg-gradient-to-br",
          GLOW_NEUTRAL_BASE,
        )}
      >
        {glow ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: GLOW_GRADIENTS[glow] }}
          />
        ) : null}
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            sizes="(min-width: 768px) 600px, 100vw"
          />
        ) : null}
      </div>
      {caption ? (
        <figcaption className="font-mono text-[10px] uppercase tracking-[0.04em] text-faint sm:text-[11px]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Mood gradients tuned to evoke the four named glows without leaking into the
 * generative tag-color system. Lightness/chroma stay close to `tagColor`'s
 * locked values (74% L, 0.14 C) so figures sit at the same brightness as
 * showcase tiles when both appear in the feed.
 */
const GLOW_GRADIENTS: Record<FigureGlow, string> = {
  warm: "radial-gradient(circle at 40% 45%, oklch(74% 0.14 65 / 0.22), transparent 60%)",
  cool: "radial-gradient(circle at 40% 45%, oklch(74% 0.14 220 / 0.22), transparent 60%)",
  pink: "radial-gradient(circle at 40% 45%, oklch(74% 0.14 350 / 0.22), transparent 60%)",
  amber: "radial-gradient(circle at 40% 45%, oklch(74% 0.14 90 / 0.22), transparent 60%)",
};
