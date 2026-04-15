import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  /** External links get the trailing arrow indicator. */
  external?: boolean;
  className?: string;
}

/**
 * Inline text link with three live states:
 *   - default → cream text + dashed teal underline
 *   - hover   → teal text + solid teal underline
 *   - visited → muted teal + dashed
 *
 * `:visited` styling can only change a small set of properties (color,
 * text-decoration-color, etc.) per browser security; everything here stays
 * within that allow-list.
 */
export function TextLink({
  href,
  children,
  external = false,
  className,
}: TextLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center gap-2 font-sans text-[17px] leading-[22px] tracking-[-0.03em] transition-colors duration-150",
        "text-text-link underline decoration-accent-teal decoration-dashed decoration-1 underline-offset-[5px]",
        "hover:text-accent-teal hover:decoration-solid hover:decoration-[1.5px]",
        "visited:text-visited visited:decoration-visited",
        className,
      )}
    >
      <span>{children}</span>
      {external ? (
        <Icon
          name="arrow-up-right"
          size={14}
          className="text-current opacity-70 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
        />
      ) : null}
    </a>
  );
}
