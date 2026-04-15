# Verification Protocol

Loaded conditionally by the implement skill during Phase 6 (Manual & E2E Verification). By this point, any unit tests from Phase 3 (Red) are passing (Phase 4 — Green, Phase 5 — Refactor). This protocol handles interactive manual verification — confirming the code actually works as intended beyond what automated tests cover.

---

## Step 1: Classify Changes

Inspect the files you created or modified during implementation and determine what verification is needed:

| Files Changed | Category | Action |
|---|---|---|
| `src/app/api/chat/**/*.ts` | Chat API route | **Step 2a** — Manual API testing with `curl` |
| `src/app/**/*.tsx`, `src/components/**/*.tsx` | Chat UI / genUI components | **Step 2b** — E2E browser testing |
| `src/engine/**/*.ts` (registry, tool defs, stream parser) | GenUI engine | **Both** — API exercise + browser test of the rendered component |
| Both API and UI | Full-stack | Run **both** Step 2a and Step 2b |
| Only `src/lib/**`, `src/stores/**`, `src/types/**` with unit tests | Internal logic | Skip — unit tests from Phase 3/4 are sufficient |

---

## Step 2a: Chat API Manual Testing

*Skip if no files under `src/app/api/chat/` were changed.*

Start the dev server (`bun run dev`) if not already running, then manually exercise the chat endpoint:

- Use `curl` to POST a representative message payload to `/api/chat`
- Test both happy paths (normal message) and error cases (malformed body, missing fields, oversized payload)
- If the change affects streaming or tool-use, verify the SSE/stream output includes the expected event types (`text` blocks, `tool_use` blocks)
- Verify response status codes, headers, and the streamed payload structure match expectations
- Check the dev server terminal for unexpected errors, warnings, or unhandled Anthropic SDK errors

**Example payload shapes to test:**
- A simple text-only message
- A message that should trigger a genUI tool call (if tool definitions were added/modified)
- An invalid payload to verify error handling

This step runs inline — no sub-agent needed. Fix issues immediately and re-run `bun run test` to confirm unit tests still pass.

---

## Step 2b: Chat UI E2E Testing — `e2e-tester`

*Skip if no frontend/UI files were changed.*

Launch the **`e2e-tester`** sub-agent via the **Task tool**. This runs in an isolated context — browser interactions and screenshots stay out of the main thread. Provide a detailed prompt that includes:

- **Which routes/components** were affected by the changes (usually `/` since this is a single-page app)
- **What user flows** to test (sending a message, triggering a genUI tool call, keyboard interactions, empty state, multi-line input)
- **Expected visual state** — what the user should see (orb animations, text appearing/streaming, genUI components rendering inline, dividers between messages)
- **Animation checks** — orb gradient shift, message entrance (fade-up spring), typing indicator pulse, genUI mount stagger

The sub-agent should take an **exploratory approach** — not just checking boxes, but actively looking for issues that automated tests miss:

- Navigate to `localhost:3000` and **take screenshots** to confirm layout and visual correctness
- Send test messages and verify the stream renders correctly
- Trigger any new genUI tool calls and verify the component mounts inline
- Check the browser console for errors and network tab for failed requests to `/api/chat`
- Verify design system fidelity: two-font system (Manrope for human, Space Mono for AI), muted palette, subtle gradient dividers, 36x36 orbs, no visible textbox
- Check responsive behavior at mobile + desktop widths
- Save all screenshots to the `.playwright-mcp/` directory (not the project root)

Wait for the sub-agent result and report the summary before proceeding.

---

## Step 3: Evaluate Results

- **All passing** — Return to the main implement skill and continue to Phase 8 (Wrap-Up).
- **Failures found** — Return to Phase 5 (Refactor) in the main skill to fix issues while keeping any existing unit tests green. If manual testing reveals a bug that should be permanently covered, **add a new failing test (Red)**, then fix (Green) — maintaining the TDD loop where it applies. For persistent issues, escalate to Phase 7 (Bug Fixing). After fixing, re-run the relevant verification step(s). Do NOT proceed to Phase 8 until all checks pass.
- **Report clearly** — When failures occur, include error context (failing endpoints, console errors, screenshot paths, curl output) so the user can make informed decisions.
