import type { ShowcaseItem } from "@/lib/content/types";

/**
 * Resolve the editorial title for a showcase. Authored frontmatter wins; if
 * absent, bento/grid showcases pick the caption of the `picked: true` tile so
 * the page name reflects the chosen direction (and not whatever happens to
 * sit at index 0). Single-variant or unpicked sets fall back to the first
 * caption, then to a slug-tagged generic.
 *
 * Shared between the route's `<head>`/OG metadata and the SiteNav/palette
 * pageMeta — keeps the two surfaces from disagreeing about a showcase's name.
 */
export function resolveShowcaseTitle(item: ShowcaseItem): string {
  const authored = item.frontmatter.title?.trim();
  if (authored) return authored;

  const isMulti =
    item.frontmatter.variant === "bento" ||
    item.frontmatter.variant === "grid";
  if (isMulti) {
    const picked = item.frontmatter.images.find((img) => img.picked === true);
    if (picked?.caption) return picked.caption;
  }

  const firstCaption = item.frontmatter.images[0]?.caption;
  if (firstCaption) return firstCaption;

  return `showcase · ${item.frontmatter.slug}`;
}
