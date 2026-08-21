/**
 * Tunable parameters for the Bento Showcase playground, plus the descriptor
 * table the in-house ControlPanel renders from. These are the values
 * interface-kit can't bind (animation physics, card geometry, count) —
 * interface-kit handles CSS chrome; this handles behaviour.
 */

export type Choreography = "simultaneous" | "cascade" | "center";

export const CHOREOGRAPHIES: { value: Choreography; label: string }[] = [
  { value: "simultaneous", label: "simultaneous" },
  { value: "cascade", label: "cascade" },
  { value: "center", label: "from center" },
];

/**
 * Motion presets — three competing models for how the deck orchestrates
 * enter / reflow / exit. All three share the baseline fixes (tweened opacity,
 * zero-delay exits, animated shadow, spring-driven stage height); they differ
 * in WHERE stagger comes from:
 *   - retune     — the original index-stagger model (choreography selector
 *                  applies), just with sane physics
 *   - two-clock  — entrances rise+fade with stagger; reflows are simultaneous;
 *                  survivors never wait
 *   - spatial    — reflow delay grows with travel distance, so the grid
 *                  ripples outward from the change
 */
export type MotionPreset = "retune" | "two-clock" | "spatial";

export const MOTION_PRESETS: { value: MotionPreset; label: string }[] = [
  { value: "retune", label: "retune" },
  { value: "two-clock", label: "two-clock" },
  { value: "spatial", label: "spatial" },
];

/**
 * Featured-tile layouts — screenshot-first compositions (the generative-
 * gradient treatments didn't converge; the hero now showcases the project
 * itself). All three carry the longer description:
 *   - cover — full-bleed screenshot, text block over a bottom scrim
 *   - frame — screenshot in a floating browser frame over quiet atmosphere,
 *             text beneath
 *   - split — text column left, screenshot bleeding off the right edge
 */
export type FeaturedLayout = "cover" | "frame" | "split";

export const FEATURED_LAYOUTS: { value: FeaturedLayout; label: string }[] = [
  { value: "cover", label: "cover" },
  { value: "frame", label: "frame" },
  { value: "split", label: "split" },
];

/**
 * Featured-tile border animation:
 *   - none  — the shared static border
 *   - trace — a tag-hued conic highlight orbiting the border ring
 *   - draw  — the border draws itself on entrance (SVG pathLength), synced
 *             to the deck's speed toggle
 */
export type BorderMode = "none" | "trace" | "draw";

export const BORDER_MODES: { value: BorderMode; label: string }[] = [
  { value: "none", label: "none" },
  { value: "trace", label: "trace" },
  { value: "draw", label: "draw" },
];

export interface Tunables {
  // Card box (size deltas between tiles are expressed via scale)
  cardWidth: number;
  cardHeight: number;
  // Grid spacing
  gap: number;
  // Reflow spring (filter add/remove + slider morph)
  stiffness: number;
  damping: number;
  mass: number;
  // Choreography
  stagger: number;
  // Hover lift (the inner-layer pop, independent of the reflow spring)
  hoverScale: number;
  hoverLift: number;
  // Data — size of the mock project pool
  count: number;
}

// Spring sits at ζ ≈ 0.93 (damping / 2√(stiffness·mass)) — a whisker under
// critical, so cards settle with one barely-visible overshoot instead of the
// old ζ ≈ 0.73 wobble that made 20px gaps read as collisions.
export const DEFAULT_TUNABLES: Tunables = {
  cardWidth: 300,
  cardHeight: 380,
  gap: 20,
  stiffness: 420,
  damping: 38,
  mass: 1,
  // 0.05s/card → a 12-card two-clock cascade spans ~0.55s: readable without
  // feeling slow. (At the old 0.02 the whole spread fit inside the spring's
  // settle time and every preset looked identical.)
  stagger: 0.05,
  hoverScale: 1.02,
  hoverLift: 6,
  count: 12,
};

export type TunableKey = keyof Tunables;

export interface ParamDescriptor {
  key: TunableKey;
  label: string;
  min: number;
  max: number;
  step: number;
  group: string;
  /** Format the readout (e.g. degrees, seconds). */
  unit?: string;
}

export const PARAM_DESCRIPTORS: ParamDescriptor[] = [
  { key: "count", label: "projects", min: 3, max: 24, step: 1, group: "Data" },

  { key: "stiffness", label: "stiffness", min: 40, max: 600, step: 10, group: "Spring" },
  { key: "damping", label: "damping", min: 4, max: 60, step: 1, group: "Spring" },
  { key: "mass", label: "mass", min: 0.2, max: 4, step: 0.1, group: "Spring" },

  { key: "stagger", label: "stagger", min: 0, max: 0.15, step: 0.005, group: "Choreography", unit: "s" },

  { key: "hoverScale", label: "hover scale", min: 1, max: 1.1, step: 0.005, group: "Hover", unit: "×" },
  { key: "hoverLift", label: "hover lift", min: 0, max: 24, step: 1, group: "Hover", unit: "px" },

  { key: "gap", label: "gap", min: 0, max: 64, step: 2, group: "Layout", unit: "px" },

  { key: "cardWidth", label: "card width", min: 180, max: 420, step: 10, group: "Card", unit: "px" },
  { key: "cardHeight", label: "card height", min: 220, max: 520, step: 10, group: "Card", unit: "px" },
];

/** Descriptors grouped in render order for the panel. */
export const PARAM_GROUPS: { group: string; params: ParamDescriptor[] }[] = (() => {
  const order = ["Data", "Spring", "Choreography", "Hover", "Layout", "Card"];
  return order.map((group) => ({
    group,
    params: PARAM_DESCRIPTORS.filter((p) => p.group === group),
  }));
})();
