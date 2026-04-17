import { notFound } from "next/navigation";
import { FeedList } from "@/components/feed/FeedList";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { FilterChipRow } from "@/components/ui/FilterChipRow";
import { HeaderShader } from "@/components/ui/HeaderShader";
import type { SocialLink } from "@/components/ui/SocialIconRow";
import { loadAll } from "@/lib/content";
import { parseTagSearchParams } from "@/lib/tagParams";

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: "github",
    href: "https://github.com/hphalasiya",
    label: "GitHub profile",
  },
  {
    icon: "x",
    href: "https://twitter.com/hphalasiya",
    label: "X profile",
  },
  {
    icon: "email",
    href: "mailto:hussain@phalasiya.dev",
    label: "Email Hussain",
  },
];

const BIO =
  "Building stuff, mostly in the AI-product corner of the internet. This is where I keep the half-formed notes, the longer pieces I haven't quite talked myself out of, and the projects that are still learning to stand up.";

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
    <HeaderShader
      name="Hussain Phalasiya"
      bio={BIO}
      socialLinks={SOCIAL_LINKS}
    />
  );
}
