import { ShowcaseCard, type ShowcaseImage } from "./ShowcaseCard";
import type { TagVariant } from "./Tag";

interface BentoShowcaseProps {
  tags: TagVariant[];
  timestamp: string;
  body: string;
  /** Exactly 3 image tiles for the bento layout. */
  images: [ShowcaseImage, ShowcaseImage, ShowcaseImage];
  engagement?: { replies?: number; likes?: number };
  className?: string;
}

/**
 * Three-tile bento variant of `ShowcaseCard`. Use when the post is showing
 * iterations or related variants (V1 / V2-picked / V3) instead of a single hero image.
 */
export function BentoShowcase(props: BentoShowcaseProps) {
  return <ShowcaseCard {...props} />;
}
