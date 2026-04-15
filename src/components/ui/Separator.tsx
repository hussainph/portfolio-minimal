import { cn } from "@/lib/utils";

interface SeparatorProps {
  className?: string;
}

export function Separator({ className }: SeparatorProps) {
  return (
    <hr
      className={cn("w-full border-0 border-t border-border", className)}
      aria-hidden="true"
    />
  );
}
