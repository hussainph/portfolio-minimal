"use client";

import { AnimatePresence, motion } from "framer-motion";
import { tagColor } from "@/lib/tagColor";
import { tileGlow, GLOW_NEUTRAL_BASE } from "@/lib/tagGlow";
import { cn } from "@/lib/utils";
import type { BorderMode, FeaturedLayout } from "./controls";
import type { PlaygroundProject } from "./mockProjects";
import { MockScreenshot } from "./MockScreenshot";

interface FeaturedCardProps {
  project: PlaygroundProject;
  layout: FeaturedLayout;
  border: BorderMode;
  hovered: boolean;
  reduce: boolean;
  /** Speed-toggle multiplier — the draw-in border paces with the deck. */
  timeScale: number;
}

/* ------------------------------------------------------------------ */
/* Border animations                                                   */
/* ------------------------------------------------------------------ */

/** A tag-hued conic highlight orbiting the card's border ring. The mask
 *  trick keeps only a 1px ring of the conic visible; --ring-angle (Houdini
 *  @property, shared with PrimaryButton) makes the angle animatable. */
function TraceBorder({
  tag,
  hovered,
  reduce,
}: {
  tag: string;
  hovered: boolean;
  reduce: boolean;
}) {
  const c = tagColor(tag, hovered ? 0.9 : 0.55);
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-30 rounded-card transition-opacity duration-300",
        !reduce && "animate-[ring-spin_7s_linear_infinite]",
      )}
      style={{
        padding: 1.5,
        backgroundImage: `conic-gradient(from var(--ring-angle, 45deg), transparent 0%, ${c} 12%, transparent 26%, transparent 55%, ${tagColor(tag, 0.25)} 68%, transparent 80%)`,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
      }}
    />
  );
}

/** The border draws itself on entrance — an SVG ring whose pathLength tweens
 *  0→1 in step with the deck's entrance choreography. Stays lit afterwards. */
function DrawBorder({
  tag,
  reduce,
  timeScale,
}: {
  tag: string;
  reduce: boolean;
  timeScale: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    >
      <motion.rect
        x="0.75"
        y="0.75"
        rx="4"
        style={{ width: "calc(100% - 1.5px)", height: "calc(100% - 1.5px)" }}
        fill="none"
        stroke={tagColor(tag, 0.65)}
        strokeWidth="1.5"
        // Keyframes (not `initial`) so the draw survives the face-swap
        // AnimatePresence above, whose initial={false} suppresses `initial`
        // for the whole subtree on mount.
        animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1] }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 1.1 * timeScale, delay: 0.15 * timeScale, ease: [0.3, 0.1, 0.2, 1] }
        }
      />
    </svg>
  );
}

function FeaturedBorder(props: FeaturedCardProps) {
  const tag = props.project.tags[0] ?? "building";
  if (props.border === "trace")
    return <TraceBorder tag={tag} hovered={props.hovered} reduce={props.reduce} />;
  if (props.border === "draw")
    return <DrawBorder tag={tag} reduce={props.reduce} timeScale={props.timeScale} />;
  return null;
}

/* ------------------------------------------------------------------ */
/* Shared text pieces                                                  */
/* ------------------------------------------------------------------ */

function StatusReveal({
  project,
  hovered,
  reduce,
}: {
  project: PlaygroundProject;
  hovered: boolean;
  reduce: boolean;
}) {
  return (
    <AnimatePresence initial={false}>
      {hovered && project.status ? (
        <motion.div
          key="latest"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.2, 0.6, 0.3, 1] }}
          className="overflow-hidden"
        >
          <span className="mt-1.5 inline-block font-mono text-[11px] leading-[15px] tracking-[0.04em] text-faint">
            latest · {project.status}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Layouts                                                             */
/* ------------------------------------------------------------------ */

/** COVER — the screenshot IS the card. Full bleed, tall scrim, text over. */
function CoverLayout({ project, hovered, reduce }: FeaturedCardProps) {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { scale: hovered ? 1.025 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
      >
        <MockScreenshot slug={project.slug} tags={project.tags} />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[58%]"
        style={{
          backgroundImage:
            "linear-gradient(180deg in oklab, oklab(0% 0 0 / 0%) 0%, oklab(3% 0 0 / 72%) 45%, oklab(3% 0 0 / 94%) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-7">
        <h3 className="max-w-[480px] font-serif text-[38px] leading-[42px] tracking-[-0.02em] text-text">
          {project.title}
        </h3>
        <p className="max-w-[460px] font-sans text-[14px] leading-[20px] tracking-[-0.03em] text-body line-clamp-2">
          {project.description}
        </p>
        <StatusReveal project={project} hovered={hovered} reduce={reduce} />
      </div>
    </>
  );
}

/** FRAME — the screenshot floats as a browser window over quiet tag-hued
 *  atmosphere; the text block gets its own ground beneath. */
function FrameLayout({ project, hovered, reduce }: FeaturedCardProps) {
  const primaryTag = project.tags[0] ?? "building";
  return (
    <>
      <div aria-hidden="true" className={cn("absolute inset-0 bg-gradient-to-br", GLOW_NEUTRAL_BASE)} />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: tileGlow(primaryTag, "weak") }}
      />

      <motion.div
        className="absolute inset-x-7 top-7 bottom-[34%] overflow-hidden rounded-[6px] border border-border"
        style={{ boxShadow: "0 24px 48px -18px rgba(0,0,0,0.65)", transformOrigin: "50% 80%" }}
        animate={reduce ? undefined : { rotate: hovered ? 0 : -1.1, y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <MockScreenshot slug={project.slug} tags={project.tags} />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-7">
        <h3 className="font-serif text-[34px] leading-[38px] tracking-[-0.02em] text-text">
          {project.title}
        </h3>
        <p className="max-w-[460px] font-sans text-[14px] leading-[20px] tracking-[-0.03em] text-body line-clamp-2">
          {project.description}
        </p>
        <StatusReveal project={project} hovered={hovered} reduce={reduce} />
      </div>
    </>
  );
}

/** SPLIT — editorial column left, the screenshot bleeding off the right and
 *  bottom edges like a magazine crop. Status rests visible (the hero affords
 *  one meta line). */
function SplitLayout({ project, hovered, reduce }: FeaturedCardProps) {
  return (
    <>
      <div aria-hidden="true" className={cn("absolute inset-0 bg-gradient-to-br", GLOW_NEUTRAL_BASE)} />

      <motion.div
        className="absolute top-9 -right-12 -bottom-8 left-[42%] overflow-hidden rounded-[6px] border border-border"
        style={{ boxShadow: "0 24px 48px -18px rgba(0,0,0,0.6)" }}
        animate={reduce ? undefined : { x: hovered ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <MockScreenshot slug={project.slug} tags={project.tags} />
      </motion.div>

      <div className="absolute inset-y-0 left-0 flex w-[42%] flex-col justify-end gap-2.5 p-7 pr-5">
        <h3 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text">
          {project.title}
        </h3>
        <p className="font-sans text-[14px] leading-[20px] tracking-[-0.03em] text-body">
          {project.description}
        </p>
        {project.status ? (
          <span className="mt-1.5 font-mono text-[11px] leading-[15px] tracking-[0.04em] text-faint">
            latest · {project.status}
          </span>
        ) : null}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The featured tile's face — screenshot-first. The project's actual UI (a
 * deterministic mock here; real screenshots once the schema grows a field)
 * carries the visual weight, the description earns its slot, and the border
 * axis adds motion at the card's edge instead of inside it.
 */
export function FeaturedCard(props: FeaturedCardProps) {
  return (
    <>
      {props.layout === "cover" ? (
        <CoverLayout {...props} />
      ) : props.layout === "frame" ? (
        <FrameLayout {...props} />
      ) : (
        <SplitLayout {...props} />
      )}
      <FeaturedBorder {...props} />
    </>
  );
}
