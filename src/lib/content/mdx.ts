import "server-only";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import rehypePrettyCode from "rehype-pretty-code";
import type { ReactElement } from "react";
import type { MDXComponents } from "mdx/types";
import { sharedComponents } from "../../../mdx-components";

const rehypePrettyCodeOptions = {
  theme: "github-dark-dimmed" as const,
  keepBackground: false,
};

/**
 * Compile a raw MDX body (frontmatter already stripped) into a React element,
 * wired with the portfolio's remark/rehype plugins and MDX components map.
 *
 * Frontmatter parsing happens upstream in the loader (gray-matter). Don't set
 * `parseFrontmatter: true` here or we'd double-parse.
 */
export async function renderMDXBody(
  source: string,
  extraComponents: MDXComponents = {},
): Promise<ReactElement> {
  const { content } = await compileMDX({
    source,
    components: { ...sharedComponents, ...extraComponents },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkSmartypants],
        rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
      },
    },
  });

  return content;
}
