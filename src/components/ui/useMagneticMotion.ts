"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface UseMagneticMotionOptions {
  /** Max translation distance in pixels. Default 8 (social row scale). */
  maxPx?: number;
  /** Fraction of pointer offset applied (higher = more responsive). Default 0.35. */
  pull?: number;
  /** Spring config for the translation. */
  spring?: { stiffness: number; damping: number; mass?: number };
  /** Short-circuits tracking entirely. Wire to `useReducedMotion()`. */
  disabled?: boolean;
}

const DEFAULT_SPRING = { stiffness: 200, damping: 15, mass: 0.6 };

/**
 * Magnetic cursor-follow motion for icons. The hook owns the ref (attach it to
 * the outer hit target so the bounding rect covers the full interactive area)
 * and returns `motionStyle` to apply to the inner visual element. Translation
 * stays inside; outer hit region stays static so focus rings and hit areas
 * don't drift.
 */
export function useMagneticMotion<T extends HTMLElement = HTMLElement>({
  maxPx = 8,
  pull = 0.35,
  spring = DEFAULT_SPRING,
  disabled = false,
}: UseMagneticMotionOptions = {}) {
  const ref = useRef<T | null>(null);
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, spring);
  const y = useSpring(yRaw, spring);

  const onPointerMove = (e: ReactPointerEvent<T>) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * pull;
    const dy = (e.clientY - cy) * pull;
    const clamp = (v: number) => Math.max(-maxPx, Math.min(maxPx, v));
    xRaw.set(clamp(dx));
    yRaw.set(clamp(dy));
  };

  const onPointerLeave = () => {
    xRaw.set(0);
    yRaw.set(0);
  };

  return {
    ref,
    motionStyle: disabled ? undefined : { x, y },
    handlers: { onPointerMove, onPointerLeave },
  };
}

export const BOUNCE_SPRING = {
  type: "spring" as const,
  stiffness: 400,
  damping: 12,
} as const;
