import type { ReactNode } from "react";
import { assertNever } from "@/lib/assertNever";
import { deriveExcerpt, formatFeedTimestamp } from "@/lib/content";
import type { FeedItem, NoteItem, PostItem, ShowcaseItem } from "@/lib/content";
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import { NoteCard } from "@/components/ui/NoteCard";
import { ShowcaseCard, ShowcaseImage } from "@/components/ui/ShowcaseCard";

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

/**
 * Maps a feed item to its UI card primitive. Server-only by construction —
 * the cards are client components, so calling this on the server produces a
 * ready-to-mount node that can be handed to `<FilteredFeed>` as a prop.
 *
 * The switch uses `assertNever` in the default branch so adding a new content
 * kind later triggers a compile error here.
 */
export function renderFeedItem(item: FeedItem): ReactNode {
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
