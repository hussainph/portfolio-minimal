import { notFound } from "next/navigation";
import { FeedList } from "@/components/feed/FeedList";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { FilterChipRow } from "@/components/ui/FilterChipRow";
import { HeaderShader } from "@/components/ui/HeaderShader";
import { loadAll } from "@/lib/content";
import { parseTagSearchParams } from "@/lib/tagParams";

const SOCIAL_LINKS = [
  { label: "github / hphalasiya", href: "https://github.com/hphalasiya" },
  { label: "twitter / hphalasiya", href: "https://twitter.com/hphalasiya" },
  { label: "email", href: "mailto:hussain@phalasiya.dev" },
];

interface HomeProps {
  searchParams: Promise<{ tags?: string | string[]; tag?: string | string[] }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const [index, raw] = await Promise.all([loadAll(), searchParams]);
  const activeTags = parseTagSearchParams(raw);
  const unknown = activeTags.find((t) => !index.byTag.has(t));
  if (unknown) notFound();
  // Deterministic alphabetical order so chip layout is stable across requests.
  const tagPool = Array.from(index.byTag.keys()).sort();

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-[720px] px-5 pt-10 pb-36 sm:px-8 sm:pt-14 sm:pb-44 md:px-12 md:pt-16 md:pb-48 lg:grid lg:max-w-[1140px] lg:grid-cols-[30fr_70fr] lg:gap-12">
        <aside className="mb-10 sm:mb-12 lg:mb-0 lg:sticky lg:top-10 lg:self-start">
          <Header />
        </aside>
        <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-10">
          <FilterChipRow tags={tagPool} className="lg:mx-0 lg:px-0" />
          <FeedList items={index.items} activeTags={activeTags} />
        </div>
      </div>
      <BottomToolbar activeTab="stream" />
    </main>
  );
}

function Header() {
  return (
    <header className="overflow-hidden rounded-md border border-border bg-surface">
      <HeaderShader className="h-36 w-full sm:h-44 lg:h-40" />
      <div className="flex flex-col gap-4 p-5 sm:p-6 lg:p-5">
        <h1 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text sm:text-[40px] sm:leading-[44px] md:text-[48px] md:leading-[52px] lg:text-[36px] lg:leading-[40px]">
          Hussain Phalasiya
        </h1>
        <p className="max-w-[560px] font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted lg:max-w-none lg:text-[14px] lg:leading-[21px]">
          Building stuff, mostly in the AI-product corner of the internet. This
          is where I keep the half-formed notes, the longer pieces I haven&apos;t
          quite talked myself out of, and the projects that are still learning
          to stand up.
        </p>
        <nav
          aria-label="Elsewhere"
          className="flex flex-wrap items-center gap-x-4 gap-y-1 lg:gap-x-3"
        >
          {SOCIAL_LINKS.map((link, idx) => (
            <span key={link.label} className="flex items-center gap-4 lg:gap-3">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
              >
                {link.label}
              </a>
              {idx < SOCIAL_LINKS.length - 1 ? (
                <span className="font-mono text-[11px] leading-[14px] text-faint">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}
