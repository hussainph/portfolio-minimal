"use client";

import { Fragment, Suspense, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
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
  /** Every tag the content index knows about. An unknown `?tags=` 404s. */
  knownTags: string[];
}

/**
 * Client-side feed filter for the statically prerendered home route.
 *
 * The home page can't read `searchParams` any more — doing so would make `/`
 * dynamic, and Cloudflare Workers have no filesystem at request time to read
 * `content/*.mdx` from. So the server renders every card at build time and
 * this component decides which ones to mount.
 *
 * The `useSearchParams()` call lives in a separate child behind its own
 * Suspense boundary on purpose: during static prerendering Next bails the
 * nearest boundary to client rendering, and we want that blast radius to be
 * the (empty) sync component rather than the feed itself. Keeping the cards
 * outside it means the full stream still ships inside the prerendered HTML.
 */
export function FilteredFeed({ entries, knownTags }: FilteredFeedProps) {
  const [filter, setFilter] = useState<FeedFilterState>(EMPTY_FEED_FILTER);

  // Parity with the old server route, which 404'd on a tag that no content
  // carries. Now it resolves after hydration, so the HTTP status is 200 and
  // only the rendered output is the not-found page.
  if (filter.tags.some((t) => !knownTags.includes(t))) notFound();

  const visible = entries.filter((entry) =>
    matchesFeedFilter(entry.meta, filter),
  );

  return (
    <>
      <Suspense fallback={null}>
        <FeedFilterSync onChange={setFilter} />
      </Suspense>
      {visible.length === 0 ? (
        <div className="py-16 text-center font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
          {describeEmptyFeed(filter)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((entry) => (
            <Fragment key={entry.meta.key}>{entry.node}</Fragment>
          ))}
        </div>
      )}
    </>
  );
}

/**
 * Reads the filter out of the URL and lifts it. Renders nothing — it exists
 * purely so `useSearchParams()` sits behind its own Suspense boundary.
 */
function FeedFilterSync({
  onChange,
}: {
  onChange: (filter: FeedFilterState) => void;
}) {
  const params = useSearchParams();
  const serialized = params.toString();

  useEffect(() => {
    onChange(parseFeedFilter(new URLSearchParams(serialized)));
  }, [serialized, onChange]);

  return null;
}
