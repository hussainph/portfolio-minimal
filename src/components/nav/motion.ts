/**
 * Motion vocabulary for the nav rail.
 *
 * Deliberately built on `EASE_HOUSE` from `@/lib/motion` rather than a curve
 * of its own — the rail should not have a private easing. These constants are
 * nav-local only because they describe nav-shaped things (a toolbar that
 * hides, a panel that unrolls); if another surface grows the same needs they
 * belong upstairs in `src/lib/motion.ts`.
 */

import { EASE_HOUSE } from "@/lib/motion";

/**
 * The rail's show/hide.
 *
 * Was `{ stiffness: 260, damping: 22, mass: 1 }` — a damping ratio of
 * 22/(2·√260) ≈ 0.68, which is a bounce of roughly 0.32. Over 80px of travel
 * that overshoot is plainly visible, and a toolbar that wobbles on a reading
 * page reads as unserious. Apple's duration/bounce form is easier to reason
 * about than raw stiffness numbers, and 0.1 keeps a trace of life without the
 * wobble.
 */
export const TOOLBAR_SPRING = {
  type: "spring",
  duration: 0.4,
  bounce: 0.1,
} as const;

/** Panel open/close. Unchanged in feel; named so both panels share one source. */
export const PANEL_SPRING = {
  type: "spring",
  stiffness: 380,
  damping: 30,
} as const;

/**
 * Panel unroll.
 *
 * Enter is slower than exit on purpose: opening is the deliberate act, and a
 * panel that lingers on the way out feels like it is arguing with you.
 */
export const PANEL_ENTER = {
  height: { duration: 0.28, ease: EASE_HOUSE },
  opacity: { duration: 0.2, ease: EASE_HOUSE },
} as const;

/**
 * Both tracks previously ran on ease-in — `[0.4, 0, 1, 1]` for height and
 * Framer's `"easeIn"` for opacity. Ease-in stalls at exactly the moment the
 * eye is tracking the edge, which is what made collapsing feel sluggish even
 * though it was already the shorter half of the pair.
 */
export const PANEL_EXIT = {
  height: { duration: 0.18, ease: EASE_HOUSE },
  opacity: { duration: 0.12, ease: EASE_HOUSE },
} as const;

/** Reduced-motion counterparts — same shape, no curve worth arguing about. */
export const PANEL_ENTER_REDUCED = { duration: 0.18 } as const;
export const PANEL_EXIT_REDUCED = { duration: 0.12 } as const;

/**
 * Press feedback deliberately does NOT live here.
 *
 * The rail uses `PRESS_FEEDBACK` from `@/lib/motion` — the same string that
 * `Tag`, `ContentTypeChips`, and `ProjectDetailPanes` use. A nav-local copy
 * existed here briefly and was removed: two press scales (0.96 upstairs,
 * 0.97 here) drifting apart across one screen is precisely the kind of
 * inconsistency a shared vocabulary is for.
 */
