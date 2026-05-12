"use client";

import { useSyncExternalStore } from "react";

// Matches Tailwind's `sm` breakpoint. On mobile the SiteNav's pillRowWidth
// cap can't fit labelled action buttons; we fall back to icon-only there.

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(min-width: 640px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getSnapshot() {
  return window.matchMedia("(min-width: 640px)").matches;
}

function getServerSnapshot() {
  return true;
}

export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
