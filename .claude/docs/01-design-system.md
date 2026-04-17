# Design System v4

Living reference for the portfolio site. The source of truth is the live specimen at [/ui-test](../../src/app/(dev)/ui-test/page.tsx) — if this doc and that page ever disagree, ui-test wins and this doc gets updated.

Paper file: [Component Library v4](https://app.paper.design/file/01KP2D4WXCKYD9AQGXGMJZKGPK/1-0/2TN-0).

## Concept

Personal feed / microblog — a single-column, reverse-chronological stream mixing **notes**, **posts**, and **project showcases**. Like a personal Twitter with richer content types, folded into a reading surface. Dark Warmth palette: deep neutral ground, warm cream ink, generative OKLCH tag hues, two restrained accents.

## Fonts

Three fonts, three jobs. **All display and heading levels are serif** — DM Sans is body and UI only.

| Font | Role | Weight |
|------|------|--------|
| Instrument Serif | Display, H1, H2, H3, post titles, pull quotes (italic) | 400 · regular + italic |
| DM Sans | Body, small, UI labels, captions, link text | 400–500, tracked -3% |
| JetBrains Mono | Tags, timestamps, meta labels, inline code, system chrome | 400–500 |

### Type Scale

All serif sizes use default tracking. DM Sans runs at **-0.03em (-3%)** everywhere. Mono runs at default tracking (occasionally +0.04em for uppercase system labels).

| Role | Font | Size / Line | Tracking | Used on |
|------|------|-------------|----------|---------|
| **Display** | Instrument Serif | 48 / 52 | -0.02em | Header name, hero titles, ProjectHero title |
| **H1** | Instrument Serif | 32 / 38 | -0.015em | Post titles on `/blog/[slug]` |
| **H2** | Instrument Serif | 24 / 32 | -0.01em | Section headings, BlogPostCard title |
| **H3** | Instrument Serif | 19 / 26 | -0.01em | Sub-headings in long posts |
| **Pull Quote** | Instrument Serif Italic | 24 / 34 | -0.01em | `<blockquote>` with colored left border |
| **Body** | DM Sans 400 | 16 / 24 | -0.03em | Longform body, card excerpts, prose MDX |
| **Small** | DM Sans 400 | 13 / 20 | -0.03em | Read time, metadata row, secondary UI |
| **System** | JetBrains Mono | 11 / 16 | default | Tags, timestamps, Meta, Label |
| **System XS** | JetBrains Mono | 10 / 14 | +0.02–0.05em | Motion specs, field labels, tiny chrome |
| **Code inline** | JetBrains Mono | 13–15 / 22–24 | default | `<code>` in prose |

Tracking rules are enforced globally in [globals.css](../../src/app/globals.css): DM Sans children get -3%; `.font-serif` and `.font-mono` reset to normal.

## Colors

### Ground — Deeper Dark, Dark Warmth v4

Thirteen tokens, each with a single job. Defined under `@theme` in [globals.css](../../src/app/globals.css#L3).

| Token | Hex | Role |
|-------|-----|------|
| `background` | `#0a0a0b` | Page floor — deepest layer |
| `sunken` | `#0c0c0e` | Callout panels, motion specs, reading frames (below the page) |
| `surface` | `#141416` | Card at rest |
| `elevated` | `#1a1a1d` | Card hover + subtle dividers |
| `border` | `#252528` | Default card / section border |
| `border-hover` | `#2e2e32` | Card hover border, toolbar pill border |
| `text` | `#f0ebe3` | Hero + note body — warm cream |
| `text-link` | `#e8e1d4` | Inline text link, default state |
| `body` | `#bfb8ae` | Longform body + card hover excerpt |
| `quote` | `#bfb4a8` | Pull quote — warmer than body |
| `muted` | `#908a84` | Secondary text |
| `faint` | `#555250` | Captions, disabled glyphs, field labels |
| `visited` | `#4e8590` | Visited text link — muted teal |

### Tags — Generative OKLCH

There is no fixed tag palette. Colors come from [tagColor()](../../src/lib/tagColor.ts), a pure djb2 hash of the tag name mapped to OKLCH hue:

```
tagColor(name) = oklch(74% 0.14 hash(name) mod 360)
```

Lightness (74%) and chroma (0.14) are locked — only hue varies. Same input always yields the same color across renders, sessions, and builds. Adding a new tag never requires touching a palette file.

The Tag component uses alpha channels for state:

| State | Fill alpha | Border alpha |
|-------|------------|--------------|
| default | 0.094 | 0.188 |
| hover | 0.188 | 0.333 |
| active | 1.0 (solid fill) | 1.0 |

Active tags invert to near-black text on the saturated fill.

### Tile Glow — Tag-derived visual mood

Showcase cards and images in post bodies use a tile glow: a radial gradient with color derived from a tag name, so the visual mood follows content naturally. Implemented via [tileGlow()](../../src/lib/tagGlow.ts):

```
tileGlow(tagName, intensity) → radial-gradient(...)
```

Two intensities:
- `strong` — the picked / featured tile in multi-tile layouts (22% alpha)
- `weak` — alternates, sitting alongside the feature (12% alpha)

Both layer over a neutral base gradient (`from-[#1f1f22] to-[#161618]`). **Exception:** `<Figure>` components in MDX bodies use a fixed `glow` prop (warm/cool/pink/amber) to signal deliberate visual mood independent of tag context.

### Accents — Two only

Outside tag hues, only two color accents are permitted anywhere in the UI:

| Token | Hex | Use |
|-------|-----|-----|
| `accent-teal` | `#70CFD4` | Text link hover/solid underline; rare focused emphasis |
| `accent-orange` | `#E89878` | "Hover" / motion-spec labels; inline copy emphasis inside callout frames |

No gradients of the Sunset kind. No rainbow stripes. Restraint is part of the voice.

## Elements

### Radius scale

Defined as theme tokens; use semantically.

| Token | Value | Use |
|-------|-------|-----|
| `radius-xs` | 2px | Color chips, tiny indicators |
| `radius-card` | 4px | Cards, buttons, containers |
| `radius-panel` | 10px | Callout/reading frames, inner panels |
| `radius-pill` | 9999px | Tags, avatar, nav pills |

### Icons

Phosphor Light weight. Rest state in `faint`. On active/interaction, icons inherit a tag hue (reply → indigo, bookmark → amber, like → rose, share → mint), derived via `tagColor()` so the color system stays unified.

[SocialIconRow](../../src/components/ui/SocialIconRow.tsx) is a three-icon row for external social links (GitHub, X, email). Combines magnetic cursor attraction (pointer-tracked spring, ±8px), hover bounce (`scale 1.15, y: -2`), and weight crossfade (regular → fill). Respects `prefers-reduced-motion`.

### Separators

1px solid `border` between feed items. No section shadows, no backdrop fills — just ruled lines.

### Spacing

4px base unit. Standard stops: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Card internal padding lives around 20–24px; page gutter is 48px on the ui-test spec (`px-12`), max container width 960px.

---

## Components

### Content cards (feed primitives)

| Component | Shape | Notes |
|-----------|-------|-------|
| [NoteCard](../../src/components/ui/NoteCard.tsx) | Short-form — tags, timestamp, body, optional engagement | Whole card clickable via overlay link; hover reveals tag-colored left stripe + elevated bg |
| [BlogPostCard](../../src/components/ui/BlogPostCard.tsx) | Long-form — adds title (H2 serif), excerpt (muted), read time | Overlay link + hover nudge on "Read →" label |
| [ShowcaseCard](../../src/components/ui/ShowcaseCard.tsx) | Design work — body + `images[]` with `{caption, glow, picked?}` | 1-tile or grid variant; overlay link pattern |
| [BentoShowcase](../../src/components/ui/BentoShowcase.tsx) | Exactly 3 images — fixed 280px height; 1 featured (55%, left) + 2 stacked (45%, right). "FEATURED" badge on picked tile | Used for comparison sets; overlay link pattern |

Image glow variants: `warm`, `cool`, `pink`, `amber` (ambient radial gradients, decorative until real images arrive).

### Project cards (smaller tier)

| Component | Shape | Notes |
|-----------|-------|-------|
| [ProjectCard](../../src/components/projects/ProjectCard.tsx) | Mid-weight project card — serif title, muted subtitle, status meta, CTA nudge | Overlay link pattern; tag chips interactive |
| [ProjectChip](../../src/components/projects/ProjectChip.tsx) | Lightweight compact row (~40–52px) — title, optional subtitle, tags, status | Bitesized tier; overlay link pattern |

### Filter & status

| Component | Purpose |
|-----------|---------|
| [FilterChipRow](../../src/components/ui/FilterChipRow.tsx) | Sticky filter row above feed. Multi-select via `?tags=a,b,c` (AND), with tag clicks toggling. Wrapped in `<Suspense>` for dynamic searchParams |

### Primitives

| Component | Purpose |
|-----------|---------|
| [HeaderShader](../../src/components/ui/HeaderShader.tsx) | Interactive Backdrop header composition. Cycles through 6 Paper shader variants (3 Dithering + 2 GrainGradient + 1 Warp presets) with scale crossfade on top-half click (aria-label: "Shuffle header shader"). Includes frosted plaque at bottom with name, bio, and SocialIconRow. Min heights: 330px (sm: 390px, lg: 420px) |
| [Tag](../../src/components/ui/Tag.tsx) | Pill with generative hue. Polymorphic: `as="display"` (span), `as="link"` (Link), `as="filter"` (button). States: default / hover / active |
| [TextLink](../../src/components/ui/TextLink.tsx) | Cream + dashed teal underline at rest → solid teal hover → muted teal when visited. External links show a trailing arrow |
| [Meta](../../src/components/ui/Meta.tsx) | 11px JB Mono, `muted` or `faint` tone. For timestamps, separators, small metadata |
| [Label](../../src/components/ui/Label.tsx) | Uppercase JB Mono system label. Size `xs` (9px) or `sm` (11px), tones `faint` / `muted` / `text` |
| [Separator](../../src/components/ui/Separator.tsx) | 1px border-top between feed items |
| [Icon](../../src/components/ui/Icon.tsx) | Phosphor Light: reply, like, bookmark, share, arrow-right, arrow-up-right, search, menu, grid, user |
| [PrimaryButton](../../src/components/ui/PrimaryButton.tsx) | See Motion section below. Polymorphic (`<button>` or `<a>`) |
| [ProjectHero](../../src/components/ui/ProjectHero.tsx) | Headliner. Two-pane: editorial left (serif display title, subtitle, meta table, CTAs) + drifting shader visual right |
| [BottomToolbar](../../src/components/ui/BottomToolbar.tsx) | Fixed bottom nav. 3 tabs (stream / projects / about) + search. Auto-hides after 3s idle past 200px scroll |

### MDX content primitives

| Component | Purpose |
|-----------|---------|
| [Ref](../../src/components/mdx/Ref.tsx) | Cross-reference link. Resolves slugs to routes; globally available in `.mdx` bodies |
| [Figure](../../src/components/mdx/Figure.tsx) | Framed image for post bodies. Glow prop maps fixed moods (warm/cool/pink/amber); omit for neutral |
| [Video](../../src/components/mdx/Video.tsx) | Embedded video with optional poster and autoplay |
| [CodeBlock](../../src/components/mdx/CodeBlock.tsx) | Explicit code block (usually unnecessary; fenced ` ```js ``` ` blocks auto-render) |

### Overlay link pattern

**Cards are clickable while inner elements stay interactive.** Implementation: `<Link>` wraps the card; its child has `before:absolute before:inset-0` so the pseudo-element becomes the clickable layer. Tag pills, buttons, and other tappable elements sit above the pseudo-element in stacking order. Applied to `NoteCard`, `BlogPostCard`, `ShowcaseCard`, `BentoShowcase`, `ProjectCard`, `ProjectChip`.

---

## Motion

Three animation tools, in order of preference:

### 1. Framer Motion — for component lifecycle

Entry / exit / state transitions on React components. Example: BottomToolbar's auto-hide uses a spring.

```
spring · stiffness 260 · damping 22 · mass 1
```

Use the `/interface-craft` skill for storyboard-style sequencing, DialKit for live-tuning, and polish audits.

### 2. CSS Houdini `@property` — for animated gradient angles

Custom properties typed as `<angle>` become interpolatable, so a conic gradient can actually rotate. Two uses today (see [globals.css](../../src/app/globals.css)):

- `--ring-angle` — [PrimaryButton](../../src/components/ui/PrimaryButton.tsx) shader ring. 45° → 405° over 6s linear infinite on hover. Conic fades in over 300ms so the color doesn't pop.
- `--shader-angle` — [ProjectHero](../../src/components/ui/ProjectHero.tsx) visual-pane shimmer. Very slow 360° drift for ambient liveness.

Only the hovered element animates — no global scheduler.

### 3. Paper canvas shaders — for ambient motion with WebGL

Procedural shader motion via `@paper-design/shaders-react` (multiple types: Dithering, GrainGradient, Warp). Used on [HeaderShader](../../src/components/ui/HeaderShader.tsx) for homepage variants cycling. Respects `prefers-reduced-motion` by setting `speed={0}` inside `useReducedMotion()` — do not try to halt the shader via CSS; instead pass the flag to the component.

### 4. `prefers-reduced-motion`

Global rule in [globals.css](../../src/app/globals.css#L89): all `animation-name` values drop to `none` when the user has reduced motion set. Components should still fade/change color at a subtler threshold so affordance stays legible.

---

## Feed Structure

### Header

Header is a tall Backdrop card rendered by [HeaderShader](../../src/components/ui/HeaderShader.tsx) with two visual layers:

- **Top half** (click target): Paper shader variants (Dithering/GrainGradient/Warp presets) with scale crossfade (550ms) on variant advance
- **Bottom half**: Heavily-blurred frosted plaque overlaid with name (Instrument Serif, display size), bio (DM Sans 400, `muted`), and [SocialIconRow](../../src/components/ui/SocialIconRow.tsx)

Min heights: 330px (sm: 390px, lg: 420px). Mobile/tablet: card stacks vertically above FilterChipRow. Desktop (lg:): card pins to left column (sticky), FilterChipRow + FeedList float to right column.

### Tag filter chips

Row of `Tag` pills above the feed. Default alphas at rest; active state fills with the tag's hue and inverts text to near-black. URL-driven (`?tag=...`) — click filters feed server-side, shareable.

### Feed items

- **Note:** tag pill + timestamp → body text → icon row
- **Post:** tag pills + timestamp + read time → serif title (H2) → muted excerpt → icon row
- **Showcase:** tag pills + timestamp → body text → image tile(s) with glow
- **Bento:** same as showcase with the fixed asymmetric 3-tile layout
- **Separator** between every item

### Bottom toolbar

Fixed, centered, backdrop blur (`backdrop-filter: blur(24px); bg #14141699`). Auto-hide after 3s idle past 200px scroll. Returns on cursor motion, scroll, or keypress.

---

## Voice

All copy uses the [hussain-voice skill](../skills/hussain-voice/). Key traits: tentative conclusions, spiral structure, hedging as voice, self-aware asides, casual profanity as texture. Never sounds like LinkedIn or marketing copy.

Applies to UI chrome too — button labels, empty states, specimen subtitles. If a string starts feeling like a stock template, rewrite it.

---

## When this doc needs an update

- New component lands in [src/components/ui/](../../src/components/ui/) — add a row to Components
- New design token added to [globals.css](../../src/app/globals.css) — add to the relevant scale table
- New animation pattern introduced — extend the Motion section
- Type scale tweaked on the specimen — reconcile the Type Scale table
- Any claim in this doc contradicts [/ui-test](../../src/app/(dev)/ui-test/page.tsx) — ui-test wins; update here
