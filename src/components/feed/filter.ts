import type { ContentKind } from "@/components/nav/types";
import type { FeedItem } from "@/lib/content";

/**
 * Everything the client needs to decide whether a feed row survives the
 * current filter. Deliberately flat and serialisable: the home page renders
 * every card on the server and ships the rendered nodes alongside one of
 * these, so the client filter never has to introspect a React element.
 */
export interface FeedItemMeta {
  /** Stable render key — `${kind}:${slug}`, matching the old FeedList key. */
  key: string;
  kind: ContentKind;
  tags: string[];
  /** Pre-lowercased haystack: title + excerpt + raw body, newline-joined. */
  search: string;
}

export interface FeedFilterState {
  /** AND-filter: a row must carry every listed tag. Empty = no filter. */
  tags: string[];
  /** OR-filter across content kinds. Empty = all kinds pass. */
  types: ContentKind[];
  /** Case-insensitive substring match, already trimmed + lowercased. */
  query: string;
}

export const EMPTY_FEED_FILTER: FeedFilterState = {
  tags: [],
  types: [],
  query: "",
};

const KINDS: ContentKind[] = ["note", "post", "showcase"];

/**
 * Collapse a feed item to its filterable surface. Mirrors the fields the old
 * server-side `matchesQuery` reached for (title, excerpt, raw body) so search
 * results are identical after the move to client-side filtering.
 */
export function buildFeedItemMeta(item: FeedItem): FeedItemMeta {
  const title = item.frontmatter.title ?? "";
  const excerpt = "excerpt" in item ? item.excerpt : "";
  return {
    key: `${item.kind}:${item.frontmatter.slug}`,
    kind: item.kind,
    tags: item.frontmatter.tags,
    search: [title, excerpt, item.raw].join("\n").toLowerCase(),
  };
}

export function matchesFeedFilter(
  meta: FeedItemMeta,
  filter: FeedFilterState,
): boolean {
  if (
    filter.tags.length > 0 &&
    !filter.tags.every((t) => meta.tags.includes(t))
  ) {
    return false;
  }
  if (filter.types.length > 0 && !filter.types.includes(meta.kind)) {
    return false;
  }
  if (filter.query && !meta.search.includes(filter.query)) {
    return false;
  }
  return true;
}

export function describeEmptyFeed(filter: FeedFilterState): string {
  const bits: string[] = [];
  if (filter.types.length > 0) bits.push(filter.types.join(" + "));
  if (filter.tags.length > 0)
    bits.push(filter.tags.map((t) => `#${t}`).join(" + "));
  if (filter.query) bits.push(`"${filter.query}"`);
  if (bits.length === 0) return "Nothing here yet.";
  return `Nothing matches ${bits.join(" · ")} yet.`;
}

/**
 * Read `?types=`, `?tags=` (plus the legacy `?tag=`), and `?q=` off a
 * URLSearchParams. Kept byte-compatible with the semantics the server route
 * used before the feed moved client-side, including the quirk that a repeated
 * `?q=` collapses to "no query" rather than picking one.
 */
export function parseFeedFilter(params: URLSearchParams): FeedFilterState {
  const q = params.getAll("q");
  return {
    tags: parseTags([...params.getAll("tags"), ...params.getAll("tag")]),
    types: parseTypes(params.getAll("types")),
    query: q.length === 1 ? q[0].trim().toLowerCase() : "",
  };
}

function parseTags(raw: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of raw.flatMap((s) => s.split(","))) {
    const tag = value.trim();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
}

function parseTypes(raw: string[]): ContentKind[] {
  return raw
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter((s): s is ContentKind => (KINDS as string[]).includes(s));
}
