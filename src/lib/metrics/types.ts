export type ProjectMetrics = {
  /** Users who have authorized (approved) the project's builder code. */
  users: number;
  /** Builder fee revenue earned through the builder code, in USD. */
  revenue: number;
  /** Trading volume routed through the builder code, in USD. */
  volume?: number;
};

export type MetricsSource = "live" | "preview";

export type MetricsSnapshot = {
  source: MetricsSource;
  /** ISO timestamp of when the data was produced. */
  updatedAt: string;
  /** Keyed by project slug. Missing keys mean "no data yet". */
  byProject: Record<string, ProjectMetrics>;
  /** Set when the live API failed and we fell back. */
  error?: string;
};
