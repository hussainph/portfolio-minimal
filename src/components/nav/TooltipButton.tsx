"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  return (
    <span className="group relative">
      <motion.button
        layout
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={active ? true : undefined}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className={cn(
          "flex h-9 items-center justify-center rounded-full transition-colors duration-150",
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
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0.6, 0.3, 1] }}
              className="overflow-hidden whitespace-nowrap font-mono text-[11px] leading-[14px] tracking-[0.02em]"
            >
              {shortLabel ?? label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.button>
      {!inline ? (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 -top-2 z-[60] -translate-x-1/2 -translate-y-full whitespace-nowrap",
            "rounded-md border border-[#2e2e328a] bg-[#101012f2] px-2 py-1 font-mono text-[10px] leading-3 tracking-[0.04em] text-text",
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
