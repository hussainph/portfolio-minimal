import { FilteredFeed } from "@/components/feed/FilteredFeed";
import { buildFeedItemMeta } from "@/components/feed/filter";
import { renderFeedItem } from "@/components/feed/renderFeedItem";
import { HeaderShader } from "@/components/ui/HeaderShader";
import type { SocialLink } from "@/components/ui/SocialIconRow";
import { NavSetter } from "@/components/nav/NavStateContext";
import { loadAll } from "@/lib/content";

/**
 * `/` is fully prerendered. The feed's `?types=`/`?tags=`/`?q=` filtering used
 * to run here off `searchParams`, which forced the route dynamic — and a
 * dynamic route would try to read `content/*.mdx` off a filesystem that
 * doesn't exist at request time on Cloudflare Workers. Every card is rendered
 * at build time instead and `<FilteredFeed>` hides the non-matching ones.
 *
 * Deliberately NOT `export const dynamic = "force-static"`. The route already
 * prerenders as ○ now that nothing here reads searchParams, and the directive
 * actively breaks the nav: under force-static Next server-renders
 * `useSearchParams()` as empty *into the static HTML* instead of deferring the
 * boundary to the client, so SiteNav's filter pill — whose active state reads
 * `?types=`/`?tags=` — hydrates against markup that disagrees with the real
 * URL and throws React #418. Check the build's route table, not a directive.
 */

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

export default async function Home() {
  const index = await loadAll();
  const entries = index.items.map((item) => ({
    meta: buildFeedItemMeta(item),
    node: renderFeedItem(item),
  }));

  return (
    <main className="min-h-screen bg-background text-text">
      <NavSetter view="home" />
      <div className="mx-auto max-w-[720px] px-5 pt-10 pb-36 sm:px-8 sm:pt-14 sm:pb-44 md:px-12 md:pt-16 md:pb-48 lg:grid lg:max-w-[1140px] lg:grid-cols-[30fr_70fr] lg:gap-12">
        <aside className="mb-10 sm:mb-12 lg:mb-0 lg:sticky lg:top-10 lg:self-start">
          <Header />
        </aside>
        <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-10">
          <FilteredFeed entries={entries} />
        </div>
      </div>
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
