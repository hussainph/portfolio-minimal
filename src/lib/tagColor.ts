/**
 * Deterministic OKLCH color for a tag name — the "Dark Warmth" v3 rule.
 *
 *   tagColor(name) === `oklch(74% 0.14 ${hash(name) mod 360})`
 *
 * Lightness and chroma are locked to the palette so every tag sits in the
 * same perceptual band; only the hue varies. The hash is pure, so the same
 * name always produces the same color across renders, sessions, and builds.
 *
 * Reference: Component Library v3, Atoms section — "hue derived from name,
 * cached once".
 */

const LIGHTNESS = 0.74;
const CHROMA = 0.14;

function hash(name: string): number {
  // djb2 — small, fast, well-distributed over short strings
  let h = 5381;
  const safe = typeof name === "string" ? name : "";
  for (let i = 0; i < safe.length; i++) {
    h = (h * 33) ^ safe.charCodeAt(i);
  }
  return Math.abs(h);
}

export function tagHue(name: string): number {
  return hash(name) % 360;
}

/** Solid OKLCH color. Pass `alpha` (0–1) for tinted fills/borders. */
export function tagColor(name: string | undefined, alpha = 1): string {
  const hue = tagHue(name ?? "");
  return alpha >= 1
    ? `oklch(${LIGHTNESS} ${CHROMA} ${hue})`
    : `oklch(${LIGHTNESS} ${CHROMA} ${hue} / ${alpha})`;
}
