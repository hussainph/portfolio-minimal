import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedList } from "@/components/feed/FeedList";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { Meta } from "@/components/ui/Meta";
import { tagColor } from "@/lib/tagColor";
import { loadAll } from "@/lib/content";

interface RouteParams {
  tag: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const index = await loadAll();
  return Array.from(index.byTag.keys())
    .sort()
    .map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { tag } = await params;
  const index = await loadAll();
  if (!index.byTag.has(tag)) return {};

  return {
    title: `#${tag} · Hussain Phalasiya`,
    description: `Everything tagged #${tag}.`,
  };
}

export default async function TagArchiveRoute({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { tag } = await params;
  const index = await loadAll();
  const items = index.byTag.get(tag);
  if (!items || items.length === 0) notFound();

  const count = items.length;
  const itemLabel = count === 1 ? "item" : "items";
  // The hash-glyph picks up the tag's hue so the title carries a small
  // ambient signal of which feed-slice you're in. Same hash everything else
  // uses, so the color matches the chip and the in-card pills.
  const hashColor = tagColor(tag);

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[720px] flex-col gap-10 px-12 pt-16 pb-48">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>back</span>
        </Link>

        <header className="flex flex-col gap-3">
          <h1 className="font-serif text-[48px] leading-[52px] tracking-[-0.02em] text-text">
            <span style={{ color: hashColor }}>#</span>
            {tag}
          </h1>
          <Meta>
            {count} {itemLabel}
          </Meta>
        </header>

        <FeedList items={items} />
      </div>

      <BottomToolbar activeTab="stream" />
    </main>
  );
}
