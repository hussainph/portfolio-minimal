"use client";

import { useReducedMotion } from "framer-motion";
import { SimplexNoise } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

interface HeaderShaderProps {
  className?: string;
}

const PALETTE = ["#4449CF", "#FFD1E0", "#F94446", "#FFD36B", "#FFFFFF"];

export function HeaderShader({ className }: HeaderShaderProps) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden", className)}
    >
      <SimplexNoise
        colors={PALETTE}
        speed={reduceMotion ? 0 : 0.4}
        scale={0.4}
        stepsPerColor={4}
        softness={0}
        style={{ width: "100%", height: "100%" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle farthest-corner at 50% 30% in oklab, oklab(0% 0 0 / 0%) 45%, oklab(0% 0 0 / 35%) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          backgroundImage:
            "linear-gradient(180deg, transparent 0%, var(--color-surface) 100%)",
        }}
      />
    </div>
  );
}
