import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { Figure } from "@/components/mdx/Figure";
import { Ref } from "@/components/mdx/Ref";
import { Video } from "@/components/mdx/Video";
import { TextLink } from "@/components/ui/TextLink";

/**
 * Global MDX component map. These are available in every MDX body without
 * needing an explicit import. Shared primitives live in src/components/mdx/;
 * one-off per-post embeds live in src/components/embeds/ and are imported
 * directly in the MDX file that uses them.
 *
 * Phase 1 shipped typography + TextLink. Phase 5 adds Ref (cross-reference
 * links). Phase 6 adds Figure, Video, CodeBlock — framed media + filename
 * chrome that wraps the rehype-pretty-code output without re-styling it.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...sharedComponents,
  };
}

export const sharedComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="font-serif text-[32px] leading-[38px] tracking-[-0.015em] text-text"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="font-serif text-[24px] leading-[32px] tracking-[-0.01em] text-text mt-10 mb-3"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="font-serif text-[19px] leading-[26px] tracking-[-0.01em] text-text mt-6 mb-2"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p
      className="font-sans text-[16px] leading-[24px] tracking-[-0.03em] text-body mt-4"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="font-sans text-[16px] leading-[24px] tracking-[-0.03em] text-body mt-4 list-disc pl-6 marker:text-faint"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="font-sans text-[16px] leading-[24px] tracking-[-0.03em] text-body mt-4 list-decimal pl-6 marker:text-faint"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="mt-1.5" {...props} />
  ),
  blockquote: ({
    children,
    ...rest
  }: ComponentPropsWithoutRef<"blockquote"> & { children?: ReactNode }) => (
    <blockquote
      className="my-6 border-l-2 border-accent-orange pl-5 font-serif italic text-[24px] leading-[34px] tracking-[-0.01em] text-quote"
      {...rest}
    >
      {children}
    </blockquote>
  ),
  a: ({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) => {
    const isExternal = Boolean(
      href && /^https?:\/\//.test(href) && !href.includes("phalasiya"),
    );
    return (
      <TextLink href={href ?? "#"} external={isExternal} {...rest}>
        {children}
      </TextLink>
    );
  },
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded-xs bg-elevated px-1.5 py-0.5 font-mono text-[13px] text-text"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-5 overflow-x-auto rounded-card border border-border bg-sunken p-4 font-mono text-[13px] leading-[22px]"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-8 border-border" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium text-text" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="italic text-text" {...props} />
  ),
  Ref,
  Figure,
  Video,
  CodeBlock,
};
