import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { PrimaryButton } from "./PrimaryButton";
import { Tag } from "./Tag";

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
  /** Top-left pill — e.g. "Now · headliner". */
  badge?: string;
  tags: string[];
  title: string;
  subtitle: string;
  /** Metadata rows rendered under a hairline above the CTAs. */
  meta: ProjectHeroMeta[];
  primaryCta: ProjectHeroCta;
  secondaryCta?: ProjectHeroCta;
  /** Small glass pill inside the visual pane — e.g. "live shader · hover to interact". */
  visualBadge?: string;
  className?: string;
}

/**
 * The "headliner" — a tall, two-pane project card. Left pane holds the
 * editorial stack (tags → serif title → subtitle → meta rows → CTAs). The
 * right pane is a layered shader visual that drifts continuously via the
 * `--shader-angle` @property declared in globals.css.
 *
 * Data-driven: pass any project's tags, copy, meta rows, and CTAs — no
 * content is hardcoded.
 */
export function ProjectHero({
  badge,
  tags,
  title,
  subtitle,
  meta,
  primaryCta,
  secondaryCta,
  visualBadge,
  className,
}: ProjectHeroProps) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col-reverse overflow-hidden rounded-md border border-border bg-[#0f0f11]",
        "md:flex-row md:min-h-[420px]",
        className,
      )}
    >
      {/* Editorial pane — left on desktop, below the shader banner on mobile */}
      <div
        className="flex w-full shrink-0 flex-col justify-center gap-4 py-8 px-5 sm:gap-5 sm:py-10 sm:px-8 md:w-[45%] md:py-14 md:px-12"
        style={{
          backgroundImage:
            "linear-gradient(180deg in oklab, oklab(14.5% 0.0006 -0.002) 0%, oklab(16.9% 0.001 -0.004) 100%)",
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <Tag key={t} name={t}>
              #{t}
            </Tag>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-[36px] leading-[40px] tracking-[-0.03em] text-text sm:text-[54px] sm:leading-[58px] md:text-[72px] md:leading-[69px]">
            {title}
          </h2>
          <p className="font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
            {subtitle}
          </p>
        </div>

        <dl className="flex flex-col gap-2.5 border-t border-elevated pt-2">
          {meta.map((row) => (
            <div key={row.label} className="flex justify-between">
              <dt className="font-mono text-[11px] leading-[14px] tracking-[0.02em] text-faint">
                {row.label}
              </dt>
              <dd className="font-mono text-[11px] leading-[14px] tracking-[0.02em] text-muted">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex items-center gap-3.5 pt-2">
          <PrimaryCtaShell cta={primaryCta} />
          {secondaryCta ? <SecondaryCtaShell cta={secondaryCta} /> : null}
        </div>
      </div>

      {/* Shader visual pane — right-half on desktop, short banner on mobile */}
      <div
        className="relative h-36 w-full grow overflow-hidden animate-[shader-drift_45s_linear_infinite] sm:h-48 md:h-auto md:w-auto"
        style={{
          backgroundImage:
            "radial-gradient(circle farthest-corner at 40% 55% in oklab, oklab(65.4% 0.029 -0.185) 0%, oklab(70.7% 0.079 -0.123) 20%, oklab(81.7% -0.139 0.026) 40%, oklab(83% 0.037 0.146) 65%, oklab(16.9% 0.001 -0.004) 90%)",
        }}
      >
        {/* Highlight bloom, top-right */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle farthest-corner at 70% 30% in oklab, oklab(100% 0 0 / 20%) 0%, oklab(0% 0 0 / 0%) 25%)",
          }}
        />
        {/* Vignette, bottom */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg in oklab, oklab(0% 0 -.0001 / 0%) 60%, oklab(14.5% 0.0006 -0.002 / 66.7%) 100%)",
          }}
        />
        {/* Shimmer conic — drifts via --shader-angle */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "conic-gradient(from var(--shader-angle, 0deg) at 45% 55%, oklab(0% 0 0 / 0%) 0%, oklab(100% 0 0 / 3%) 25%, oklab(0% 0 0 / 0%) 50%, oklab(100% 0 0 / 3%) 75%, oklab(0% 0 0 / 0%) 100%)",
          }}
        />

        {visualBadge ? (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-pill border border-border-hover bg-[#0a0a0b99] py-1.5 px-3 backdrop-blur-[8px] sm:bottom-5 sm:right-5 md:bottom-6 md:right-6">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full shadow-[0_0_8px_#4AE0B4]"
              style={{ backgroundColor: "#4AE0B4" }}
            />
            <span className="font-mono text-[10px] leading-3 tracking-[0.04em] text-body">
              {visualBadge}
            </span>
          </div>
        ) : null}
      </div>

      {badge ? (
        <div className="absolute top-3 left-3 rounded-pill border border-border-hover bg-[#0a0a0b99] py-1 px-2.5 backdrop-blur-[8px] sm:top-4 sm:left-4">
          <span className="font-mono text-[10px] leading-3 tracking-[0.08em] uppercase text-accent-orange">
            {badge}
          </span>
        </div>
      ) : null}
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
  // Mirrors the TextLink atom — 17px DM Sans, -3% tracking, dashed teal
  // underline that resolves to a solid teal on hover. Keeps the trailing
  // arrow so it still reads as a directional CTA.
  return (
    <Component
      className="group inline-flex items-center gap-2 font-sans text-[16px] leading-[22px] tracking-[-0.03em] text-text-link underline decoration-accent-teal decoration-dashed decoration-1 underline-offset-[5px] transition-[color,gap] duration-150 hover:gap-2.5 hover:text-accent-teal hover:decoration-solid hover:decoration-[1.5px] sm:text-[17px]"
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
