import type { ReactElement } from "react";
import type {
  FeedFrontmatter,
  NoteFrontmatter,
  PostFrontmatter,
  ProjectFrontmatter,
  ShowcaseFrontmatter,
} from "./schema";

interface WithBody<TFrontmatter> {
  frontmatter: TFrontmatter;
  raw: string;
  content: ReactElement;
  readingTimeMinutes: number;
  filePath: string;
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
