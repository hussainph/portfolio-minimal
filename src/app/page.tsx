import { FeedList } from "@/components/feed/FeedList";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { loadAll } from "@/lib/content";

const SOCIAL_LINKS = [
  { label: "github / hphalasiya", href: "https://github.com/hphalasiya" },
  { label: "twitter / hphalasiya", href: "https://twitter.com/hphalasiya" },
  { label: "email", href: "mailto:hussain@phalasiya.dev" },
];

export default async function Home() {
  const index = await loadAll();

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[720px] flex-col gap-14 px-12 pt-16 pb-48">
        <Header />
        <FeedList items={index.items} />
      </div>
      <BottomToolbar activeTab="stream" />
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col gap-4">
      <h1 className="font-serif text-[48px] leading-[52px] tracking-[-0.02em] text-text">
        Hussain Phalasiya
      </h1>
      <p className="max-w-[560px] font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
        Building stuff, mostly in the AI-product corner of the internet. This is
        where I keep the half-formed notes, the longer pieces I haven&apos;t
        quite talked myself out of, and the projects that are still learning to
        stand up.
      </p>
      <nav
        aria-label="Elsewhere"
        className="flex flex-wrap items-center gap-x-4 gap-y-1"
      >
        {SOCIAL_LINKS.map((link, idx) => (
          <span key={link.label} className="flex items-center gap-4">
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
    </header>
  );
}
