import type { Project } from "@/data/projects";
import type { MetricsSnapshot, ProjectMetrics } from "./types";

/**
 * Builder Codes API adapter.
 *
 * SoDEX builder codes mirror Hyperliquid's: a builder is identified by its
 * numeric SoDEX account ID (`builderID`), users approve a max builder fee for
 * it, and fees settle in vUSDC straight into the builder's balance. As of
 * Oct 2026 there is no documented per-builder aggregate endpoint — the
 * organisers' Builder Codes API is expected to add one.
 *
 * Until its docs are published this adapter is deliberately tolerant: it
 * accepts a bare array, `{ data: [...] }`, `{ data: { list: [...] } }` or
 * `{ result: [...] }`, and reads each record's fields through the alias lists
 * below. When the final docs land, adjust `ENDPOINT` and the aliases — nothing
 * else in the app needs to change.
 *
 * Env:
 *   BUILDER_CODES_API_URL   Full URL of the stats endpoint (required for live mode)
 *   BUILDER_CODES_API_KEY   Optional; sent as `x-api-key` and Bearer token
 *   BUILDER_CODES_REVENUE_DECIMALS  Optional; set if revenue comes in raw token
 *                                   units (e.g. 6 for vUSDC base units)
 *   BUILDER_CODES_VOLUME_DECIMALS   Optional; defaults to the revenue decimals
 *
 * Anything that looks like a schema mismatch throws, so the UI shows "live data
 * unavailable" rather than a healthy-looking empty board.
 */

const ALIASES = {
  id: ["builderID", "builderId", "builder_id", "builder", "accountID", "accountId", "builderCode", "builder_code", "address", "id"],
  users: ["authorizedUsers", "authorized_users", "approvedUsers", "approved_users", "approvals", "userCount", "user_count", "users"],
  revenue: ["builderRevenue", "builder_revenue", "builderFeeRevenue", "builder_fee_revenue", "builderFees", "builder_fees", "builderRewards", "builderFee", "revenue", "fees", "totalFees"],
  volume: ["volume", "tradingVolume", "trading_volume", "totalVolume", "total_volume", "notional"],
} as const;

type RawRecord = Record<string, unknown>;

export function isLiveConfigured() {
  return Boolean(process.env.BUILDER_CODES_API_URL);
}

export async function getLiveMetrics(projects: Project[]): Promise<MetricsSnapshot> {
  const url = process.env.BUILDER_CODES_API_URL;
  if (!url) throw new Error("BUILDER_CODES_API_URL is not set");

  const key = process.env.BUILDER_CODES_API_KEY;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      ...(key ? { "x-api-key": key, authorization: `Bearer ${key}` } : {}),
    },
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Builder Codes API responded ${res.status}`);

  const records = extractRecords(await res.json());
  if (records === null) throw new Error("Unrecognised Builder Codes API response shape");

  const decimals = Number(process.env.BUILDER_CODES_REVENUE_DECIMALS ?? 0);
  const volumeDecimals = Number(process.env.BUILDER_CODES_VOLUME_DECIMALS ?? decimals);
  const byId = new Map<string, ProjectMetrics>();
  for (const record of records) {
    const id = pickString(record, ALIASES.id);
    if (!id) continue;
    const volume = pickNumber(record, ALIASES.volume);
    byId.set(id.toLowerCase(), {
      users: pickNumber(record, ALIASES.users) ?? 0,
      revenue: scale(pickNumber(record, ALIASES.revenue) ?? 0, decimals),
      volume: volume === undefined ? undefined : scale(volume, volumeDecimals),
    });
  }

  const coded = projects.filter((p) => p.builderId);
  if (byId.size > 0 && coded.length > 0 && !coded.some((p) => byId.has(p.builderId!.toLowerCase()))) {
    const sample = [...byId.keys()].slice(0, 3).join(", ");
    throw new Error(`No builderId matched any API record (sample ids: ${sample}) — check ALIASES.id`);
  }

  // A registered builder missing from the response simply has no activity yet.
  const byProject: MetricsSnapshot["byProject"] = {};
  for (const project of coded) {
    byProject[project.slug] = byId.get(project.builderId!.toLowerCase()) ?? { users: 0, revenue: 0 };
  }
  return { source: "live", updatedAt: new Date().toISOString(), byProject };
}

/** Returns the record array (possibly empty), or null when the shape is unrecognised. */
function extractRecords(body: unknown): RawRecord[] | null {
  if (Array.isArray(body)) return body.filter(isRecord);
  if (!isRecord(body)) return null;
  for (const key of ["data", "result", "results", "items", "list", "builders"]) {
    const value = body[key];
    if (Array.isArray(value)) return value.filter(isRecord);
    if (isRecord(value)) {
      const nested = extractRecords(value);
      if (nested !== null) return nested;
    }
  }
  return null;
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickString(record: RawRecord, keys: readonly string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value) return value;
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

function pickNumber(record: RawRecord, keys: readonly string[]) {
  for (const key of keys) {
    const value = record[key];
    const n = typeof value === "string" ? Number(value) : value;
    if (typeof n === "number" && Number.isFinite(n)) return n;
  }
  return undefined;
}

function scale(value: number, decimals: number) {
  return decimals > 0 ? value / 10 ** decimals : value;
}
