"use client";

import { useCallback, useState } from "react";
import { DEFAULT_TUNABLES, type TunableKey, type Tunables } from "./controls";

/**
 * The single seam between the deck and its control surface. Today it's a plain
 * useState store driving the in-house ControlPanel. Because it returns the
 * `Tunables` shape, swapping it for DialKit's `useDialKit(...)` later is a
 * one-file change — PlaygroundClient never needs to know.
 */
export function useDeckControls() {
  const [tunables, setTunables] = useState<Tunables>(DEFAULT_TUNABLES);

  const set = useCallback(
    <K extends TunableKey>(key: K, value: Tunables[K]) => {
      setTunables((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setTunables(DEFAULT_TUNABLES), []);

  return { tunables, set, reset };
}
