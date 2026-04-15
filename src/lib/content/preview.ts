import "server-only";
import { assertNever } from "@/lib/assertNever";
import { getItemBySlug } from "./loader";
import { deriveExcerpt } from "./derive";
import type { ContentItem } from "./types";

export interface RefPreview {
  kind: ContentItem["kind"];
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  href: string;
}

/**
 * Resolve a slug to the data a hover-preview card would need: title, excerpt,
 * tags, and the canonical route. Returns `null` when the slug doesn't resolve
 * so callers can render a missing-ref affordance.
 *
 * Phase 7 wires the data hook only — the actual hover micro-card UI lands in
 * a future phase. The shape here is what the client script will consume.
 */
export async function getRefPreview(
  slug: string,
): Promise<RefPreview | null> {
  const item = await getItemBySlug(slug);
  if (!item) return null;

  return {
    kind: item.kind,
    slug: item.frontmatter.slug,
    title: previewTitle(item),
    excerpt: previewExcerpt(item),
    tags: item.frontmatter.tags ?? [],
    href: hrefFor(item),
  };
}

/**
 * Same routing logic as `<Ref>`'s `routeFor`. Kept inline rather than imported
 * because Ref lives in `src/components/mdx/` (UI layer) and this helper sits
 * in the content layer — neither side should depend on the other.
 */
function hrefFor(item: ContentItem): string {
  switch (item.kind) {
    case "note":
      return `/n/${item.frontmatter.slug}`;
    case "post":
      return `/blog/${item.frontmatter.slug}`;
    case "showcase":
      return `/showcases/${item.frontmatter.slug}`;
    case "project":
      return `/projects/${item.frontmatter.slug}`;
    default:
      return assertNever(item);
  }
}

/**
 * Headline for the preview card. Posts and projects always have a title in
 * frontmatter. Notes may not — fall back to the first non-empty line of the
 * raw body. Showcases prefer authored title, then the picked-image caption
 * for multi-image variants, then the first caption.
 */
function previewTitle(item: ContentItem): string {
  switch (item.kind) {
    case "post":
    case "project":
      return item.frontmatter.title;
    case "note":
      return item.frontmatter.title?.trim() || firstLine(item.raw) || item.frontmatter.slug;
    case "showcase": {
      const authored = item.frontmatter.title?.trim();
      if (authored) return authored;
      const isMulti =
        item.frontmatter.variant === "bento" ||
        item.frontmatter.variant === "grid";
      if (isMulti) {
        const picked = item.frontmatter.images.find((img) => img.picked === true);
        if (picked?.caption) return picked.caption;
      }
      return item.frontmatter.images[0]?.caption ?? item.frontmatter.slug;
    }
    default:
      return assertNever(item);
  }
}

/**
 * Sub-headline for the preview card. Posts already have a derived excerpt
 * sitting on the item; everything else needs to be derived from the body or
 * frontmatter on the spot. Capped at 160 chars so the card stays glance-able.
 */
function previewExcerpt(item: ContentItem): string {
  switch (item.kind) {
    case "post":
      return item.excerpt;
    case "note":
    case "showcase":
      return deriveExcerpt(item.raw, 160);
    case "project":
      return item.frontmatter.subtitle;
    default:
      return assertNever(item);
  }
}

function firstLine(raw: string): string {
  const line = raw
    .split(/\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  return line ?? "";
}
