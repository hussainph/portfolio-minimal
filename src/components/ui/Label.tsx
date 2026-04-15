import { cn } from "@/lib/utils";

interface LabelProps {
  children: React.ReactNode;
  /** Visual size token. Defaults to `sm` (11px), matching specimen labels. */
  size?: "xs" | "sm";
  /** Color token. */
  tone?: "faint" | "muted" | "text";
  className?: string;
}

const SIZES = {
  xs: "text-[9px] leading-[12px] tracking-[0.05em]",
  sm: "text-[11px] leading-[14px] tracking-[0.08em]",
};

const TONES = {
  faint: "text-faint",
  muted: "text-muted",
  text: "text-text",
};

export function Label({
  children,
  size = "sm",
  tone = "faint",
  className,
}: LabelProps) {
  return (
    <span
      className={cn("font-mono uppercase", SIZES[size], TONES[tone], className)}
    >
      {children}
    </span>
  );
}
