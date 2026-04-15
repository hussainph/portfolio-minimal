# Content Architecture

How the CMS works. For authoring instructions, see [04-authoring-guide.md](04-authoring-guide.md).

## Content Source

All content lives in Markdown+YAML files under `content/` at the repo root — outside `src/`, so it stays out of the TypeScript module graph. Direct file editing only; no admin UI.

### Directory Layout

```
content/
  notes/              # Short-form thoughts; one per file
  posts/              # Long-form essays; one per file
  showcases/          # Visual content; one per file
  projects/           # Project descriptions
    <slug>/
      index.mdx       # 1:1 with route; metadata + description
```

Asset storage is reserved for future use.

## Loader Architecture

All content I/O lives under `src/lib/content/`. Each module has a discrete job:

| File | Purpose |
|------|---------|
| `schema.ts` | Zod discriminated union for frontmatter validation. Defines `NoteFrontmatter`, `PostFrontmatter`, `ShowcaseFrontmatter`, `ProjectFrontmatter` |
| `types.ts` | TypeScript types: `ContentItem`, `FeedItem` (union of note/post/showcase), `ProjectItem`, `ProjectWithTimeline`, `ContentIndex` |
| `loader.ts` | `loadAll(): Promise<ContentIndex>` — reads all files, validates, sorts by `published` (desc), groups by kind/slug/tag. Wrapped in `React.cache()` for per-request dedup |
| `derive.ts` | Helpers: `computeReadingTimeMinutes()`, `deriveExcerpt()` (truncates body to 180 chars if frontmatter doesn't provide one), `formatFeedTimestamp()` |
| `mdx.ts` | `renderMDXBody()` — compiles `.mdx` string to JSX via `next-mdx-remote/rsc`'s `compileMDX`. Plugins: `remark-gfm`, `remark-smartypants`, `rehype-pretty-code` with Shiki `github-dark-dimmed`. Frontmatter stripped by `gray-matter` upstream |
| `preview.ts` | `getRefPreview()` — returns title + slug for `<Ref>` link preview tooltips (future) |
| `index.ts` | Public exports; re-exports from the above modules |

## Load Semantics

### `loadAll()` Returns

A `ContentIndex` object:

```ts
{
  items: FeedItem[],           // Notes, posts, showcases; sorted by published desc
  projects: ProjectWithTimeline[],  // Projects + computed timelines
  bySlug: Map<string, ContentItem>, // Fast lookup for <Ref> resolution
  byTag: Map<string, string[]>,     // Tag → slug[] for feed filtering
}
```

### Build vs Request

- **Most routes prerender via `generateStaticParams()`** — build-time optimization
- **Home `/` is dynamic** — reads `?tag=` searchParams to filter the feed at request time
- Content is cached per-request via `React.cache()`; loader re-runs on each server request, but within a single request, repeated `loadAll()` calls return the same data object (zero I/O)

## MDX Compilation

Uses `next-mdx-remote/rsc`'s `compileMDX` in `src/lib/content/mdx.ts`. Frontmatter is parsed by `gray-matter` during file loading, so the compiler receives body text only (`parseFrontmatter: false`).

**Plugins:**
- `remark-gfm` — GitHub Flavored Markdown tables, strikethrough, autolink literals
- `remark-smartypants` — Curly quotes, dashes, ellipses
- `rehype-pretty-code` — Syntax-highlighted code blocks via Shiki. Theme is `github-dark-dimmed`; can be swapped in globals.css under the `--shiki-` variables

**Global MDX components** (no import needed in `.mdx` files):
- `<Ref slug="..." />` — cross-reference link resolver
- `<Figure src="..." caption="..." glow="..." />` — framed images
- `<Video src="..." poster="..." autoplay />` — video embed
- `<CodeBlock language="js" filename="..." />` — explicit code block (rarely needed; ` ```js ``` ` fences work out of the box)

Additional one-off embeds live in `src/components/embeds/` and are imported directly in `.mdx` bodies (e.g., `import { ForceDemo } from '@/components/embeds/force-demo'`).

## Validation & Errors

Zod discriminated union in `schema.ts` validates all frontmatter. Invalid YAML or missing required fields throw a descriptive error at build or request time — the loader never silently drops bad content.

**Slug uniqueness invariant:** All slugs must be globally unique across notes, posts, showcases, and projects. The loader throws if a duplicate is found.

## Project Timeline Computation

For each project, the loader collects all feed items (`NoteItem`, `PostItem`, `ShowcaseItem`) whose frontmatter includes that project's slug in the `projects` array. These become the project's `timeline`.

Projects without linked content get an empty `timeline` array — the page renders description-only, no timeline section.

## Draft Content

The `draft: true` flag in frontmatter:
- **Dev**: Content is visible in the feed and all archive pages
- **Prod**: Content is hidden (NODE_ENV === "production")

Useful for iteration without publishing.

---

## Why Not `@next/mdx` at Route Level?

The planned approach was to use `@next/mdx` as a plugin at the route level (`src/app/blog/[slug]/page.mdx`), but Turbopack rejects serialized plugin options. All MDX compiles at runtime via `next-mdx-remote/rsc` in `src/lib/content/mdx.ts` instead — same output, no build-time friction.
