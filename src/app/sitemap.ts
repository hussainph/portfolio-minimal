import type { MetadataRoute } from "next";
import { loadAll } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Enumerate every routable URL on the site. Index routes (home, projects,
 * tag archives) get a recent `lastModified` so crawlers re-check often;
 * content items use their `published` date because the body itself rarely
 * shifts after publication.
 *
 * Priority weighting follows the editorial hierarchy: home and full posts
 * rank highest, projects sit a step below, notes/showcases under that, tag
 * archives last (they're navigation, not destinations).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const index = await loadAll();
  const now = new Date();

  const indexes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const items: MetadataRoute.Sitemap = index.items.map((item) => {
    const lastModified = item.frontmatter.published;
    if (item.kind === "post") {
      return {
        url: `${SITE_URL}/blog/${item.frontmatter.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      };
    }
    if (item.kind === "showcase") {
      return {
        url: `${SITE_URL}/showcases/${item.frontmatter.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      };
    }
    return {
      url: `${SITE_URL}/n/${item.frontmatter.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    };
  });

  const projects: MetadataRoute.Sitemap = index.projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.frontmatter.slug}`,
    lastModified: project.frontmatter.published,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tags: MetadataRoute.Sitemap = Array.from(index.byTag.keys())
    .sort()
    .map((tag) => ({
      url: `${SITE_URL}/tags/${encodeURIComponent(tag)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    }));

  return [...indexes, ...items, ...projects, ...tags];
}
