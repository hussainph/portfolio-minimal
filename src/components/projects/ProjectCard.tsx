import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/ui/Tag";
import { ProjectGlow, REVEAL_CLASSES } from "./ProjectSurface";

interface ProjectCardProps {
  slug: string;
  tags: string[];
  title: string;
  subtitle?: string;
  /** Short status line, e.g. "v0.4 · launching may". Revealed on hover/focus. */
  status?: string;
  /**
   * `major` is a showcase-tier project that isn't the lead — a big card with
   * a full subtitle. `compact` is the mid-weight tier.
   */
  weight?: "major" | "compact";
  className?: string;
}

/**
 * Grid card for the projects index. Visual-first: at rest it is imagery
 * (a tag-hashed glow), a serif title, and a subtitle — nothing else. Status
 * and tags stay out of the resting composition and ride in on hover or
 * keyboard focus, so the grid reads as a set of objects rather than a set
 * of spec sheets.
 *
 * The title carries the overlay link (`before:inset-0`), which makes the
 * whole card clickable while leaving one accessible name per card. The
 * revealed meta is deliberately non-interactive — controls that are hidden
 * at rest are a poor target, and every tag is reachable from the feed.
 */
export function ProjectCard({
  slug,
  tags,
  title,
  subtitle,
  status,
  weight = "compact",
  className,
}: ProjectCardProps) {
  const isMajor = weight === "major";
  const shownTags = tags.slice(0, isMajor ? 3 : 2);

  return (
    <article
      className={cn(
        "group relative isolate flex flex-col justify-end overflow-hidden rounded-panel border border-border bg-surface",
        "transition-colors duration-300 hover:border-border-hover hover:bg-surface-hover",
        isMajor
          ? "min-h-[248px] gap-3 p-6 pb-5 sm:min-h-[300px] sm:p-8 sm:pb-6"
          : "min-h-[176px] gap-2.5 p-5 pb-4 sm:min-h-[196px] sm:p-6 sm:pb-5",
        className,
      )}
    >
      <ProjectGlow seed={slug} accent={tags[0]} />

      <h3
        className={cn(
          "font-serif text-text text-balance",
          isMajor
            ? "text-[27px] leading-[31px] tracking-[-0.015em] sm:text-[32px] sm:leading-[36px]"
            : "text-[20px] leading-[25px] tracking-[-0.01em] sm:text-[22px] sm:leading-[27px]",
        )}
      >
        <Link
          href={`/projects/${slug}`}
          className="text-inherit no-underline before:absolute before:inset-0 before:rounded-[inherit] before:content-['']"
        >
          {title}
        </Link>
      </h3>

      {subtitle ? (
        <p
          className={cn(
            "font-sans tracking-[-0.03em] text-muted text-pretty transition-colors duration-300 group-hover:text-body",
            isMajor
              ? "line-clamp-3 text-[15px] leading-[23px]"
              : "line-clamp-2 text-[14px] leading-[21px]",
          )}
        >
          {subtitle}
        </p>
      ) : null}

      {/* Reserved strip — empty at rest so the reveal costs no layout shift. */}
      <div className={cn(REVEAL_CLASSES, "h-7", isMajor ? "pt-1" : null)}>
        {shownTags.map((t) => (
          <Tag key={t} as="display" name={t}>
            #{t}
          </Tag>
        ))}
        {status ? (
          <span className="truncate font-sans text-[12px] leading-[16px] tracking-[-0.03em] text-muted">
            {status}
          </span>
        ) : null}
      </div>
    </article>
  );
}
