import type { CSSProperties } from "react";
import { tagColor, tagHue } from "./tagColor";

/**
 * Translucent frosted-glass surface shared by NoteCard, ShowcaseCard, and
 * BentoShowcase. `rgba(20, 20, 22, 0.42)` is `--color-surface` (#141416)
 * at 42% alpha so whatever sits beneath the card shows through; paired
 * with `FROSTED_CHROME_CLASSES` for the border + `backdrop-blur`.
 *
 * Border + blur are classes (not inline) so hover variants still take
 * effect — inline `style` would beat them.
 */
export const FROSTED_SURFACE: CSSProperties = {
  backgroundColor: "rgba(20, 20, 22, 0.42)",
};

/**
 * Border + backdrop-blur classes that go with `FROSTED_SURFACE`. Border is
 * a translucent white tint (not a solid token) so it belongs to the
 * frosted family; hover lifts it slightly to signal interactivity.
 */
export const FROSTED_CHROME_CLASSES =
  "border border-white/[0.06] backdrop-blur-md hover:border-white/[0.12]";

/**
 * Leading-rail style. Single-tag cards get a solid color; multi-tag cards
 * get a 4s `stripe-cycle` gradient (defined in globals.css) that loops back
 * to the first color so the motion seam is invisible. Used by NoteCard,
 * ShowcaseCard, and ShaderBlogPost's siblings.
 */
export function buildStripeStyle(tags: string[]): CSSProperties {
  if (tags.length <= 1) {
    return { backgroundColor: tagColor(tags[0] ?? "building") };
  }
  const ordered = [...tags, tags[0]!];
  const stops = ordered.map((t) => tagColor(t)).join(", ");
  return {
    backgroundImage: `linear-gradient(172deg, ${stops})`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "repeat-y",
    animation: "stripe-cycle 4s linear infinite",
  };
}

/**
 * HSL palettes for BlogPostCard's GrainGradient shader. Rest is nearly
 * desaturated so the shader reads as ambient texture; hover buffs
 * saturation + lightness so the card "wakes up" when the reader reaches
 * for it. Paper's color parser accepts HSL but not OKLCH, so hue is
 * borrowed from `tagHue`'s hash — the rest of the site stays in OKLCH.
 *
 * GrainGradient caps at 7 colors, so for three tags (6 tag entries) the
 * single internal neutral band is the ceiling; `colorBack` carries the
 * true page-floor dark.
 */
export function shaderPaletteRest(tags: string[]): string[] {
  const safe = tags.length > 0 ? tags : ["building"];
  const palette: string[] = [];
  for (const t of safe) {
    palette.push(`hsl(${tagHue(t)}, 39%, 46%)`);
    palette.push(`hsl(${tagHue(t)}, 23%, 24%)`);
  }
  palette.push("#111114");
  return palette;
}

export function shaderPaletteHover(tags: string[]): string[] {
  const safe = tags.length > 0 ? tags : ["building"];
  const palette: string[] = [];
  for (const t of safe) {
    palette.push(`hsl(${tagHue(t)}, 53%, 56%)`);
    palette.push(`hsl(${tagHue(t)}, 35%, 32%)`);
  }
  palette.push("#111114");
  return palette;
}
