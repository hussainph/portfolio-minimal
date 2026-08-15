import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { Icon } from "./Icon";
import { PrimaryButton } from "./PrimaryButton";

export interface ProjectHeroMeta {
  label: string;
  value: string;
}

export interface ProjectHeroCta {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ProjectHeroProps {
  /** Drives the ambient glow hue. Not rendered as pills — the color is the tag. */
  tags: string[];
  title: string;
  subtitle: string;
  /** Short human status, e.g. "v0.4 · launching may". Rendered as a dot + line. */
  status?: string;
  /** Supporting facts. Rendered as a wrapping caption, never a label/value table. */
  meta?: ProjectHeroMeta[];
  primaryCta: ProjectHeroCta;
  secondaryCta?: ProjectHeroCta;
  /** `lead` is the projects-index headliner; `detail` sits above the reading panes. */
  variant?: "lead" | "detail";
  className?: string;
}

/**
 * The headliner. One surface, not two panes: a tag-derived glow field fills
 * the whole card and the editorial stack sits directly on it. That's the
 * fix for the old split layout, which stacked into a squat shader banner
 * plus a cramped text block on narrow screens — there are no panes left to
 * stack, so the mobile composition is the same idea as the desktop one at a
 * different scale.
 *
 * Hierarchy comes from atmosphere (glow presence, type scale, padding), not
 * from chrome: no badge pill, no status glass pill, no monospace meta table.
 * The ambient conic shimmer drifts via the `--shader-angle` @property and is
 * suppressed under `prefers-reduced-motion` by the global rule in globals.css.
 */
export function ProjectHero({
  tags,
  title,
  subtitle,
  status,
  meta,
  primaryCta,
  secondaryCta,
  variant = "detail",
  className,
}: ProjectHeroProps) {
  const isLead = variant === "lead";
  const primaryHue = tagColor(tags[0] ?? "building", 0.17);
  const secondaryHue = tagColor(tags[1] ?? tags[0] ?? "building", 0.09);
  const dotColor = tagColor(tags[0] ?? "building");

  // The status line already says what a `status` meta row would say, so drop
  // the duplicate rather than printing it twice in two different voices.
  const metaRows = (meta ?? []).filter(
    (row) => !(status && row.label.trim().toLowerCase() === "status"),
  );

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-panel border border-border bg-surface",
        isLead ? "lg:min-h-[440px]" : "lg:min-h-[340px]",
        className,
      )}
    >
      <HeroAtmosphere primary={primaryHue} secondary={secondaryHue} />

      <div
        className={cn(
          "relative flex flex-col justify-center gap-5",
          "px-6 py-9 sm:px-9 sm:py-11 lg:px-14 lg:py-14",
          isLead ? "lg:min-h-[440px] lg:max-w-[62%]" : "lg:min-h-[340px] lg:max-w-[68%]",
        )}
      >
        {status ? (
          <p className="flex items-center gap-2.5 font-sans text-[13px] leading-[18px] tracking-[-0.03em] text-muted">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full"
              style={{
                backgroundColor: dotColor,
                boxShadow: `0 0 9px ${tagColor(tags[0] ?? "building", 0.55)}`,
              }}
            />
            <span>{status}</span>
          </p>
        ) : null}

        <div className="flex flex-col gap-3.5">
          <h2
            className={cn(
              "font-serif text-text text-balance",
              isLead
                ? "text-[40px] leading-[42px] tracking-[-0.02em] sm:text-[56px] sm:leading-[58px] lg:text-[72px] lg:leading-[72px]"
                : "text-[34px] leading-[38px] tracking-[-0.02em] sm:text-[46px] sm:leading-[48px] lg:text-[58px] lg:leading-[60px]",
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "max-w-[46ch] font-sans tracking-[-0.03em] text-body text-pretty",
              isLead
                ? "text-[16px] leading-[25px] sm:text-[17px] sm:leading-[27px]"
                : "text-[15px] leading-[23px] sm:text-[16px] sm:leading-[25px]",
            )}
          >
            {subtitle}
          </p>
        </div>

        {metaRows.length > 0 ? (
          <ul className="flex max-w-[52ch] flex-wrap gap-x-5 gap-y-1.5">
            {metaRows.map((row) => (
              <li
                key={row.label}
                className="font-sans text-[13px] leading-[19px] tracking-[-0.03em]"
              >
                <span className="text-faint">{row.label} </span>
                <span className="text-muted">{row.value}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
          <PrimaryCtaShell cta={primaryCta} />
          {secondaryCta ? <SecondaryCtaShell cta={secondaryCta} /> : null}
        </div>
      </div>
    </section>
  );
}

/**
 * The glow field. Blooms from ~78%/30% so the same coordinates read as
 * "behind the title, top-right" on a phone and "in the open space beside
 * the text" on a wide screen — no media-query-swapped layers needed.
 */
function HeroAtmosphere({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(155deg in oklab, oklab(16.5% 0.001 -0.003) 0%, oklab(13.5% 0.0006 -0.002) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle farthest-corner at 80% 32%, ${primary} 0%, transparent 68%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle farthest-side at 18% 88%, ${secondary} 0%, transparent 60%)`,
        }}
      />
      {/* Ambient drift — deliberately near-invisible at rest. */}
      <div
        className="absolute inset-0 animate-[shader-drift_45s_linear_infinite]"
        style={{
          backgroundImage:
            "conic-gradient(from var(--shader-angle, 0deg) at 62% 40%, oklab(0% 0 0 / 0%) 0%, oklab(100% 0 0 / 3.5%) 25%, oklab(0% 0 0 / 0%) 50%, oklab(100% 0 0 / 3.5%) 75%, oklab(0% 0 0 / 0%) 100%)",
        }}
      />
      {/* Keeps the type legible where the bloom runs warmest. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(100deg in oklab, oklab(11% 0.0004 -0.001 / 78%) 0%, oklab(11% 0.0004 -0.001 / 26%) 48%, oklab(11% 0.0004 -0.001 / 0%) 76%)",
        }}
      />
    </div>
  );
}

function PrimaryCtaShell({ cta }: { cta: ProjectHeroCta }) {
  if (cta.href) {
    return <PrimaryButton href={cta.href}>{cta.label}</PrimaryButton>;
  }
  return <PrimaryButton onClick={cta.onClick}>{cta.label}</PrimaryButton>;
}

function SecondaryCtaShell({ cta }: { cta: ProjectHeroCta }) {
  const Component = cta.href ? "a" : "button";
  const props = cta.href
    ? { href: cta.href }
    : { type: "button" as const, onClick: cta.onClick };
  // Mirrors the TextLink atom — DM Sans, -3% tracking, dashed teal underline
  // that resolves to solid on hover, trailing arrow so it reads directional.
  return (
    <Component
      className="group inline-flex items-center gap-2 font-sans text-[16px] leading-[22px] tracking-[-0.03em] text-text-link underline decoration-accent-teal decoration-dashed decoration-1 underline-offset-[5px] transition-[color,gap] duration-150 hover:gap-2.5 hover:text-accent-teal hover:decoration-solid hover:decoration-[1.5px]"
      {...props}
    >
      <span>{cta.label}</span>
      <Icon
        name="arrow-right"
        size={14}
        className="no-underline opacity-80 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Component>
  );
}
