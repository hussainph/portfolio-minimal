import { Fragment } from "react";
import { assertNever } from "@/lib/assertNever";
import { deriveExcerpt, formatFeedTimestamp } from "@/lib/content";
import type { FeedItem, NoteItem, PostItem, ShowcaseItem } from "@/lib/content";

/**
 * Lightweight inline-markdown stripper for card previews. Keeps paragraph
 * breaks intact but removes emphasis markers and link syntax so the card
 * reads as clean prose. The note permalink renders the real MDX.
 */
function stripInlineMarkdown(raw: string): string {
  return raw
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/^import\s.+?from\s.+?;?\s*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import { NoteCard } from "@/components/ui/NoteCard";
import {
  ShowcaseCard,
  ShowcaseImage,
} from "@/components/ui/ShowcaseCard";

interface FeedListProps {
  items: FeedItem[];
  /** AND-filter: rendered items must carry every listed tag. Empty = no filter. */
  activeTags?: string[];
  /** AND-filter across content kinds. Empty = all kinds pass. */
  activeTypes?: string[];
  /** Case-insensitive substring match across title, excerpt, and raw body. */
  query?: string;
}

/**
 * Server component. Maps the content index's discriminated-union feed items
 * to the corresponding UI card primitive. Cards now carry their own
 * frosted/shader chrome, so the feed packs them tight with no dividers.
 * The switch uses `assertNever` in the default branch so adding a new
 * content kind later triggers a compile error here.
 */
export function FeedList({
  items,
  activeTags = [],
  activeTypes = [],
  query = "",
}: FeedListProps) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = items.filter((item) => {
    if (
      activeTags.length > 0 &&
      !activeTags.every((t) => item.frontmatter.tags.includes(t))
    ) {
      return false;
    }
    if (activeTypes.length > 0 && !activeTypes.includes(item.kind)) {
      return false;
    }
    if (normalizedQuery && !matchesQuery(item, normalizedQuery)) {
      return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
        {describeEmpty(activeTags, activeTypes, normalizedQuery)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((item) => (
        <Fragment key={`${item.kind}:${item.frontmatter.slug}`}>
          {renderItem(item)}
        </Fragment>
      ))}
    </div>
  );
}

function matchesQuery(item: FeedItem, q: string): boolean {
  const title = item.frontmatter.title?.toLowerCase() ?? "";
  if (title.includes(q)) return true;
  if ("excerpt" in item && item.excerpt.toLowerCase().includes(q)) return true;
  return item.raw.toLowerCase().includes(q);
}

function describeEmpty(
  tags: string[],
  types: string[],
  query: string,
): string {
  const bits: string[] = [];
  if (types.length > 0) bits.push(types.join(" + "));
  if (tags.length > 0) bits.push(tags.map((t) => `#${t}`).join(" + "));
  if (query) bits.push(`"${query}"`);
  if (bits.length === 0) return "Nothing here yet — check back soon.";
  return `Nothing matches ${bits.join(" · ")} yet.`;
}

function renderItem(item: FeedItem) {
  switch (item.kind) {
    case "note":
      return <NoteRow item={item} />;
    case "post":
      return <PostRow item={item} />;
    case "showcase":
      return <ShowcaseRow item={item} />;
    default:
      return assertNever(item);
  }
}

function NoteRow({ item }: { item: NoteItem }) {
  const { frontmatter } = item;
  return (
    <NoteCard
      href={`/n/${frontmatter.slug}`}
      tags={frontmatter.tags}
      timestamp={formatFeedTimestamp(frontmatter.published)}
      body={stripInlineMarkdown(item.raw)}
      engagement={frontmatter.engagement}
    />
  );
}

function PostRow({ item }: { item: PostItem }) {
  const { frontmatter } = item;
  return (
    <BlogPostCard
      href={`/blog/${frontmatter.slug}`}
      tags={frontmatter.tags}
      timestamp={formatFeedTimestamp(frontmatter.published)}
      readTime={`${item.readingTimeMinutes} min`}
      title={frontmatter.title}
      excerpt={item.excerpt}
      engagement={frontmatter.engagement}
    />
  );
}

function ShowcaseRow({ item }: { item: ShowcaseItem }) {
  const { frontmatter } = item;
  const body = deriveExcerpt(item.raw, 200);

  return (
    <ShowcaseCard
      href={`/showcases/${frontmatter.slug}`}
      tags={frontmatter.tags}
      timestamp={formatFeedTimestamp(frontmatter.published)}
      body={body}
      layout={frontmatter.variant}
      engagement={frontmatter.engagement}
    >
      {frontmatter.images.map((img, idx) => (
        <ShowcaseImage
          key={idx}
          caption={img.caption}
          picked={img.picked}
          src={img.src}
        />
      ))}
    </ShowcaseCard>
  );
}
