"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PANE_SWAP, PRESS_FEEDBACK } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ActiveTab = "story" | "stream";

const WIDE = "(min-width: 1024px)";

function subscribeWide(cb: () => void) {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Tracks the `lg:` breakpoint, where the two panes stop being a toggle and
 * become side-by-side columns.
 *
 * Mirrors `useIsDesktop` but at 1024px rather than 640px, and the server
 * snapshot returns `true` for the same reason: the prerendered HTML then
 * contains *both* panes, exactly as it does today, so the markup stays
 * complete for crawlers and for anyone who never runs the JS. Mobile clients
 * re-render to the single-pane form on hydration.
 */
function useIsWide() {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
}

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
  const storyRef = useRef<HTMLElement>(null);
  const isWide = useIsWide();
  const reduce = useReducedMotion();

  // The SiteNav outline links to headings inside the story pane, which is
  // `display: none` on mobile whenever Stream is showing. The browser can't
  // scroll to a target it isn't rendering, so those links did nothing. Swap
  // back to Story first, then scroll once the pane is actually laid out.
  useEffect(() => {
    const showHashTarget = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;

      let decoded = id;
      try {
        decoded = decodeURIComponent(id);
      } catch {
        // Malformed escape sequence — fall back to the raw fragment.
      }

      const target = document.getElementById(decoded);
      if (!target || !storyRef.current?.contains(target)) return;

      setTab("story");
      requestAnimationFrame(() => {
        // Matches the `scroll-behavior: smooth` rule in globals.css. The
        // media query is read here rather than trusted to the global
        // reduced-motion block, which only nulls `animation-name` and would
        // not catch an imperative scroll.
        const smooth = window.matchMedia(
          "(prefers-reduced-motion: no-preference)",
        ).matches;
        target.scrollIntoView({
          block: "start",
          behavior: smooth ? "smooth" : "auto",
        });
      });
    };

    showHashTarget();
    window.addEventListener("hashchange", showHashTarget);
    return () => window.removeEventListener("hashchange", showHashTarget);
  }, []);

  if (!timeline || streamCount === 0) {
    return <article className="prose-dark">{body}</article>;
  }

  // On mobile the swap used to be a `block`/`hidden` teleport, throwing away
  // the left/right relationship the two panes have on desktop. Each pane now
  // arrives from the side it occupies at `lg:` — Story from the left, Stream
  // from the right — so the toggle reads as moving between two places.
  //
  // Note what this deliberately does NOT do: unmount the inactive pane. The
  // hash-navigation effect above needs the Story pane in the DOM to find a
  // heading by id and to run `storyRef.current.contains()`. Swapping panes
  // with AnimatePresence would leave `getElementById` returning null whenever
  // Stream was showing, and every outline link on mobile would silently do
  // nothing — the exact bug the comment above says was already fixed once.
  // Both panes stay mounted; only the visible one animates.
  const paneAnim = (side: ActiveTab) => {
    if (isWide || reduce) return undefined;
    return tab === side
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: side === "story" ? -8 : 8 };
  };

  return (
    <div className="flex flex-col gap-6 lg:h-[calc(100dvh-12rem)] lg:flex-row lg:gap-0 lg:overflow-hidden">
      <div className="lg:hidden">
        <TabBar tab={tab} onChange={setTab} streamCount={streamCount} />
      </div>

      <motion.section
        ref={storyRef}
        aria-label="Story"
        tabIndex={0}
        animate={paneAnim("story")}
        transition={PANE_SWAP}
        className={cn(
          tab === "story" ? "block" : "hidden",
          "lg:block lg:flex-1 lg:h-full lg:overflow-y-auto lg:pr-10 lg:pb-12",
        )}
      >
        <article className="prose-dark mx-auto max-w-[640px] lg:mx-0">
          {body}
        </article>
      </motion.section>

      <div
        aria-hidden="true"
        className="hidden lg:block lg:w-px lg:shrink-0 lg:self-stretch lg:bg-border"
      />

      <motion.section
        aria-label="Stream"
        tabIndex={0}
        animate={paneAnim("stream")}
        transition={PANE_SWAP}
        className={cn(
          tab === "stream" ? "block" : "hidden",
          "lg:block lg:w-[40%] lg:shrink-0 lg:h-full lg:overflow-y-auto lg:pl-10 lg:pb-12",
        )}
      >
        {timeline}
      </motion.section>
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
        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 font-mono text-[11px] leading-[14px] tracking-[0.02em]",
        PRESS_FEEDBACK,
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
