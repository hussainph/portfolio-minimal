"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";
import {
  useToolbarVisibility,
  type ToolbarState,
} from "./useToolbarVisibility";

export type ToolbarTab = "stream" | "projects" | "about";

interface BottomToolbarProps {
  activeTab: ToolbarTab;
  /** Override the internal visibility state (specimen rendering). */
  state?: ToolbarState;
  /** Render position. `static` is for the design specimen so the toolbar can sit inline. */
  position?: "fixed" | "static";
  className?: string;
}

const TABS: { id: ToolbarTab; label: string; icon: IconName }[] = [
  { id: "stream", label: "stream", icon: "menu" },
  { id: "projects", label: "projects", icon: "grid" },
  { id: "about", label: "about", icon: "user" },
];

const STATE_VARIANTS = {
  visible: { y: 0, opacity: 1 },
  peek: { y: 28, opacity: 1 },
  hidden: { y: 80, opacity: 0 },
};

const SPRING = { type: "spring" as const, stiffness: 260, damping: 22, mass: 1 };

const PILL_SHELL =
  "flex items-center rounded-pill bg-[#14141699] backdrop-blur-[24px] border border-[#2e2e328a] p-1.5 shadow-[0_12px_40px_#0a0a0bab]";

export function BottomToolbar({
  activeTab,
  state,
  position = "fixed",
  className,
}: BottomToolbarProps) {
  const liveState = useToolbarVisibility();
  const resolved = state ?? liveState;

  return (
    <motion.div
      animate={resolved}
      variants={STATE_VARIANTS}
      transition={SPRING}
      className={cn(
        position === "fixed"
          ? "fixed bottom-7 left-1/2 z-50 -translate-x-1/2"
          : "relative",
        "flex items-center gap-2.5",
        className,
      )}
    >
      <nav className={PILL_SHELL} aria-label="Primary">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-pill py-2.5 px-[18px] transition-colors",
                active
                  ? "bg-background text-text"
                  : "bg-transparent text-muted hover:text-text",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={tab.icon} size={16} strokeWidth={1.6} />
              <span className="font-mono text-[11px] leading-[14px] tracking-[0.04em]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className={cn(PILL_SHELL, "p-1.5")}
        aria-label="Search"
      >
        <span className="flex items-center justify-center py-2.5 px-3.5 text-muted hover:text-text transition-colors">
          <Icon name="search" size={16} strokeWidth={1.6} />
        </span>
      </button>
    </motion.div>
  );
}
