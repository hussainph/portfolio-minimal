import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectChip } from "@/components/projects/ProjectChip";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { Label } from "@/components/ui/Label";
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

const TIER_DESCRIPTORS: Record<ProjectWithTimeline["frontmatter"]["tier"], string> = {
  showcase: "headliners — the ones worth a full pane",
  smaller: "mid-weight — a focused swing, a self-contained shape",
  bitesized: "weekend stuff — throwaways, experiments, the small and the honest",
};

export default async function ProjectsIndexRoute() {
  const index = await loadAll();

  const byTier = {
    showcase: [] as ProjectWithTimeline[],
    smaller: [] as ProjectWithTimeline[],
    bitesized: [] as ProjectWithTimeline[],
  };
  for (const project of index.projects) {
    byTier[project.frontmatter.tier].push(project);
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[720px] flex-col gap-10 px-5 pt-10 pb-36 sm:gap-12 sm:px-8 sm:pt-14 sm:pb-44 md:gap-14 md:px-12 md:pt-16 md:pb-48">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint no-underline transition-colors duration-150 hover:text-muted"
        >
          <span aria-hidden="true">←</span>
          <span>back</span>
        </Link>

        <header className="flex flex-col gap-3">
          <h1 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text sm:text-[40px] sm:leading-[44px] md:text-[48px] md:leading-[52px]">
            Projects
          </h1>
          <p className="max-w-[560px] font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
            What I&apos;m working on, what I shipped, what I&apos;m breaking.
            Headliners up top, then the mid-weight swings, then the weekend stuff.
          </p>
        </header>

        {byTier.showcase.length > 0 ? (
          <TierSection
            tier="showcase"
            projects={byTier.showcase}
            description={TIER_DESCRIPTORS.showcase}
          />
        ) : null}
        {byTier.smaller.length > 0 ? (
          <TierSection
            tier="smaller"
            projects={byTier.smaller}
            description={TIER_DESCRIPTORS.smaller}
          />
        ) : null}
        {byTier.bitesized.length > 0 ? (
          <TierSection
            tier="bitesized"
            projects={byTier.bitesized}
            description={TIER_DESCRIPTORS.bitesized}
          />
        ) : null}
      </div>

      <BottomToolbar activeTab="projects" />
    </main>
  );
}

function TierSection({
  tier,
  projects,
  description,
}: {
  tier: ProjectWithTimeline["frontmatter"]["tier"];
  projects: ProjectWithTimeline[];
  description: string;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline gap-4">
        <Label tone="faint">{tier.toUpperCase()}</Label>
        <span className="font-mono text-[11px] leading-[14px] tracking-[0.02em] text-faint">
          {description}
        </span>
      </div>

      <div
        className={
          tier === "showcase" ? "flex flex-col gap-y-16" : "flex flex-col gap-5"
        }
      >
        {projects.map((project) => (
          <TierEntry key={project.frontmatter.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

function TierEntry({ project }: { project: ProjectWithTimeline }) {
  const { frontmatter } = project;

  if (frontmatter.tier === "showcase") {
    // On the index, both CTAs are typically in-page anchors meant for the
    // detail page. Rewrite the primary to route to `/projects/[slug]` and
    // drop the secondary entirely — the detail page is where the author's
    // anchors actually resolve.
    return (
      <ProjectHero
        badge={frontmatter.badge}
        tags={frontmatter.tags}
        title={frontmatter.title}
        subtitle={frontmatter.subtitle}
        meta={frontmatter.meta ?? []}
        primaryCta={{
          label: frontmatter.primaryCta?.label ?? "Open project",
          href: `/projects/${frontmatter.slug}`,
        }}
        visualBadge={frontmatter.visualBadge}
      />
    );
  }

  if (frontmatter.tier === "smaller") {
    return (
      <ProjectCard
        slug={frontmatter.slug}
        tags={frontmatter.tags}
        title={frontmatter.title}
        subtitle={frontmatter.subtitle}
        status={frontmatter.status}
      />
    );
  }

  return (
    <ProjectChip
      slug={frontmatter.slug}
      title={frontmatter.title}
      tags={frontmatter.tags}
      subtitle={frontmatter.subtitle}
      status={frontmatter.status}
    />
  );
}
