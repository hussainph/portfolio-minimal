import type { Metadata } from "next";
import Link from "next/link";
import { NavSetter } from "@/components/nav/NavStateContext";
import { Label } from "@/components/ui/Label";
import { SITE_URL } from "@/lib/siteUrl";

const ABOUT_DESCRIPTION =
  "A page about the person behind this feed. A few more words than a bio, a few fewer than a memoir.";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT_DESCRIPTION,
  openGraph: {
    title: "About",
    description: ABOUT_DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description: ABOUT_DESCRIPTION,
  },
};

export default function AboutRoute() {
  return (
    <main className="min-h-screen bg-background text-text">
      <NavSetter view="home" />
      <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-5 pt-10 pb-36 sm:gap-9 sm:px-8 sm:pt-14 sm:pb-44 md:gap-10 md:px-12 md:pt-16 md:pb-48">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>back</span>
        </Link>

        <header className="flex flex-col gap-3">
          <Label tone="faint">ABOUT</Label>
          <h1 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text sm:text-[40px] sm:leading-[44px] md:text-[48px] md:leading-[52px]">
            More about me
          </h1>
        </header>

        <article className="prose-dark">
          <p>
            This is a stub. The proper version is still half-written in a draft
            somewhere, probably nested under a folder called{" "}
            <em>final-final-v2</em>. Check back in a week. Or don&apos;t — the{" "}
            <Link href="/">stream</Link> is where most of me lives anyway.
          </p>
        </article>
      </div>
    </main>
  );
}
