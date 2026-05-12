"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  NavPageMeta,
  OutlineEntry,
  PaletteItem,
  ViewMode,
} from "./types";

interface NavContextValue {
  view: ViewMode;
  outline: OutlineEntry[];
  /** Index of the current entry in `outline`, or null if none is active yet. */
  currentIndex: number | null;
  prevHref: string | null;
  nextHref: string | null;
  pageMeta: NavPageMeta;
  /** All tags the filter pill can show. Set once by the root layout. */
  availableTags: string[];
  /** All content, summarised for the ⌘K palette. */
  paletteIndex: PaletteItem[];
  /** Called by `<NavSetter />` on each render of a page. */
  publish: (patch: Partial<NavSnapshot>) => void;
  /** Called by `<NavSetter />` on unmount to reset to home defaults. */
  reset: () => void;
}

interface NavSnapshot {
  view: ViewMode;
  outline: OutlineEntry[];
  currentIndex: number | null;
  prevHref: string | null;
  nextHref: string | null;
  pageMeta: NavPageMeta;
}

const DEFAULT_SNAPSHOT: NavSnapshot = {
  view: "home",
  outline: [],
  currentIndex: null,
  prevHref: null,
  nextHref: null,
  pageMeta: {},
};

const NavContext = createContext<NavContextValue | null>(null);

export function NavStateProvider({
  children,
  availableTags,
  paletteIndex,
}: {
  children: React.ReactNode;
  availableTags: string[];
  paletteIndex: PaletteItem[];
}) {
  const [snapshot, setSnapshot] = useState<NavSnapshot>(DEFAULT_SNAPSHOT);

  const publish = useCallback((patch: Partial<NavSnapshot>) => {
    setSnapshot((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setSnapshot(DEFAULT_SNAPSHOT);
  }, []);

  const value = useMemo<NavContextValue>(
    () => ({
      ...snapshot,
      availableTags,
      paletteIndex,
      publish,
      reset,
    }),
    [snapshot, availableTags, paletteIndex, publish, reset],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNavContext() {
  const ctx = useContext(NavContext);
  if (!ctx)
    throw new Error("useNavContext must be used inside <NavStateProvider>");
  return ctx;
}

/**
 * Page-level client component that publishes the current route's view,
 * outline, and prev/next into `NavStateContext`. Each route renders this once
 * (server → client boundary) and the SiteNav at the bottom of the tree reads
 * the published state.
 *
 * Unmount → reset to home defaults so the previous page's outline doesn't
 * leak into the next navigation.
 */
export function NavSetter({
  view = "home",
  outline = [],
  currentIndex = null,
  prevHref = null,
  nextHref = null,
  pageMeta = {},
}: Partial<NavSnapshot>) {
  const { publish, reset } = useNavContext();

  // Stringify the outline so the effect doesn't refire on reference churn.
  const outlineKey = useMemo(
    () => outline.map((e) => `${e.id}:${e.label}`).join("|"),
    [outline],
  );
  const pageMetaKey = `${pageMeta.slug ?? ""}|${pageMeta.title ?? ""}`;

  useEffect(() => {
    publish({
      view,
      outline,
      currentIndex,
      prevHref,
      nextHref,
      pageMeta,
    });
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, outlineKey, currentIndex, prevHref, nextHref, pageMetaKey]);

  return null;
}
