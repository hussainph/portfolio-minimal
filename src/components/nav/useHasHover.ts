"use client";

import { useSyncExternalStore } from "react";

/**
 * True when the device has a real hovering pointer.
 *
 * The rail's panels open on `onMouseEnter`. Touch browsers synthesise
 * `mouseenter` on tap, so on a phone a tap meant for the filter button also
 * fired the hover-peek — the panel opened from the "hover" and then the click
 * toggled it, which read as the panel flickering.
 *
 * Tailwind v4 already gates its `hover:` variant behind `@media (hover: hover)`
 * so the CSS side of the rail was never affected; only these JS handlers were.
 *
 * Deliberately not `useIsDesktop` (`min-width: 640px`): screen width is a poor
 * proxy for pointer capability — a touchscreen laptop is wide and cannot hover
 * meaningfully, and an iPad in landscape clears the breakpoint.
 */

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// Assume hover on the server. The rail renders client-only anyway (SiteNav
// reads searchParams and suspends), so this value is never actually committed
// from a server pass — but returning `true` keeps the desktop path the
// default if that ever changes.
function getServerSnapshot() {
  return true;
}

export function useHasHover() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
