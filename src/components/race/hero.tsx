"use client";

import type { Leaderboard } from "@/lib/ranking";
import { SoSoValueLogo } from "@/components/sosovalue-logo";
import { BuilderField } from "./builder-field";
import { Countdown } from "./countdown";
import { StatusPill } from "./status-pill";

export function Hero({ data, reconnecting }: { data: Leaderboard; reconnecting: boolean }) {
  const { totals } = data;

  return (
    <section className="relative overflow-x-clip">
      {/* The field runs past the hero into the top of the leaderboard. */}
      <BuilderField className="absolute inset-x-0 top-0 -bottom-48 h-[calc(100%+12rem)] w-full" />
      {/* Melts the grid into the page instead of a hard divider. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-48 h-56 bg-linear-to-b from-transparent to-ink" />

      <div className="relative mx-auto max-w-6xl px-4 pt-32 pb-12 sm:px-6 sm:pt-40 sm:pb-16">
        <div className="flex animate-rise flex-wrap items-center gap-2.5">
          <StatusPill
            source={data.source}
            updatedAt={data.updatedAt}
            error={data.error}
            reconnecting={reconnecting}
            hasData={totals.active > 0}
          />
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-canvas py-1.5 pr-3 pl-3.5 text-fg">
            <SoSoValueLogo className="h-4 w-auto" />
            <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
            <span className="font-display text-sm font-medium tracking-tight text-soft">Buildathon · Wave 3</span>
          </span>
          <Countdown />
        </div>

        <h1 className="mt-8 animate-rise font-display text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.88] font-semibold tracking-[-0.05em] [animation-delay:80ms]">
          Builder Race
        </h1>

        {data.error && (
          <p className="mt-6 w-fit animate-rise rounded-full border border-down/40 bg-canvas px-3.5 py-1.5 text-xs text-down">
            {totals.active > 0 ? "Live data unavailable — showing last known figures." : "Live data unavailable. Retrying every 30s."}
          </p>
        )}
      </div>
    </section>
  );
}
