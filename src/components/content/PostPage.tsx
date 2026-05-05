import Link from "next/link";
import { NavSetter } from "@/components/nav/NavStateContext";
import { Meta } from "@/components/ui/Meta";
import { Tag } from "@/components/ui/Tag";
import { formatFeedTimestamp } from "@/lib/content";
import type { PostItem, SiblingHrefs } from "@/lib/content";

interface PostPageProps {
  item: PostItem;
  siblings: SiblingHrefs;
}

export function PostPage({ item, siblings }: PostPageProps) {
  const { frontmatter, readingTimeMinutes, toc } = item;
  const timestamp = formatFeedTimestamp(frontmatter.published);

  return (
    <main className="min-h-screen bg-background text-text">
      <NavSetter
        view="post"
        outline={toc}
        prevHref={siblings.prevHref}
        nextHref={siblings.nextHref}
        pageMeta={{
          slug: frontmatter.slug,
          title: frontmatter.title,
        }}
      />
      <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-5 pt-10 pb-36 sm:gap-7 sm:px-8 sm:pt-14 sm:pb-44 md:gap-8 md:px-12 md:pt-16 md:pb-48">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>back</span>
        </Link>

        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {frontmatter.tags.map((t) => (
              <Tag key={t} as="display" name={t}>
                #{t}
              </Tag>
            ))}
            <Meta>· {timestamp}</Meta>
            <Meta>· {readingTimeMinutes} min read</Meta>
          </div>

          <h1 className="font-serif text-[24px] leading-[30px] tracking-[-0.015em] text-text sm:text-[28px] sm:leading-[34px] md:text-[32px] md:leading-[38px]">
            {frontmatter.title}
          </h1>
        </header>

        <article className="prose-dark">{item.content}</article>
      </div>
    </main>
  );
}
