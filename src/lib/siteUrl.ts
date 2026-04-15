/**
 * Canonical origin used by sitemap, robots, and per-route OpenGraph URLs.
 *
 * Override at deploy time with `NEXT_PUBLIC_SITE_URL` if the production host
 * ever changes. The fallback below is the current canonical domain so local
 * builds and previews emit valid absolute URLs even without the env set.
 */
const FALLBACK_SITE_URL = "https://hussain.phalasiya.dev";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL
).replace(/\/$/, "");
