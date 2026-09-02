/**
 * Shared motion vocabulary for Framer Motion call sites.
 *
 * The curve is the same one `--ease-house` carries in `globals.css`; it lives
 * here as well because Framer reads a numeric array, not a CSS custom
 * property. If one changes, change the other.
 *
 * Durations are seconds (Framer's unit), not milliseconds.
 */

/** House ease-out. Matches `--ease-house` in globals.css. */
export const EASE_HOUSE = [0.2, 0.6, 0.3, 1] as const;

/**
 * Feed and pane transitions.
 *
 * `exit` is deliberately shorter than `enter`. A card that is leaving has
 * already stopped being interesting, and matching the two durations makes
 * removal feel like it drags.
 */
export const FEED_ENTER = { duration: 0.2, ease: EASE_HOUSE } as const;
export const FEED_EXIT = { duration: 0.15, ease: EASE_HOUSE } as const;

/** Story/Stream pane swap on `/projects/[slug]`. */
export const PANE_SWAP = { duration: 0.18, ease: EASE_HOUSE } as const;

/**
 * Press feedback for controls that trigger navigation — tag pills, filter
 * chips, tabs, the primary CTA.
 *
 * 0.96 is not a new value: `SocialIconRow` has used exactly that on
 * `whileTap` since it was written, and this keeps the two in step. It earns
 * its place on the pills in particular because they fire a `router.replace`;
 * without it there's a dead beat between the click and the feed reacting,
 * and the user can't tell whether the press registered.
 *
 * Two things to know before reusing it:
 *
 * 1. It re-lists the color properties. `transition-colors` and this are both
 *    `transition-property` utilities, so tailwind-merge keeps whichever lands
 *    last — appending a transform-only transition would silently drop the
 *    color fade rather than add to it. Call sites should drop their own
 *    `transition-colors duration-150` when they adopt this.
 * 2. It carries its own `motion-reduce:` guard. The global reduced-motion
 *    block in globals.css only nulls `animation-name`; it does not touch
 *    `transition`, so nothing else here would catch it.
 */
export const PRESS_FEEDBACK =
  "transition-[color,background-color,border-color,transform] duration-150 ease-house active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100";
