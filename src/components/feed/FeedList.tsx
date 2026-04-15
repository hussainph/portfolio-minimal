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
import { BentoShowcase } from "@/components/ui/BentoShowcase";
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import { NoteCard } from "@/components/ui/NoteCard";
import { Separator } from "@/components/ui/Separator";
import {
  ShowcaseCard,
  type ShowcaseImage as ShowcaseCardImage,
} from "@/components/ui/ShowcaseCard";

interface FeedListProps {
  items: FeedItem[];
  /** When present, only renders items carrying this tag. */
  activeTag?: string;
}

/**
 * Server component. Maps the content index's discriminated-union feed items
 * to the corresponding UI card primitive, inserting separators between
 * siblings. The switch uses `assertNever` in the default branch so that
 * adding a new content kind later triggers a compile error here.
 */
export function FeedList({ items, activeTag }: FeedListProps) {
  const filtered = activeTag
    ? items.filter((item) => item.frontmatter.tags.includes(activeTag))
    : items;

  return (
    <div className="flex flex-col">
      {filtered.map((item, idx) => (
        <Fragment key={`${item.kind}:${item.frontmatter.slug}`}>
          {idx > 0 ? <Separator className="my-8" /> : null}
          {renderItem(item)}
        </Fragment>
      ))}
    </div>
  );
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
  const cardImages: ShowcaseCardImage[] = frontmatter.images.map((img) => ({
    caption: img.caption,
    glow: img.glow,
    picked: img.picked,
  }));

  if (frontmatter.variant === "bento" && cardImages.length === 3) {
    return (
      <BentoShowcase
        href={`/showcases/${frontmatter.slug}`}
        tags={frontmatter.tags}
        timestamp={formatFeedTimestamp(frontmatter.published)}
        body={body}
        images={
          cardImages as [ShowcaseCardImage, ShowcaseCardImage, ShowcaseCardImage]
        }
        engagement={frontmatter.engagement}
      />
    );
  }

  return (
    <ShowcaseCard
      href={`/showcases/${frontmatter.slug}`}
      tags={frontmatter.tags}
      timestamp={formatFeedTimestamp(frontmatter.published)}
      body={body}
      images={cardImages}
      engagement={frontmatter.engagement}
    />
  );
}
