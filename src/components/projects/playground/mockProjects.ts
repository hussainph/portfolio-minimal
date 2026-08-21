import type { ProjectFrontmatter } from "@/lib/content";

/**
 * Deterministic mock project data for the `/project-test` playground.
 *
 * The real CMS only has two projects; the playground needs a deck of many to
 * judge how the morphing arrangements feel at scale. Every field is derived
 * from the card INDEX via a pure djb2 hash — there is NO `Math.random()` or
 * `Date.now()` anywhere, so server and client render identically (no hydration
 * mismatch). `published` uses `Date.UTC` so it's timezone-independent too.
 *
 * Typed against the real `ProjectFrontmatter` so it stays schema-accurate, but
 * it never touches the MDX loader.
 */

const TITLES = [
  "Clawbox",
  "Tutor Engine",
  "Field Notes",
  "Synth UI",
  "Atlas",
  "Halcyon",
  "Driftwood",
  "Loom",
  "Beacon",
  "Quanta",
  "Mosaic",
  "Ember",
  "Lattice",
  "Cadence",
  "Pinhole",
  "Marginalia",
  "Tidepool",
  "Foundry",
  "Aperture",
  "Threadbare",
] as const;

const SUBTITLES = [
  "An arcade you can program.",
  "A tutor that learns how you learn.",
  "Notes from the edge of a research rabbit hole.",
  "A design system that tunes itself.",
  "Mapping everything I can't stop thinking about.",
  "A calmer way to read the morning.",
  "Small tools for thinking out loud.",
  "Weaving prompts into something that holds.",
  "A signal in the noise of my own feeds.",
  "Counting the things that refuse to be counted.",
  "Assembling fragments into a picture.",
  "A spark that refused to go out over a weekend.",
  "The scaffolding under a half-built idea.",
  "Finding the rhythm in messy data.",
  "Letting a little light through a very small hole.",
  "Everything I scribble in the margins.",
  "Watching ideas pool and recede.",
  "Where rough prototypes get hammered into shape.",
  "Opening the lens a little wider each week.",
  "Held together with curiosity and duct tape.",
] as const;

const TAG_VOCAB = [
  "building",
  "ai",
  "code",
  "design",
  "thinking",
  "research",
  "craft",
  "notes",
] as const;

/** Longer-form blurbs for the featured tile's description slot. The real
 *  schema has no description field yet — `PlaygroundProject` carries it
 *  locally so the layouts can be judged with honest text lengths. */
const DESCRIPTIONS = [
  "Started as a weekend hack to scratch a very specific itch, then refused to stay small. The interesting part turned out to be the bit I almost didn't build.",
  "An attempt to make the boring part of the workflow disappear entirely. Mostly works. The remaining 10% is, predictably, 90% of the effort.",
  "I kept doing this manually and hating it, so I automated it badly, then less badly, and now it's a thing other people ask to use.",
  "A long-running experiment in doing one thing well instead of five things adequately. Still deciding if it worked.",
  "Built to answer a question I couldn't stop asking. The answer was 'sort of', which honestly was enough to keep going.",
  "The kind of tool that's invisible when it works. It mostly works, so nobody notices it, which I've decided is the point.",
  "Two rewrites in, the architecture finally matches how I think about the problem. The first version was wrong in genuinely instructive ways.",
  "What happens when you take a throwaway prototype seriously. Half the code is still throwaway. The other half ships.",
] as const;

const STATUSES = [
  "v0.4 · launching may",
  "shipped · retired",
  "v0.2 · iterating",
  "v1.0 · maintained",
  "prototype · weekend",
  "shipped · live",
  "exploring · early",
  "archived · learned a lot",
  "v0.7 · polishing",
] as const;

const TIERS = ["showcase", "smaller", "bitesized"] as const;

/** Playground-local extension of the real frontmatter — carries the longer
 *  description the featured layouts need. When the concept graduates, the
 *  field moves into `projectFrontmatter` and this alias dissolves. */
export type PlaygroundProject = ProjectFrontmatter & { description: string };

/** djb2 — same hash family used in `src/lib/tagColor.ts`, kept local so the
 *  playground has zero coupling to the real color module. */
function hashStr(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(h);
}

function seeded(index: number, salt: string): number {
  return hashStr(`${salt}:${index}`);
}

function pick<T>(arr: readonly T[], index: number, salt: string): T {
  return arr[seeded(index, salt) % arr.length]!;
}

function mockTags(index: number): string[] {
  const count = 1 + (seeded(index, "ntags") % 3);
  const start = seeded(index, "tag") % TAG_VOCAB.length;
  const out: string[] = [];
  for (let k = 0; k < count; k++) {
    const tag = TAG_VOCAB[(start + k * 3) % TAG_VOCAB.length]!;
    if (!out.includes(tag)) out.push(tag);
  }
  return out;
}

const BASE_MS = Date.UTC(2026, 4, 15);
const DAY_MS = 86_400_000;

/** Build a single deterministic mock project for a given index. */
function mockProjectAt(index: number): PlaygroundProject {
  const tier =
    index % 6 === 0 ? "showcase" : index % 2 === 0 ? "smaller" : "bitesized";

  return {
    type: "project",
    slug: `mock-project-${index}`,
    title: pick(TITLES, index, "title"),
    subtitle: pick(SUBTITLES, index, "sub"),
    description: pick(DESCRIPTIONS, index, "desc"),
    tier: TIERS.includes(tier) ? tier : "smaller",
    status: pick(STATUSES, index, "status"),
    tags: mockTags(index),
    published: new Date(BASE_MS - index * DAY_MS),
    draft: false,
  };
}

/**
 * Return `count` deterministic mock projects. Indices are stable, so card N is
 * always identical regardless of `count` — paging/resizing never reshuffles the
 * deck, and `slug` (the morph key) stays unique for every card.
 */
export function getMockProjects(count: number): PlaygroundProject[] {
  const safe = Math.max(0, Math.floor(count));
  return Array.from({ length: safe }, (_, i) => mockProjectAt(i));
}
