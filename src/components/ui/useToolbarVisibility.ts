"use client";

import { useEffect, useRef, useState } from "react";

export type ToolbarState = "hidden" | "visible";

interface Options {
  /** Idle delay before fading to hidden (ms). */
  idleMs?: number;
  /** Pixel band from the bottom of the viewport that keeps the rail awake. */
  peekZonePx?: number;
  /** Scroll depth below which the rail never hides. */
  minScrollPx?: number;
}

/** How often the idle check runs. Coarse on purpose — see `lastActivity`. */
const TICK_MS = 250;

/**
 * Keys that imply the reader is moving through the page, and so should bring
 * the rail back. Every other key is ignored: typing into the command palette
 * used to wake the toolbar on every keystroke, and animating in response to
 * typing is the clearest case of motion the user never asked for.
 */
const NAVIGATION_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar",
]);

/**
 * Returns whether the floating toolbar should be showing.
 *
 * - Default: `visible`.
 * - After `idleMs` of no interaction, once scrolled past `minScrollPx`: `hidden`.
 * - Any qualifying activity brings it back.
 *
 * Previously this hook also had a `peek` state. It was unreachable: `wakeUp`
 * called `setState(prev => prev === "hidden" ? "peek" : prev)` immediately
 * followed by `setState("visible")`, and React batches both into one commit,
 * so the intermediate value never rendered. The `peek` variant it drove
 * (`y: 28`) was dead too. Rather than resurrect a stage nobody could observe,
 * the state is gone — the rail is simply shown or hidden.
 *
 * Activity is recorded as a timestamp and swept by one interval, instead of
 * the old approach of clearing and recreating a `setTimeout` inside the
 * `mousemove` handler. That fired on every pointer sample — a timer teardown
 * and rebuild per mouse move, for a deadline that only needs ~250ms accuracy.
 */
export function useToolbarVisibility({
  idleMs = 3000,
  peekZonePx = 120,
  minScrollPx = 200,
}: Options = {}): ToolbarState {
  const [state, setState] = useState<ToolbarState>("visible");
  const lastActivity = useRef(0);
  // Set by `mousemove` when the cursor sits in the bottom band. The rail is
  // pinned open there so it can actually be aimed at.
  const cursorInZone = useRef(false);

  useEffect(() => {
    // `performance.now()` rather than `Date.now()`: monotonic, so a system
    // clock adjustment mid-read can't make the rail hide early or hang open.
    const mark = () => {
      lastActivity.current = performance.now();
      setState("visible");
    };

    mark();

    const handleMove = (e: MouseEvent) => {
      cursorInZone.current = window.innerHeight - e.clientY < peekZonePx;
      mark();
    };
    const handleScroll = () => mark();
    const handleKey = (e: KeyboardEvent) => {
      if (NAVIGATION_KEYS.has(e.key)) mark();
    };

    const tick = () => {
      if (cursorInZone.current) return;
      if (window.scrollY <= minScrollPx) return;
      if (performance.now() - lastActivity.current < idleMs) return;
      setState("hidden");
    };

    const timer = setInterval(tick, TICK_MS);
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKey);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, [idleMs, peekZonePx, minScrollPx]);

  return state;
}
