/**
 * Typography tokens for the nav rail and its panels.
 *
 * The rail had drifted into eleven separate `font-*` declarations across six
 * different tracking values (0.02 / 0.04 / 0.05 / 0.06 / 0.08em and none),
 * with `ContentTypeChips` even switching typeface between its own `sm` and
 * `md` sizes. These constants collapse that into one rule:
 *
 *   **Mono is for data. Sans is for language.**
 *
 * If the user reads it as a word they act on — a nav tab, a filter chip, a
 * button — it is DM Sans. If it is a token, a count, an index, or a key hint
 * — something closer to a value than a sentence — it stays JetBrains Mono.
 *
 * This follows the assignment the design system already makes
 * (`.claude/docs/01-design-system.md`): DM Sans owns "body, small, UI
 * labels"; JetBrains Mono owns "tags, timestamps, meta labels, inline code".
 */

/**
 * Interactive control labels — primary nav tabs, and any panel control at
 * full size. Weight 500 because 400 goes mushy at 12px over the rail's
 * translucent `backdrop-blur` surface.
 */
export const UI_LABEL =
  "font-sans text-[12px] leading-[16px] font-medium tracking-[-0.01em]";

/**
 * One step down, for dense rows inside panels — filter chips, inline action
 * labels, tooltips. Same voice as `UI_LABEL`, tighter box.
 */
export const UI_LABEL_SM =
  "font-sans text-[11px] leading-[14px] font-medium tracking-[-0.01em]";

/**
 * Section headings inside panels — "TAGS", "CHAPTERS · 5". Uppercase mono is
 * the design system's documented "System XS" idiom, and the one place wide
 * tracking is correct: it is what opens up uppercase counters.
 */
export const PANEL_HEADING =
  "font-mono text-[10px] leading-3 tracking-[0.08em] uppercase";

/**
 * Numeric and tabular chrome — outline counters ("3 / 5"), row indices
 * ("01"), keyboard hints. Mono earns its place here: fixed advance widths
 * stop digits from shifting as values change.
 */
export const DATA_XS = "font-mono text-[10px] leading-3 tracking-[0.04em]";

/**
 * Tag tokens (`#design`). Always mono — a tag is data, not language, and this
 * matches the shared `Tag` primitive in `components/ui/Tag.tsx`.
 */
export const TAG_LABEL = "font-mono text-[11px] leading-[14px] tracking-[0.02em]";
