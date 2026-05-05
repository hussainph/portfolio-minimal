"use client";

import { Command } from "cmdk";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { tagColor } from "@/lib/tagColor";
import type { PaletteItem, PaletteKind } from "./types";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: PaletteItem[];
}

/**
 * Redesigned ⌘K palette. One input, one flat list. No section headings, no
 * filter toggles, no recents bucket — just "what am I trying to open?" →
 * sorted results → enter.
 *
 * Scrollbar is styled via CSS variables + ::-webkit-scrollbar so the track
 * matches the card rails instead of the browser's default grey bar.
 */
export function CommandPalette({
  open,
  onOpenChange,
  items,
}: CommandPaletteProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [search, setSearch] = useState("");

  // Reset the query imperatively when we close the palette so reopening is
  // fresh. Doing this in the close handler (rather than a useEffect on `open`)
  // keeps the state-setter out of the effect body.
  const close = useCallback(() => {
    setSearch("");
    onOpenChange(false);
  }, [onOpenChange]);

  const sorted = useMemo(() => sortItems(items, search), [items, search]);

  const handleSelect = (item: PaletteItem) => {
    close();
    router.push(item.href);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.15 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-background/60 px-4 pt-[16vh] backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: -12, opacity: 0, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { y: -8, opacity: 0, scale: 0.98 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 320, damping: 28 }
            }
            className="w-full max-w-[560px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              label="Command palette"
              // We sort upstream, so tell cmdk to show items in the order we
              // render them. shouldFilter=false means the builtin filter
              // doesn't hide our matches — we've already filtered them.
              shouldFilter={false}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  close();
                }
              }}
              className="flex flex-col overflow-hidden rounded-card border border-border/70 bg-[#141416f2] shadow-[0_24px_60px_#0a0a0bcc] backdrop-blur-[28px]"
            >
              <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
                <SearchIcon />
                <Command.Input
                  placeholder="Search or jump…"
                  autoFocus
                  value={search}
                  onValueChange={setSearch}
                  className="flex-1 border-none bg-transparent font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-text placeholder:text-faint focus:outline-none"
                />
                <kbd className="font-mono text-[10px] leading-3 tracking-[0.06em] text-faint">
                  esc
                </kbd>
              </div>

              <Command.List
                className={cn(
                  "max-h-[min(480px,60vh)] overflow-y-auto py-2",
                  "palette-scroll",
                )}
              >
                <Command.Empty className="px-5 py-6 text-center font-sans text-[13px] leading-[20px] tracking-[-0.03em] text-muted">
                  Nothing matches {search ? `"${search}"` : "that"}.
                </Command.Empty>

                {sorted.map((item) => (
                  <PaletteRow
                    key={`${item.kind}:${item.slug}`}
                    item={item}
                    onSelect={() => handleSelect(item)}
                  />
                ))}
              </Command.List>

              <div className="flex items-center justify-between border-t border-border/60 px-5 py-2.5">
                <span className="font-mono text-[10px] leading-3 tracking-[0.04em] text-faint">
                  ↑↓ navigate · ↵ open
                </span>
                <span className="font-mono text-[10px] leading-3 tracking-[0.04em] text-faint">
                  ⌘K to close
                </span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

interface PaletteRowProps {
  item: PaletteItem;
  onSelect: () => void;
}

function PaletteRow({ item, onSelect }: PaletteRowProps) {
  return (
    <Command.Item
      value={`${item.kind} ${item.title} ${item.tags.join(" ")}`}
      onSelect={onSelect}
      className={cn(
        "group/item mx-2 flex cursor-pointer items-center gap-3 rounded-[6px] px-3 py-2",
        "data-[selected=true]:bg-background/70",
      )}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-muted group-data-[selected=true]/item:text-text">
        <KindGlyph kind={item.kind} />
      </span>
      <span className="flex-1 truncate font-sans text-[14px] leading-[20px] tracking-[-0.03em] text-muted group-data-[selected=true]/item:text-text">
        {item.title}
      </span>
      {item.tags[0] ? (
        <span
          className="font-mono text-[10px] leading-3 tracking-[0.04em]"
          style={{ color: tagColor(item.tags[0]) }}
        >
          #{item.tags[0]}
        </span>
      ) : null}
      <span className="font-mono text-[10px] leading-3 tracking-[0.04em] text-faint">
        {formatKind(item.kind)}
      </span>
    </Command.Item>
  );
}

/**
 * Sort heuristic:
 * 1. Exact title match.
 * 2. Title starts-with match.
 * 3. Tag match.
 * 4. Substring title match.
 * 5. Substring body (we don't have body here, so skip — fallback to date).
 *
 * Ties broken by `publishedISO` DESC so the newest matching item comes first.
 */
function sortItems(items: PaletteItem[], search: string): PaletteItem[] {
  const q = search.trim().toLowerCase();
  if (!q) {
    return [...items].sort((a, b) =>
      b.publishedISO.localeCompare(a.publishedISO),
    );
  }

  const scored = items
    .map((item) => ({ item, score: scoreItem(item, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.item.publishedISO.localeCompare(a.item.publishedISO);
    });
  return scored.map(({ item }) => item);
}

function scoreItem(item: PaletteItem, q: string): number {
  const title = item.title.toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (item.tags.some((t) => t.toLowerCase() === q)) return 60;
  if (item.tags.some((t) => t.toLowerCase().includes(q))) return 40;
  if (title.includes(q)) return 20;
  return 0;
}

function formatKind(kind: PaletteKind): string {
  if (kind === "note") return "note";
  if (kind === "post") return "writing";
  if (kind === "showcase") return "showcase";
  return "project";
}

interface KindGlyphProps {
  kind: PaletteKind;
}

function KindGlyph({ kind }: KindGlyphProps) {
  const glyph =
    kind === "note" ? "·" : kind === "post" ? "¶" : kind === "showcase" ? "◰" : "◨";
  return <span className="font-mono text-[14px] leading-[14px]">{glyph}</span>;
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}
