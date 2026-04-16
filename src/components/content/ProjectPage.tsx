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
      <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-5 pt-10 pb-8 sm:gap-7 sm:px-8 sm:pt-14 sm:pb-10 md:gap-8 md:px-12 md:pt-16">
        <Link
          href="/projects"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>all projects</span>
        </Link>
      </div>

      <div className="mx-auto max-w-[960px] px-5 sm:px-8 md:px-12">
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
        className="mx-auto max-w-[720px] px-5 pt-8 pb-36 sm:px-8 sm:pt-10 sm:pb-44 md:px-12 md:pb-48"
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
              <h2 className="font-serif text-[22px] leading-[28px] tracking-[-0.015em] text-text sm:text-[25px] sm:leading-[31px] md:text-[28px] md:leading-[34px]">
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
