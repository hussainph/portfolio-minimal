import {
  deriveExcerpt,
  loadAll,
  routeFor,
  resolveShowcaseTitle,
} from "@/lib/content";
import type { FeedItem } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-static";

const SITE_NAME = "Hussain Phalasiya";
const SITE_DESCRIPTION =
  "Personal feed — notes, posts, and projects. A Twitter + Substack hybrid.";
const FEED_URL = `${SITE_URL}/feed.xml`;

export async function GET(): Promise<Response> {
  const index = await loadAll();
  const items = index.items.map(renderItem).join("\n");
  const lastBuildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <atom:link href="${escapeXml(FEED_URL)}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

function renderItem(item: FeedItem): string {
  const excerpt = deriveExcerpt(item.raw);
  const url = `${SITE_URL}${routeFor(item)}`;
  const title = titleFor(item, excerpt);

  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(excerpt)}</description>
      <pubDate>${escapeXml(item.frontmatter.published.toUTCString())}</pubDate>
    </item>`;
}

function titleFor(item: FeedItem, excerpt: string): string {
  if (item.kind === "showcase") return resolveShowcaseTitle(item);

  return (
    item.frontmatter.title?.trim() ||
    excerpt ||
    `${item.kind} · #${item.frontmatter.tags[0] ?? "untagged"}`
  );
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return character;
    }
  });
}
