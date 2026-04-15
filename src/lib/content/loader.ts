import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { frontmatter as frontmatterSchema } from "./schema";
import type {
  Frontmatter,
  FeedFrontmatter,
  ProjectFrontmatter,
} from "./schema";
import { computeReadingTimeMinutes, deriveExcerpt } from "./derive";
import { renderMDXBody } from "./mdx";
import type {
  ContentIndex,
  ContentItem,
  FeedItem,
  NoteItem,
  PostItem,
  ProjectItem,
  ProjectWithTimeline,
  ShowcaseItem,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

interface RawEntry {
  filePath: string;
  relPath: string;
  source: string;
  data: Record<string, unknown>;
  body: string;
}

async function readCollection(subdir: "notes" | "posts" | "showcases"): Promise<RawEntry[]> {
  const dir = path.join(CONTENT_DIR, subdir);
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".mdx"));
  return Promise.all(
    files.map(async (f) => {
      const filePath = path.join(dir, f.name);
      const source = await readFile(filePath, "utf8");
      const parsed = matter(source);
      return {
        filePath,
        relPath: path.join(subdir, f.name),
        source,
        data: parsed.data as Record<string, unknown>,
        body: parsed.content,
      };
    }),
  );
}

async function readProjects(): Promise<RawEntry[]> {
  const dir = path.join(CONTENT_DIR, "projects");
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const dirs = entries.filter((e) => e.isDirectory());
  const rawList = await Promise.all(
    dirs.map(async (d) => {
      const filePath = path.join(dir, d.name, "index.mdx");
      try {
        const source = await readFile(filePath, "utf8");
        const parsed = matter(source);
        return {
          filePath,
          relPath: path.join("projects", d.name, "index.mdx"),
          source,
          data: parsed.data as Record<string, unknown>,
          body: parsed.content,
        } satisfies RawEntry;
      } catch {
        return null;
      }
    }),
  );
  return rawList.filter((x): x is RawEntry => x !== null);
}

function validate(raw: RawEntry): Frontmatter {
  try {
    return frontmatterSchema.parse(raw.data);
  } catch (err) {
    throw new Error(
      `Invalid frontmatter in ${raw.relPath}:\n${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}

async function compileBody(raw: RawEntry) {
  try {
    return await renderMDXBody(raw.body);
  } catch (err) {
    throw new Error(
      `Failed to compile MDX in ${raw.relPath}:\n${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}

async function buildFeedItem(raw: RawEntry, fm: FeedFrontmatter): Promise<FeedItem> {
  const content = await compileBody(raw);
  const readingTimeMinutes = computeReadingTimeMinutes(raw.body);

  if (fm.type === "note") {
    const item: NoteItem = {
      kind: "note",
      frontmatter: fm,
      raw: raw.body,
      content,
      readingTimeMinutes,
      filePath: raw.relPath,
    };
    return item;
  }

  if (fm.type === "post") {
    const excerpt = fm.excerpt ?? deriveExcerpt(raw.body);
    const item: PostItem = {
      kind: "post",
      frontmatter: fm,
      raw: raw.body,
      content,
      readingTimeMinutes,
      filePath: raw.relPath,
      excerpt,
    };
    return item;
  }

  const item: ShowcaseItem = {
    kind: "showcase",
    frontmatter: fm,
    raw: raw.body,
    content,
    readingTimeMinutes,
    filePath: raw.relPath,
  };
  return item;
}

async function buildProjectItem(raw: RawEntry, fm: ProjectFrontmatter): Promise<ProjectItem> {
  const content = await compileBody(raw);
  const readingTimeMinutes = computeReadingTimeMinutes(raw.body);
  return {
    kind: "project",
    frontmatter: fm,
    raw: raw.body,
    content,
    readingTimeMinutes,
    filePath: raw.relPath,
  };
}

function shouldInclude(fm: Frontmatter): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return !fm.draft;
}

function buildProjectIndex(
  projects: ProjectItem[],
  items: FeedItem[],
): ProjectWithTimeline[] {
  return projects.map((project) => {
    const timeline = items
      .filter((it) => it.frontmatter.projects?.includes(project.frontmatter.slug))
      .sort(
        (a, b) =>
          b.frontmatter.published.getTime() - a.frontmatter.published.getTime(),
      );
    return { ...project, timeline };
  });
}

function buildBySlug(items: FeedItem[], projects: ProjectItem[]): Map<string, ContentItem> {
  const map = new Map<string, ContentItem>();
  const add = (slug: string, item: ContentItem, label: string) => {
    if (map.has(slug)) {
      throw new Error(
        `Duplicate slug "${slug}" (second occurrence: ${label} at ${item.filePath}). Slugs must be globally unique across all content types.`,
      );
    }
    map.set(slug, item);
  };
  for (const it of items) add(it.frontmatter.slug, it, it.kind);
  for (const p of projects) add(p.frontmatter.slug, p, "project");
  return map;
}

function buildByTag(items: FeedItem[]): Map<string, FeedItem[]> {
  const map = new Map<string, FeedItem[]>();
  for (const item of items) {
    for (const tag of item.frontmatter.tags) {
      const list = map.get(tag) ?? [];
      list.push(item);
      map.set(tag, list);
    }
  }
  return map;
}

export const loadAll = cache(async (): Promise<ContentIndex> => {
  const [rawNotes, rawPosts, rawShowcases, rawProjects] = await Promise.all([
    readCollection("notes"),
    readCollection("posts"),
    readCollection("showcases"),
    readProjects(),
  ]);

  const feedRaw = [...rawNotes, ...rawPosts, ...rawShowcases];
  const feedItems: FeedItem[] = await Promise.all(
    feedRaw
      .map((raw) => ({ raw, fm: validate(raw) }))
      .filter(({ fm, raw }) => {
        if (fm.type === "project") {
          throw new Error(`Unexpected project frontmatter in feed file ${raw.relPath}`);
        }
        return shouldInclude(fm);
      })
      .map(({ raw, fm }) => buildFeedItem(raw, fm as FeedFrontmatter)),
  );

  const projectItems: ProjectItem[] = await Promise.all(
    rawProjects
      .map((raw) => ({ raw, fm: validate(raw) }))
      .filter(({ fm, raw }) => {
        if (fm.type !== "project") {
          throw new Error(`Expected project frontmatter in ${raw.relPath}, got "${fm.type}"`);
        }
        return shouldInclude(fm);
      })
      .map(({ raw, fm }) => buildProjectItem(raw, fm as ProjectFrontmatter)),
  );

  feedItems.sort(
    (a, b) => b.frontmatter.published.getTime() - a.frontmatter.published.getTime(),
  );

  const projects = buildProjectIndex(projectItems, feedItems);
  const bySlug = buildBySlug(feedItems, projectItems);
  const byTag = buildByTag(feedItems);

  return { items: feedItems, projects, bySlug, byTag };
});

export async function getItemBySlug(slug: string): Promise<ContentItem | undefined> {
  const index = await loadAll();
  return index.bySlug.get(slug);
}
