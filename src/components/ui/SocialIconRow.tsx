"use client";

import { useRef, useState, type ComponentType } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  EnvelopeSimple,
  GithubLogo,
  XLogo,
  type IconProps as PhosphorIconProps,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type SocialIconKey = "github" | "x" | "email";

export interface SocialLink {
  icon: SocialIconKey;
  href: string;
  /** aria-label; also used as a fallback tooltip via `title`. */
  label: string;
}

interface SocialIconRowProps {
  links: SocialLink[];
  iconSize?: number;
  className?: string;
}

const ICONS: Record<SocialIconKey, ComponentType<PhosphorIconProps>> = {
  github: GithubLogo,
  x: XLogo,
  email: EnvelopeSimple,
};

const MAGNET_MAX_PX = 8;
const MAGNET_PULL = 0.35;
const MAGNET_SPRING = { stiffness: 200, damping: 15, mass: 0.6 };
const BOUNCE_SPRING = {
  type: "spring" as const,
  stiffness: 400,
  damping: 12,
};

export function SocialIconRow({
  links,
  iconSize = 22,
  className,
}: SocialIconRowProps) {
  return (
    <nav
      aria-label="Elsewhere"
      className={cn("flex items-center gap-5", className)}
    >
      {links.map((link, idx) => (
        <MagneticIcon
          key={link.icon}
          link={link}
          iconSize={iconSize}
          delay={idx * 0.06}
        />
      ))}
    </nav>
  );
}

function MagneticIcon({
  link,
  iconSize,
  delay,
}: {
  link: SocialLink;
  iconSize: number;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hovered || focused;

  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, MAGNET_SPRING);
  const y = useSpring(yRaw, MAGNET_SPRING);

  const Icon = ICONS[link.icon];

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * MAGNET_PULL;
    const dy = (e.clientY - cy) * MAGNET_PULL;
    const clamp = (v: number) =>
      Math.max(-MAGNET_MAX_PX, Math.min(MAGNET_MAX_PX, v));
    xRaw.set(clamp(dx));
    yRaw.set(clamp(dy));
  };

  const handlePointerLeave = () => {
    xRaw.set(0);
    yRaw.set(0);
    setHovered(false);
  };

  const hoverVariant = reduceMotion
    ? undefined
    : { scale: 1.15, y: -2, transition: BOUNCE_SPRING };

  return (
    <motion.a
      ref={ref}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      title={link.label}
      className="relative inline-flex items-center justify-center text-muted outline-none transition-colors duration-150 hover:text-text focus-visible:text-text"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.2, 0.6, 0.3, 1] }}
      whileHover={hoverVariant}
      whileFocus={hoverVariant}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      onPointerEnter={() => setHovered(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <motion.span
        aria-hidden="true"
        className="relative grid place-items-center"
        style={reduceMotion ? undefined : { x, y }}
      >
        <span
          className="grid place-items-center"
          style={{ width: iconSize, height: iconSize }}
        >
          <motion.span
            className="absolute inset-0 grid place-items-center"
            animate={{ opacity: active ? 0 : 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.14 }}
          >
            <Icon size={iconSize} weight="regular" />
          </motion.span>
          <motion.span
            className="absolute inset-0 grid place-items-center"
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.14 }}
          >
            <Icon size={iconSize} weight="fill" />
          </motion.span>
        </span>
      </motion.span>
    </motion.a>
  );
}
