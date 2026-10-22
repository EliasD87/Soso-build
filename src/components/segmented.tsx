"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Pill-style radio group with a sliding highlight. Options share equal widths
 * so the highlight is a single element moved with a CSS transform — it never
 * animates in on page load, hydration or navigation — it only slides once the
 * user picks an option. Roving tabindex: Tab enters the
 * group once, arrow keys move (and select) between options.
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
  itemClassName,
}: {
  label: string;
  options: readonly { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  itemClassName?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  const [touched, setTouched] = useState(false);
  const select = (key: T) => {
    setTouched(true);
    onChange(key);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    const edge = e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : null;
    if (!step && edge === null) return;
    e.preventDefault();
    const next = edge ?? (index + step + options.length) % options.length;
    select(options[next].key);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("relative inline-grid items-center rounded-full border border-line bg-surface p-1", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "bg-brand-gradient absolute inset-y-1 left-1 rounded-full",
          touched && "transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        )}
        style={{ width: `calc((100% - 0.5rem) / ${options.length})`, transform: `translateX(${index * 100}%)` }}
      />
      {options.map((o, i) => {
        const active = i === index;
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
            onClick={() => select(o.key)}
            className={cn(
              "relative h-full rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-300",
              active ? "text-ink" : "text-muted hover:text-fg",
              itemClassName,
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
