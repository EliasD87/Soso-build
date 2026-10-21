"use client";

import { motion } from "motion/react";
import { type KeyboardEvent, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Pill-style radio group with a sliding highlight. Roving tabindex: Tab enters
 * the group once, arrow keys move (and select) between options.
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  layoutId,
  className,
  itemClassName,
}: {
  label: string;
  options: readonly { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  layoutId: string;
  className?: string;
  itemClassName?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    const edge = e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : null;
    if (!step && edge === null) return;
    e.preventDefault();
    const current = options.findIndex((o) => o.key === value);
    const next = edge ?? (current + step + options.length) % options.length;
    onChange(options[next].key);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("relative inline-flex items-center rounded-full border border-line bg-surface p-1", className)}
    >
      {options.map((o, i) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.key)}
            className={cn(
              "relative h-full flex-1 rounded-full px-4 text-sm whitespace-nowrap transition-colors sm:flex-none",
              active ? "text-ink" : "text-muted hover:text-fg",
              itemClassName,
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="bg-brand-gradient absolute inset-0 rounded-full"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative font-semibold">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
