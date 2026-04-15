import Link from "next/link";
import type { ReactNode } from "react";
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
 * Cross-reference link for MDX bodies. The author writes
 * `<Ref slug="trust-ramps" />` and the component resolves the slug against the
 * content index, emits a real `<Link>`, and hangs a `data-ref-slug` attribute
 * for the future hover-preview (Phase 7). Styling matches `TextLink` so refs
 * sit in prose identically to regular links.
 *
 * Missing slugs render a visible-but-safe fallback in both dev and prod —
 * dev gets a louder accent so broken refs are obvious while authoring.
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

  return (
    <Link
      href={routeFor(item)}
      data-ref-slug={slug}
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
