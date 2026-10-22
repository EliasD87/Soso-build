"use client";

import { type CSSProperties, useId, useState } from "react";
import { Segmented } from "@/components/segmented";
import { formatInt, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

/*
 * Builder fee rates are integers in tenths of a basis point (1/100,000):
 * 10 = 1 bp = 0.01%. The charged rate is limited by the rate the order
 * requests, the user's approved maximum, and the product cap.
 */

type Product = "perps" | "spot" | "wealth";

const PRODUCTS: Record<Product, { label: string; cap: number; capLabel: string; note: string }> = {
  perps: {
    label: "Perps",
    cap: 200,
    capLabel: "Perps engine cap",
    note: "Applies to both sides of perps fills. Credited to your builder account in real time.",
  },
  spot: {
    label: "Spot",
    cap: 2000,
    capLabel: "Spot engine cap",
    note: "Only fees collected in the quote asset count — the buying side of spot trades pays no builder fee.",
  },
  wealth: {
    label: "Wealth",
    cap: 2000,
    capLabel: "Protocol max",
    note: "Charged on redemption claims and filled RFQ sells, taken from the user's proceeds and rounded down.",
  },
};

const PRODUCT_OPTIONS = (Object.keys(PRODUCTS) as Product[]).map((key) => ({ key, label: PRODUCTS[key].label }));

const MAX_RATE = 2000;
const PRESETS = [10_000, 100_000, 1_000_000];

/** 50 → "5 bp", 2000 → "200 bp" (rates are tenths of a basis point). */
const formatBp = (rate: number) => `${Number((rate / 10).toFixed(1))} bp`;

export function FeeCalculator() {
  const [product, setProduct] = useState<Product>("perps");
  const [volume, setVolume] = useState(100_000);
  const [requested, setRequested] = useState(50);
  const [approved, setApproved] = useState(100);
  const id = useId();

  const cap = PRODUCTS[product].cap;
  const effective = approved === 0 ? 0 : Math.min(requested, approved, cap);
  const binding: "none" | "requested" | "approved" | "cap" =
    approved === 0 || requested === 0
      ? "none"
      : effective === cap && cap < Math.min(requested, approved)
        ? "cap"
        : effective === approved && approved < requested
          ? "approved"
          : "requested";
  const daily = Math.floor(((volume * effective) / 100_000) * 100) / 100;

  const rows = [
    { key: "requested", label: "Requested on the order", value: requested },
    { key: "approved", label: "User's approved max", value: approved },
    { key: "cap", label: PRODUCTS[product].capLabel, value: cap },
  ] as const;

  return (
    <div className="panel p-6 sm:p-8">
      <Segmented
        label="Product"
        options={PRODUCT_OPTIONS}
        value={product}
        onChange={setProduct}
        className="h-10 bg-canvas"
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        {/* Inputs */}
        <div className="space-y-8">
          <div>
            <label htmlFor={`${id}-volume`} className="text-sm font-medium text-soft">
              Daily volume through your app
            </label>
            <div className="mt-2.5 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
              <div className="relative col-span-3">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">$</span>
                <input
                  id={`${id}-volume`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={formatInt(volume)}
                  onChange={(e) => setVolume(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
                  className="num h-10 w-full rounded-full border border-line bg-canvas pr-4 pl-7 text-fg outline-none focus:border-fg sm:w-40"
                />
              </div>
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setVolume(p)}
                  className={cn(
                    "num h-10 rounded-full border px-3.5 text-sm transition",
                    volume === p ? "border-fg text-fg" : "border-line text-muted hover:text-fg",
                  )}
                >
                  {p >= 1_000_000 ? `$${p / 1_000_000}M` : `$${p / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          <RateSlider id={`${id}-requested`} label="Fee you request" value={requested} onChange={setRequested} />
          <RateSlider id={`${id}-approved`} label="User's approved max" value={approved} onChange={setApproved} />
        </div>

        {/* Result */}
        <div>
          <p className="text-sm font-medium text-soft">You earn</p>
          <p className="mt-2 flex items-baseline gap-2" aria-live="polite">
            <span className="num text-5xl font-semibold tracking-tight text-fg">{formatUsd(daily)}</span>
            <span className="text-base text-muted">/ day</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {formatUsd(daily * 30)} per month at <span className="num text-fg">{formatBp(effective)}</span>
          </p>

          <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
            {rows.map((row) => {
              const isBinding = binding === row.key;
              return (
                <div key={row.key} className="flex items-center justify-between py-3">
                  <dt className={isBinding ? "font-medium text-fg" : "text-muted"}>
                    {row.label}
                    {isBinding && <span className="ml-2 text-xs font-normal text-muted">sets the fee</span>}
                  </dt>
                  <dd className={cn("num", isBinding ? "font-semibold text-fg" : "text-muted")}>{formatBp(row.value)}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>

      <p className="mt-8 border-t border-line pt-5 text-sm text-muted">
        {approved === 0 ? "No approval, no fee — the order still executes, just without a builder fee." : PRODUCTS[product].note}
      </p>
    </div>
  );
}

function RateSlider({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  // Non-linear slider: position² maps to rate so small fees get most of the travel.
  const pos = Math.round(Math.sqrt(value / MAX_RATE) * 1000);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-soft">
          {label}
        </label>
        <span className="num text-sm font-medium text-fg">{value === 0 ? "Not approved" : formatBp(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={1000}
        step={1}
        value={pos}
        aria-valuetext={`${formatBp(value)} (${value} in tenths of a basis point)`}
        onChange={(e) => {
          const p = Number(e.target.value) / 1000;
          onChange(Math.round(p * p * MAX_RATE));
        }}
        className="range mt-3"
        style={{ "--fill": `${pos / 10}%` } as CSSProperties}
      />
    </div>
  );
}
