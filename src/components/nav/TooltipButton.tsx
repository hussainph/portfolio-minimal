"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE_HOUSE, PRESS_FEEDBACK } from "@/lib/motion";
import { UI_LABEL_SM } from "./typography";

interface TooltipButtonProps {
  label: string;
  /** Short text rendered inline alongside the icon when `inline` is true.
   *  Falls back to `label` when omitted. Keep it tight (≤5 chars) so the
   *  peek row still fits inside the nav-row cap on mobile. */
  shortLabel?: string;
  /** When true, renders the short label inline (and suppresses the hover
   *  tooltip, since the label is already visible). The button uses Framer
   *  `layout` so width changes animate with the surrounding row. */
  inline?: boolean;
  /** When true, the button uses the "pressed / saved" treatment regardless
   *  of hover state. Used by the Save button to reflect bookmark state. */
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

export function TooltipButton({
  label,
  shortLabel,
  inline,
  active,
  disabled,
  children,
  onClick,
}: TooltipButtonProps) {
  const reduce = useReducedMotion();
  return (
    <span className="group relative">
      <motion.button
        layout
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={active ? true : undefined}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 32 }
        }
        className={cn(
          "flex h-9 items-center justify-center rounded-full",
          // `active:` is gated on `disabled` so a dead button doesn't dip.
          disabled ? "transition-colors duration-150" : PRESS_FEEDBACK,
          inline ? "gap-1.5 px-2.5" : "w-9",
          active ? "bg-text/10 text-text" : "text-muted",
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-background/60 hover:text-text focus-visible:bg-background/60 focus-visible:text-text",
        )}
      >
        <motion.span layout="position" className="flex items-center">
          {children}
        </motion.span>
        <AnimatePresence initial={false}>
          {inline ? (
            <motion.span
              key="label"
              // Only opacity. This used to animate `width` from 0 to "auto",
              // which forces layout every frame on four buttons at once — and
              // it was redundant: the parent already carries Framer's `layout`,
              // so the button's width transition is measured and animated
              // there. The two were doing the same job twice, and fighting.
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.22, ease: EASE_HOUSE }
              }
              className={cn(
                "overflow-hidden whitespace-nowrap",
                UI_LABEL_SM,
              )}
            >
              {shortLabel ?? label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.button>
      {/* Visible-only hover affordance. The button already carries
          `aria-label`, so we deliberately omit `role="tooltip"` (which would
          require an `aria-describedby` association duplicating the same
          string). */}
      {!inline ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-1/2 -top-2 z-[60] -translate-x-1/2 -translate-y-full whitespace-nowrap",
            "rounded-md border border-[#2e2e328a] bg-[#101012f2] px-2 py-1 text-text",
            UI_LABEL_SM,
            "opacity-0 shadow-[0_8px_20px_#0a0a0bcc] backdrop-blur-[28px] backdrop-saturate-150",
            "transition-opacity duration-150",
            "group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
