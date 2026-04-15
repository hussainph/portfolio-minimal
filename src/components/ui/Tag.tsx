import { cn } from "@/lib/utils";

export type TagVariant =
  | "ai"
  | "building"
  | "design"
  | "thinking"
  | "code"
  | "reading";

interface TagProps {
  variant: TagVariant;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Static class lookups so Tailwind can extract them at build time.
const RESTING: Record<TagVariant, string> = {
  ai: "bg-tag-ai/10 border-tag-ai/20 text-tag-ai",
  building: "bg-tag-building/10 border-tag-building/20 text-tag-building",
  design: "bg-tag-design/10 border-tag-design/20 text-tag-design",
  thinking: "bg-tag-thinking/10 border-tag-thinking/20 text-tag-thinking",
  code: "bg-tag-code/10 border-tag-code/20 text-tag-code",
  reading: "bg-tag-reading/10 border-tag-reading/20 text-tag-reading",
};

const ACTIVE: Record<TagVariant, string> = {
  ai: "bg-tag-ai/20 border-tag-ai/30 text-tag-ai",
  building: "bg-tag-building/20 border-tag-building/30 text-tag-building",
  design: "bg-tag-design/20 border-tag-design/30 text-tag-design",
  thinking: "bg-tag-thinking/20 border-tag-thinking/30 text-tag-thinking",
  code: "bg-tag-code/20 border-tag-code/30 text-tag-code",
  reading: "bg-tag-reading/20 border-tag-reading/30 text-tag-reading",
};

export function Tag({ variant, active = false, children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border py-1 px-3 font-mono text-[11px] leading-[14px]",
        active ? ACTIVE[variant] : RESTING[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
