import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";

export type TagState = "default" | "hover" | "active";

interface TagProps {
  /**
   * The tag's underlying name (no `#` prefix). The hue is derived from
   * this string via `tagColor()` — stable across renders and builds.
   */
  name: string;
  /**
   * Visual state. `active` renders a solid fill with near-black text for
   * selected filter chips; `hover` is a brighter tint used in interactive
   * specimens; `default` is the resting state.
   */
  state?: TagState;
  /**
   * Back-compat convenience — sugar for `state="active"`.
   */
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

const ALPHAS: Record<TagState, { bg: number; border: number }> = {
  default: { bg: 0.094, border: 0.188 }, // matches Paper's HEX18 / HEX30
  hover: { bg: 0.188, border: 0.333 },   // matches HEX30 / HEX55
  active: { bg: 1, border: 1 },
};

export function Tag({
  name,
  state,
  active = false,
  children,
  className,
}: TagProps) {
  const resolved: TagState = state ?? (active ? "active" : "default");
  const alphas = ALPHAS[resolved];
  const color = tagColor(name);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border py-1 px-3 font-mono text-[11px] leading-[14px]",
        resolved === "active" ? "font-bold text-background" : null,
        className,
      )}
      style={{
        backgroundColor: tagColor(name, alphas.bg),
        borderColor: tagColor(name, alphas.border),
        color: resolved === "active" ? undefined : color,
      }}
    >
      {children}
    </span>
  );
}
