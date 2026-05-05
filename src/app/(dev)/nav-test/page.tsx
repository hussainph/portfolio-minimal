import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/Label";

export const metadata: Metadata = {
  title: "nav-test · sandbox",
};

/**
 * Dev-only scaffold kept around so future nav iterations have a quiet room to
 * live in without touching production routes. The production `SiteNav` is
 * mounted by `src/app/layout.tsx`, so it appears at the bottom of this page
 * too — the sandbox body is intentionally empty. Replace this file when
 * prototyping a new variant; diff against the shipped `src/components/nav/`
 * when promoting.
 */
export default function NavTestPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-5 pt-10 pb-36 sm:px-8 sm:pt-14 md:px-12 md:pt-16">
        <Label tone="faint">nav-test · sandbox</Label>
        <h1 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text sm:text-[40px] sm:leading-[44px]">
          Empty by design
        </h1>
        <p className="max-w-[560px] font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
          The shipped nav lives in{" "}
          <code className="font-mono text-[13px] text-text">src/components/nav/</code>{" "}
          and is mounted by the root layout. That pill row at the bottom of
          this page is the real thing — drop prototype scaffolding into this
          file when the next iteration starts. For the working production
          reference, see{" "}
          <Link href="/" className="text-text-link underline decoration-dotted">
            the home feed
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
