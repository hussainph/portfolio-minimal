import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Every route is prerendered at build time, so there's no ISR/on-demand
// revalidation to cache — no R2 incremental cache needed.
export default defineCloudflareConfig({});
