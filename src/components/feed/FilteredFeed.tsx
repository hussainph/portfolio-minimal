"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_HOUSE, FEED_ENTER, FEED_EXIT } from "@/lib/motion";
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

/**
 * Applying a filter used to mount and unmount cards with no bridge: the list
 * teleported, cards vanished out from under the cursor, and survivors snapped
 * upward. Every card now enters and leaves on a short fade, and `popLayout`
 * lets the survivors glide to their new positions instead of jumping.
 *
 * `layout="position"` (not the full `layout`) is deliberate — the cards never
 * change size when the filter changes, only where they sit, and measuring
 * size as well would cost more for nothing. Worth revisiting if the feed ever
 * gets long enough for the per-card measurement to show up in a profile;
 * it's cheap at the scale this feed runs at today.
 */
function FeedRows({ entries, filter }: FeedRowsProps) {
  const reduce = useReducedMotion();
  const visible = entries.filter((entry) =>
    matchesFeedFilter(entry.meta, filter),
  );

  // Reduced motion keeps the crossfade and drops the travel. Cutting it to
  // nothing would put this back to the teleport the transition exists to fix.
  const from = reduce ? { opacity: 0 } : { opacity: 0, y: 8 };
  const to = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };
  // The exit transition rides inside the target rather than the shared
  // `transition` prop, which would otherwise apply the enter duration to it
  // and make removal drag.
  const exit = reduce
    ? { opacity: 0, transition: FEED_EXIT }
    : { opacity: 0, scale: 0.98, transition: FEED_EXIT };

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {visible.length === 0 ? (
          <motion.div
            key="__empty"
            initial={from}
            animate={to}
            exit={exit}
            transition={FEED_ENTER}
            className="py-16 text-center font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted"
          >
            {describeEmptyFeed(filter)}
          </motion.div>
        ) : (
          visible.map((entry) => (
            <motion.div
              key={entry.meta.key}
              layout={reduce ? false : "position"}
              initial={from}
              animate={to}
              exit={exit}
              transition={{
                ...FEED_ENTER,
                layout: { duration: 0.2, ease: EASE_HOUSE },
              }}
            >
              {entry.node}
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
