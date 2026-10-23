import { cacheLife } from "next/cache";
import { projects } from "@/data/projects";
import { getLiveMetrics } from "./metrics/builder-codes";
import { getPreviewMetrics } from "./metrics/preview";
import type { MetricsSnapshot, MetricsSource } from "./metrics/types";
import { buildLeaderboard, type Leaderboard } from "./ranking";

/** How often (seconds) the server refreshes metrics and clients poll. */
export const REFRESH_SECONDS = 30;

/**
 * Source shown on first load: METRICS_MODE "live" | "preview" (default).
 * Visitors can switch with the Prototype / Live toggle (`?data=`).
 */
export function defaultSource(): MetricsSource {
  return process.env.METRICS_MODE?.toLowerCase() === "live" ? "live" : "preview";
}

export function parseSource(value: string | null | undefined): MetricsSource | null {
  if (value === "live") return "live";
  if (value === "preview" || value === "prototype") return "preview";
  return null;
}

/*
 * `stale` only governs the client router cache (the browser polls the API
 * route instead); keeping it at 5 minutes lets results ship in the prerendered
 * App Shell. `revalidate` is the real refresh interval.
 */

async function previewLeaderboard(): Promise<Leaderboard> {
  "use cache";
  cacheLife({ stale: 300, revalidate: REFRESH_SECONDS, expire: 3600 });
  return buildLeaderboard(projects, getPreviewMetrics(projects));
}

/** Last successful live snapshot on this server instance, kept through outages. */
let lastGood: MetricsSnapshot | null = null;

async function liveLeaderboard(): Promise<Leaderboard> {
  "use cache";
  try {
    const snapshot = await getLiveMetrics(projects);
    lastGood = snapshot;
    cacheLife({ stale: 300, revalidate: REFRESH_SECONDS, expire: 3600 });
    return buildLeaderboard(projects, snapshot);
  } catch (err) {
    // Errors must not escape a cached scope (they would fail the render/build).
    // Never fall back to sample numbers in live mode: keep the last real
    // figures if this instance has them, otherwise show "unavailable".
    console.error("[builder-race] live metrics failed:", err);
    cacheLife({ stale: 300, revalidate: 15, expire: 600 });
    return buildLeaderboard(projects, {
      source: "live",
      updatedAt: lastGood?.updatedAt ?? new Date().toISOString(),
      byProject: lastGood?.byProject ?? {},
      error: "Live data is temporarily unavailable. Retrying shortly.",
    });
  }
}

export async function getLeaderboard(source: MetricsSource = defaultSource()): Promise<Leaderboard> {
  return source === "live" ? liveLeaderboard() : previewLeaderboard();
}
