import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotePage } from "@/components/content/NotePage";
import { deriveExcerpt, getItemBySlug, loadAll } from "@/lib/content";
import type { NoteItem } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

interface RouteParams {
  slug: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const index = await loadAll();
  return index.items
    .filter((item): item is NoteItem => item.kind === "note")
    .map((item) => ({ slug: item.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item || item.kind !== "note") return {};

  const title =
    item.frontmatter.title?.trim() || firstLine(item.raw) || "note";
  const description = deriveExcerpt(item.raw, 160);
  const url = `${SITE_URL}/n/${item.frontmatter.slug}`;

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

export default async function NoteRoute({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item || item.kind !== "note") notFound();

  return <NotePage item={item} />;
}

function firstLine(raw: string): string {
  const line = raw
    .split(/\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!line) return "";
  const truncated = line.length > 80 ? `${line.slice(0, 80).trim()}…` : line;
  return truncated;
}
