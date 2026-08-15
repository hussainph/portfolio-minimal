import { tagColor } from "@/lib/tagColor";
import { cn } from "@/lib/utils";

/**
 * Shared surface pieces for the project grid, so the glow field and the
 * meta-reveal microinteraction live in exactly one place instead of being
 * re-tuned per card size.
 */

/**
 * Classes for the meta strip that stays hidden until the card is hovered or
 * focused. Cards are visual-first at rest — title, subtitle, imagery — and
 * status/tags ride in on interaction.
 *
 * The default state is *revealed*, then `(hover: hover)` hides it. That way
 * touch devices, which have no hover to give, show the meta at rest rather
 * than hiding it behind a gesture they can't perform. `group-focus-within`
 * covers keyboard users following the overlay link.
 *
 * `motion-reduce` keeps the fade but drops the travel.
 */
export const REVEAL_CLASSES = cn(
  "pointer-events-none flex items-center gap-2 overflow-hidden opacity-100 translate-y-0",
  "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.34,1.28,0.64,1)]",
  "[@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0",
  "[@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100",
  "[@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100",
  "motion-reduce:translate-y-0 motion-reduce:transition-[opacity]",
);

/**
 * The card's "imagery". There are no per-project art assets, so the visual is
 * a bloom hashed through the same OKLCH rule as `tagColor` and `tileGlow` —
 * deterministic, palette-free, and free to add a project to.
 *
 * The primary bloom is keyed on the project's **slug**, not its first tag.
 * Tags are shared (nearly every project here leads with `building`), so
 * tag-keyed glows made every card the same colour and the grid lost its
 * per-project identity. The slug is unique by construction, so each project
 * gets its own hue; the first tag still tints the secondary bloom, which is
 * where the content-follows-mood idea keeps earning its place.
 *
 * Sits near-invisible at rest and warms on hover; only the hovered card
 * animates, so there's no global scheduler.
 */
export function ProjectGlow({
  seed,
  accent,
}: {
  /** Unique per project — the slug. Drives the dominant hue. */
  seed: string;
  /** Usually the first tag. Tints the secondary bloom. */
  accent?: string;
}) {
  const primary = seed;
  const secondary = accent ?? seed;

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage: `radial-gradient(circle farthest-corner at 82% 8%, ${tagColor(primary, 0.16)} 0%, transparent 62%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage: `radial-gradient(circle farthest-side at 8% 96%, ${tagColor(secondary, 0.1)} 0%, transparent 58%)`,
        }}
      />
      {/* Grounds the type against the warmest part of the bloom. */}
      <div
        className="absolute inset-x-0 bottom-0 h-3/5"
        style={{
          backgroundImage:
            "linear-gradient(0deg in oklab, oklab(12% 0.0004 -0.001 / 88%) 0%, oklab(12% 0.0004 -0.001 / 0%) 100%)",
        }}
      />
    </div>
  );
}
