import Link from "next/link";
import { FeedList } from "@/components/feed/FeedList";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { Label } from "@/components/ui/Label";
import { ProjectHero } from "@/components/ui/ProjectHero";
import { Separator } from "@/components/ui/Separator";
import type { ProjectWithTimeline } from "@/lib/content";

interface ProjectPageProps {
  project: ProjectWithTimeline;
}

/**
 * Detail template for `/projects/[slug]`. Full-width hero at top, a narrower
 * reading column for the MDX description, and a conditional timeline of
 * linked feed items below the hairline. Projects with no linked content just
 * show description-only — no empty state.
 */
export function ProjectPage({ project }: ProjectPageProps) {
  const { frontmatter, timeline } = project;

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-12 pt-16 pb-10">
        <Link
          href="/projects"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>all projects</span>
        </Link>
      </div>

      <div className="mx-auto max-w-[960px] px-12">
        <ProjectHero
          badge={frontmatter.badge}
          tags={frontmatter.tags}
          title={frontmatter.title}
          subtitle={frontmatter.subtitle}
          meta={frontmatter.meta ?? []}
          primaryCta={
            frontmatter.primaryCta ?? {
              label: "Read below",
              href: "#project-body",
            }
          }
          secondaryCta={frontmatter.secondaryCta}
          visualBadge={frontmatter.visualBadge}
        />
      </div>

      <div
        id="project-body"
        className="mx-auto max-w-[720px] px-12 pt-10 pb-10"
      >
        <article className="prose-dark">{project.content}</article>

        {timeline.length > 0 ? (
          <section
            id="project-timeline"
            className="mt-16 flex flex-col gap-8"
          >
            <Separator />
            <div className="flex flex-col gap-2">
              <Label tone="faint">TIMELINE</Label>
              <h2 className="font-serif text-[28px] leading-[34px] tracking-[-0.015em] text-text">
                The thread
              </h2>
              <p className="font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-muted">
                Every note, post, and showcase tagged to this project, newest
                first.
              </p>
            </div>
            <FeedList items={timeline} />
          </section>
        ) : null}
      </div>

      <BottomToolbar activeTab="projects" />
    </main>
  );
}
