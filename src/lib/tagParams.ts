/**
 * Parse/serialize/toggle the `?tags=a,b,c` query parameter used by the feed.
 * Falls back to a legacy `?tag=x` single-tag key so older links stay alive.
 *
 * All helpers return a deduped, trimmed list. Order is preserved so the URL
 * reads the way the user built it (first toggled tag appears first).
 */

export function parseTagsQuery(
  raw: string | string[] | undefined,
): string[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return dedupe(
    list
      .flatMap((s) => s.split(","))
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

/** Reads both `tags` (csv) and legacy `tag` keys and merges. */
export function parseTagSearchParams(params: {
  tags?: string | string[];
  tag?: string | string[];
}): string[] {
  return dedupe([...parseTagsQuery(params.tags), ...parseTagsQuery(params.tag)]);
}

/** Returns the query suffix — empty string when no tags are active. */
export function serializeTagsQuery(tags: string[]): string {
  const clean = dedupe(tags);
  if (clean.length === 0) return "";
  return `?tags=${clean.map(encodeURIComponent).join(",")}`;
}

export function toggleTagInList(current: string[], tag: string): string[] {
  return current.includes(tag)
    ? current.filter((t) => t !== tag)
    : [...current, tag];
}

function dedupe(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of list) {
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}
