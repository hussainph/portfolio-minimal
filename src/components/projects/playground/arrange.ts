import type { Tunables } from "./controls";

/**
 * Per-card transform for the bento. `x`/`y` are the top-left position (px) of the
 * card's UNSCALED box within the stage; `scale` transforms around the box centre,
 * so the visual centre stays put regardless of scale. Reflows stay on the
 * compositor (x/y/scale/opacity) and compose cleanly with the drifting conic
 * background (a paint property, not a transform).
 *
 * `width`/`height` are the card's DESIGN-SIZE box. Every card shares the same
 * cell→design scale factor, so 1px borders and radii stay optically identical
 * across tiles — the featured card gets a 2×2 design box and composes its own
 * layout at that size, rather than being a small card under a 2× zoom (which
 * doubled its border, radius, and type for free).
 */
export interface PerCardTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  zIndex: number;
  opacity: number;
  /** The big feature tile (slot 0) — gates the strong glow + conic wake. */
  featured: boolean;
}

export interface Arrangement {
  cards: PerCardTransform[];
  /** Stage height the grid needs, so the page reserves room. */
  height: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface SlotRect {
  cx: number;
  cy: number;
  /** Design-size box for this slot (slot px ÷ the shared scale factor). */
  width: number;
  height: number;
  scale: number;
  featured: boolean;
}

/**
 * First-free-cell bento packer. Slot 0 is a 2×2 feature tile (when ≥3 cols); the
 * rest are 1×1. Every slot shares ONE scale factor (cell width ÷ design card
 * width); a slot's design box is its pixel size divided by that scale, so the
 * featured tile lays out at 2×2 design size instead of being zoomed. Columns
 * adapt to stage width.
 */
function packBentoSlots(
  slots: number,
  stageWidth: number,
  t: Tunables,
): { rects: SlotRect[]; height: number } {
  const cols = clamp(Math.round(stageWidth / 300), 2, 5);
  const gap = t.gap;
  const cellW = (stageWidth - gap * (cols - 1)) / cols;
  const cellH = t.cardHeight * (cellW / t.cardWidth); // keep card aspect

  const occupied: boolean[][] = [];
  const ensureRow = (r: number) => {
    while (occupied.length <= r) occupied.push(new Array(cols).fill(false));
  };
  const fits = (r: number, c: number, w: number, h: number) => {
    if (c + w > cols) return false;
    for (let rr = r; rr < r + h; rr++) {
      ensureRow(rr);
      for (let cc = c; cc < c + w; cc++) if (occupied[rr]![cc]) return false;
    }
    return true;
  };
  const mark = (r: number, c: number, w: number, h: number) => {
    for (let rr = r; rr < r + h; rr++) {
      ensureRow(rr);
      for (let cc = c; cc < c + w; cc++) occupied[rr]![cc] = true;
    }
  };
  const place = (w: number, h: number): { r: number; c: number } => {
    for (let r = 0; ; r++) {
      ensureRow(r);
      for (let c = 0; c < cols; c++) {
        if (fits(r, c, w, h)) {
          mark(r, c, w, h);
          return { r, c };
        }
      }
    }
  };

  const scale = cellW / t.cardWidth;

  const rects: SlotRect[] = [];
  let maxRow = 0;
  for (let i = 0; i < slots; i++) {
    const big = i === 0 && cols >= 3;
    const w = big ? 2 : 1;
    const h = big ? 2 : 1;
    const { r, c } = place(w, h);
    maxRow = Math.max(maxRow, r + h);

    const slotW = w * cellW + (w - 1) * gap;
    const slotH = h * cellH + (h - 1) * gap;
    rects.push({
      cx: c * (cellW + gap) + slotW / 2,
      cy: r * (cellH + gap) + slotH / 2,
      width: slotW / scale,
      height: slotH / scale,
      scale,
      featured: big,
    });
  }

  const height = maxRow * cellH + Math.max(0, maxRow - 1) * gap + 8;
  return { rects, height };
}

/**
 * BENTO SHOWCASE — every (filtered) project gets its own packed slot; slot 0 is
 * the big feature tile. Filtering changes how many cards are packed, so the grid
 * reflows; the deck springs every card to its new slot via the morph engine.
 */
export function arrangeBento(
  count: number,
  stageWidth: number,
  t: Tunables,
): Arrangement {
  const width = stageWidth > 0 ? stageWidth : 1000;
  const { rects, height } = packBentoSlots(count, width, t);
  const cards = rects.map((r) => ({
    // Top-left of the unscaled box such that the scaled visual centres on the
    // slot centre (scale transforms around the box centre).
    x: r.cx - r.width / 2,
    y: r.cy - r.height / 2,
    width: r.width,
    height: r.height,
    scale: r.scale,
    zIndex: r.featured ? 200 : 100,
    opacity: 1,
    featured: r.featured,
  }));
  return { cards, height };
}
