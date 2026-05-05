"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import { Icon } from "@/components/ui/Icon";
import { useToolbarVisibility } from "@/components/ui/useToolbarVisibility";
import { CommandPalette } from "./CommandPalette";
import { ContentTypeChips } from "./ContentTypeChips";
import {
  LeftPanelPill,
  PANEL_LIFT_DEFAULT,
  PANEL_SHELL,
  PILL_SHELL,
  type PanelRenderProps,
} from "./LeftPanelPill";
import { TooltipButton } from "./TooltipButton";
import { useBookmarks } from "./useBookmarks";
import { useIsDesktop } from "./useIsDesktop";
import { useNavContext } from "./NavStateContext";
import { useNavState, type NavController } from "./useNavState";
import {
  BookmarkGlyph,
  Chevron,
  ChevronLeft,
  ChevronRight,
  FilterIcon,
  GridIcon,
  ParagraphIcon,
  ShareGlyph,
} from "./glyphs";
import type { OutlineEntry, ViewMode } from "./types";

interface SiteNavProps {
  /** Optional override — when omitted, the SiteNav manages its own palette
   *  state and binds ⌘K globally. Passing a handler lets a specimen page
   *  take control. */
  onOpenPalette?: () => void;
}

const STATE_VARIANTS = {
  visible: { y: 0, opacity: 1 },
  peek: { y: 28, opacity: 1 },
  hidden: { y: 80, opacity: 0 },
};

const SPRING = { type: "spring" as const, stiffness: 260, damping: 22, mass: 1 };

const PRIMARY_PAGES = [
  { id: "stream" as const, label: "stream", href: "/" },
  { id: "projects" as const, label: "projects", href: "/projects" },
  { id: "about" as const, label: "about", href: "/about" },
];

export function SiteNav({ onOpenPalette }: SiteNavProps) {
  const visibility = useToolbarVisibility();
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const pathname = usePathname();
  const nav = useNavState();
  const bookmarks = useBookmarks();
  const {
    view,
    outline,
    currentIndex,
    prevHref,
    nextHref,
    pageMeta,
    availableTags,
    paletteIndex,
  } = useNavContext();
  const saved = pageMeta.slug ? bookmarks.has(pageMeta.slug) : false;
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global ⌘K — open/close the palette from anywhere on the page. We bind it
  // here rather than inside CommandPalette so the listener exists even before
  // the palette has ever rendered.
  useEffect(() => {
    if (onOpenPalette) return; // caller is managing their own palette
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenPalette]);

  const openPalette = onOpenPalette ?? (() => setPaletteOpen(true));

  const pillRowRef = useRef<HTMLDivElement>(null);
  const [pillRowWidth, setPillRowWidth] = useState(408);
  useEffect(() => {
    const el = pillRowRef.current;
    if (!el) return;
    const measure = () => setPillRowWidth(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activePage = resolveActivePage(pathname);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = pageMeta.title ?? document.title;
    if (navigator.share) {
      try {
        await navigator.share({ url, title });
        return;
      } catch {
        // user cancelled or share not allowed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard may be blocked in dev; swallow silently
    }
  }, [pageMeta.title]);

  const handleSave = useCallback(() => {
    if (!pageMeta.slug) return;
    bookmarks.toggle(pageMeta.slug);
  }, [bookmarks, pageMeta.slug]);

  return (
    <>
      <motion.div
        animate={visibility}
        variants={STATE_VARIANTS}
        transition={reduce ? { duration: 0.2 } : SPRING}
        initial="visible"
        className="fixed bottom-7 left-1/2 z-50 -translate-x-1/2"
      >
        <div ref={pillRowRef} className="flex items-center gap-2">
          {view === "home" ? (
            <FilterPill nav={nav} pillRowWidth={pillRowWidth} availableTags={availableTags} />
          ) : (
            <OutlinePill
              view={view}
              outline={outline}
              currentIndex={currentIndex ?? 0}
              prevHref={prevHref}
              nextHref={nextHref}
              pillRowWidth={pillRowWidth}
              isDesktop={isDesktop}
              onShare={handleShare}
              onSave={handleSave}
              saved={saved}
            />
          )}

          <nav className={cn(PILL_SHELL, "p-1.5")} aria-label="Primary">
            {PRIMARY_PAGES.map((page) => {
              const active = activePage === page.id;
              return (
                <Link
                  key={page.id}
                  href={page.href}
                  className={cn(
                    "flex items-center gap-2 rounded-pill px-3 py-2.5 transition-colors sm:px-[18px]",
                    active
                      ? "bg-background text-text"
                      : "bg-transparent text-muted hover:text-text",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <PageGlyph id={page.id} />
                  <span className="hidden font-mono text-[11px] leading-[14px] tracking-[0.04em] sm:inline">
                    {page.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={openPalette}
            className={cn(PILL_SHELL, "p-1.5")}
            aria-label="Search (⌘K)"
          >
            <span className="flex items-center justify-center py-2.5 px-3.5 text-muted hover:text-text transition-colors">
              <Icon name="search" size={16} strokeWidth={1.6} />
            </span>
          </button>
        </div>
      </motion.div>
      {/* Palette is rendered outside the auto-hide wrapper so it stays
       *  visible even after the toolbar has idled out. */}
      {onOpenPalette ? null : (
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          items={paletteIndex}
        />
      )}
    </>
  );
}

/**
 * Map the current pathname onto the primary-nav tab that should read as
 * active. Note: tag archives and single-item detail routes all ladder back
 * up to "stream" since the feed is their parent.
 */
function resolveActivePage(pathname: string): "stream" | "projects" | "about" {
  if (pathname === "/about" || pathname.startsWith("/about/")) return "about";
  if (pathname === "/projects" || pathname.startsWith("/projects/"))
    return "projects";
  return "stream";
}

/* -------------------------------------------------------------------------- */
/*  Filter pill (home)                                                         */
/* -------------------------------------------------------------------------- */

function FilterPill({
  nav,
  pillRowWidth,
  availableTags,
}: {
  nav: NavController;
  pillRowWidth: number;
  availableTags: string[];
}) {
  const anyFilter = nav.types.size > 0 || nav.tags.length > 0;

  return (
    <LeftPanelPill
      icon={<FilterIcon />}
      active={anyFilter}
      labelClosed="Open filters"
      labelActive="Open filters (some active)"
      renderPanel={(p) => (
        <FilterPanel
          nav={nav}
          pillRowWidth={pillRowWidth}
          availableTags={availableTags}
          {...p}
        />
      )}
    />
  );
}

function FilterPanel({
  nav,
  pillRowWidth,
  availableTags,
  expanded,
  toggleExpanded,
  reduce,
}: {
  nav: NavController;
  pillRowWidth: number;
  availableTags: string[];
} & PanelRenderProps) {
  return (
    <motion.div
      key="filter-panel"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={
        reduce
          ? { duration: 0.15 }
          : { type: "spring", stiffness: 380, damping: 30 }
      }
      role="dialog"
      aria-label="Filter the stream"
      className={cn(PANEL_SHELL, PANEL_LIFT_DEFAULT)}
      style={{ maxWidth: pillRowWidth }}
    >
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.section
            key="tags"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: reduce
                ? { duration: 0.18 }
                : {
                    height: { duration: 0.28, ease: [0.2, 0.6, 0.3, 1] },
                    opacity: { duration: 0.2, ease: "easeOut" },
                  },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: reduce
                ? { duration: 0.12 }
                : {
                    height: { duration: 0.18, ease: [0.4, 0, 1, 1] },
                    opacity: { duration: 0.12, ease: "easeIn" },
                  },
            }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 border-b border-border/60 px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] leading-3 tracking-[0.08em] uppercase text-faint">
                  Tags
                </span>
                {nav.tags.length > 0 ? (
                  <button
                    type="button"
                    onClick={nav.clearTags}
                    className="font-mono text-[10px] leading-3 tracking-[0.04em] text-muted transition-colors hover:text-accent-orange"
                  >
                    clear
                  </button>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((t) => {
                  const active = nav.tags.includes(t);
                  const color = tagColor(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => nav.toggleTag(t)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-pill border px-2.5 py-1 font-mono text-[11px] leading-[14px] tracking-[0.02em] transition-colors duration-150",
                        active ? "font-bold text-background" : null,
                      )}
                      style={{
                        backgroundColor: tagColor(t, active ? 1 : 0.094),
                        borderColor: tagColor(t, active ? 1 : 0.188),
                        color: active ? undefined : color,
                      }}
                    >
                      #{t}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <div className="flex items-center gap-2 px-2.5 py-2">
        <ContentTypeChips selected={nav.types} onToggle={nav.toggleType} />
        <button
          type="button"
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse tag filters" : "Expand tag filters"}
          className={cn(
            "ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150",
            "hover:bg-background/60 hover:text-text",
            expanded ? "bg-background/40 text-text" : null,
          )}
        >
          <Chevron rotated={expanded} />
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Outline pill (post / project)                                              */
/* -------------------------------------------------------------------------- */

interface OutlinePillProps {
  view: ViewMode;
  outline: OutlineEntry[];
  currentIndex: number;
  prevHref: string | null;
  nextHref: string | null;
  pillRowWidth: number;
  isDesktop: boolean;
  saved: boolean;
  onShare: () => void;
  onSave: () => void;
}

function OutlinePill(props: OutlinePillProps) {
  const { view } = props;
  return (
    <LeftPanelPill
      icon={view === "post" ? <ParagraphIcon /> : <GridIcon />}
      labelClosed={view === "post" ? "Open chapters" : "Open sections"}
      renderPanel={(p) => <NestedOutlinePanel {...props} {...p} />}
    />
  );
}

function NestedOutlinePanel({
  view,
  outline,
  currentIndex,
  prevHref,
  nextHref,
  pillRowWidth,
  isDesktop,
  saved,
  onShare,
  onSave,
  expanded,
  toggleExpanded,
  reduce,
}: OutlinePillProps & PanelRenderProps) {
  const headingLabel = view === "post" ? "Chapters" : "Sections";
  const nextLabel = view === "post" ? "Next post" : "Next project";
  const prevLabel = view === "post" ? "Previous post" : "Previous project";
  // Only reveal inline short labels on desktop — on mobile the pillRowWidth
  // cap can't fit four labelled buttons.
  const showLabels = expanded && isDesktop;
  const hasOutline = outline.length > 0;

  return (
    <motion.div
      key="nested-outline-panel"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={
        reduce
          ? { duration: 0.15 }
          : { type: "spring", stiffness: 380, damping: 30 }
      }
      role="dialog"
      aria-label={`${headingLabel} for this page`}
      className={cn(PANEL_SHELL, PANEL_LIFT_DEFAULT)}
      style={{ maxWidth: pillRowWidth }}
    >
      {hasOutline ? (
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.section
              key="chapters"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: reduce
                  ? { duration: 0.18 }
                  : {
                      height: { duration: 0.28, ease: [0.2, 0.6, 0.3, 1] },
                      opacity: { duration: 0.2, ease: "easeOut" },
                    },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: reduce
                  ? { duration: 0.12 }
                  : {
                      height: { duration: 0.18, ease: [0.4, 0, 1, 1] },
                      opacity: { duration: 0.12, ease: "easeIn" },
                    },
              }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1 border-b border-border/60 px-3 py-3 min-w-[240px]">
                <div className="flex items-center justify-between pb-1 gap-3">
                  <span className="font-mono text-[10px] leading-3 tracking-[0.08em] uppercase text-faint">
                    {headingLabel} · {outline.length}
                  </span>
                  <span className="font-mono text-[10px] leading-3 tracking-[0.04em] text-muted">
                    {currentIndex + 1} / {outline.length}
                  </span>
                </div>
                <ul className="flex flex-col">
                  {outline.map((entry, idx) => (
                    <OutlineRow
                      key={entry.id}
                      entry={entry}
                      index={idx}
                      current={idx === currentIndex}
                    />
                  ))}
                </ul>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      ) : null}

      <motion.div layout className="flex items-center gap-1 px-2 py-1.5">
        <motion.div layout className="flex items-center gap-1">
          <TooltipButton
            label={prevLabel}
            shortLabel="Prev"
            inline={showLabels}
            disabled={!prevHref}
            onClick={prevHref ? () => navigate(prevHref) : undefined}
          >
            <ChevronLeft />
          </TooltipButton>
          <TooltipButton
            label="Share"
            shortLabel="Share"
            inline={showLabels}
            onClick={onShare}
          >
            <ShareGlyph />
          </TooltipButton>
          <TooltipButton
            label={saved ? "Unsave" : "Save"}
            shortLabel={saved ? "Saved" : "Save"}
            inline={showLabels}
            active={saved}
            onClick={onSave}
          >
            <BookmarkGlyph filled={saved} />
          </TooltipButton>
          <TooltipButton
            label={nextLabel}
            shortLabel="Next"
            inline={showLabels}
            disabled={!nextHref}
            onClick={nextHref ? () => navigate(nextHref) : undefined}
          >
            <ChevronRight />
          </TooltipButton>
        </motion.div>
        {hasOutline ? (
          <motion.button
            layout
            type="button"
            onClick={toggleExpanded}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? `Collapse ${headingLabel.toLowerCase()}`
                : `Expand ${headingLabel.toLowerCase()}`
            }
            className={cn(
              "ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150",
              "hover:bg-background/60 hover:text-text",
              expanded ? "bg-background/40 text-text" : null,
            )}
          >
            <Chevron rotated={expanded} />
          </motion.button>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

function OutlineRow({
  entry,
  index,
  current,
}: {
  entry: OutlineEntry;
  index: number;
  current: boolean;
}) {
  return (
    <li>
      <a
        href={`#${entry.id}`}
        aria-current={current ? "location" : undefined}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors duration-150",
          current
            ? "bg-background/60 text-text"
            : "text-muted hover:bg-background/40 hover:text-text",
        )}
      >
        <span className="font-mono text-[10px] leading-3 tracking-[0.05em] text-faint w-4 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[13px] leading-4 tracking-[-0.01em]">
          {entry.label}
        </span>
      </a>
    </li>
  );
}

function navigate(href: string) {
  if (typeof window === "undefined") return;
  // Soft navigation — rely on the browser's router since Link would be heavier
  // here and we're inside an event handler. next/navigation's useRouter.push
  // is an option if we want prefetch, but the nav is sparse enough that a
  // direct assignment feels right.
  window.location.href = href;
}

function PageGlyph({ id }: { id: "stream" | "projects" | "about" }) {
  if (id === "stream") return <Icon name="menu" size={16} strokeWidth={1.6} />;
  if (id === "projects") return <Icon name="grid" size={16} strokeWidth={1.6} />;
  return <Icon name="user" size={16} strokeWidth={1.6} />;
}

// ReactNode alias so type imports stay clean if SiteNav ever exports helpers.
export type { ReactNode };
