"use client";

import { useCallback, useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Dithering,
  ditheringPresets,
  GrainGradient,
  grainGradientPresets,
  Warp,
  warpPresets,
} from "@paper-design/shaders-react";
import { SocialIconRow, type SocialLink } from "@/components/ui/SocialIconRow";
import { cn } from "@/lib/utils";

interface HeaderShaderProps {
  name: string;
  bio: string;
  socialLinks: SocialLink[];
  className?: string;
}

const FILL_STYLE = { width: "100%", height: "100%" } as const;

// Brand palette — mirrors @theme tokens in globals.css. Shader fills are
// large-area treatments, so we favor the saturated ambient set over pale
// accents.
const BRAND = {
  background: "#0a0a0b",
  surface: "#141416",
  accentTeal: "#70cfd4",
  electricBlue: "#4449CF",
  fireRed: "#F94446",
  sunGold: "#FFD36B",
  candyPink: "#FFD1E0",
} as const;

interface ShaderVariant {
  key: string;
  render: (opts: { speed?: number }) => ReactNode;
}

interface PresetLike {
  name: string;
  params: { speed?: number } & Record<string, unknown>;
}

function buildVariant(
  prefix: string,
  preset: PresetLike,
  Component: ComponentType<Record<string, unknown>>,
  extraProps?: Record<string, unknown>,
): ShaderVariant {
  return {
    key: `${prefix}:${preset.name}`,
    render: ({ speed }) => (
      <Component
        {...(preset.params as Record<string, unknown>)}
        {...(extraProps ?? {})}
        speed={speed ?? preset.params.speed ?? 0}
        style={FILL_STYLE}
      />
    ),
  };
}

const pick = <T extends { name: string }>(arr: T[], name: string) =>
  arr.find((p) => p.name === name);

const DITHERING_KEEP = new Set(["Warp", "Ripple", "Swirl"]);
const DITHERING_EXTRAS: Record<string, Record<string, unknown>> = {
  Warp: {
    colorBack: BRAND.background,
    colorFront: BRAND.electricBlue,
    size: 1.5,
  },
  Ripple: {
    colorBack: BRAND.background,
    colorFront: BRAND.fireRed,
    size: 1.5,
  },
  Swirl: {
    colorBack: BRAND.background,
    colorFront: BRAND.sunGold,
    size: 1.5,
  },
};

const GRAIN_EXTRAS: Record<string, Record<string, unknown>> = {
  Default: {
    colorBack: BRAND.background,
    colors: [
      BRAND.electricBlue,
      BRAND.fireRed,
      BRAND.sunGold,
      BRAND.accentTeal,
    ],
  },
  Wave: {
    colorBack: BRAND.background,
    colors: [BRAND.fireRed, BRAND.sunGold, BRAND.candyPink],
  },
};

const WARP_EXTRAS: Record<string, unknown> = {
  colors: [BRAND.background, BRAND.electricBlue, BRAND.surface, BRAND.fireRed],
};

const VARIANTS: ShaderVariant[] = [
  ...ditheringPresets
    .filter((p) => DITHERING_KEEP.has(p.name))
    .map((p) =>
      buildVariant(
        "dither",
        p,
        Dithering as unknown as ComponentType<Record<string, unknown>>,
        DITHERING_EXTRAS[p.name],
      ),
    ),
  ...(["Default", "Wave"]
    .map((n) => pick(grainGradientPresets, n))
    .filter((p): p is (typeof grainGradientPresets)[number] => Boolean(p))
    .map((p) =>
      buildVariant(
        "grain",
        p,
        GrainGradient as unknown as ComponentType<Record<string, unknown>>,
        GRAIN_EXTRAS[p.name],
      ),
    )),
  ...(pick(warpPresets, "Default")
    ? [
        buildVariant(
          "warp",
          pick(warpPresets, "Default")!,
          Warp as unknown as ComponentType<Record<string, unknown>>,
          WARP_EXTRAS,
        ),
      ]
    : []),
];

const CROSSFADE = {
  duration: 0.55,
  ease: [0.2, 0.6, 0.3, 1] as const,
};

export function HeaderShader({
  name,
  bio,
  socialLinks,
  className,
}: HeaderShaderProps) {
  const reduceMotion = useReducedMotion();
  const [variantIndex, setVariantIndex] = useState(0);

  const variant = VARIANTS[variantIndex];
  const next = useCallback(
    () => setVariantIndex((i) => (i + 1) % VARIANTS.length),
    [],
  );

  const motionVariants = reduceMotion
    ? {
        initial: false as const,
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, scale: 1.04 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
      };

  return (
    <header
      className={cn(
        "relative min-h-[330px] overflow-hidden rounded-md border border-border sm:min-h-[390px] lg:min-h-[420px]",
        className,
      )}
    >
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={variant.key}
            initial={motionVariants.initial}
            animate={motionVariants.animate}
            exit={motionVariants.exit}
            transition={reduceMotion ? { duration: 0 } : CROSSFADE}
            className="absolute inset-0"
          >
            {variant.render({ speed: reduceMotion ? 0 : undefined })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle farthest-corner at 50% 20% in oklab, oklab(0% 0 0 / 0%) 40%, oklab(0% 0 0 / 50%) 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[64%] backdrop-blur-[52px]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, oklab(0% 0 0 / 0%) 0%, oklab(0% 0 0 / 86%) 35%, oklab(0% 0 0 / 100%) 100%)",
          maskImage: "linear-gradient(to top, black 74%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 74%, transparent 100%)",
        }}
      />

      <button
        type="button"
        onClick={next}
        aria-label="Shuffle header shader"
        className="absolute inset-x-0 top-0 z-10 h-1/2 cursor-pointer"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
        <h1 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text sm:text-[40px] sm:leading-[44px] md:text-[44px] md:leading-[48px] lg:text-[36px] lg:leading-[40px]">
          {name}
        </h1>
        <p className="max-w-[560px] font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted lg:max-w-none lg:text-[14px] lg:leading-[21px]">
          {bio}
        </p>
        <SocialIconRow links={socialLinks} />
      </div>
    </header>
  );
}
