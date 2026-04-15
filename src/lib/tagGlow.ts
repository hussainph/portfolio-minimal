/**
 * Tile glow derived from a tag name — the companion to `tagColor`.
 *
 * Showcase and Bento card tiles previously picked one of four hardcoded
 * glows (`warm | cool | pink | amber`), which contradicted the site's
 * "hash everything from the tag name" principle. `tileGlow` threads the
 * glow through the same deterministic OKLCH hue that `tagColor` produces,
 * so the tile's mood follows the tag naturally.
 *
 *   tileGlow("building", "strong") →
 *     `radial-gradient(circle at 40% 45%, oklch(74% 0.14 <hue> / 0.22), transparent 60%)`
 *
 * Two intensity levels cover the feature/alt axis:
 *   - `strong` — the picked / featured tile in a multi-tile layout
 *   - `weak`   — alternates, sitting alongside the feature
 */

import { tagColor } from "./tagColor";

/** Shared neutral base gradient class — applied to every glow tile. */
export const GLOW_NEUTRAL_BASE = "from-[#1f1f22] to-[#161618]";

/**
 * Radial-gradient string ready to drop into an inline `backgroundImage`.
 * The caller is responsible for layering it over `GLOW_NEUTRAL_BASE`.
 */
export function tileGlow(
  tagName: string,
  intensity: "strong" | "weak",
): string {
  const alpha = intensity === "strong" ? 0.22 : 0.12;
  return `radial-gradient(circle at 40% 45%, ${tagColor(tagName, alpha)}, transparent 60%)`;
}
