import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/ui/Tag";
import { ProjectGlow, REVEAL_CLASSES } from "./ProjectSurface";

interface ProjectChipProps {
  slug: string;
  title: string;
  tags: string[];
  /** Short status line. Revealed on hover/focus, never at rest on pointer devices. */
  status?: string;
  className?: string;
}

/**
 * The `bitesized` tier — the weekend stuff. Same visual-first rules as
 * ProjectCard (glow + serif title at rest, meta on hover/focus) at the
 * smallest scale the system uses, so a short row of these still reads as
 * part of the same family as the grid above it.
 */
export function ProjectChip({
  slug,
  title,
  tags,
  status,
  className,
}: ProjectChipProps) {
  const primaryTag = tags[0];

  return (
    <article
      className={cn(
        "group relative isolate flex min-h-[112px] flex-col justify-end gap-2 overflow-hidden rounded-panel border border-border bg-surface p-4 pb-3 transition-colors duration-300 hover:border-border-hover hover:bg-surface-hover sm:min-h-[124px] sm:p-5 sm:pb-4",
        className,
      )}
    >
      <ProjectGlow seed={slug} accent={tags[0]} />

      <h3 className="font-serif text-[17px] leading-[22px] tracking-[-0.01em] text-text text-balance sm:text-[18px] sm:leading-[24px]">
        <Link
          href={`/projects/${slug}`}
          className="text-inherit no-underline before:absolute before:inset-0 before:rounded-[inherit] before:content-['']"
        >
          {title}
        </Link>
      </h3>

      <div className={cn(REVEAL_CLASSES, "h-7")}>
        {primaryTag ? (
          <Tag as="display" name={primaryTag}>
            #{primaryTag}
          </Tag>
        ) : null}
        {status ? (
          <span className="truncate font-sans text-[12px] leading-[16px] tracking-[-0.03em] text-muted">
            {status}
          </span>
        ) : null}
      </div>
    </article>
  );
}
