import Link from "next/link";
import type { ReactNode } from "react";
import { assertNever } from "@/lib/assertNever";
import { cn } from "@/lib/utils";
import { getItemBySlug } from "@/lib/content";
import type { ContentItem } from "@/lib/content";

interface RefProps {
  slug: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Resolve a slug to its route. The loader stores both feed items and projects
 * in the same `bySlug` map, so we can recover the content kind without extra
 * IO and send the reader to the right section of the site.
 */
function routeFor(item: ContentItem): string {
  switch (item.kind) {
    case "note":
      return `/n/${item.frontmatter.slug}`;
    case "post":
      return `/blog/${item.frontmatter.slug}`;
    case "showcase":
      return `/showcases/${item.frontmatter.slug}`;
    case "project":
      return `/projects/${item.frontmatter.slug}`;
    default:
      return assertNever(item);
  }
}

/**
 * Fall-back label when the MDX author didn't pass children. Uses the
 * frontmatter title when present; otherwise the slug itself so notes without
 * titles (which is most of them) still render a human-readable link.
 */
function defaultLabel(item: ContentItem): string {
  const title =
    "title" in item.frontmatter ? item.frontmatter.title : undefined;
  if (title && typeof title === "string" && title.trim().length > 0) {
    return title;
  }
  return item.frontmatter.slug;
}

/**
 * Compact title string for the `data-ref-title` attribute. Mirrors
 * `getRefPreview`'s logic but stays inline so we don't double-resolve the
 * slug — Phase 8 hover code reads this attribute first and only fetches the
 * full preview when it commits to opening a card.
 */
function previewTitleFor(item: ContentItem): string {
  switch (item.kind) {
    case "post":
    case "project":
      return item.frontmatter.title;
    case "showcase": {
      const authored = item.frontmatter.title?.trim();
      if (authored) return authored;
      const isMulti =
        item.frontmatter.variant === "bento" ||
        item.frontmatter.variant === "grid";
      if (isMulti) {
        const picked = item.frontmatter.images.find((img) => img.picked === true);
        if (picked?.caption) return picked.caption;
      }
      return item.frontmatter.images[0]?.caption ?? item.frontmatter.slug;
    }
    case "note": {
      // Prefer authored title, then the first non-empty body line so refs to
      // title-less notes still surface a meaningful preview headline.
      const authored = item.frontmatter.title?.trim();
      if (authored) return authored;
      const firstBodyLine = item.raw
        .split(/\n/)
        .map((l) => l.trim())
        .find((l) => l.length > 0);
      return firstBodyLine || item.frontmatter.slug;
    }
    default:
      return assertNever(item);
  }
}

function clip(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

/**
 * Cross-reference link for MDX bodies. The author writes
 * `<Ref slug="trust-ramps" />` and the component resolves the slug against the
 * content index, emits a real `<Link>`, and hangs `data-ref-*` attributes for
 * the future hover-preview. Styling matches `TextLink` so refs sit in prose
 * identically to regular links.
 *
 * Missing slugs render a visible-but-safe fallback in both dev and prod —
 * dev gets a louder accent so broken refs are obvious while authoring.
 *
 * Phase 8 adds the hover interaction against `data-ref-*` attributes; the
 * full payload (excerpt, tags, etc.) comes from `getRefPreview` server-side
 * on demand.
 */
export async function Ref({ slug, children, className }: RefProps) {
  const item = await getItemBySlug(slug);

  if (!item) {
    const isDev = process.env.NODE_ENV !== "production";
    return (
      <span
        data-ref-slug={slug}
        data-ref-missing="true"
        className={cn(
          "font-sans text-[17px] leading-[22px] tracking-[-0.03em]",
          isDev
            ? "rounded-xs border border-dashed border-accent-orange/60 px-1.5 py-0.5 text-accent-orange"
            : "text-muted underline decoration-dotted decoration-muted underline-offset-[5px]",
          className,
        )}
      >
        {children ?? `[missing: ${slug}]`}
      </span>
    );
  }

  const label = children ?? defaultLabel(item);
  const refTitle = clip(previewTitleFor(item), 60);

  return (
    <Link
      href={routeFor(item)}
      data-ref-slug={slug}
      data-ref-kind={item.kind}
      data-ref-title={refTitle}
      className={cn(
        "font-sans text-[17px] leading-[22px] tracking-[-0.03em] transition-colors duration-150",
        "text-text-link underline decoration-accent-teal decoration-dashed decoration-1 underline-offset-[5px]",
        "hover:text-accent-teal hover:decoration-solid hover:decoration-[1.5px]",
        "visited:text-visited visited:decoration-visited",
        className,
      )}
    >
      {label}
    </Link>
  );
}
