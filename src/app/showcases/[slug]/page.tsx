import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShowcasePage } from "@/components/content/ShowcasePage";
import {
  computeSiblingHrefs,
  deriveExcerpt,
  getItemBySlug,
  loadAll,
  resolveShowcaseTitle,
} from "@/lib/content";
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
  const [item, index] = await Promise.all([getItemBySlug(slug), loadAll()]);
  if (!item || item.kind !== "showcase") notFound();

  const siblings = computeSiblingHrefs(item, index);
  return <ShowcasePage item={item} siblings={siblings} />;
}
