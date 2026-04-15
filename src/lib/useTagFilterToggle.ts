"use client";

import { useRouter } from "next/navigation";
import {
  parseTagsQuery,
  serializeTagsQuery,
  toggleTagInList,
} from "@/lib/tagParams";

/**
 * Click handler for in-card tag pills. Reads the current `?tags=a,b,c`
 * (or legacy `?tag=x`) straight off `window.location` at click time — on
 * purpose, so the card itself can stay statically prerenderable. Toggles the
 * clicked tag, then navigates to the new href without scrolling. Empty set
 * strips the query entirely.
 */
export function useTagFilterToggle(): (tag: string) => void {
  const router = useRouter();
  return (tag: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const current = parseTagsQuery(
      [params.get("tags"), params.get("tag")].filter(Boolean) as string[],
    );
    const next = toggleTagInList(current, tag);
    const suffix = serializeTagsQuery(next);
    router.replace(
      suffix ? `${window.location.pathname}${suffix}` : window.location.pathname,
      { scroll: false },
    );
  };
}
