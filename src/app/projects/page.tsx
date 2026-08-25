import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectChip } from "@/components/projects/ProjectChip";
import { NavSetter } from "@/components/nav/NavStateContext";
import { ProjectHero } from "@/components/ui/ProjectHero";
import { loadAll } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

const PROJECTS_DESCRIPTION =
  "Breaking, building and sometimes, even buying.";

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

  // `index.projects` is sorted newest-first by the loader, so "the lead" is
  // the most recent showcase-tier project rather than whatever the filesystem
  // handed back first. Every *other* showcase project gets a major card —
  // they used to fall through to the mid-weight grid and quietly lose their
  // tier, which made a deliberate frontmatter choice look like a bug.
  const showcases = projects.filter((p) => p.frontmatter.tier === "showcase");
  const [featured, ...majors] = showcases;
  const smaller = projects.filter((p) => p.frontmatter.tier === "smaller");
  const bitesized = projects.filter((p) => p.frontmatter.tier === "bitesized");

  return (
    <main className="min-h-screen bg-background text-text">
      <NavSetter view="home" />
      <div className="mx-auto flex max-w-[1140px] flex-col gap-10 px-5 pt-10 pb-36 sm:gap-12 sm:px-8 sm:pt-14 sm:pb-44 md:gap-14 md:px-12 md:pt-16 md:pb-48">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 font-sans text-[13px] leading-[18px] tracking-[-0.03em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>back</span>
        </Link>

        <header className="flex max-w-[640px] flex-col gap-3">
          <h1 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text sm:text-[40px] sm:leading-[44px] md:text-[48px] md:leading-[52px]">
            Projects
          </h1>
        </header>

        {projects.length === 0 ? (
          <p className="py-16 text-center font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
            I seem to have run out of projects to talk about. It&apos;s a glitch in the Matrix, don&apos;t worry.
          </p>
        ) : null}

        {featured ? (
          <ProjectHero
            variant="lead"
            seed={featured.frontmatter.slug}
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

        {majors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {majors.map((project) => (
              <ProjectCard
                key={project.frontmatter.slug}
                weight="major"
                slug={project.frontmatter.slug}
                tags={project.frontmatter.tags}
                title={project.frontmatter.title}
                subtitle={project.frontmatter.subtitle}
                status={project.frontmatter.status}
              />
            ))}
          </div>
        ) : null}

        {smaller.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {smaller.map((project) => (
              <ProjectCard
                key={project.frontmatter.slug}
                weight="compact"
                slug={project.frontmatter.slug}
                tags={project.frontmatter.tags}
                title={project.frontmatter.title}
                subtitle={project.frontmatter.subtitle}
                status={project.frontmatter.status}
              />
            ))}
          </div>
        ) : null}

        {bitesized.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {bitesized.map((project) => (
              <ProjectChip
                key={project.frontmatter.slug}
                slug={project.frontmatter.slug}
                title={project.frontmatter.title}
                tags={project.frontmatter.tags}
                status={project.frontmatter.status}
              />
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
