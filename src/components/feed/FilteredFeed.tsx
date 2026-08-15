"use client";

import { Fragment, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  describeEmptyFeed,
  matchesFeedFilter,
  parseFeedFilter,
  EMPTY_FEED_FILTER,
  type FeedFilterState,
  type FeedItemMeta,
} from "./filter";

export interface FeedEntry {
  meta: FeedItemMeta;
  /** Card rendered on the server at build time. Never introspected here. */
  node: ReactNode;
}

interface FilteredFeedProps {
  entries: FeedEntry[];
}

/**
 * Client-side feed filter for the statically prerendered home route.
 *
 * The home page can't read `searchParams` any more — doing so would make `/`
 * dynamic, and Cloudflare Workers have no filesystem at request time to read
 * `content/*.mdx` from. So the server renders every card at build time and
 * this component decides which ones to mount.
 *
 * `useSearchParams()` lives in `FilteredRows`, a child behind its own
 * Suspense boundary: during static prerendering Next bails the nearest
 * boundary to client rendering, and we want that blast radius scoped there
 * rather than swallowing the whole feed. The Suspense fallback renders the
 * *unfiltered* list, so every card still ships inside the prerendered HTML —
 * and because the child reads the filter during render instead of lifting it
 * in an effect, the hydration pass paints the correct subset immediately
 * instead of painting everything and reflowing a tick later.
 */
export function FilteredFeed({ entries }: FilteredFeedProps) {
  return (
    <Suspense
      fallback={<FeedRows entries={entries} filter={EMPTY_FEED_FILTER} />}
    >
      <FilteredRows entries={entries} />
    </Suspense>
  );
}

function FilteredRows({ entries }: { entries: FeedEntry[] }) {
  const filter = parseFeedFilter(
    new URLSearchParams(useSearchParams().toString()),
  );
  return <FeedRows entries={entries} filter={filter} />;
}

interface FeedRowsProps {
  entries: FeedEntry[];
  filter: FeedFilterState;
}

function FeedRows({ entries, filter }: FeedRowsProps) {
  const visible = entries.filter((entry) =>
    matchesFeedFilter(entry.meta, filter),
  );

  return visible.length === 0 ? (
    <div className="py-16 text-center font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
      {describeEmptyFeed(filter)}
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {visible.map((entry) => (
        <Fragment key={entry.meta.key}>{entry.node}</Fragment>
      ))}
    </div>
  );
}
