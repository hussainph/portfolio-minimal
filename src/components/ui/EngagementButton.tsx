"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

interface EngagementButtonProps {
  icon: IconName;
  label: string;
  count?: number | string;
  active?: boolean;
  iconSize?: number;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Engagement control used across feed cards (like, reply, bookmark, share).
 * Always a `<button type="button">` with an `aria-label` — no bare icons.
 *
 * Two visual shapes, one API:
 *   • solo icon (no count)    → square hit area, negative-margin bleed
 *   • icon + count            → pill hit area, count in JetBrains Mono
 *
 * Hit area is ≥36×36 on mobile, ≥32×32 on pointer viewports. Negative margins
 * bleed the target outward so the visible alignment inside a card stays the
 * same as the bare-icon version it replaces.
 *
 * `data-active` / `data-pressed` are exposed so future microinteractions
 * (hover bloom, tap scale, count-flip, etc.) can attach via CSS or motion
 * libs without touching every consumer.
 */
export function EngagementButton({
  icon,
  label,
  count,
  active,
  iconSize = 16,
  onClick,
  className,
  style,
}: EngagementButtonProps) {
  const hasCount = count !== undefined;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active ? true : undefined}
      data-active={active ? "" : undefined}
      onClick={onClick}
      style={style}
      className={cn(
        "relative z-10 inline-flex items-center justify-center rounded-[3px] text-faint transition-colors duration-200 hover:text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border",
        hasCount
          ? "-ml-1.5 h-9 gap-1.5 px-1.5 sm:h-8"
          : "-m-1 h-9 w-9 sm:h-8 sm:w-8",
        className,
      )}
    >
      <Icon name={icon} size={iconSize} />
      {hasCount ? (
        <span className="font-mono text-[11px] leading-[14px]">{count}</span>
      ) : null}
    </button>
  );
}
