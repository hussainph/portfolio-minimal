import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";

interface PullQuoteProps {
  /** When set, the left border picks up the tag's hue. Posts auto-bind this to the first frontmatter tag. */
  tag?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Pull quote — italic serif, tinted left border. Auto-colors from the post's
 * primary tag when rendered inside an MDX body (the loader binds the tag for
 * us). Outside MDX the `tag` prop is required to tint; without it the border
 * falls back to the muted accent orange.
 */
export function PullQuote({ tag, children, className }: PullQuoteProps) {
  const borderColor = tag ? tagColor(tag) : "var(--color-accent-orange)";
  // The inline-child selectors override the MDX <p> mapping (which otherwise
  // wins on specificity for markdown `> quote` blocks inside prose-dark).
  return (
    <blockquote
      className={cn(
        "my-6 max-w-[640px] border-l-2 pl-5 font-serif italic text-[24px] leading-[34px] tracking-[-0.01em] text-quote",
        "[&_p]:m-0 [&_p]:font-serif [&_p]:italic [&_p]:text-[24px] [&_p]:leading-[34px] [&_p]:tracking-[-0.01em] [&_p]:text-quote",
        className,
      )}
      style={{ borderColor }}
    >
      {children}
    </blockquote>
  );
}
