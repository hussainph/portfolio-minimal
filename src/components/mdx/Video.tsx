import { cn } from "@/lib/utils";

interface VideoProps {
  /** Omit to render just the empty frame — useful for design previews. */
  src?: string;
  poster?: string;
  caption?: string;
  /** Autoplay implies muted + loop + playsInline and removes the controls bar. */
  autoplay?: boolean;
  className?: string;
}

/**
 * Local-first video for MDX bodies. The visual frame matches `Figure` —
 * 4px radius, hairline border, optional caption in mono — so a post that
 * mixes images and clips reads as one rhythm.
 *
 * The `<video>` defaults are deliberate. Authors shouldn't need to know the
 * difference between an autoplaying loop (mute + no controls) and a clip a
 * reader presses play on (controls + sound on click). A single `autoplay`
 * flag flips between the two modes.
 */
export function Video({
  src,
  poster,
  caption,
  autoplay = false,
  className,
}: VideoProps) {
  return (
    <figure className={cn("my-6 flex flex-col gap-2 sm:my-8", className)}>
      <div className="overflow-hidden rounded-card border border-border bg-sunken">
        {src ? (
          <video
            src={src}
            poster={poster}
            className="block w-full"
            playsInline
            muted={autoplay}
            loop={autoplay}
            autoPlay={autoplay}
            controls={!autoplay}
            preload={autoplay ? "auto" : "metadata"}
          />
        ) : (
          <div className="aspect-video w-full" />
        )}
      </div>
      {caption ? (
        <figcaption className="font-mono text-[10px] uppercase tracking-[0.04em] text-faint sm:text-[11px]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
