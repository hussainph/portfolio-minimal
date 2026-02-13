# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minimalist portfolio website built as an AI chat interface with generative UI. The entire experience is a single chat stream — no traditional page layouts. The AI can tool-call pre-made UI components (genUI engine) to render rich portfolio content inline within the conversation.

## Commands

```bash
bun install              # Install dependencies
bun run dev              # Start dev server (default: localhost:5173)
bun run build            # Build for production
bun run preview          # Preview production build
bun run check            # Run svelte-check (type checking)
bun run check:watch      # Run svelte-check in watch mode
bun run lint             # Run ESLint + Prettier checks
bun run format           # Auto-format with Prettier
```

## Tech Stack

- **Framework:** SvelteKit with strict TypeScript
- **Package manager:** Bun
- **Animation:** Framer Motion via `svelte-motion` (Svelte port of framer-motion API)
- **Styling:** Tailwind CSS
- **AI:** Anthropic Claude API (raw SDK, no LangChain/Vercel AI SDK)
- **Fonts:** Manrope (human text), Space Mono (AI text)

## Architecture

### Chat Stream Model

The app is a single full-screen chat stream. There are no chat bubbles or boxes — messages render as plain text lines separated by subtle gradient dividers. Each message row has a small (36x36) gradient orb indicator:

- **AI orb:** Bluish-green gradient, subtle color shifting animation
- **Human orb:** Reddish-orange gradient, subtle color shifting animation

The text input has no visible textbox — only a minimal signifier (blinking cursor) indicates where the user types.

### GenUI Engine

The AI doesn't just return text — it can tool-call pre-made Svelte components that render inline in the chat stream. This is the core differentiator: portfolio content (projects, skills, experience, etc.) appears as rich generative UI within the conversation.

Key pieces:
- **Component registry:** Maps component names to Svelte components so the AI can reference them by string ID
- **Tool definitions:** Anthropic tool-use format definitions that tell Claude which UI components it can invoke and what props they accept
- **Stream renderer:** Parses the AI response stream, detects tool-use blocks, and renders the corresponding Svelte component inline with the chat message

### Route Structure

SvelteKit file-based routing. The app is essentially a single-page experience:
- `src/routes/+page.svelte` — Main chat interface
- `src/routes/api/chat/+server.ts` — Chat API endpoint that proxies to Anthropic

### Key Directories

- `src/lib/components/chat/` — Chat stream, message rows, orbs, input area
- `src/lib/components/genui/` — Pre-made genUI components (project cards, skill displays, etc.)
- `src/lib/engine/` — GenUI engine: component registry, tool definitions, stream parsing
- `src/lib/stores/` — Svelte stores for chat state, message history
- `src/lib/types/` — Shared TypeScript types for messages, tools, components

## Design Principles

- **Pure minimalism.** Every element must earn its place. Default to removing, not adding.
- **Swiss design aesthetic.** Strong typography hierarchy, intentional whitespace, grid-aware layouts.
- **Animation with purpose.** Use `svelte-motion` for meaningful transitions — entrances, state changes, attention. No decorative animation.
- **Two-font system.** Manrope (or similar modern sans-serif) for human text. Space Mono for all AI-generated text. No mixing.
- **Muted palette.** Near-black backgrounds, off-white text, color only in the orbs and subtle gradients.

## Animation Approach

All animations use `svelte-motion` (framer-motion API for Svelte). Use the `/interface-craft` skill for:
- Designing storyboard animations (stage-driven sequencing DSL)
- Tuning animation values with DialKit (live control panels)
- Design critique and audit of UI polish

Common animation patterns:
- Message entrance: fade-up with subtle spring
- Orb idle: continuous gradient shift between two colors (CSS or motion values)
- GenUI component mount: orchestrated stagger entrance
- Typing indicator: pulsing opacity on cursor

## AI Integration

Direct Anthropic SDK usage (`@anthropic-ai/sdk`). The chat endpoint:
1. Receives message history from the client
2. Sends to Claude with tool definitions for all registered genUI components
3. Streams the response back using SSE
4. Client-side parser handles `text` blocks (rendered as chat text) and `tool_use` blocks (rendered as genUI components)

The system prompt should instruct Claude to act as the portfolio owner and use genUI tools to showcase work when relevant.

## Git Conventions

- **Never add AI attribution or co-author lines to commits.** No `Co-Authored-By`, no AI mentions. Commits should look like they were written by the developer.

## TypeScript Conventions

- Strict mode enabled in `tsconfig.json`
- Prefer `interface` over `type` for object shapes
- All genUI component props must have explicit interfaces
- Tool definitions should be typed to match their component prop interfaces
