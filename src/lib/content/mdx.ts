import "server-only";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { visit } from "unist-util-visit";
import type { ReactElement } from "react";
import type { MDXComponents } from "mdx/types";
import type { Root, Heading, Nodes } from "mdast";
import { sharedComponents } from "../../../mdx-components";
import type { TocEntry } from "@/lib/content/types";

/**
 * Recursively flatten a heading's mdast subtree into a plain string.
 * Walks any node with `value` (text/inlineCode/html) or `children`
 * (emphasis/strong/link/del/etc.) so that headings with nested formatting
 * still produce a complete TOC label.
 */
function extractHeadingText(node: Nodes): string {
  if ("value" in node && typeof node.value === "string") return node.value;
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map((child) => extractHeadingText(child)).join("");
  }
  return "";
}

const rehypePrettyCodeOptions = {
  theme: "github-dark-dimmed" as const,
  keepBackground: false,
};

/**
 * Remark plugin factory that collects depth-2 headings into `{ id, label }`
 * entries on a shared, call-scoped array. We pass the array in explicitly
 * (rather than using `vfile.data`) because `next-mdx-remote` doesn't give us
 * direct access to the processed vfile afterwards.
 *
 * Unified expects a plugin — `() => Transformer` — not a transformer
 * directly, so we wrap one extra level.
 */
function collectToc(sink: TocEntry[]) {
  return function plugin() {
    return function transformer(tree: Root) {
      const slugger = new GithubSlugger();
      visit(tree, "heading", (node: Heading) => {
        if (node.depth !== 2) return;
        const label = extractHeadingText(node).trim();
        if (!label) return;
        sink.push({ id: slugger.slug(label), label });
      });
    };
  };
}

interface CompileResult {
  content: ReactElement;
  toc: TocEntry[];
}

/**
 * Compile a raw MDX body (frontmatter already stripped) into a React element
 * plus the collected h2 TOC.
 *
 * `rehype-slug` attaches deterministic ids to rendered headings so the TOC's
 * `id` field matches the DOM anchor each heading receives. The remark
 * collector and rehype-slug use the same `github-slugger` internally, so the
 * slugs line up.
 */
export async function renderMDXBody(
  source: string,
  extraComponents: MDXComponents = {},
): Promise<CompileResult> {
  const toc: TocEntry[] = [];

  const { content } = await compileMDX({
    source,
    components: { ...sharedComponents, ...extraComponents },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkSmartypants, collectToc(toc)],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, rehypePrettyCodeOptions],
        ],
      },
    },
  });

  return { content, toc };
}
