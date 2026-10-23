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
    live: { dot: "bg-up", ring: "bg-up/60" },
    error: { dot: "bg-down", ring: "bg-down/60" },
    reconnecting: { dot: "bg-muted", ring: "bg-muted/50" },
  }[state];

  const detail =
    state === "error"
      ? hasData
        ? "Showing last data"
        : "Data unavailable"
      : state === "reconnecting"
        ? "Reconnecting"
        : ago
          ? `Updated ${ago}`
          : "Connected";

  return (
    <>
      {/* The visible pill ticks every second, so it is not a live region. */}
      <span className={cn("inline-flex items-center gap-2 text-xs whitespace-nowrap text-muted", className)}>
        <span className="relative flex size-2" aria-hidden="true">
          {state !== "error" && (
            <span className={cn("absolute inset-0 animate-pulse-ring rounded-full", tone.ring)} />
          )}
          <span className={cn("relative size-2 rounded-full", tone.dot)} />
        </span>
        {detail}
      </span>
      <span role="status" className="sr-only">
        {ANNOUNCE[state]}
      </span>
    </>
  );
}
