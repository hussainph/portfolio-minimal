# Design System v4

Living reference for the portfolio site design system. Designed collaboratively in Paper (April 2026).

## Concept

Personal feed/microblog — a single-column, reverse-chronological stream mixing notes, posts, and project showcases. Like a personal Twitter with richer content types. Header with ambient gradient glow + rainbow side stripe flows into a hashtag filter navbar into the feed.

## Fonts

Three fonts, three jobs:

| Font | Role | Weight | Tracking |
|------|------|--------|----------|
| Instrument Serif Regular | Display, H1, post titles | 400 | default |
| Instrument Serif Italic | Pull quotes, accent text only | 400 italic | default |
| DM Sans | Body, H2, H3, UI text, taglines | 400–500 | -0.03em (-3%) |
| JetBrains Mono | Tags, timestamps, labels, code | 400–500 | default |

### Type Scale

- **Display:** Instrument Serif Regular / 40px
- **H1:** Instrument Serif Regular / 28px
- **H2:** DM Sans 500 / 22px / -3%
- **H3:** DM Sans 500 / 18px / -3%
- **Body:** DM Sans 400 / 15px / -3% / line-height 1.65
- **Small:** DM Sans 400 / 13px / -3% / muted color
- **System:** JetBrains Mono / 11px / tags, timestamps, labels

## Colors

### Ground (Deeper Dark — neutral near-black)

| Token | Hex | Usage |
|-------|-----|-------|
| background | `#0a0a0b` | Page bg, deepest layer |
| surface | `#141416` | Cards, navbar, elevated containers |
| elevated | `#1e1e21` | Hover states, nested surfaces |
| border | `#252528` | Lines, separators, card borders |
| text | `#f0ebe3` | Primary text (warm cream on neutral dark) |
| muted | `#908a84` | Secondary text, excerpts, descriptions |
| faint | `#555250` | Timestamps, labels, inactive icons |

### Tags (Dark Warmth — 75% saturation, 58% lightness)

All tag colors are perceptually unified — same saturation and lightness, only hue varies. This is what makes them feel like a system instead of individual picks.

| Tag | Hex | Icon State |
|-----|-----|------------|
| `#ai` | `#7B7EFF` | Reply (filled) |
| `#building` | `#FFB844` | Bookmark (filled) |
| `#design` | `#FF7A94` | Like/heart (filled) |
| `#thinking` | `#FFCC55` | — |
| `#code` | `#4AE0B4` | Share |
| `#reading` | `#4AC0E0` | — |

Tag pills use 10-12% opacity background + 15-20% opacity border of the tag color.

### Accent Gradient

- **Primary (Sunset):** `#FFB844 → #FF7A94` — used for active "All" filter, featured borders, hover states
- **Side Stripe:** All 6 tag colors as a vertical gradient — dynamically computed from active tags
  - `#FFB844 → #FF7A94 → #FFCC55 → #4AE0B4 → #4AC0E0 → #7B7EFF`

## Elements

| Element | Radius | Notes |
|---------|--------|-------|
| Cards, containers | 4px | Subtle, not bubbly |
| Tag pills | 999px (full pill) | Always rounded |
| Buttons | 4px | Match containers |
| Avatars | 999px (circle) | If used |

- **Icons:** Phosphor Light weight. Default state in `faint` color. Active state fills with tag color (heart → rose, bookmark → amber, reply → indigo, share → mint).
- **Separators:** 1px solid `border` color between feed items.
- **Spacing:** 4px base unit. Common values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

## Feed Structure

### Header
- DM Sans 500 name at 24px / -3% tracking
- Tagline in DM Sans 400 / muted color
- Social links in JetBrains Mono / faint color
- Rainbow side stripe (3px, all tag colors gradient)
- Ambient glow: subtle radial gradients of accent colors behind header, blurred

### Hashtag Navbar
- Sits below header, above feed
- All tag filters as pill buttons
- Active "All" filter: sunset gradient fill with dark text
- Inactive tags: 10% opacity bg + colored border + colored text
- On hover/selection: tag fills brighter (~25% opacity) with subtle gradient complement

### Feed Items
- **Note (short):** Tag pill + timestamp → body text → icon row
- **Post (long):** Tag pills + timestamp + read time → Instrument Serif title → body excerpt in muted → icon row
- **Separator:** 1px border line between items

## Voice

All copy uses the hussain-voice skill. See `/.claude/skills/hussain-voice/` for the complete voice rules. Key traits: tentative conclusions, spiral structure, hedging as voice, self-aware asides, casual profanity as texture. Never sounds like LinkedIn or marketing copy.
