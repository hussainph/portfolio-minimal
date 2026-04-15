"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";

export type TagState = "default" | "hover" | "active";

type TagBase = {
  /**
   * The tag's underlying name (no `#` prefix). The hue is derived from
   * this string via `tagColor()` — stable across renders and builds.
   */
  name: string;
  /**
   * Visual state. `active` renders a solid fill with near-black text for
   * selected filter chips; `hover` is a brighter tint used in interactive
   * specimens; `default` is the resting state.
   */
  state?: TagState;
  /** Back-compat convenience — sugar for `state="active"`. */
  active?: boolean;
  children: ReactNode;
  className?: string;
};

/** Renders as `<span>` — inert display pill (default). */
type TagDisplay = TagBase & { as?: "display" };

/**
 * Renders as `<Link>` (next/link). Used by `FilterChipRow` where each
 * chip is a real URL target (`?tags=a,b,c`). `scroll={false}` is baked in so
 * applying a filter doesn't jump the page back to the top.
 */
type TagLink = TagBase & { as: "link"; href: string };

/**
 * Renders as `<button>`. Used inside feed cards — the card itself is
 * wrapped in an overlay `<Link>`, so nesting another anchor would be
 * invalid HTML. A filter click fires `onClick` — typically the shared
 * `useTagFilterToggle()` handler which toggles the tag in the csv query.
 */
type TagFilter = TagBase & { as: "filter"; onClick: () => void };

export type TagProps = TagDisplay | TagLink | TagFilter;

const ALPHAS: Record<TagState, { bg: number; border: number }> = {
  default: { bg: 0.094, border: 0.188 }, // matches Paper's HEX18 / HEX30
  hover: { bg: 0.188, border: 0.333 }, // matches HEX30 / HEX55
  active: { bg: 1, border: 1 },
};

export function Tag(props: TagProps) {
  const { name, state, active = false, children, className } = props;
  const resolved: TagState = state ?? (active ? "active" : "default");
  const alphas = ALPHAS[resolved];
  const color = tagColor(name);
  const as = "as" in props ? (props.as ?? "display") : "display";
  const isInteractive = as === "link" || as === "filter";

  const sharedClass = cn(
    "inline-flex items-center rounded-pill border py-1 px-3 font-mono text-[11px] leading-[14px]",
    resolved === "active" ? "font-bold text-background" : null,
    isInteractive ? "cursor-pointer transition-colors duration-150" : null,
    className,
  );

  const style: CSSProperties = {
    backgroundColor: tagColor(name, alphas.bg),
    borderColor: tagColor(name, alphas.border),
    color: resolved === "active" ? undefined : color,
  };

  if (as === "link") {
    return (
      <Link
        href={(props as TagLink).href}
        className={cn(sharedClass, "no-underline")}
        style={style}
        scroll={false}
      >
        {children}
      </Link>
    );
  }

  if (as === "filter") {
    return (
      <button
        type="button"
        onClick={(props as TagFilter).onClick}
        className={sharedClass}
        style={style}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={sharedClass} style={style}>
      {children}
    </span>
  );
}
