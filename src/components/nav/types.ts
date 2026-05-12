export type ViewMode = "home" | "post" | "project";
export type ContentKind = "note" | "post" | "showcase";
export type PaletteKind = ContentKind | "project";

export interface OutlineEntry {
  id: string;
  label: string;
}

export interface NavPageMeta {
  /** Slug of the current item (used for Save / bookmark state). */
  slug?: string;
  /** Title used in `navigator.share` and as display fallback. */
  title?: string;
}

/** Client-safe summary of a single piece of content used by the command
 *  palette. Built once by the root layout and passed through context. */
export interface PaletteItem {
  kind: PaletteKind;
  slug: string;
  title: string;
  tags: string[];
  /** ISO string — dates are not serializable across the server→client
   *  boundary, so we store the formatted ISO once at build time. */
  publishedISO: string;
  href: string;
}
