import type { NextConfig } from "next";

// MDX content is compiled at render time via next-mdx-remote/rsc (see
// src/lib/content/mdx.ts). We don't need @next/mdx here because we aren't
// using .mdx files as route modules — content/ is read via fs and passed
// through compileMDX. Turbopack also rejects @next/mdx's plugin options
// as non-serializable, so leaving it out keeps dev running.
const nextConfig: NextConfig = {};

export default nextConfig;
