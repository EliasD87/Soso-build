import type { Project } from "@/data/projects";
import type { MetricsSnapshot, ProjectMetrics } from "./types";

/**
 * Sample metrics for the prototype, used until the Builder Codes API is live.
 *
 * Numbers are deterministic per project and grow over time (minute buckets),
 * so the page behaves like a live race: totals only ever tick up, and ranks
 * swap when one project's growth curve overtakes another's. They are NOT real
 * and the UI labels them as sample data.
 */

const RACE_START = Date.UTC(2026, 9, 20, 0, 0, 0);
const HOUR = 3_600_000;

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleFor(project: Project, now: number): ProjectMetrics {
  const rand = mulberry32(hash(project.slug));
  // A skewed "traction" score so a handful of projects pull ahead.
  const traction = Math.pow(rand(), 1.8);
  const ceilingUsers = 18 + traction * 640;
  const feePerUser = 4 + rand() * 26;
  const pace = 30 + rand() * 120; // hours to reach ~63% of ceiling
  const avgFeeRate = 0.0004 + rand() * 0.0006; // 4–10 bps

  const progressAt = (minute: number) => {
    const hours = Math.max(0, (minute * 60_000 - RACE_START) / HOUR);
    return 0.22 + 0.78 * (1 - Math.exp(-hours / pace));
  };
  const revenueAt = (minute: number) => {
    const p = progressAt(minute);
    return ceilingUsers * p * feePerUser * p;
  };

  const minute = Math.floor(now / 60_000);
  const users = Math.max(1, Math.round(ceilingUsers * progressAt(minute)));
  // Jitter only the latest increment: revenue(m) stays between base(m-1) and
  // base(m), so it never decreases while still moving unevenly.
  const jitter = mulberry32(hash(project.slug) ^ minute)();
  const before = revenueAt(minute - 1);
  const revenue = Math.round((before + (revenueAt(minute) - before) * jitter) * 100) / 100;
  const volume = Math.round(revenue / avgFeeRate);
  return { users, revenue, volume };
}

export function getPreviewMetrics(projects: Project[], now = Date.now()): MetricsSnapshot {
  const byProject: MetricsSnapshot["byProject"] = {};
  for (const project of projects) byProject[project.slug] = sampleFor(project, now);
  return {
    source: "preview",
    updatedAt: new Date(Math.floor(now / 60_000) * 60_000).toISOString(),
    byProject,
  };
}
