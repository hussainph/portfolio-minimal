import { assertNever } from "@/lib/assertNever";
import type { ContentItem } from "./types";

/**
 * Canonical route for a content item, keyed off its discriminant. Shared by
 * `<Ref>` (MDX) and `getRefPreview` (server) so a future route rename only
 * needs to change one place.
 */
export function routeFor(item: ContentItem): string {
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
