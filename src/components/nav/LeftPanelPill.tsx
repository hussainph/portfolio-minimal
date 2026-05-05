"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const PILL_SHELL =
  "flex items-center rounded-pill bg-[#14141699] backdrop-blur-[24px] border border-[#2e2e328a] shadow-[0_12px_40px_#0a0a0bab]";

export type PanelState = "closed" | "peek" | "expanded";

export type PanelLift = "default" | "aboveRail";

export interface PanelRenderProps {
  expanded: boolean;
  toggleExpanded: () => void;
  close: () => void;
  reduce: boolean;
  panelLift: PanelLift;
}

interface LeftPanelPillProps {
  icon: ReactNode;
  active?: boolean;
  labelClosed: string;
  labelActive?: string;
  trailing?: ReactNode;
  /**
   * Secondary rail rendered inside the icon's hover zone so moving the cursor
   * between the icon, bridge, panel, and rail never breaks hover.
   */
  rail?: ReactNode;
  panelLift?: PanelLift;
  onOpenChange?: (open: boolean) => void;
  renderPanel: (p: PanelRenderProps) => ReactNode;
}

/**
 * Shared shell for the left-side contextual pill. Same modality everywhere:
 * hover peeks, click expands, ⌃ signifier at rest, invisible 8px bridge over
 * the gap, escape/outside-click close. The panel content itself is owned by
 * the caller — only the state machine and chrome are shared.
 */
export function LeftPanelPill({
  icon,
  active = false,
  labelClosed,
  labelActive,
  trailing,
  rail,
  panelLift = "default",
  onOpenChange,
  renderPanel,
}: LeftPanelPillProps) {
  const [state, setState] = useState<PanelState>("closed");
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  // Clear any pending peek-close timer on unmount so we don't fire `setState`
  // on an unmounted node when the user navigates away mid-180ms.
  useEffect(() => {
    return () => {
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
      }
    };
  }, []);

  const open = state !== "closed";
  const expanded = state === "expanded";

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  const handleEnter = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (state === "closed") setState("peek");
  };

  const handleLeave = () => {
    hoverTimer.current = setTimeout(() => {
      if (state === "peek") setState("closed");
    }, 180);
  };

  const handleButtonClick = () => {
    if (state === "expanded") setState("peek");
    else setState("expanded");
  };

  const toggleExpanded = () => {
    if (expanded) setState("peek");
    else setState("expanded");
  };

  const close = () => setState("closed");

  useEffect(() => {
    if (state !== "expanded") return;
    // `pointerdown` fires for mouse, touch, and pen with a single listener.
    const handler = (e: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setState("closed");
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [state]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState("closed");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className={cn(PILL_SHELL, "relative p-1.5")}
    >
      <div
        className="relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocusCapture={handleEnter}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) handleLeave();
        }}
      >
        <button
          type="button"
          onClick={handleButtonClick}
          aria-expanded={open}
          aria-label={active && labelActive ? labelActive : labelClosed}
          className="relative flex items-center"
        >
          <span
            className={cn(
              "flex items-center justify-center rounded-pill py-2.5 px-3.5 transition-colors duration-150",
              open
                ? "bg-background/70 text-text"
                : active
                  ? "bg-background/40 text-text"
                  : "text-muted hover:text-text",
            )}
          >
            {icon}
          </span>
          {active ? (
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-0.5 h-[6px] w-[6px] rounded-full bg-accent-orange"
            />
          ) : null}
        </button>

        <AnimatePresence>
          {!open ? (
            <motion.span
              key="signifier"
              aria-hidden="true"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 2 }}
              animate={reduce ? { opacity: 0.55 } : { opacity: 0.55, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 2 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
              className="pointer-events-none absolute left-1/2 top-[-10px] -translate-x-1/2 font-mono text-[9px] leading-3 tracking-[0.05em] text-faint"
            >
              ⌃
            </motion.span>
          ) : null}
        </AnimatePresence>

        {open ? (
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-full left-0 w-full",
              panelLift === "aboveRail" ? "h-[54px]" : "h-2",
            )}
          />
        ) : null}

        <AnimatePresence>
          {open
            ? renderPanel({
                expanded,
                toggleExpanded,
                close,
                reduce: !!reduce,
                panelLift,
              })
            : null}
        </AnimatePresence>

        {rail ? (
          <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-[150px]">
            <div className="pointer-events-auto -translate-x-1/2">{rail}</div>
          </div>
        ) : null}
      </div>

      {trailing}
    </div>
  );
}

/** Panel shell — matches the navbar's solidity so content behind doesn't
 *  bleed through. Each caller sets its own `bottom` offset via PANEL_LIFT_* so
 *  the panel can clear a secondary rail if one is present. */
export const PANEL_SHELL =
  "absolute left-0 flex flex-col items-stretch overflow-hidden rounded-[24px] border border-[#2e2e328a] bg-[#101012f2] shadow-[0_20px_50px_#0a0a0bd9] backdrop-blur-[28px] backdrop-saturate-150";

export const PANEL_LIFT_DEFAULT = "bottom-[calc(100%+8px)]";
/** Use when a secondary rail floats between the panel and the nav pill. The
 *  extra 46px clears a 32px rail + its 8px gap with room to breathe. */
export const PANEL_LIFT_ABOVE_RAIL = "bottom-[calc(100%+54px)]";
