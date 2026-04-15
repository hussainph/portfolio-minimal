import Link from "next/link";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { Meta } from "@/components/ui/Meta";
import { Tag } from "@/components/ui/Tag";
import { formatFeedTimestamp } from "@/lib/content";
import type { NoteItem } from "@/lib/content";

interface NotePageProps {
  item: NoteItem;
}

export function NotePage({ item }: NotePageProps) {
  const { frontmatter, readingTimeMinutes } = item;
  const timestamp = formatFeedTimestamp(frontmatter.published);
  const showReadTime = readingTimeMinutes > 1;

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-12 pt-16 pb-48">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>back</span>
        </Link>

        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {frontmatter.tags.map((t) => (
              <Tag key={t} name={t}>
                #{t}
              </Tag>
            ))}
            <Meta>· {timestamp}</Meta>
            {showReadTime ? <Meta>· {readingTimeMinutes} min</Meta> : null}
          </div>

          {frontmatter.title ? (
            <h1 className="font-serif text-[32px] leading-[38px] tracking-[-0.015em] text-text">
              {frontmatter.title}
            </h1>
          ) : null}
        </header>

        <article className="prose-dark">{item.content}</article>
      </div>

      <BottomToolbar activeTab="stream" />
    </main>
  );
}
