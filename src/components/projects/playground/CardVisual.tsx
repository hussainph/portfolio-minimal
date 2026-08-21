import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { GLOW_NEUTRAL_BASE, tileGlow } from "@/lib/tagGlow";

interface CardVisualProps {
  tags: string[];
  /** Featured or hovered — wakes the strong glow + conic drift. */
  active: boolean;
}

/**
 * Generative card imagery — the visual-first face of a project card with no
 * real image. Layers, bottom to top:
 *   1. neutral base gradient (GLOW_NEUTRAL_BASE)
 *   2. a deterministic tag-hue radial glow (weak at rest, strong when active)
 *   3. a conic shimmer that drifts via `--shader-angle` (only visible when
 *      active; the drift keyframe is globally suppressed under reduced motion)
 *   4. a bottom scrim so the title/subtitle stay legible over any hue
 *
 * Mirrors the layered-gradient "shader" recipe from ProjectHero, scoped to a
 * card and gated so only featured/hovered cards animate (perf).
 */
export function CardVisual({ tags, active }: CardVisualProps) {
  const primaryTag = tags[0] ?? "building";

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* 1 · neutral base */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", GLOW_NEUTRAL_BASE)} />

      {/* 2a · resting weak glow (always present) */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: tileGlow(primaryTag, "weak") }}
      />
      {/* 2b · strong glow, fades in when active */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: tileGlow(primaryTag, "strong"),
          opacity: active ? 1 : 0,
        }}
      />

      {/* 3 · conic shimmer, drifts via --shader-angle, visible only when active */}
      <div
        className="absolute inset-0 animate-[shader-drift_45s_linear_infinite] transition-opacity duration-500"
        style={{
          opacity: active ? 1 : 0,
          backgroundImage: `conic-gradient(from var(--shader-angle, 0deg) at 45% 55%, ${tagColor(
            primaryTag,
            0,
          )} 0%, oklab(100% 0 0 / 6%) 25%, ${tagColor(
            primaryTag,
            0,
          )} 50%, oklab(100% 0 0 / 6%) 75%, ${tagColor(primaryTag, 0)} 100%)`,
        }}
      />

      {/* 4 · bottom scrim for text legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          backgroundImage:
            "linear-gradient(180deg in oklab, oklab(0% 0 0 / 0%) 0%, oklab(4% 0 0 / 80%) 100%)",
        }}
      />
    </div>
  );
}
