import type { Project } from "@/data/projects";
import type { MetricsSnapshot, ProjectMetrics } from "./types";

/**
 * SoDEX Builder Statistics adapter.
 *
 * `GET {base}/user/{builderAddress}/builder/summary[?accountID=]` returns a
 * builder's cumulative Spot + Perps stats (BuilderFeeStats). It is public — no
 * key or signature — and keyed by the builder account owner's wallet, so each
 * project needs a `builderAddress`; `builderId` optionally picks a
 * non-primary builder account. There is no list endpoint, so builders are
 * queried one by one.
 *
 * Env:
 *   SODEX_API_URL  Optional; defaults to Mainnet (`https://mainnet-gw.sodex.dev/api/v1`).
 *                  Use `https://testnet-gw.sodex.dev/api/v1` for Testnet.
 *
 * Docs: sodex.com/documentation/for-developers/developers/trading/builder-codes-in-trading#builder-statistics
 */

const DEFAULT_BASE = "https://mainnet-gw.sodex.dev/api/v1";

/** BuilderFeeStats — integers and decimals both arrive as strings. */
type BuilderFeeStats = {
  name?: string;
  builderCode?: string;
  userCount: string;
  builderFee: string;
  tradeCount: string;
  tradeVolume: string;
};

type SummaryResponse = { code?: number; data?: BuilderFeeStats | null };

export async function getLiveMetrics(projects: Project[]): Promise<MetricsSnapshot> {
  const base = (process.env.SODEX_API_URL || DEFAULT_BASE).replace(/\/+$/, "");
  const linked = projects.filter((p) => p.builderAddress);
  const results = await Promise.allSettled(linked.map((p) => fetchSummary(base, p)));

  const byProject: MetricsSnapshot["byProject"] = {};
  const failures: string[] = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") byProject[linked[i].slug] = result.value;
    else failures.push(String(result.reason));
  });

  if (failures.length > 0) console.error("[builder-race] builder summary failures:", failures);
  // One bad builder shows "No data"; every request failing means the API is down.
  if (linked.length > 0 && failures.length === linked.length) {
    throw new Error(`All ${linked.length} builder summary requests failed`);
  }
  return { source: "live", updatedAt: new Date().toISOString(), byProject };
}

async function fetchSummary(base: string, project: Project): Promise<ProjectMetrics> {
  const url = new URL(`${base}/user/${project.builderAddress}/builder/summary`);
  if (project.builderId) url.searchParams.set("accountID", project.builderId);

  const res = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8_000) });
  if (!res.ok) throw new Error(`${project.slug}: HTTP ${res.status}`);
  const body = (await res.json()) as SummaryResponse;
  if (body.code !== 0) throw new Error(`${project.slug}: API code ${body.code}`);

  // `data: null` — linked, but no builder activity yet.
  if (!body.data) return { users: 0, revenue: 0, volume: 0 };
  return {
    users: toNumber(body.data.userCount),
    revenue: toNumber(body.data.builderFee),
    volume: toNumber(body.data.tradeVolume),
  };
}

function toNumber(value: string | undefined) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
