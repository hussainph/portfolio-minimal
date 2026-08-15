import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every route is prerendered and nothing revalidates on demand, so the
// prerendered payloads ride along as Workers static assets (under
// `cdn-cgi/_next_cache`, worker-readable only) instead of needing an R2 or KV
// incremental cache. Without this the routes built via generateStaticParams —
// /projects/[slug], /blog/[slug], /n/[slug], /showcases/[slug], /tags/[tag] —
// have nowhere to read their prerendered output from and 404.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
