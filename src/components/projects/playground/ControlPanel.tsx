"use client";

import { useState } from "react";
import { Label } from "@/components/ui/Label";
import {
  PARAM_GROUPS,
  type ParamDescriptor,
  type TunableKey,
  type Tunables,
} from "./controls";

interface ControlPanelProps {
  tunables: Tunables;
  set: <K extends TunableKey>(key: K, value: Tunables[K]) => void;
  reset: () => void;
}

function formatValue(value: number, descriptor: ParamDescriptor): string {
  const decimals = descriptor.step < 0.01 ? 3 : descriptor.step < 1 ? 2 : 0;
  return `${value.toFixed(decimals)}${descriptor.unit ?? ""}`;
}

/**
 * The in-house dial panel for what interface-kit can't bind — animation physics,
 * arrangement geometry, and card count. Native range inputs, rendered from the
 * PARAM_GROUPS descriptor table so the panel and any future DialKit config share
 * one source of truth. Sticky rail; fully self-contained and deletable.
 */
export function ControlPanel({ tunables, set, reset }: ControlPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyValues = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(tunables, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard blocked (rare on localhost) — leave the label unchanged.
    }
  };

  return (
    <aside className="flex w-full flex-col gap-5 rounded-panel border border-border bg-sunken p-4 md:sticky md:top-10 md:max-h-[calc(100vh-5rem)] md:w-[260px] md:shrink-0 md:overflow-y-auto">
      <div className="flex items-center justify-between">
        <Label tone="muted">deck controls</Label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={copyValues}
            className="font-mono text-[10px] uppercase tracking-[0.06em] text-faint transition-colors duration-150 hover:text-accent-teal"
          >
            {copied ? "copied" : "copy"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="font-mono text-[10px] uppercase tracking-[0.06em] text-faint transition-colors duration-150 hover:text-accent-teal"
          >
            reset
          </button>
        </div>
      </div>

      {PARAM_GROUPS.map(({ group, params }) => (
        <div key={group} className="flex flex-col gap-3">
          <Label size="xs" tone="faint">
            {group}
          </Label>
          {params.map((descriptor) => {
            const value = tunables[descriptor.key];
            return (
              <label key={descriptor.key} className="flex flex-col gap-1">
                <span className="flex items-center justify-between">
                  <span className="font-mono text-[11px] leading-[14px] tracking-[0.02em] text-muted">
                    {descriptor.label}
                  </span>
                  <span className="font-mono text-[11px] leading-[14px] tracking-[0.02em] text-body">
                    {formatValue(value, descriptor)}
                  </span>
                </span>
                <input
                  type="range"
                  min={descriptor.min}
                  max={descriptor.max}
                  step={descriptor.step}
                  value={value}
                  onChange={(e) =>
                    set(descriptor.key, Number(e.target.value))
                  }
                  className="h-1 w-full cursor-pointer appearance-none rounded-pill bg-elevated"
                  style={{ accentColor: "#70cfd4" }}
                />
              </label>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
