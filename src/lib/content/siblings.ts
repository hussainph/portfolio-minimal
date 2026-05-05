import type { ContentIndex, ContentItem } from "./types";

export interface SiblingHrefs {
  prevHref: string | null;
  nextHref: string | null;
}

/**
 * Compute the `prev`/`next` detail-page hrefs for a given item, scoped to
 * siblings of the same kind and sorted newest-first (ContentIndex.items is
 * already sorted by published DESC).
 *
 * `prev` = the next-older sibling.
 * `next` = the next-newer sibling.
 *
 * Projects are their own collection sorted by published DESC.
 */
export function computeSiblingHrefs(
  current: ContentItem,
  index: ContentIndex,
): SiblingHrefs {
  if (current.kind === "project") {
    const projects = [...index.projects].sort(
      (a, b) =>
        b.frontmatter.published.getTime() - a.frontmatter.published.getTime(),
    );
    const i = projects.findIndex(
      (p) => p.frontmatter.slug === current.frontmatter.slug,
    );
    if (i === -1) return { prevHref: null, nextHref: null };
    return {
      prevHref: projects[i + 1]
        ? `/projects/${projects[i + 1]!.frontmatter.slug}`
        : null,
      nextHref: projects[i - 1]
        ? `/projects/${projects[i - 1]!.frontmatter.slug}`
        : null,
    };
  }

  const siblings = index.items.filter((it) => it.kind === current.kind);
  const i = siblings.findIndex(
    (it) => it.frontmatter.slug === current.frontmatter.slug,
  );
  if (i === -1) return { prevHref: null, nextHref: null };

  return {
    prevHref: siblings[i + 1] ? itemHref(siblings[i + 1]!) : null,
    nextHref: siblings[i - 1] ? itemHref(siblings[i - 1]!) : null,
  };
}

function itemHref(item: ContentItem): string {
  if (item.kind === "note") return `/n/${item.frontmatter.slug}`;
  if (item.kind === "post") return `/blog/${item.frontmatter.slug}`;
  if (item.kind === "showcase") return `/showcases/${item.frontmatter.slug}`;
  return `/projects/${item.frontmatter.slug}`;
}
