"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ActiveTab = "story" | "stream";

interface ProjectDetailPanesProps {
  body: ReactNode;
  /** Pre-rendered timeline (typically a `<FeedList>`). Falsy when there's no linked content. */
  timeline: ReactNode | null;
  /** Count for the Stream tab badge. */
  streamCount: number;
}

/**
 * Below-hero surface on `/projects/[slug]`. Desktop (`lg:`+): two columns
 * side-by-side, each independently scrollable inside a viewport-bounded pane.
 * Mobile: a pair of toggle buttons (Story / Stream) swaps between the two
 * stacks. When there's no timeline, falls back to a single full-width body
 * column with no toggle — same shape as the original page.
 *
 * The toggles are `aria-pressed` buttons, not ARIA tabs. Real tabs owe screen
 * reader users `aria-controls`, `role="tabpanel"` on the panels, and
 * arrow-key roving focus; this control is two buttons that show and hide
 * sections, so it's described as what it is rather than borrowing a pattern
 * it doesn't implement. The sections keep their own `aria-label`s.
 */
export function ProjectDetailPanes({
  body,
  timeline,
  streamCount,
}: ProjectDetailPanesProps) {
  const [tab, setTab] = useState<ActiveTab>("story");

  if (!timeline || streamCount === 0) {
    return <article className="prose-dark">{body}</article>;
  }

  return (
    <div className="flex flex-col gap-6 lg:h-[calc(100dvh-12rem)] lg:flex-row lg:gap-0 lg:overflow-hidden">
      <div className="lg:hidden">
        <TabBar tab={tab} onChange={setTab} streamCount={streamCount} />
      </div>

      <section
        aria-label="Story"
        className={cn(
          tab === "story" ? "block" : "hidden",
          "lg:block lg:flex-1 lg:h-full lg:overflow-y-auto lg:pr-10 lg:pb-12",
        )}
      >
        <article className="prose-dark mx-auto max-w-[640px] lg:mx-0">
          {body}
        </article>
      </section>

      <div
        aria-hidden="true"
        className="hidden lg:block lg:w-px lg:shrink-0 lg:self-stretch lg:bg-border"
      />

      <section
        aria-label="Stream"
        className={cn(
          tab === "stream" ? "block" : "hidden",
          "lg:block lg:w-[40%] lg:shrink-0 lg:h-full lg:overflow-y-auto lg:pl-10 lg:pb-12",
        )}
      >
        {timeline}
      </section>
    </div>
  );
}

function TabBar({
  tab,
  onChange,
  streamCount,
}: {
  tab: ActiveTab;
  onChange: (next: ActiveTab) => void;
  streamCount: number;
}) {
  return (
    <div
      role="group"
      aria-label="Project sections"
      className="sticky top-0 z-10 -mx-5 flex items-center gap-1.5 border-b border-border bg-background/90 px-5 py-2 backdrop-blur-md sm:-mx-8 sm:px-8"
    >
      <TabButton
        active={tab === "story"}
        onClick={() => onChange("story")}
        label="Story"
      />
      <TabButton
        active={tab === "stream"}
        onClick={() => onChange("stream")}
        label="Stream"
        count={streamCount}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 font-mono text-[11px] leading-[14px] tracking-[0.02em] transition-colors duration-150",
        active
          ? "border-text/80 bg-text text-background"
          : "border-border bg-transparent text-muted hover:border-border-hover hover:text-text",
      )}
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "font-mono text-[10px] leading-[12px]",
            active ? "opacity-70" : "opacity-60",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
