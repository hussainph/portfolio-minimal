"use client";

import { AnimatePresence, motion, type Transition } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CardVisual } from "./CardVisual";
import type { BorderMode, FeaturedLayout } from "./controls";
import { FeaturedCard } from "./FeaturedCard";
import type { PlaygroundProject } from "./mockProjects";

interface DeckCardProps {
  project: PlaygroundProject;
  /** From `arrange()` — featured cards glow + wake without hover. */
  featured: boolean;
  /** Featured face composition (cover/frame/split) + border animation. */
  layout: FeaturedLayout;
  border: BorderMode;
  /** Hover-pop magnitude (1 = no resize) and lift distance in px. */
  hoverScale: number;
  hoverLift: number;
  reduce: boolean;
  timeScale: number;
}

/** The small card's resting face: imagery + serif title + subtitle — NO status
 *  dot, version, date, or hashtags. Hover reveals a single "latest ·" line,
 *  the only place the repeat-visitor signal surfaces. */
function SmallFace({
  project,
  hovered,
  reduce,
}: {
  project: PlaygroundProject;
  hovered: boolean;
  reduce: boolean;
}) {
  const revealTransition: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.2, 0.6, 0.3, 1] };

  return (
    <>
      <CardVisual tags={project.tags} active={hovered} />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5">
        <h3 className="font-serif text-[24px] leading-[27px] tracking-[-0.02em] text-text">
          {project.title}
        </h3>
        <p className="font-sans text-[14px] leading-[19px] tracking-[-0.03em] text-body line-clamp-2">
          {project.subtitle}
        </p>

        <AnimatePresence initial={false}>
          {hovered && project.status ? (
            <motion.div
              key="latest"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={revealTransition}
              className="overflow-hidden"
            >
              <span className="mt-1 inline-block font-mono text-[10px] leading-[14px] tracking-[0.04em] text-faint">
                latest · {project.status}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}

/**
 * The card shell shared by every tile: border, radius, hover lift, shadow, and
 * the whole-card link. The lift runs on this INNER layer with its own snappy
 * spring (independent of the deck's morph transform); the shadow tweens
 * alongside it instead of snapping. Featured tiles swap in a FeaturedCard face
 * (composed at design size — see arrange.ts) with a short crossfade, since
 * filtering can change which card holds the feature slot.
 *
 * Hover is local state so hovering one card never re-renders the whole deck.
 */
export function DeckCard({
  project,
  featured,
  layout,
  border,
  hoverScale,
  hoverLift,
  reduce,
  timeScale,
}: DeckCardProps) {
  const [hovered, setHovered] = useState(false);

  // The draw-in border supplies the featured ring itself — hide the shell's
  // static border there or the draw has nothing to reveal.
  const hideShellBorder = featured && border === "draw";

  const liftSpring: Transition = reduce
    ? { duration: 0 }
    : { type: "spring", stiffness: 500, damping: 34 };

  return (
    <div
      className="h-full w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{
          y: hovered ? -hoverLift : 0,
          scale: hovered ? hoverScale : 1,
          boxShadow: hovered
            ? "0 18px 40px -12px rgba(0,0,0,0.6)"
            : "0 2px 10px -6px rgba(0,0,0,0.5)",
        }}
        transition={{
          ...liftSpring,
          boxShadow: reduce
            ? { duration: 0 }
            : { type: "tween", duration: 0.25, ease: "easeOut" },
        }}
        className={cn(
          "relative h-full w-full overflow-hidden rounded-card border",
          hideShellBorder
            ? "border-transparent"
            : hovered
              ? "border-border-hover"
              : "border-border",
        )}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={featured ? `featured-${layout}-${border}` : "small"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {featured ? (
              <FeaturedCard
                project={project}
                layout={layout}
                border={border}
                hovered={hovered}
                reduce={reduce}
                timeScale={timeScale}
              />
            ) : (
              <SmallFace project={project} hovered={hovered} reduce={reduce} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Whole-card link to the detail page (no click-to-swap). */}
        <Link
          href={`/projects/${project.slug}`}
          aria-label={project.title}
          className="absolute inset-0 z-20"
        />
      </motion.div>
    </div>
  );
}
