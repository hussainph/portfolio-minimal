# Product Principles

Why this site exists, and the rules that should constrain every design and technical decision.

## What this site is

A Twitter + Substack hybrid. A single-column, reverse-chronological feed mixing three content shapes — **notes**, **posts**, **showcases** — with **projects** as containers that aggregate the related thread underneath a description.

It's a personal corner of the internet. Not a portfolio in the generic sense. Not a blog. Not a CV. All three, folded into a feed.

## The principles

### 1. Organizer for the chaos of how I work

At any given time there are multiple projects running at varying depth, plus a stream of thoughts on industry, people, ideas, whatever. The site is a **low-intensity, variable-effort safe space** to document all of that in one place.

**The contract:** bulk of the effort is the design/dev phase (now). Maintenance after that should be near-zero. If an authoring task takes more than a few minutes of friction, the CMS has failed.

### 2. Three archetypes, all served in 7 seconds or less

Three audiences land here:

- **Readers** — want to read the long-form writing
- **Scanners** — want the Twitter-like micro thoughts and showcase examples
- **Recruiters** — want to evaluate projects and prior work fast

Each archetype must find what they're looking for in **under seven seconds**. Tag chips and the bottom toolbar do the heavy lifting. The feed does the orientation. Don't add navigation the 7-second rule doesn't clearly require.

### 3. Simple surface, rewarding depth

The first impression is calm and editorial. But staying on the site rewards curiosity — colors respond to tags, buttons have shader rings, cards animate, micro-interactions reveal themselves.

Nothing should feel like a generic dark-mode SaaS. Every interaction should feel considered. If a control could be static, make it subtly alive instead.

### 4. Using the site communicates how I think

The site *is* a portfolio piece. Recruiters and peers should leave with an intuition for how I think about product — from the content, yes, but also from the information architecture, the copy, the typography choices, the way the feed interleaves content types, and the tiny decisions that only show up after a minute of clicking around.

If a visitor can form an opinion about my taste without seeing my face or reading a single sentence, the site is doing its job.

### 5. Human, not tech-bro

I'm a person. Good days, bad days, finished work, half-finished work, things I'm excited about, things I gave up on. All of it belongs here. Don't curate for LinkedIn. Don't flatten failure into "learnings." The site should feel warm — a corner of the internet that sounds like me.

If copy or a component starts feeling corporate, it's wrong. Rewrite it.

### 6. Three shapes, one feed

Notes, posts, and showcases interleave in reverse-chron on the home feed. Each has a **distinct visual treatment** — you can tell a note from a post at a glance — but the rhythm of the feed stays unified. No separate inboxes. No type-based tabs at the top level.

Projects are a second axis. Content is tagged with the project it belongs to, and project pages aggregate: long-form description at the top, filtered timeline underneath. Projects without associated content still get a page — just description-only, no empty-state section.

### 7. Story over inventory

Every decision — content order, organization, layout, design, motion — serves a narrative. This isn't a CV you scan; it's a reading experience you move through.

The organization thesis itself is part of the story: *organized chaos*. The fact that a half-baked weekend hack sits in the same feed as a long-form essay on product architecture tells visitors something about how I work. Don't sanitize that.

---

## Content tiers

A companion to the three content shapes above: **projects come in three tiers**, and they get different treatments.

| Tier | Examples | Page treatment |
|------|----------|----------------|
| **showcase** | Big, meaningful work. Flagship things. | ProjectHero + full description + timeline |
| **smaller** | University projects, side projects with real substance | ProjectCard on index + description page + timeline |
| **bitesized** | Vibe-coded weekend experiments, throwaway toys | ProjectChip on index + lightweight page |

All three tiers get a page — the page just adapts. Every tier can have a timeline of linked content, or none at all.

---

## What this is *not*

Explicitly not in the product thesis. If a future decision pushes toward any of these, push back:

- **Not an admin panel.** Authoring is editing `.mdx` files in `content/`. No WYSIWYG, no CMS UI.
- **Not a social network.** Replies and likes on cards are decorative. Real engagement lives where it happens (external posts, conversations).
- **Not SEO-maxed.** We want shareable URLs and good OpenGraph, but we're not chasing the algorithm.
- **Not a template.** The design is specific to me. Resist the urge to generalize it into something reusable.

---

## How to use this doc

When making a design or technical decision, check it against these principles. If the change doesn't serve at least one — and doesn't break any — reconsider it.

For visual decisions, pair this with [01-design-system.md](01-design-system.md). This doc covers the *why*; that one covers the *what*.
