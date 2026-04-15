# Authoring Guide

How to write and publish content on the site.

## Quick Start

Create a new `.mdx` file in the appropriate folder:

- **Note:** `content/notes/YYYY-MM-DD-slug.mdx`
- **Post:** `content/posts/YYYY-MM-DD-slug.mdx`
- **Showcase:** `content/showcases/YYYY-MM-DD-slug.mdx`
- **Project:** `content/projects/<slug>/index.mdx`

Add a YAML frontmatter block, then write Markdown body. Restart the dev server; the file is discovered and compiled automatically.

## Frontmatter Cheatsheet

### Note

```yaml
---
type: note
slug: slug-here
published: 2026-04-15
tags: [tag1, tag2]
title: Optional title
projects: [project-slug]        # optional; links to project timeline
engagement: { replies: 2, likes: 5 }  # optional; decorative
draft: false                    # optional; hide from prod
---
```

### Post

```yaml
---
type: post
slug: slug-here
title: Required Title (H1)
published: 2026-04-15
tags: [tag1, tag2]
excerpt: Optional excerpt (derives from body if omitted)
projects: [project-slug]        # optional
engagement: { replies: 2 }      # optional
draft: false                    # optional
---
```

### Showcase

```yaml
---
type: showcase
slug: slug-here
published: 2026-04-15
tags: [tag1]
variant: single | grid | bento
title: Optional title
images:
  - caption: "Caption text"
    glow: warm | cool | pink | amber  # optional; defaults to derived from tag
    picked: true                       # marks featured tile in multi-tile layouts
    src: "path/to/image.png"          # optional; no src = glow-only visual
draft: false                    # optional
---
```

### Project

```yaml
---
type: project
slug: slug-here
title: Project Title
published: 2026-04-15
tags: [tag1]
tier: showcase | smaller | bitesized
subtitle: Short one-liner
status: "v0.4 · in progress"    # optional
badge: "New"                     # optional; renders in page header
meta:                            # optional; meta table
  - label: "Role"
    value: "Design + Dev"
primaryCta:                       # optional; call-to-action button
  label: "See the work"
  href: "https://..."
secondaryCta:                     # optional; secondary CTA
  label: "Learn more"
  href: "https://..."
visualBadge: "✨"               # optional; small emoji/icon for card header
---
```

## Slug Rules

- **Kebab-case:** lowercase letters, digits, hyphens only
- **Globally unique:** No two items (notes, posts, showcases, projects) can share a slug — the loader throws on duplicate
- **Derives the URL:** `/n/<slug>`, `/blog/<slug>`, `/showcases/<slug>`, `/projects/<slug>`

## Tags

Free-form strings. Color is generated deterministically from the name via `tagColor()` — no palette to maintain, no color config needed. Same tag always yields the same color across renders and builds.

## Cross-References

Use `<Ref slug="other-slug">optional label</Ref>` anywhere in any MDX body to link to another item:

```mdx
Read more in <Ref slug="agent-composition">agent design patterns</Ref>.
```

The `slug` must exist in the content loader's `bySlug` map (notes, posts, showcases, or projects). Link text derives from the target's title if omitted; label text is optional. `<Ref>` is globally available — no import needed.

Example: see `content/notes/2026-04-12-agent-composition.mdx` for a real usage.

## MDX Primitives

All of these are globally available in `.mdx` bodies — no imports needed:

| Component | Purpose |
|-----------|---------|
| `<Ref slug="..." />` | Cross-reference link |
| `<Figure src="..." caption="..." glow="..." />` | Framed image; `glow` is optional (warm/cool/pink/amber) |
| `<Video src="..." poster="..." autoplay />` | Embedded video |
| `<CodeBlock language="js" filename="..." />` | Explicit code block (rarely needed) |
| `<PullQuote>…</PullQuote>` | Pull quote — italic serif, left border auto-tints from the post's first tag. Pass `tag="name"` to override. |

Markdown `> quote` blocks compile through `<PullQuote>` too, so the styling is identical whether you write markdown syntax or the explicit component.

Typography mapping is automatic: `#` → H1, `##` → H2, `###` → H3, `**bold**` → strong emphasis, ` ```js code ``` ` → syntax-highlighted block.

## Tier-2 Embeds

For one-off interactive components (e.g., a custom force-directed graph, a specific demo), create a file in `src/components/embeds/`. Import it directly in your `.mdx`:

```mdx
import { ForceDemo } from '@/components/embeds/force-demo'

# My Post

Some prose...

<ForceDemo />
```

See `src/components/embeds/README.md` for the conventions. When a second post wants to reuse an embed, graduate it from `embeds/` to `src/components/mdx/` so it becomes a first-class global primitive.

## Drafts

Set `draft: true` in frontmatter. The item becomes visible in dev but hidden in production — useful for iteration and scheduled publishes.

## Linking to a Project

Add a `projects` array to any note, post, or showcase frontmatter:

```yaml
projects: [clawbox, other-project]
```

The item appears in those projects' timelines. Projects without any linked content still get a page — it just shows description and metadata, no timeline section.

## Projects Without Content

Fine. A project with zero linked items renders the description and metadata only. The timeline section doesn't appear.

## Engagement Metadata

The `engagement: { replies: N, likes: M }` field is **decorative** — no backend. Include it only if it matches real engagement on an external post (Twitter, etc.). Omit it otherwise.
