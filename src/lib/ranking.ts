import type { Project } from "@/data/projects";
import type { MetricsSnapshot, MetricsSource, ProjectMetrics } from "./metrics/types";

export type SortKey = "revenue" | "users";

export type LeaderboardEntry = {
  project: Project;
  metrics: ProjectMetrics | null;
};

export type Leaderboard = {
  source: MetricsSource;
  updatedAt: string;
  error?: string;
  entries: LeaderboardEntry[];
  totals: {
    users: number;
    revenue: number;
    volume: number;
    /** Projects in the race. */
    projects: number;
    /** Projects reporting data. */
    active: number;
  };
};

export type RankedEntry = LeaderboardEntry & {
  /** null when the project has no data yet. */
  rank: number | null;
  /** Value relative to the leader for the active sort, 0–1. */
  relative: number;
};

export function buildLeaderboard(projects: Project[], snapshot: MetricsSnapshot): Leaderboard {
  const racing = projects.filter((p) => p.participating);
  const entries = racing.map((project) => ({
    project,
    metrics: snapshot.byProject[project.slug] ?? null,
  }));
  const withData = entries.filter((e) => e.metrics);
  return {
    source: snapshot.source,
    updatedAt: snapshot.updatedAt,
    error: snapshot.error,
    entries,
    totals: {
      users: sum(withData, (e) => e.metrics!.users),
      revenue: sum(withData, (e) => e.metrics!.revenue),
      volume: sum(withData, (e) => e.metrics!.volume ?? 0),
      projects: racing.length,
      active: withData.length,
    },
  };
}

/**
 * Orders entries by the chosen metric (ties broken by the other metric, then
 * by Wave 3 placement). Projects with no activity ($0 and 0 users) or no data
 * sink to the bottom unranked, so nobody earns a medal for doing nothing.
 */
export function rankEntries(entries: LeaderboardEntry[], sort: SortKey): RankedEntry[] {
  const other: SortKey = sort === "revenue" ? "users" : "revenue";
  const sorted = [...entries].sort((a, b) => {
    if (!a.metrics || !b.metrics) {
      if (a.metrics) return -1;
      if (b.metrics) return 1;
      return a.project.waveRank - b.project.waveRank;
    }
    return (
      b.metrics[sort] - a.metrics[sort] ||
      b.metrics[other] - a.metrics[other] ||
      a.project.waveRank - b.project.waveRank
    );
  });
  const top = sorted[0]?.metrics?.[sort] ?? 0;
  return sorted.map((entry, i) => ({
    ...entry,
    // Active entries sort first, so ranks stay contiguous.
    rank: hasActivity(entry) ? i + 1 : null,
    relative: entry.metrics && top > 0 ? entry.metrics[sort] / top : 0,
  }));
}

export function hasActivity({ metrics }: LeaderboardEntry) {
  return Boolean(metrics && (metrics.revenue > 0 || metrics.users > 0));
}

function sum<T>(items: T[], pick: (item: T) => number) {
  return items.reduce((acc, item) => acc + pick(item), 0);
}
