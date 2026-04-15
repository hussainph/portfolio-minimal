import readingTime from "reading-time";

export function computeReadingTimeMinutes(raw: string): number {
  const { minutes } = readingTime(raw);
  return Math.max(1, Math.round(minutes));
}

/**
 * Pull a reasonable excerpt from an MDX body when the author didn't provide
 * one. Strips frontmatter-adjacent markdown markers and takes the first
 * paragraph, truncated to ~220 chars at a word boundary.
 */
export function deriveExcerpt(raw: string, max = 220): string {
  const stripped = raw
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/^import\s.+?from\s.+?;?\s*$/gm, "")
    .replace(/^#{1,6}\s.*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();

  const firstPara = stripped.split(/\n\s*\n/)[0]?.replace(/\s+/g, " ").trim() ?? "";
  if (firstPara.length <= max) return firstPara;

  const sliced = firstPara.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, lastSpace > 0 ? lastSpace : max).trim()}…`;
}

/**
 * Human-friendly timestamp for feed cards: "apr 12 · 9:42pm" for today-ish,
 * "apr 8" for older. Matches the tone of the ui-test specimens.
 */
export function formatFeedTimestamp(date: Date, now: Date = new Date()): string {
  const sameYear = date.getFullYear() === now.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const day = date.getDate();
  const year = date.getFullYear();

  const deltaMs = now.getTime() - date.getTime();
  const showTime = deltaMs < 1000 * 60 * 60 * 24 * 2; // last ~48h gets a timestamp

  if (showTime) {
    const hours24 = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours24 >= 12 ? "pm" : "am";
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minStr = minutes.toString().padStart(2, "0");
    return `${month} ${day} · ${hours12}:${minStr}${ampm}`;
  }

  return sameYear ? `${month} ${day}` : `${month} ${day}, ${year}`;
}
