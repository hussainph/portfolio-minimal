import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/content/ProjectPage";
import { loadAll } from "@/lib/content";

interface RouteParams {
  slug: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const index = await loadAll();
  return index.projects.map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const index = await loadAll();
  const project = index.projects.find((p) => p.frontmatter.slug === slug);
  if (!project) return {};

  return {
    title: `${project.frontmatter.title} · Hussain Phalasiya`,
    description: project.frontmatter.subtitle,
  };
}

export default async function ProjectDetailRoute({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const index = await loadAll();
  const project = index.projects.find((p) => p.frontmatter.slug === slug);
  if (!project) notFound();

  return <ProjectPage project={project} />;
}
