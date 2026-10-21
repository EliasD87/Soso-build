"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatFee, formatInt, formatIntCompact, formatUsd, formatUsdCompact, formatUsdWhole } from "@/lib/format";

const FORMATS = {
  usd: formatUsd,
  usdWhole: formatUsdWhole,
  usdCompact: formatUsdCompact,
  int: formatInt,
  intCompact: formatIntCompact,
  fee: formatFee,
} as const;

export type NumberFormat = keyof typeof FORMATS;

/** Renders a number and tweens to new values when it changes. */
export function AnimatedNumber({
  value,
  format = "int",
  className,
}: {
  value: number;
  format?: NumberFormat;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  // Where the number currently sits on screen, so interrupted tweens continue smoothly.
  const shownRef = useRef(value);

  useEffect(() => {
    const from = shownRef.current;
    if (from === value) return;
    const update = (v: number) => {
      shownRef.current = v;
      setDisplay(v);
    };
    if (reduceMotion) {
      const id = requestAnimationFrame(() => update(value));
      return () => cancelAnimationFrame(id);
    }
    const controls = animate(from, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: update,
    });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return <span className={className}>{FORMATS[format](display)}</span>;
}
