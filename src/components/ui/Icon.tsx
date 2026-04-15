import { cn } from "@/lib/utils";

export type IconName =
  | "like"
  | "reply"
  | "bookmark"
  | "share"
  | "arrow-right"
  | "arrow-up-right"
  | "search"
  | "menu"
  | "grid"
  | "user";

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  fill?: string;
}

const PATHS: Record<IconName, React.ReactNode> = {
  // Phosphor Light heart
  like: (
    <path d="M12 21s-8-4.5-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6.5-8 11-8 11Z" />
  ),
  // Speech bubble
  reply: (
    <path d="M12 3C7 3 3 6.5 3 11c0 2.5 1.3 4.7 3.4 6.1L5 21l4.5-2.3c.8.2 1.7.3 2.5.3 5 0 9-3.5 9-8s-4-8-9-8Z" />
  ),
  // Bookmark
  bookmark: (
    <path d="M18 21l-6-4-6 4V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1Z" />
  ),
  // Share / upload
  share: (
    <>
      <path d="M16 9h2.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-9A1.5 1.5 0 0 1 5.5 9H8" />
      <polyline points="8.5 6 12 2.5 15.5 6" fill="none" />
      <line x1="12" y1="2.5" x2="12" y2="14" />
    </>
  ),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-up-right": (
    <>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="9 7 17 7 17 15" fill="none" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M3 21c1.7-3.5 5-5.5 9-5.5s7.3 2 9 5.5" />
    </>
  ),
};

export function Icon({
  name,
  size = 16,
  strokeWidth = 1.5,
  className,
  fill = "none",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
