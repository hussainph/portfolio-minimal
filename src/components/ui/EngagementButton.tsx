"use client";

import { useState, type ComponentType, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookmarkSimple,
  ChatCircle,
  Heart,
  Share,
  type IconProps as PhosphorIconProps,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { BOUNCE_SPRING, useMagneticMotion } from "./useMagneticMotion";

export type EngagementIcon = "like" | "reply" | "bookmark" | "share";

interface EngagementButtonProps {
  icon: EngagementIcon;
  label: string;
  count?: number | string;
  active?: boolean;
  iconSize?: number;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

const ICONS: Record<EngagementIcon, ComponentType<PhosphorIconProps>> = {
  like: Heart,
  reply: ChatCircle,
  bookmark: BookmarkSimple,
  share: Share,
};

/**
 * Engagement control used across feed cards (like, reply, bookmark, share).
 * Shares the same magnetic + bounce + weight-swap microinteraction language as
 * `SocialIconRow` via `useMagneticMotion`, tuned tighter for the cluster-of-four
 * layout (icons sit ~12px apart so the magnetic travel is clamped to 3px).
 *
 * Motion scope: the inner `motion.span` wrapping the icon handles both the
 * magnetic translation and the bounce scale. The outer `<button>` stays static
 * so the optional count text alongside the icon doesn't scale with it, and
 * focus rings stay anchored.
 *
 * Two visual shapes, one API:
 *   • solo icon (no count)    → square hit area, negative-margin bleed
 *   • icon + count            → pill hit area, count in JetBrains Mono
 *
 * `active` (e.g. the user has liked) locks the fill weight on. Otherwise the
 * fill crossfades in on hover/focus.
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
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const interactive = hovered || focused;
  const showFill = active || interactive;
  const hasCount = count !== undefined;

  const { ref, motionStyle, handlers } = useMagneticMotion<HTMLButtonElement>({
    maxPx: 3,
    pull: 0.2,
    disabled: reduceMotion ?? false,
  });

  const Icon = ICONS[icon];

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-pressed={active ? true : undefined}
      data-active={active ? "" : undefined}
      onClick={onClick}
      style={style}
      onPointerEnter={() => setHovered(true)}
      onPointerMove={handlers.onPointerMove}
      onPointerLeave={() => {
        handlers.onPointerLeave();
        setHovered(false);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        "relative z-10 inline-flex items-center justify-center rounded-[3px] text-faint transition-colors duration-200 hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border",
        hasCount
          ? "-ml-1.5 h-9 gap-1.5 px-1.5 sm:h-8"
          : "-m-1 h-9 w-9 sm:h-8 sm:w-8",
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        className="relative grid place-items-center"
        style={motionStyle}
        animate={
          reduceMotion
            ? undefined
            : interactive
              ? { scale: 1.12, y: -1 }
              : { scale: 1, y: 0 }
        }
        transition={BOUNCE_SPRING}
      >
        <span
          className="relative grid place-items-center"
          style={{ width: iconSize, height: iconSize }}
        >
          <motion.span
            className="absolute inset-0 grid place-items-center"
            animate={{ opacity: showFill ? 0 : 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.14 }}
          >
            <Icon size={iconSize} weight="regular" />
          </motion.span>
          <motion.span
            className="absolute inset-0 grid place-items-center"
            animate={{ opacity: showFill ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.14 }}
          >
            <Icon size={iconSize} weight="fill" />
          </motion.span>
        </span>
      </motion.span>
      {hasCount ? (
        <span className="font-mono text-[11px] leading-[14px]">{count}</span>
      ) : null}
    </button>
  );
}
