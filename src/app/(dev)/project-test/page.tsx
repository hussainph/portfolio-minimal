import { notFound } from "next/navigation";
import { PlaygroundClient } from "@/components/projects/playground/PlaygroundClient";
import { Label } from "@/components/ui/Label";

/**
 * Dev-only playground for prototyping the redesigned Projects index — a Bento
 * Showcase of visual-first project cards with a featured hero tile. Tag toggles
 * reduce the visible set and the grid reflows via the morph engine; cards link to
 * their detail page. Tune the reflow animation in the in-house panel; tune card
 * *styling* with the interface-kit paintbrush (already mounted).
 *
 * 404s in production, mirroring the other `(dev)` routes.
 */
export default function ProjectTestPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 pt-10 pb-36 sm:px-8 sm:pt-14 sm:pb-44 md:px-12 md:pt-16 md:pb-48">
        <header className="flex max-w-[640px] flex-col gap-3">
          <Label tone="faint">project-test · playground</Label>
          <h1 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text sm:text-[40px] sm:leading-[44px]">
            Bento showcase
          </h1>
          <p className="font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
            Every project in one bento, one featured hero. Filter by tag to narrow
            the set — the grid reflows. Cards link through to the detail page. Mock
            data, built to feel right at many projects.
          </p>
        </header>

        <PlaygroundClient />
      </div>
    </main>
  );
}
