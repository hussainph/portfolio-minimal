import type { ReactElement } from "react";
import type {
  FeedFrontmatter,
  NoteFrontmatter,
  PostFrontmatter,
  ProjectFrontmatter,
  ShowcaseFrontmatter,
} from "./schema";

export interface TocEntry {
  /** Slug used as the target for in-page anchor links. Matches the `id` the
   *  rehype-slug plugin attaches to the rendered h2 element. */
  id: string;
  /** Rendered heading text, stripped of markup. */
  label: string;
}

interface WithBody<TFrontmatter> {
  frontmatter: TFrontmatter;
  raw: string;
  content: ReactElement;
  readingTimeMinutes: number;
  filePath: string;
  /** Table of contents collected from depth-2 headings during MDX compile. */
  toc: TocEntry[];
}

export type NoteItem = WithBody<NoteFrontmatter> & { kind: "note" };
export type PostItem = WithBody<PostFrontmatter> & {
  kind: "post";
  excerpt: string;
};
export type ShowcaseItem = WithBody<ShowcaseFrontmatter> & { kind: "showcase" };
export type ProjectItem = WithBody<ProjectFrontmatter> & { kind: "project" };

export type FeedItem = NoteItem | PostItem | ShowcaseItem;
export type ContentItem = FeedItem | ProjectItem;

export interface ProjectWithTimeline extends ProjectItem {
  timeline: FeedItem[];
}

export interface ContentIndex {
  items: FeedItem[];
  projects: ProjectWithTimeline[];
  bySlug: Map<string, ContentItem>;
  byTag: Map<string, FeedItem[]>;
}

export type FeedFrontmatterOnly = FeedFrontmatter;
