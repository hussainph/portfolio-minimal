import Link from "next/link";
import { FeedList } from "@/components/feed/FeedList";
import { NavSetter } from "@/components/nav/NavStateContext";
import { ProjectDetailPanes } from "@/components/projects/ProjectDetailPanes";
import { ProjectHero } from "@/components/ui/ProjectHero";
import type { ProjectWithTimeline, SiblingHrefs } from "@/lib/content";
import { cn } from "@/lib/utils";

interface ProjectPageProps {
  project: ProjectWithTimeline;
  siblings: SiblingHrefs;
}

/**
 * Detail template for `/projects/[slug]`. Full-width hero on top, then a
 * two-column pane below — body MDX on the left, timeline on the right —
 * each scrolling independently on desktop. Mobile collapses the pane to a
 * Story/Stream tab bar. Projects with no linked content render the body
 * full-width with no tab bar.
 */
export function ProjectPage({ project, siblings }: ProjectPageProps) {
  const { frontmatter, timeline, toc } = project;
  const hasTimeline = timeline.length > 0;

  return (
    <main className="min-h-screen bg-background text-text">
      <NavSetter
        view="project"
        outline={toc}
        prevHref={siblings.prevHref}
        nextHref={siblings.nextHref}
        pageMeta={{
          slug: frontmatter.slug,
          title: frontmatter.title,
        }}
      />
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
          variant="detail"
          seed={frontmatter.slug}
          tags={frontmatter.tags}
          title={frontmatter.title}
          subtitle={frontmatter.subtitle}
          status={frontmatter.status}
          meta={frontmatter.meta ?? []}
          primaryCta={
            frontmatter.primaryCta ?? {
              label: "Read below",
              href: "#project-body",
            }
          }
          secondaryCta={frontmatter.secondaryCta}
        />
      </div>

      <div
        id="project-body"
        className={cn(
          "mx-auto px-5 pt-8 pb-36 sm:px-8 sm:pt-10 sm:pb-44 md:px-12 md:pb-48",
          hasTimeline ? "max-w-[1140px]" : "max-w-[720px]",
        )}
      >
        <ProjectDetailPanes
          body={project.content}
          timeline={hasTimeline ? <FeedList items={timeline} /> : null}
          streamCount={timeline.length}
        />
      </div>
    </main>
  );
}
