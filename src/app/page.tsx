import { notFound } from "next/navigation";
import { FeedList } from "@/components/feed/FeedList";
import { HeaderShader } from "@/components/ui/HeaderShader";
import type { SocialLink } from "@/components/ui/SocialIconRow";
import { NavSetter } from "@/components/nav/NavStateContext";
import { loadAll } from "@/lib/content";
import { parseTagSearchParams } from "@/lib/tagParams";

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: "github",
    href: "https://github.com/hussainph",
    label: "GitHub profile",
  },
  {
    icon: "x",
    href: "https://twitter.com/hphalasiya",
    label: "X profile",
  },
  {
    icon: "email",
    href: "mailto:me@hussain.ph",
    label: "Email Hussain",
  },
];

const BIO =
  "Building stuff, mostly in the AI-product corner of the internet. This is where I keep the half-formed notes, the longer pieces I haven't quite talked myself out of, and the projects that are still learning to stand up.";

interface HomeProps {
  searchParams: Promise<{
    tags?: string | string[];
    tag?: string | string[];
    types?: string | string[];
    q?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const [index, raw] = await Promise.all([loadAll(), searchParams]);
  const activeTags = parseTagSearchParams(raw);
  const unknown = activeTags.find((t) => !index.byTag.has(t));
  if (unknown) notFound();
  const activeTypes = parseTypesParam(raw.types);
  const query = typeof raw.q === "string" ? raw.q.trim().toLowerCase() : "";

  return (
    <main className="min-h-screen bg-background text-text">
      <NavSetter view="home" />
      <div className="mx-auto max-w-[720px] px-5 pt-10 pb-36 sm:px-8 sm:pt-14 sm:pb-44 md:px-12 md:pt-16 md:pb-48 lg:grid lg:max-w-[1140px] lg:grid-cols-[30fr_70fr] lg:gap-12">
        <aside className="mb-10 sm:mb-12 lg:mb-0 lg:sticky lg:top-10 lg:self-start">
          <Header />
        </aside>
        <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-10">
          <FeedList
            items={index.items}
            activeTags={activeTags}
            activeTypes={activeTypes}
            query={query}
          />
        </div>
      </div>
    </main>
  );
}

function parseTypesParam(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter((s) => s === "note" || s === "post" || s === "showcase");
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
