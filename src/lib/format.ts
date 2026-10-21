const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const usdFull = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const int = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const intCompact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** $1,234.56 below $100k, compact ($1.2M) above. */
export function formatUsd(value: number) {
  if (value >= 100_000) return usdCompact.format(value);
  return usdFull.format(value);
}

export function formatUsdWhole(value: number) {
  return usdWhole.format(value);
}

export function formatUsdCompact(value: number) {
  return usdCompact.format(value);
}

/** Fee amounts: whole numbers below 10,000, then compact with up to 2 decimals (12.35K, 1.2M). */
const feeCompact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });

export function formatFee(value: number) {
  return value >= 10_000 ? feeCompact.format(value) : int.format(value);
}

export function formatInt(value: number) {
  return int.format(value);
}

export function formatIntCompact(value: number) {
  return value >= 10_000 ? intCompact.format(value) : int.format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatRelativeTime(from: Date | string | number, now = Date.now()) {
  const then = new Date(from).getTime();
  const seconds = Math.max(0, Math.round((now - then) / 1000));
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
