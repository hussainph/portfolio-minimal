import { tagColor } from "@/lib/tagColor";
import { cn } from "@/lib/utils";

interface MockScreenshotProps {
  /** Drives the deterministic archetype + accent hue. */
  slug: string;
  tags: string[];
  /** Render the browser-chrome bar (omit for full-bleed crops). */
  chrome?: boolean;
  className?: string;
}

/**
 * A deterministic stand-in for a real project screenshot, drawn entirely with
 * divs — no binary assets, no network. The slug hashes to one of four app
 * archetypes (dashboard / editor / chat / landing) and the primary tag tints
 * the accents, so every mock project gets a stable, distinct "screenshot".
 *
 * Everything is sized in FIXED PIXELS, like a real app at 1× zoom — the
 * container crops the overflow. (Percentage sizing scaled the fake UI up with
 * the tile and read as abstract bricks, not a screenshot.)
 *
 * Purely a playground prop for judging image-heavy layouts; the real card
 * swaps in an actual screenshot from frontmatter.
 */

function hashStr(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i);
  return Math.abs(h);
}

/** Deterministic pseudo-random 0..1 from slug + salt — same djb2 family as
 *  the rest of the playground, so SSR and client always agree. */
function rand(slug: string, salt: string): number {
  return (hashStr(`${slug}:${salt}`) % 1000) / 1000;
}

const PANEL = "rgba(255,255,255,0.045)";
const PANEL_SOFT = "rgba(255,255,255,0.028)";
const LINE = "rgba(255,255,255,0.13)";
const LINE_SOFT = "rgba(255,255,255,0.07)";

function Dashboard({ slug, accent }: { slug: string; accent: string }) {
  return (
    <div className="flex h-full gap-4 p-4">
      <div className="flex w-[120px] shrink-0 flex-col gap-3 pt-1">
        <div className="mb-2 size-5 rounded-[4px]" style={{ background: accent, opacity: 0.45 }} />
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="h-[7px] rounded-[2px]"
            style={{
              width: 48 + rand(slug, `nav${i}`) * 56,
              background: i === 1 ? accent : LINE_SOFT,
              opacity: i === 1 ? 0.65 : 1,
            }}
          />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex h-[10px] items-center justify-between">
          <div className="h-[9px] w-[140px] rounded-[2px]" style={{ background: LINE }} />
          <div className="h-[16px] w-[64px] rounded-[3px]" style={{ background: accent, opacity: 0.4 }} />
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-[72px] flex-1 rounded-[5px] p-3" style={{ background: i === 0 ? PANEL : PANEL_SOFT }}>
              <div className="mb-2.5 h-[6px] w-[55%] rounded-[2px]" style={{ background: LINE_SOFT }} />
              <div
                className="h-[12px] w-[70%] rounded-[2px]"
                style={{ background: i === 0 ? accent : LINE, opacity: i === 0 ? 0.55 : 1 }}
              />
            </div>
          ))}
        </div>
        <div className="flex min-h-[160px] flex-1 items-end gap-2 rounded-[5px] p-4" style={{ background: PANEL_SOFT }}>
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[2px]"
              style={{
                height: `${14 + rand(slug, `bar${i}`) * 70}%`,
                background: i === 11 ? accent : LINE_SOFT,
                opacity: i === 11 ? 0.5 : 1,
              }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex h-[24px] items-center gap-3 rounded-[4px] px-3" style={{ background: PANEL_SOFT }}>
              <div className="size-2 rounded-full" style={{ background: i === 0 ? accent : LINE_SOFT, opacity: i === 0 ? 0.6 : 1 }} />
              <div className="h-[6px] rounded-[2px]" style={{ width: 90 + rand(slug, `row${i}`) * 120, background: LINE_SOFT }} />
              <div className="ml-auto h-[6px] w-[40px] rounded-[2px]" style={{ background: LINE_SOFT }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Editor({ slug, accent }: { slug: string; accent: string }) {
  return (
    <div className="flex h-full">
      <div className="flex w-[44px] shrink-0 flex-col items-end gap-[9px] border-r py-4 pr-3" style={{ borderColor: LINE_SOFT }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="h-[5px] w-[14px] rounded-[1px]" style={{ background: LINE_SOFT, opacity: 0.7 }} />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[9px] p-4">
        {Array.from({ length: 24 }, (_, i) => {
          const indent = [0, 16, 32, 32, 16, 0, 0, 16, 32, 48, 32, 16, 0, 0, 16, 32, 32, 48, 32, 16, 0, 16, 16, 0][i]!;
          const isAccent = i === 2 || i === 9 || i === 17;
          return (
            <div
              key={i}
              className="h-[5px] rounded-[1px]"
              style={{
                marginLeft: indent,
                width: 60 + rand(slug, `code${i}`) * 180,
                background: isAccent ? accent : i % 3 === 0 ? LINE : LINE_SOFT,
                opacity: isAccent ? 0.5 : 1,
              }}
            />
          );
        })}
      </div>
      <div className="hidden w-[150px] shrink-0 flex-col gap-2.5 border-l p-3 sm:flex" style={{ borderColor: LINE_SOFT }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="h-[5px] rounded-[1px]"
            style={{ width: 40 + rand(slug, `tree${i}`) * 80, marginLeft: (i % 3) * 10, background: LINE_SOFT }}
          />
        ))}
      </div>
    </div>
  );
}

function Chat({ slug, accent }: { slug: string; accent: string }) {
  return (
    <div className="mx-auto flex h-full max-w-[420px] flex-col justify-end gap-3 p-5">
      {Array.from({ length: 8 }, (_, i) => {
        const mine = i % 2 === 1;
        const lines = 1 + (hashStr(`${slug}:lines${i}`) % 3);
        return (
          <div
            key={i}
            className="flex flex-col gap-[7px] rounded-[8px] px-3.5 py-3"
            style={{
              width: 150 + rand(slug, `msgw${i}`) * 130,
              alignSelf: mine ? "flex-end" : "flex-start",
              background: mine ? accent : PANEL,
              opacity: mine ? 0.32 : 1,
            }}
          >
            {Array.from({ length: lines }, (_, j) => (
              <div
                key={j}
                className="h-[5px] rounded-[1px]"
                style={{
                  width: `${j === lines - 1 ? 40 + rand(slug, `ml${i}${j}`) * 30 : 85 + rand(slug, `ml${i}${j}`) * 15}%`,
                  background: mine ? "rgba(255,255,255,0.5)" : LINE_SOFT,
                }}
              />
            ))}
          </div>
        );
      })}
      <div className="mt-2 flex h-[34px] shrink-0 items-center justify-between rounded-[8px] border px-3" style={{ borderColor: LINE_SOFT }}>
        <div className="h-[5px] w-[100px] rounded-[1px]" style={{ background: LINE_SOFT }} />
        <div className="size-4 rounded-[4px]" style={{ background: accent, opacity: 0.45 }} />
      </div>
    </div>
  );
}

function Landing({ slug, accent }: { slug: string; accent: string }) {
  return (
    <div className="flex h-full flex-col items-center gap-4 px-8 pt-6">
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="size-4 rounded-[4px]" style={{ background: accent, opacity: 0.45 }} />
        <div className="flex gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-[6px] w-[34px] rounded-[2px]" style={{ background: LINE_SOFT }} />
          ))}
        </div>
      </div>
      <div className="h-[18px] w-[260px] rounded-[3px]" style={{ background: LINE }} />
      <div className="h-[18px] w-[190px] rounded-[3px]" style={{ background: LINE }} />
      <div className="mt-1 h-[7px] w-[300px] rounded-[2px]" style={{ background: LINE_SOFT }} />
      <div className="h-[7px] w-[230px] rounded-[2px]" style={{ background: LINE_SOFT }} />
      <div className="mt-2 h-[28px] w-[92px] rounded-[5px]" style={{ background: accent, opacity: 0.45 }} />
      <div className="mt-4 flex w-full flex-1 gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex-1 rounded-t-[6px] p-3.5" style={{ background: i === 1 ? PANEL : PANEL_SOFT }}>
            <div className="mb-2.5 size-5 rounded-[4px]" style={{ background: i === 1 ? accent : LINE_SOFT, opacity: i === 1 ? 0.4 : 1 }} />
            <div className="mb-2 h-[6px] rounded-[2px]" style={{ width: `${45 + rand(slug, `fc${i}`) * 30}%`, background: LINE }} />
            <div className="h-[5px] w-[85%] rounded-[1px]" style={{ background: LINE_SOFT }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const ARCHETYPES = [Dashboard, Editor, Chat, Landing];

export function MockScreenshot({ slug, tags, chrome = true, className }: MockScreenshotProps) {
  const accent = tagColor(tags[0] ?? "building", 0.8);
  const App = ARCHETYPES[hashStr(slug) % ARCHETYPES.length]!;

  return (
    <div
      aria-hidden="true"
      className={cn("flex h-full w-full flex-col overflow-hidden bg-[#131316]", className)}
    >
      {chrome ? (
        <div
          className="flex h-[26px] shrink-0 items-center gap-1.5 border-b px-3"
          style={{ borderColor: LINE_SOFT, background: PANEL_SOFT }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-[6px] rounded-full" style={{ background: LINE }} />
          ))}
          <span className="mx-auto h-[10px] w-[40%] max-w-[220px] rounded-pill" style={{ background: PANEL_SOFT }} />
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-hidden">
        <App slug={slug} accent={accent} />
      </div>
    </div>
  );
}
