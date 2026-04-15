# Embeds

One-off interactive components scoped to a single MDX post. The Tier-2
half of the MDX component story — Tier 1 lives in
[`src/components/mdx/`](../mdx/) and is globally available in every body.

## When to put a component here

You're writing a post and want to embed a small live demo, sketch, or
sandbox that exists for that one post. The component will probably never
be reused. Putting it in `src/components/mdx/` and the global map would
bloat the map for every other body and give the embed a footprint it
doesn't deserve.

Drop it here instead, and import it directly in the MDX file:

```mdx
import { ForceDemo } from '@/components/embeds/force-demo'

The toy I built yesterday:

<ForceDemo />
```

## Conventions

- **Filename:** `kebab-case.tsx`. Match the import name in the MDX file.
- **Export:** named export of the component is fine — the MDX file is
  doing the importing, not a global map.
- **Co-locate small state:** Tailwind classes inline. CSS files only when
  a component needs animations the JSX can't carry comfortably.
- **No frontmatter coupling:** the embed shouldn't read frontmatter or
  the content index. If it needs that, it's probably a primitive in
  disguise — graduate it to `src/components/mdx/`.

## Graduating to a primitive

When two or more posts want the same embed, lift it to
`src/components/mdx/`, add it to the `sharedComponents` map in the
repo-root `mdx-components.tsx`, and add a specimen to
[`/ui-test`](../../app/(dev)/ui-test/page.tsx). At that point it stops
being one author's tool and starts being part of the design system.

## Specimens

Every embed authored here also gets a row on `/ui-test` so the component
library stays browsable in one place. The specimen lives under §10+ in
the page numbering.
