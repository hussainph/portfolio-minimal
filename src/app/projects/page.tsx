import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectChip } from "@/components/projects/ProjectChip";
import { NavSetter } from "@/components/nav/NavStateContext";
import { ProjectHero } from "@/components/ui/ProjectHero";
import { loadAll } from "@/lib/content";
import type { ProjectWithTimeline } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

const PROJECTS_DESCRIPTION =
  "What I'm working on, what I shipped, what I'm breaking.";

export const metadata: Metadata = {
  title: "Projects",
  description: PROJECTS_DESCRIPTION,
  openGraph: {
    title: "Projects",
    description: PROJECTS_DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/projects`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects",
    description: PROJECTS_DESCRIPTION,
  },
};

export default async function ProjectsIndexRoute() {
  const index = await loadAll();
  const projects = index.projects;

  const featuredIdx = projects.findIndex(
    (p) => p.frontmatter.tier === "showcase",
  );
  const featured = featuredIdx >= 0 ? projects[featuredIdx] : null;
  const grid = featured
    ? projects.filter((_, i) => i !== featuredIdx)
    : projects;

  return (
    <main className="min-h-screen bg-background text-text">
      <NavSetter view="home" />
      <div className="mx-auto flex max-w-[1140px] flex-col gap-10 px-5 pt-10 pb-36 sm:gap-12 sm:px-8 sm:pt-14 sm:pb-44 md:gap-14 md:px-12 md:pt-16 md:pb-48">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>back</span>
        </Link>

        <header className="flex max-w-[640px] flex-col gap-3">
          <h1 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text sm:text-[40px] sm:leading-[44px] md:text-[48px] md:leading-[52px]">
            Projects
          </h1>
          <p className="font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
            What I&apos;m working on, what I shipped, what I&apos;m breaking.
            Headliners up top, then the mid-weight swings, then the weekend stuff.
          </p>
        </header>

        {featured ? (
          <ProjectHero
            variant="lead"
            tags={featured.frontmatter.tags}
            title={featured.frontmatter.title}
            subtitle={featured.frontmatter.subtitle}
            status={featured.frontmatter.status}
            meta={featured.frontmatter.meta ?? []}
            primaryCta={{
              label: featured.frontmatter.primaryCta?.label ?? "Open project",
              href: `/projects/${featured.frontmatter.slug}`,
            }}
          />
        ) : null}

        {grid.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {grid.map((project) => (
              <GridEntry key={project.frontmatter.slug} project={project} />
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}

function GridEntry({ project }: { project: ProjectWithTimeline }) {
  const { frontmatter } = project;

  if (frontmatter.tier === "bitesized") {
    return (
      <ProjectChip
        slug={frontmatter.slug}
        title={frontmatter.title}
        tags={frontmatter.tags}
        status={frontmatter.status}
      />
    );
  }

  return (
    <ProjectCard
      slug={frontmatter.slug}
      tags={frontmatter.tags}
      title={frontmatter.title}
      status={frontmatter.status}
    />
  );
}
