---
name: implement
description: Feature implementation workflow for the portfolio-minimal project. Relaxed TDD (tests only where logic is testable), thorough exploration, critical analysis, code reuse focus, discrete git commits, E2E verification of the chat UI, and documentation sync. Use for any feature, bug fix, or design/architecture change.
---

# Feature Implementation Workflow — Portfolio Edition

## Core Principles

1. **Tests Where It Matters**: Write failing tests first for logic-heavy code (genUI engine, stream parsing, tool dispatch, state stores). Skip formal tests for pure UI/design work — rely on manual visual verification instead.
2. **Branch Isolation**: All code changes stay within the current branch and worktree only.
3. **Code Reuse Over Duplication**: Maintainability, modularity, and elegant reuse over raw output.
4. **Design System Fidelity**: Every visual change must honor `CLAUDE.md` Design Principles and `.claude/docs/01-design-system.md` (fonts, palette, spacing, motion). Warmth and human feel over generic dark-mode minimalism.
5. **Collaborative Decision-Making**: Ask comprehensive questions; err on the side of caution.
6. **Critical Technical Analysis**: Surface downstream effects, trade-offs, and architectural implications.
7. **Verify Before Shipping**: Every implementation must pass automated checks (if any) and manual/E2E checks before documentation sync.

---

## Phase 1: Exploration

Before writing any code, conduct thorough exploration:

- Identify ALL components affected by the change (including those not explicitly mentioned)
- Find existing code, utilities, and patterns that can be meaningfully reused
- Map upstream dependencies and downstream effects
- Read `CLAUDE.md` (design principles, architecture overview, genUI engine, animation approach)
- Read `.claude/docs/01-design-system.md` for fonts, palette, spacing, and visual patterns
- Check `src/engine/` for the genUI component registry, tool definitions, and stream parser — most feature work will touch these
- Check `src/components/chat/`, `src/components/genui/`, `src/stores/`, `src/types/` for existing patterns
- Spawn Explore subagents for parallel research when needed

**Key questions**: What existing patterns does this codebase use? What utilities already exist? Does this fit the single-stream chat model or does it break it? How does this interact with the genUI tool-use flow?

---

## Phase 2: Critical Analysis

Before implementation, provide thorough technical analysis:

- **Downstream Effects**: What other parts of the chat stream, genUI registry, or state will this affect?
- **Trade-offs**: What are we gaining vs. what are we sacrificing (minimalism, performance, complexity)?
- **Architectural Implications**: Does this fit the genUI / chat-stream model or require new primitives?
- **Design Fidelity**: Does this respect the two-font system, muted palette, orb indicators, and Swiss minimalism? Flag any potential drift.
- **Potential Optimizations**: Are there better approaches we should consider?

Present findings clearly. Ask clarifying questions on ambiguities. Get explicit approval before significant decisions (new genUI components, tool definitions, state shape changes, animation approaches).

---

## Phase 3: Red — Write Failing Tests

**Skip this phase if** the task is purely frontend/UI, design, or copy work with no testable logic.

**Run this phase if** the task touches: `src/engine/` (registry, tool definitions, stream parsing), `src/app/api/chat/` (chat endpoint logic), `src/stores/` (state reducers/selectors), or any pure utility in `src/lib/`.

Before writing any implementation code, define the expected behavior through tests.

Launch the **`test-orchestrator`** sub-agent via the **Task tool** with instructions to:

- **Write tests only** — do NOT implement any feature code
- Define expected behaviors based on the exploration and analysis from Phases 1–2
- Cover happy paths, edge cases, stream-parsing boundaries, and error scenarios
- Include which specific files will be created/modified and what functions/parsers/reducers to test
- Follow existing test conventions in `__tests__/` (if present) or bootstrap the setup if this is the first test file

After the sub-agent returns, **run the tests and confirm they fail** (`bun run test`). This is the critical "red" step — if any tests already pass before implementation exists, they are not testing the right thing.

> **Note**: Vitest is not installed by default in this project. If the test-orchestrator reports missing test infrastructure, it will install Vitest, add the `test` script to `package.json`, and create initial configuration before writing tests.

**Done when:** All new tests run and all fail for the expected reasons.

---

## Phase 4: Green — Implementation

Write the minimum code needed to make all failing tests pass. For UI-only tasks with no Phase 3, this is where implementation begins.

- Prefer editing existing files over creating new ones
- Extract reusable logic into shared utilities/hooks
- Follow existing codebase patterns and conventions
- For new genUI components: place in `src/components/genui/`, register in the engine, add matching tool definition with typed props
- For animations: use Framer Motion; consider invoking the `/interface-craft` skill for storyboard-style sequencing
- For styling: use Tailwind v4 classes; respect the two-font system (Manrope human, Space Mono AI)
- **Focus on making tests pass** (if Phase 3 ran) — avoid premature optimization or gold-plating
- Run tests frequently (`bun run test`) to track progress toward green
- Make discrete, logical git commits at natural breakpoints

**Done when:** All tests from Phase 3 are passing (or, for UI-only work, the feature renders as intended in the dev server).

---

## Phase 5: Refactor

With a passing test suite (or a working UI) as your safety net, clean up the implementation:

- Remove duplication, simplify logic, improve naming
- Ensure code follows codebase conventions and patterns identified in Phase 1
- Re-run the full test suite (`bun run test`) after each meaningful refactor to confirm nothing broke
- For UI changes, re-check the design system alignment
- Commit after refactoring is complete

**Done when:** Code is clean, follows conventions, and all tests still pass (if applicable).

---

## Phase 6: Manual & E2E Verification

**Skip if** the change is purely internal (types, utilities with full test coverage, config) and touches no API routes or UI.

> **Read [Verification Protocol](references/verification-protocol.md)** and execute it. This protocol classifies your changes and routes to the appropriate verification:
> - **Chat API route** (`src/app/api/chat/`) → manual `curl` testing against the dev server (inline)
> - **Chat UI / components / animations** → launches the **`e2e-tester`** sub-agent via the **Task tool** for exploratory browser testing
> - **Both** → run both

The goal is to catch issues that automated tests miss — broken layouts, incorrect streaming behavior, genUI components failing to render, animation jank, design-system drift. If verification reveals a bug that should be permanently covered, **add a new failing test (Red), then fix (Green)** — maintaining the TDD loop where it applies.

If issues persist, escalate to Phase 7 (Bug Fixing). Do NOT proceed until all checks pass.

---

## Phase 7: Bug Fixing Protocol

When encountering persistent issues at any phase, step back:

1. **Understand the Full Picture** — Where is the issue? What are the upstream dependencies, downstream effects, and blindspots?
2. **Evaluate Implementation Quality** — Is the code bloated? Is there a more elegant redesign? Would a different approach avoid the complexity?
3. **Collaborate on Solutions** — Present alternatives with trade-offs. Get user input before major refactors.

After fixing, re-run the relevant checks (unit tests, E2E, or both) before proceeding.

---

## Phase 8: Wrap-Up — Documentation Sync

Launch the **`docs-sync`** sub-agent via the **Task tool** to update `.claude/docs/` and (if architectural or design-system changes occurred) `CLAUDE.md`. Provide a brief summary of what changed so the agent has context.

Typical triggers for a docs sync:
- New genUI component added to the registry → update architecture section in CLAUDE.md
- New tool definition or engine primitive → update architecture section
- Design system additions (new font role, color, spacing token, motion pattern) → update `01-design-system.md`
- New route or API endpoint → update route structure section
- Major refactor of the chat stream or genUI engine → update architecture section

Skip docs-sync for trivial copy tweaks, bug fixes with no architectural impact, or dependency bumps.

---

## Context Management

**Critical: Protect the main thread's context window.** The following operations MUST be launched as sub-agents via the **Task tool**, never executed inline:

| Operation | Sub-Agent Name | When |
|---|---|---|
| Write failing tests | `test-orchestrator` | Phase 3 (Red) — logic files will be created/modified |
| E2E browser tests | `e2e-tester` | Phase 6 — chat UI or genUI components changed |
| Documentation sync | `docs-sync` | Phase 8 — when architecture or design system changed |

**Why sub-agents?** These operations are multi-turn and context-heavy (test iterations, browser snapshots, file scans). Running them inline floods the main thread. The Task tool spawns an isolated process — only the final summary returns.

**How to delegate effectively:**
- Provide the sub-agent with a detailed prompt including which files will be changed, what logic will be added, and what behaviors to test or verify
- For Phase 3 (Red): emphasize that the sub-agent should write tests only, not implementation code
- Wait for the sub-agent result before proceeding to the next phase
- If a sub-agent reports failures, handle the fix in the main thread, then re-launch the sub-agent

**General context hygiene:**
- Spawn `Explore` subagents for broad codebase research
- Summarize key findings before context gets long
- Use `TodoWrite` for complex multi-step work

---

## Quick Reference Checklist

- [ ] Explored codebase for reusable code and relevant patterns
- [ ] Read `CLAUDE.md` design principles and `.claude/docs/01-design-system.md`
- [ ] Identified downstream effects and design-system implications
- [ ] Asked clarifying questions and got approval for significant decisions
- [ ] **Red** *(if applicable)*: Launched `test-orchestrator` to write tests
- [ ] **Red** *(if applicable)*: Confirmed all new tests fail (`bun run test`)
- [ ] **Green**: Implemented code — all tests passing (or UI renders correctly)
- [ ] **Refactor**: Cleaned up code — tests still passing, design-system still aligned
- [ ] Made discrete git commits (no AI attribution per `CLAUDE.md`)
- [ ] Ran API `curl` verification *(if API route changed)*
- [ ] Launched `e2e-tester` sub-agent *(if chat UI / genUI components changed)*
- [ ] All checks passing
- [ ] Launched `docs-sync` sub-agent *(if architectural or design-system changes occurred)*
