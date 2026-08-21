import type { Transition } from "framer-motion";
import type { Choreography, MotionPreset, Tunables } from "./controls";

/**
 * Per-card transition planning for the deck. Three rules hold across every
 * preset (they fix the bugs, the presets are taste):
 *
 *   1. Opacity NEVER rides the spring — springs overshoot, and overshooting
 *      opacity reads as a flash. It always gets its own short tween.
 *   2. Exits never wait. A removed card starts fading on the same frame the
 *      survivors start moving.
 *   3. Reduced motion collapses everything to a near-instant tween.
 *
 * Each preset has a distinct fingerprint:
 *   - retune    — everything moves at once (or via the legacy choreography
 *                 selector). The calm-physics control case.
 *   - two-clock — entrances cascade by index; reflows are simultaneous.
 *                 Identity lives in the enter/exit clocks.
 *   - spatial   — entrances ripple outward from the featured tile; reflow
 *                 delay grows with travel distance. Identity is geometric.
 */

export type CardPhase = "enter" | "reflow";

export interface TransitionContext {
  phase: CardPhase;
  index: number;
  count: number;
  /** Pixels this card travels from its previous slot (0 for entrances). */
  travel: number;
  /** Distance (px) from the wave origin — the featured tile's centre — that
   *  drives the spatial preset's entrance ripple. */
  waveDist: number;
  preset: MotionPreset;
  /** Only consulted by the "retune" preset — the legacy stagger shapes. */
  choreography: Choreography;
  t: Tunables;
  reduce: boolean;
  /** Duration multiplier from the playground speed toggle (1 = realtime,
   *  4 = quarter speed). Scales delays, tween durations, and the spring's
   *  period (stiffness ÷ ts², damping ÷ ts — damping ratio is preserved). */
  timeScale: number;
}

/** Spatial coefficients: at the default stagger (0.05s) the entrance wave
 *  sweeps ~1.25ms/px from the hero and a 400px reflow hop waits ~0.4s —
 *  readable ripples, capped so far-flung cards never feel parked. */
const SPATIAL_ENTER_CAP = 0.9;
const SPATIAL_REFLOW_CAP = 0.5;

function delayFor(ctx: TransitionContext): number {
  const { phase, index, count, travel, waveDist, preset, choreography, t } = ctx;

  if (preset === "retune") {
    if (choreography === "cascade") return index * t.stagger;
    if (choreography === "center")
      return Math.abs(index - (count - 1) / 2) * t.stagger;
    return 0;
  }

  if (preset === "two-clock") {
    // Entrances cascade in; survivors re-pack immediately.
    return phase === "enter" ? index * t.stagger : 0;
  }

  // spatial — geometry, not array order.
  if (phase === "enter")
    return Math.min(waveDist * (t.stagger / 40), SPATIAL_ENTER_CAP);
  return Math.min(travel * (t.stagger / 50), SPATIAL_REFLOW_CAP);
}

export function transitionFor(ctx: TransitionContext): Transition {
  if (ctx.reduce) return { duration: 0.15 };

  const ts = ctx.timeScale;
  const delay = delayFor(ctx) * ts;
  return {
    type: "spring",
    stiffness: ctx.t.stiffness / ts ** 2,
    damping: ctx.t.damping / ts,
    mass: ctx.t.mass,
    delay,
    opacity: { type: "tween", duration: 0.25 * ts, ease: "easeOut", delay },
  };
}

/** Exits are a fast fade with zero delay — see rule 2 above. */
export function exitTransitionFor(reduce: boolean, timeScale: number): Transition {
  return reduce
    ? { duration: 0 }
    : { type: "tween", duration: 0.18 * timeScale, ease: "easeOut" };
}
