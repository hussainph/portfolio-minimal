"use client";

import { useEffect, useRef, useState } from "react";

export type ToolbarState = "hidden" | "peek" | "visible";

interface Options {
  /** Idle delay before fading to hidden (ms). */
  idleMs?: number;
  /** Pixel band from the bottom of the viewport that triggers `peek`. */
  peekZonePx?: number;
}

/**
 * Returns the toolbar's visibility state based on cursor + scroll activity.
 *
 * - Default: `visible`.
 * - After `idleMs` of no interaction while the page has scrolled past the fold: `hidden`.
 * - When the cursor enters the bottom `peekZonePx` band: `peek` → `visible`.
 */
export function useToolbarVisibility({
  idleMs = 3000,
  peekZonePx = 120,
}: Options = {}): ToolbarState {
  const [state, setState] = useState<ToolbarState>("visible");
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const wakeUp = () => {
      setState((prev) => (prev === "hidden" ? "peek" : prev));
      setState("visible");
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (window.scrollY > 200) setState("hidden");
      }, idleMs);
    };

    const handleMove = (e: MouseEvent) => {
      const distFromBottom = window.innerHeight - e.clientY;
      if (distFromBottom < peekZonePx) {
        setState("visible");
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => {
          if (window.scrollY > 200) setState("hidden");
        }, idleMs);
      } else {
        wakeUp();
      }
    };

    const handleScroll = () => wakeUp();
    const handleKey = () => wakeUp();

    wakeUp();

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKey);

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, [idleMs, peekZonePx]);

  return state;
}
