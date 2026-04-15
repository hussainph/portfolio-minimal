import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShowcasePage } from "@/components/content/ShowcasePage";
import { deriveExcerpt, getItemBySlug, loadAll } from "@/lib/content";
import type { ShowcaseItem } from "@/lib/content";

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

  const title =
    item.frontmatter.title?.trim() ||
    item.frontmatter.images[0]?.caption ||
    "showcase";
  const description = deriveExcerpt(item.raw, 160);

  return {
    title: `${title} · Hussain Phalasiya`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: item.frontmatter.published.toISOString(),
      tags: item.frontmatter.tags,
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
