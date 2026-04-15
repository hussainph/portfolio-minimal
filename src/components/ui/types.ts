/**
 * A post's effort/maturity bucket. Drives the `StatusChip` rendered in
 * the card header row plus outer-card treatment (dashed border for
 * thinking, dimmed content for parked).
 *
 *   shipped  — default. Finished post, no chip, no visual treatment.
 *   thinking — work in progress, tentative conclusion, "thinking in public."
 *   parked   — shelved or failed. Readable but deliberately quiet.
 */
export type PostStatus = "shipped" | "thinking" | "parked";
