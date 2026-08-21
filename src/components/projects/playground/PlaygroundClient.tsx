"use client";

import { useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/Label";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import { ControlPanel } from "./ControlPanel";
import {
  BORDER_MODES,
  CHOREOGRAPHIES,
  FEATURED_LAYOUTS,
  MOTION_PRESETS,
  type BorderMode,
  type Choreography,
  type FeaturedLayout,
  type MotionPreset,
} from "./controls";
import { getMockProjects } from "./mockProjects";
import { ProjectDeck } from "./ProjectDeck";
import { useDeckControls } from "./useDeckControls";

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-pill border border-border bg-surface p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-pill px-3 py-1 font-mono text-[11px] leading-[14px] tracking-[0.02em] transition-colors duration-150",
            o.value === value
              ? "bg-text/10 text-text"
              : "text-muted hover:text-text",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Bento Showcase playground. All (filtered) projects render in one bento with a
 * featured hero tile; cards link to their detail page. Tag toggles reduce the
 * visible set and the grid reflows via the morph engine. Two comparison axes sit
 * above the deck: a MOTION preset (retune / two-clock / spatial — competing
 * orchestration models) and a FEATURED treatment (editorial / shader / split /
 * depth — competing hero faces). The in-house panel tunes the shared physics.
 */
export function PlaygroundClient() {
  const { tunables, set, reset } = useDeckControls();
  const reduce = useReducedMotion() ?? false;

  // two-clock at ½× is the chosen motion feel — the playground opens on it.
  const [preset, setPreset] = useState<MotionPreset>("two-clock");
  const [layout, setLayout] = useState<FeaturedLayout>("cover");
  const [border, setBorder] = useState<BorderMode>("none");
  const [choreography, setChoreography] = useState<Choreography>("simultaneous");
  const [selected, setSelected] = useState<string[]>([]);
  // Bumping this remounts the deck: position memory clears, every card re-runs
  // its entrance under the CURRENT motion settings — replay without a reload.
  const [replayKey, setReplayKey] = useState(0);
  // Duration multiplier (1 = realtime). Slowing the whole choreography down is
  // how you actually SEE the difference between presets — delays, tweens, and
  // spring periods all stretch together (damping ratio preserved).
  const [speed, setSpeed] = useState<"1" | "2" | "4">("2");

  const pool = useMemo(
    () => getMockProjects(tunables.count),
    [tunables.count],
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of pool) for (const t of p.tags) set.add(t);
    return Array.from(set).sort();
  }, [pool]);

  const visibleProjects = useMemo(
    () =>
      selected.length === 0
        ? pool
        : pool.filter((p) => p.tags.some((t) => selected.includes(t))),
    [pool, selected],
  );

  const toggleTag = (tag: string) =>
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <Label size="xs" tone="faint">
            motion
          </Label>
          <Segmented options={MOTION_PRESETS} value={preset} onChange={setPreset} />
        </div>
        <div className="flex items-center gap-2">
          <Label size="xs" tone="faint">
            layout
          </Label>
          <Segmented options={FEATURED_LAYOUTS} value={layout} onChange={setLayout} />
        </div>
        <div className="flex items-center gap-2">
          <Label size="xs" tone="faint">
            border
          </Label>
          <Segmented options={BORDER_MODES} value={border} onChange={setBorder} />
        </div>
        {/* The legacy stagger shapes only exist inside the retune model. */}
        {preset === "retune" ? (
          <div className="flex items-center gap-2">
            <Label size="xs" tone="faint">
              choreography
            </Label>
            <Segmented
              options={CHOREOGRAPHIES}
              value={choreography}
              onChange={setChoreography}
            />
          </div>
        ) : null}
        <div className="flex items-center gap-4 sm:ml-auto">
          <div className="flex items-center gap-2">
            <Label size="xs" tone="faint">
              speed
            </Label>
            <Segmented
              options={[
                { value: "1", label: "1×" },
                { value: "2", label: "½×" },
                { value: "4", label: "¼×" },
              ]}
              value={speed}
              onChange={setSpeed}
            />
          </div>
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="font-mono text-[10px] uppercase tracking-[0.06em] text-faint transition-colors duration-150 hover:text-accent-teal"
          >
            ↺ replay
          </button>
          <span className="font-mono text-[11px] tabular-nums tracking-[0.02em] text-muted">
            showing {visibleProjects.length} / {pool.length}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Label size="xs" tone="faint" className="mr-1">
          filter
        </Label>
        {allTags.map((tag) => (
          <Tag
            key={tag}
            as="filter"
            name={tag}
            active={selected.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            #{tag}
          </Tag>
        ))}
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={() => setSelected([])}
            className="ml-1 font-mono text-[10px] uppercase tracking-[0.06em] text-faint transition-colors duration-150 hover:text-accent-teal"
          >
            clear
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="relative min-w-0 flex-1">
          <ProjectDeck
            key={replayKey}
            projects={visibleProjects}
            preset={preset}
            choreography={choreography}
            layout={layout}
            border={border}
            tunables={tunables}
            reduce={reduce}
            timeScale={Number(speed)}
          />
          {visibleProjects.length === 0 ? (
            <p className="absolute inset-x-0 top-24 text-center font-mono text-[12px] tracking-[0.02em] text-faint">
              no projects match these tags
            </p>
          ) : null}
        </div>
        <ControlPanel tunables={tunables} set={set} reset={reset} />
      </div>
    </div>
  );
}
