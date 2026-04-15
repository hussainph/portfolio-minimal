import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language?: string;
  filename?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Optional chrome around a fenced code block. Syntax highlighting is already
 * applied upstream by `rehype-pretty-code` (Shiki, `github-dark-dimmed`),
 * which transforms the inner triple-backtick fence into a styled `<pre>`
 * before this component sees it. So `CodeBlock` is purely a frame wrapper —
 * it adds a filename header strip and a border, then drops the children
 * straight through.
 *
 * MDX usage:
 *
 * ```mdx
 * <CodeBlock filename="src/lib/example.ts" language="ts">
 * ```ts
 * export function add(a: number, b: number) { return a + b; }
 * ```
 * </CodeBlock>
 * ```
 *
 * Without a filename the component degrades to the bare children — which
 * means a plain triple-backtick fence still flows through the existing `pre`
 * mapping in `mdx-components.tsx` without ceremony. Opt in to the chrome
 * only when the filename is meaningful.
 */
export function CodeBlock({
  language,
  filename,
  children,
  className,
}: CodeBlockProps) {
  if (!filename) {
    return <div className={cn("my-6", className)}>{children}</div>;
  }

  // The inner <pre> arrives already styled by the global `pre` mapping
  // (border + radius + margin + bg). Reset those properties on nested <pre>
  // so the wrapper's frame doesn't double up. Outside this branch the global
  // `pre` styling is exactly what we want.
  return (
    <div
      className={cn(
        "my-6 overflow-hidden rounded-card border border-border bg-sunken",
        "[&_pre]:my-0 [&_pre]:rounded-none [&_pre]:border-0",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-[11px] leading-[14px] tracking-[0.04em] text-muted">
          {filename}
        </span>
        {language ? (
          <span className="font-mono text-[10px] leading-3 tracking-[0.05em] uppercase text-faint">
            {language}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
