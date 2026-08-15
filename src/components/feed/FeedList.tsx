import { Fragment } from "react";
import type { FeedItem } from "@/lib/content";
import { renderFeedItem } from "./renderFeedItem";

interface FeedListProps {
  items: FeedItem[];
}

/**
 * Server component. Renders a pre-filtered list of feed items as UI cards.
 * Cards carry their own frosted/shader chrome, so the feed packs them tight
 * with no dividers.
 *
 * Filtering lives elsewhere: the home route needs it client-side (see
 * `FilteredFeed`), while tag archives and project timelines hand this
 * component a list that's already been narrowed by the loader.
 */
export function FeedList({ items }: FeedListProps) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
        Nothing here yet — check back soon.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Fragment key={`${item.kind}:${item.frontmatter.slug}`}>
          {renderFeedItem(item)}
        </Fragment>
      ))}
    </div>
  );
}
