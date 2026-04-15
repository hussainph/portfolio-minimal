import { cn } from "@/lib/utils";

interface CommonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

type ButtonOnly = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type AnchorOnly = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

type PrimaryButtonProps = ButtonOnly | AnchorOnly;

/**
 * The "shader wave" button — v3's primary control.
 *
 * - Rest: 1.5px neutral ring, near-black fill, cream label. Lets the word do
 *   the work.
 * - Hover: conic-gradient ring fades in and rotates continuously (animated
 *   via the `--ring-angle` @property declared in globals.css). A subtle
 *   two-color glow bloom lifts it off the page.
 * - Disabled: ring drops to flat neutral, fill desaturates, label goes faint,
 *   cursor becomes not-allowed.
 *
 * Polymorphic: pass `href` to render an anchor (with native navigation) or
 * omit for a regular button. prefers-reduced-motion: the rotating ring
 * animation is suppressed globally by globals.css; the color ring still
 * fades in on hover so the affordance is legible.
 */
export function PrimaryButton(props: PrimaryButtonProps) {
  const { children, className, disabled, ...rest } = props;

  const shellClass = cn(
    "group relative inline-flex rounded-md p-[1.5px] no-underline",
    "transition-[filter] duration-200",
    disabled
      ? "cursor-not-allowed opacity-50"
      : "hover:shadow-[0_0_24px_#FFB84422,0_0_48px_#7B7EFF18]",
    className,
  );

  const body = (
    <>
      {/* Neutral rest ring — always present. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-md bg-border-hover"
      />
      {/* Conic color ring — fades in on hover, rotates via --ring-angle. */}
      {!disabled ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 rounded-md opacity-0 transition-opacity duration-300",
            "group-hover:opacity-100 group-hover:animate-[ring-spin_6s_linear_infinite]",
          )}
          style={{
            backgroundImage:
              "conic-gradient(from var(--ring-angle, 45deg) at 50% 50%, oklab(83% 0.037 0.146) 0%, oklab(74.1% 0.161 0.027) 20%, oklab(70.7% 0.079 -0.123) 40%, oklab(65.4% 0.029 -0.185) 60%, oklab(81.7% -0.139 0.026) 80%, oklab(83% 0.037 0.146) 100%)",
          }}
        />
      ) : null}
      {/* Fill + label. */}
      <span
        className={cn(
          "relative rounded-[4.5px] py-2.5 px-[22px] bg-[#0f0f11]",
          "font-sans font-medium text-[14px] leading-[18px] tracking-[-0.03em]",
          disabled ? "text-faint" : "text-text",
        )}
      >
        {children}
      </span>
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        className={shellClass}
        {...anchorRest}
      >
        {body}
      </a>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={buttonRest.type ?? "button"}
      disabled={disabled}
      className={shellClass}
      {...buttonRest}
    >
      {body}
    </button>
  );
}
