"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "portfolio:bookmarks";
const EVENT = "portfolio:bookmarks:change";

type Listener = () => void;

function readFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function writeToStorage(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(set)),
    );
  } catch {
    // storage quota / private mode — swallow
  }
}

function subscribe(cb: Listener) {
  if (typeof window === "undefined") return () => {};
  // Changes from this tab + other tabs (storage event) both need to wake us up.
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// Cache the frozen snapshot; React's useSyncExternalStore requires a stable
// reference until the store changes. We mutate `current` on writes and bump
// `revision` so React sees a new identity.
let current: ReadonlySet<string> = new Set();
let initialised = false;

function ensureInitialised() {
  if (initialised) return;
  current = readFromStorage();
  initialised = true;
}

function getSnapshot(): ReadonlySet<string> {
  ensureInitialised();
  return current;
}

function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY_SET;
}

const EMPTY_SET: ReadonlySet<string> = new Set();

function mutate(fn: (next: Set<string>) => void) {
  ensureInitialised();
  const next = new Set(current);
  fn(next);
  current = next;
  writeToStorage(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

export interface BookmarksApi {
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  all: ReadonlySet<string>;
}

export function useBookmarks(): BookmarksApi {
  const set = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const has = useCallback((slug: string) => set.has(slug), [set]);
  const toggle = useCallback((slug: string) => {
    mutate((next) => {
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
    });
  }, []);

  return { has, toggle, all: set };
}
