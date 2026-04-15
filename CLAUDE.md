# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal MDX-based blog — a Twitter + Substack hybrid. Single-column reverse-chronological feed mixing three primitives: short-form **notes**, long-form **blog posts**, and project **showcases**. Header with subtle ambient glow, hashtag filter chips, then the stream.

## Commands

```bash
bun install              # Install dependencies
bun run dev              # Start dev server (localhost:3000)
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # ESLint
```

## Tech Stack

- **Framework:** Next.js 16 (App Router) with strict TypeScript
- **Package manager:** Bun
- **Styling:** Tailwind CSS v4 (CSS-first via `@theme`)
- **Animation:** Framer Motion
- **Fonts:** Instrument Serif (display + post titles + pull quotes), DM Sans (body + UI), JetBrains Mono (tags + timestamps + code) — all via `next/font/google`

MDX (`@next/mdx`) is planned but not wired up yet — content will live as `.mdx` files mapped through `mdx-components.tsx` to the design-system primitives.

## Design System

The Dark Warmth design system is the source of truth for all visual decisions. **Always read [.claude/docs/01-design-system.md](.claude/docs/01-design-system.md) before making styling decisions.** Pinned reference: Paper file [Component Library v4](https://app.paper.design/file/01KP2D4WXCKYD9AQGXGMJZKGPK/1-0/2TN-0).

Tokens live in [src/app/globals.css](src/app/globals.css) under `@theme`. Component implementations live in [src/components/ui/](src/components/ui/). Visual specimen page at `/ui-test` (dev only).

## Architecture

### Route Structure

- `src/app/page.tsx` — Home (the feed)
- `src/app/(dev)/ui-test/page.tsx` — Component library specimen, dev-only (404s in production)
- `src/app/api/chat/route.ts` — Stub, currently unused

### Key Directories

- `src/components/ui/` — Design-system primitives (Tag, TextLink, NoteCard, BlogPostCard, ShowcaseCard, BentoShowcase, BottomToolbar, Icon, Meta, Label, Separator)
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Import Alias

Use `@/` to import from `src/`:
```ts
import { NoteCard } from "@/components/ui/NoteCard";
```

## Animation Approach

All animations use Framer Motion. Use the `/interface-craft` skill for storyboard animations (stage DSL), live-tuning with DialKit, and polish audits.

The bottom toolbar uses a spring (`stiffness: 260, damping: 22, mass: 1`) and respects `prefers-reduced-motion` (falls back to a simple fade).

## Git Conventions

- **Never add AI attribution or co-author lines to commits.** No `Co-Authored-By`, no AI mentions. Commits should look like they were written by the developer.

## TypeScript Conventions

- Strict mode enabled
- Prefer `interface` over `type` for object shapes
- All component props have explicit interfaces

## Voice

All copy uses the `hussain-voice` skill. Tentative conclusions, spiral structure, hedging as voice, self-aware asides, casual profanity as texture. Never sounds like LinkedIn.
