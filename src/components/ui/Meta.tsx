import { cn } from "@/lib/utils";

interface MetaProps {
  children: React.ReactNode;
  /** Slightly brighter when used in active/hover contexts. */
  tone?: "faint" | "muted";
  className?: string;
}

export function Meta({ children, tone = "faint", className }: MetaProps) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] leading-[14px] tracking-[0.02em]",
        tone === "faint" ? "text-faint" : "text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
