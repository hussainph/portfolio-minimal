"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { arrangeBento } from "./arrange";
import { exitTransitionFor, transitionFor, type CardPhase } from "./choreography";
import type {
  BorderMode,
  Choreography,
  FeaturedLayout,
  MotionPreset,
  Tunables,
} from "./controls";
import { DeckCard } from "./DeckCard";
import type { PlaygroundProject } from "./mockProjects";

interface ProjectDeckProps {
  /** The already-filtered set of projects to show. */
  projects: PlaygroundProject[];
  preset: MotionPreset;
  choreography: Choreography;
  layout: FeaturedLayout;
  border: BorderMode;
  tunables: Tunables;
  reduce: boolean;
  /** Duration multiplier from the speed toggle (1 = realtime, 4 = ¼ speed). */
  timeScale: number;
}

/** useLayoutEffect on the client, useEffect on the server — avoids the SSR
 *  warning while still measuring before the first client paint. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The bento stage. Cards are `position:absolute` and animate to explicit
 * `{x,y,scale,opacity}` targets from `arrangeBento()`. Filtering changes which
 * projects are present: AnimatePresence fades removed cards out immediately
 * (zero stagger — exits never wait) while survivors spring to their re-packed
 * slots — one orchestrated reflow. A card's transition depends on its PHASE:
 * a slug we haven't seen is an entrance, a known slug reflowing gets a delay
 * derived from the active motion preset (see choreography.ts). The stage
 * height animates on the SAME spring as the cards, so the container and its
 * contents settle on one clock.
 */
export function ProjectDeck({
  projects,
  preset,
  choreography,
  layout,
  border,
  tunables,
  reduce,
  timeScale,
}: ProjectDeckProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(0);

  // Previous slot positions by slug — distinguishes entrances from reflows and
  // gives the spatial preset its travel distance. A render-stable mutable Map
  // (NOT a ref — render reads it; not reactive state — updating it must never
  // re-render), rewritten after each commit so strict mode stays idempotent.
  const [prevPositions] = useState(
    () => new Map<string, { x: number; y: number }>(),
  );

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setStageWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const arrangement =
    stageWidth > 0 ? arrangeBento(projects.length, stageWidth, tunables) : null;

  useEffect(() => {
    if (!arrangement) return;
    prevPositions.clear();
    projects.forEach((project, i) => {
      const card = arrangement.cards[i]!;
      prevPositions.set(project.slug, { x: card.x, y: card.y });
    });
  });

  return (
    <motion.div
      ref={ref}
      // `isolate` makes the stage its own stacking context, so the cards' high
      // zIndex (100 / 200 featured) only compete with each other and never paint
      // over the fixed SiteNav (z-50) at the page root.
      className="relative isolate w-full"
      initial={false}
      animate={{ height: arrangement ? arrangement.height : 460 }}
      transition={
        reduce
          ? { duration: 0.15 }
          : {
              type: "spring",
              stiffness: tunables.stiffness / timeScale ** 2,
              damping: tunables.damping / timeScale,
              mass: tunables.mass,
            }
      }
      style={{ minHeight: 320 }}
    >
      {arrangement ? (
        <AnimatePresence>
          {projects.map((project, i) => {
            const card = arrangement.cards[i]!;
            const prev = prevPositions.get(project.slug);
            const phase: CardPhase = prev ? "reflow" : "enter";
            const travel = prev
              ? Math.hypot(card.x - prev.x, card.y - prev.y)
              : 0;

            // Spatial's entrance wave radiates from the featured tile (slot 0)
            // — geometry, not array order.
            const origin = arrangement.cards[0]!;
            const waveDist = Math.hypot(
              card.x + (card.width * card.scale) / 2 -
                (origin.x + (origin.width * origin.scale) / 2),
              card.y + (card.height * card.scale) / 2 -
                (origin.y + (origin.height * origin.scale) / 2),
            );

            const enterInitial =
              preset === "two-clock"
                ? {
                    x: card.x,
                    y: card.y + 24,
                    width: card.width,
                    height: card.height,
                    scale: card.scale * 0.98,
                    opacity: 0,
                  }
                : {
                    x: card.x,
                    y: card.y,
                    width: card.width,
                    height: card.height,
                    scale: card.scale * 0.92,
                    opacity: 0,
                  };

            return (
              <motion.div
                key={project.slug}
                initial={enterInitial}
                animate={{
                  x: card.x,
                  y: card.y,
                  width: card.width,
                  height: card.height,
                  scale: card.scale,
                  opacity: card.opacity,
                }}
                exit={{
                  opacity: 0,
                  scale: card.scale * 0.9,
                  transition: exitTransitionFor(reduce, timeScale),
                }}
                transition={transitionFor({
                  phase,
                  index: i,
                  count: projects.length,
                  travel,
                  waveDist,
                  preset,
                  choreography,
                  t: tunables,
                  reduce,
                  timeScale,
                })}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: card.zIndex,
                  willChange: "transform",
                }}
              >
                <DeckCard
                  project={project}
                  featured={card.featured}
                  layout={layout}
                  border={border}
                  hoverScale={tunables.hoverScale}
                  hoverLift={tunables.hoverLift}
                  reduce={reduce}
                  timeScale={timeScale}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      ) : null}
    </motion.div>
  );
}
