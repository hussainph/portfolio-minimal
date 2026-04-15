import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShowcasePage } from "@/components/content/ShowcasePage";
import { deriveExcerpt, getItemBySlug, loadAll } from "@/lib/content";
import type { ShowcaseItem } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

interface RouteParams {
  slug: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const index = await loadAll();
  return index.items
    .filter((item): item is ShowcaseItem => item.kind === "showcase")
    .map((item) => ({ slug: item.frontmatter.slug }));
}

/**
 * Resolve the editorial title for a showcase. Authored frontmatter wins; if
 * absent, bento/grid showcases pick the caption of the `picked: true` tile so
 * the page name reflects the chosen direction (and not whatever happens to
 * sit at index 0). Single-variant or unpicked sets fall back to the first
 * caption, then to a slug-tagged generic.
 */
function resolveShowcaseTitle(item: ShowcaseItem): string {
  const authored = item.frontmatter.title?.trim();
  if (authored) return authored;

  const isMulti =
    item.frontmatter.variant === "bento" ||
    item.frontmatter.variant === "grid";
  if (isMulti) {
    const picked = item.frontmatter.images.find((img) => img.picked === true);
    if (picked?.caption) return picked.caption;
  }

  const firstCaption = item.frontmatter.images[0]?.caption;
  if (firstCaption) return firstCaption;

  return `showcase · ${item.frontmatter.slug}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item || item.kind !== "showcase") return {};

  const title = resolveShowcaseTitle(item);
  const description = deriveExcerpt(item.raw, 160);
  const url = `${SITE_URL}/showcases/${item.frontmatter.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      publishedTime: item.frontmatter.published.toISOString(),
      tags: item.frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ShowcaseRoute({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item || item.kind !== "showcase") notFound();

  return <ShowcasePage item={item} />;
}
