"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { parseTagsQuery, serializeTagsQuery } from "@/lib/tagParams";
import type { ContentKind } from "./types";

interface NavState {
  types: Set<ContentKind>;
  tags: string[];
  query: string;
}

const KINDS: ContentKind[] = ["note", "post", "showcase"];

function parseSet<T extends string>(raw: string | null, allowed: T[]): Set<T> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is T => (allowed as string[]).includes(s)),
  );
}

/**
 * URL-state controller for the filter pill. Reads `?types=`, `?tags=` (with
 * legacy `?tag=` fallback), and `?q=`. Writes stay on the current route —
 * toggling a tag on `/projects` updates `/projects?tags=X`, not `/?tags=X`.
 * The SiteNav's filter pill is only rendered on home-view routes, so these
 * writers are effectively scoped to `/`, `/projects`, and `/tags/[tag]`.
 */
export function useNavState() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const state: NavState = useMemo(
    () => ({
      types: parseSet(params.get("types"), KINDS),
      tags: parseTagsQuery(
        [params.get("tags"), params.get("tag")].filter(Boolean) as string[],
      ),
      query: params.get("q") ?? "",
    }),
    [params],
  );

  const push = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      next.delete("tag"); // always migrate legacy single-tag param
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const toggleType = useCallback(
    (k: ContentKind) => {
      const next = new Set(state.types);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      push({ types: next.size === 0 ? null : Array.from(next).join(",") });
    },
    [state.types, push],
  );
  const clearTypes = useCallback(() => push({ types: null }), [push]);

  const toggleTag = useCallback(
    (t: string) => {
      const nextTags = state.tags.includes(t)
        ? state.tags.filter((x) => x !== t)
        : [...state.tags, t];
      const serialized = serializeTagsQuery(nextTags).replace(/^\?tags=/, "");
      push({ tags: serialized || null });
    },
    [state.tags, push],
  );
  const clearTags = useCallback(() => push({ tags: null }), [push]);

  const setQuery = useCallback((q: string) => push({ q: q || null }), [push]);

  const resetFilters = useCallback(
    () => push({ types: null, tags: null, q: null }),
    [push],
  );

  return {
    ...state,
    toggleType,
    clearTypes,
    toggleTag,
    clearTags,
    setQuery,
    resetFilters,
  };
}

export type NavController = ReturnType<typeof useNavState>;
