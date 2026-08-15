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
            The short version: I&apos;m Hussain. I build AI products — the kind
            where an agent actually does something in front of you and you can
            watch it succeed or fail, which I&apos;ve slowly come to believe is
            the whole game.
          </p>
          <p>
            The slightly longer version: this past while I built{" "}
            <Link href="/projects/volli">Volli</Link>, a desktop app for
            planning and running AI coding agents — 289k lines in about five
            and a half weeks, built largely <em>with</em> the same agents it
            exists to run, which still feels a little surreal to type.
            Before that it was{" "}
            <Link href="/projects/consulting-sandbox">Consulting Sandbox</Link>
            , a training platform for a university where students interview AI
            stakeholders who refuse to answer lazy questions. And in the
            background there&apos;s{" "}
            <Link href="/projects/clawbox">Clawbox</Link>, a programmable claw
            machine, because I feel like most agent demos have no stakes and a
            claw that visibly drops the thing is the most honest feedback
            mechanism I could come up with.
          </p>
          <p>
            I guess the through-line — and I&apos;ve rewritten this sentence a
            few times trying to make it sound less like a mission statement —
            is that I keep building things where the AI has to earn it. Earn
            the answer by asking better questions. Earn the merge by surviving
            review. Earn the prize by actually gripping it. The tools are
            getting absurdly good, and I think the interesting work now is
            designing the situations where they either deliver or visibly
            don&apos;t.
          </p>
          <p>
            The reality is I&apos;m also looking for my next role right now, so
            if you&apos;re here because someone forwarded you this link — hi.
            The <Link href="/">stream</Link> is the real portfolio; this page
            is just the trailer. And if you want to talk, I&apos;m at{" "}
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
