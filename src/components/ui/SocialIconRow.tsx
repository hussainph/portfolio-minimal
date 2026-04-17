"use client";

import { useState, type ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  EnvelopeSimple,
  GithubLogo,
  XLogo,
  type IconProps as PhosphorIconProps,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { BOUNCE_SPRING, useMagneticMotion } from "./useMagneticMotion";

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
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hovered || focused;

  const { ref, motionStyle, handlers } = useMagneticMotion<HTMLAnchorElement>({
    maxPx: 8,
    pull: 0.35,
    disabled: reduceMotion ?? false,
  });

  const Icon = ICONS[link.icon];

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
      onPointerMove={handlers.onPointerMove}
      onPointerLeave={() => {
        handlers.onPointerLeave();
        setHovered(false);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <motion.span
        aria-hidden="true"
        className="relative grid place-items-center"
        style={motionStyle}
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
