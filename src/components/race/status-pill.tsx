"use client";

import { formatRelativeTime } from "@/lib/format";
import type { MetricsSource } from "@/lib/metrics/types";
import { cn } from "@/lib/utils";
import { useNow } from "./use-now";

const ANNOUNCE = {
  live: "Live data connected",
  error: "Live data unavailable",
  reconnecting: "Reconnecting to live data",
} as const;

export function StatusPill({
  source,
  updatedAt,
  error,
  reconnecting,
  hasData,
  className,
}: {
  source: MetricsSource;
  updatedAt: string;
  error?: string;
  reconnecting?: boolean;
  /** Whether last known figures are still on screen during an outage. */
  hasData?: boolean;
  className?: string;
}) {
  const now = useNow(1000);
  const ago = now ? formatRelativeTime(updatedAt, now) : null;

  // Sample-data (preview) mode shows no status at all.
  if (source === "preview" && !error) return null;
  const state = error ? "error" : reconnecting ? "reconnecting" : "live";
  const tone = {
    live: { dot: "bg-up", ring: "bg-up/60", label: "Live" },
    error: { dot: "bg-down", ring: "bg-down/60", label: "Live" },
    reconnecting: { dot: "bg-muted", ring: "bg-muted/50", label: "Reconnecting" },
  }[state];

  const detail =
    state === "error"
      ? hasData
        ? "showing last data"
        : "data unavailable"
      : ago
          ? `updated ${ago}`
          : "connected";

  return (
    <>
      {/* The visible pill ticks every second, so it is not a live region. */}
      <span
        className={cn(
          "glass inline-flex items-center gap-2.5 rounded-full py-1.5 pr-3.5 pl-3 text-xs text-soft",
          className,
        )}
      >
        <span className="relative flex size-2" aria-hidden="true">
          {state !== "error" && (
            <span className={cn("absolute inset-0 animate-pulse-ring rounded-full", tone.ring)} />
          )}
          <span className={cn("relative size-2 rounded-full", tone.dot)} />
        </span>
        <span className="font-medium text-fg">{tone.label}</span>
        <span className="h-3 w-px bg-fg/15" aria-hidden="true" />
        <span className="text-muted">{detail}</span>
      </span>
      <span role="status" className="sr-only">
        {ANNOUNCE[state]}
      </span>
    </>
  );
}
