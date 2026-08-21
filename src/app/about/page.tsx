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
          {/* STUB — write this in your own words. Beats to consider: who you
              are, the three projects (Volli / Consulting Sandbox / Clawbox),
              the through-line, and the fact you're looking. */}
          <p>
            I&apos;m Hussain. I build AI products. The longer version of this
            page is being written; the <Link href="/">stream</Link> and the{" "}
            <Link href="/projects">projects</Link> are the real story anyway.
          </p>
          <p>
            If you want to talk, I&apos;m at{" "}
            <a href="mailto:hussainphalasiya@gmail.com">
              hussainphalasiya@gmail.com
            </a>
            .
          </p>
        </article>
      </div>
    </main>
  );
}
