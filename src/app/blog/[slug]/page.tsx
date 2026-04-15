import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPage } from "@/components/content/PostPage";
import { getItemBySlug, loadAll } from "@/lib/content";
import type { PostItem } from "@/lib/content";

interface RouteParams {
  slug: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const index = await loadAll();
  return index.items
    .filter((item): item is PostItem => item.kind === "post")
    .map((item) => ({ slug: item.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item || item.kind !== "post") return {};

  const title = item.frontmatter.title;
  const description = item.excerpt;

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

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item || item.kind !== "post") notFound();

  return <PostPage item={item} />;
}
