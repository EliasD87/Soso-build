"use client";

import { MotionConfig } from "motion/react";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { MetricsSource } from "@/lib/metrics/types";
import { type Leaderboard, rankEntries, type SortKey } from "@/lib/ranking";
import { setQueryParams, useQueryParam } from "@/lib/url-state";
import { cn } from "@/lib/utils";
import { Hero } from "./hero";
import { ProjectSheet } from "./project-sheet";
import { type Changed, type Movement, Standings } from "./standings";

type RaceState = {
  data: Leaderboard;
  /** Rank deltas since the previous refresh, per sort key. */
  movement: Record<SortKey, Movement>;
  changed: Changed;
  /** Increments on every data change; retriggers value flashes. */
  tick: number;
};

const SHEET_STATE_KEY = "builderRaceSheet";

export function LeaderboardApp({ initial, refreshSeconds }: { initial: Leaderboard; refreshSeconds: number }) {
  const [state, setState] = useState<RaceState>(() => ({
    data: initial,
    movement: { revenue: {}, users: {} },
    changed: {},
    tick: 0,
  }));
  const [reconnecting, setReconnecting] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  // Layout animations start one frame after mount, so a `?sort=users` deep link
  // snaps into place instead of reshuffling during hydration.
  const [animateLayout, setAnimateLayout] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimateLayout(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const sortParam = useQueryParam("sort");
  const sort: SortKey = sortParam === "users" ? "users" : "revenue";
  const selectedSlug = useQueryParam("project");
  // Prototype / Live toggle; the server's default applies until it is used.
  const dataParam = useQueryParam("data");
  const source: MetricsSource = dataParam === "live" ? "live" : dataParam === "prototype" ? "preview" : initial.source;
  // True between flipping the toggle and the new source's first response.
  const switching = state.data.source !== source;

  // Poll the cached API route; pause while the tab is hidden. Changing the
  // source restarts polling with an immediate fetch.
  const firstRun = useRef(true);
  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    async function refresh() {
      if (inFlight || document.visibilityState !== "visible") return;
      inFlight = true;
      try {
        const res = await fetch(`/api/leaderboard?source=${source}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const next = (await res.json()) as Leaderboard;
        if (cancelled) return;
        setReconnecting(false);
        setState((prev) => reconcile(prev, next));
      } catch {
        if (!cancelled) setReconnecting(true);
      } finally {
        inFlight = false;
      }
    }

    if (!firstRun.current || source !== initial.source) refresh();
    firstRun.current = false;
    const id = setInterval(refresh, refreshSeconds * 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshSeconds, source, initial.source]);

  const { data } = state;
  const isPreview = data.source === "preview";
  const ranked = useMemo(() => rankEntries(data.entries, sort), [data.entries, sort]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return ranked;
    return ranked.filter(({ project: p }) =>
      [p.name, p.tagline, p.builder.name, p.builder.github, p.builder.x ?? ""].some((s) => s.toLowerCase().includes(q)),
    );
  }, [ranked, deferredQuery]);

  const selected = selectedSlug ? ranked.find((e) => e.project.slug === selectedSlug) ?? null : null;

  const setSort = useCallback((next: SortKey) => {
    setQueryParams({ sort: next === "revenue" ? null : next });
  }, []);

  const setSource = useCallback((next: MetricsSource) => {
    setQueryParams({ data: next === "live" ? "live" : "prototype" });
  }, []);

  const openProject = useCallback((slug: string) => {
    setQueryParams({ project: slug }, "push", { [SHEET_STATE_KEY]: true });
  }, []);

  const closeProject = useCallback(() => {
    if (!new URLSearchParams(window.location.search).has("project")) return;
    // Opened from this page → step back so the back button doesn't reopen it.
    if (window.history.state?.[SHEET_STATE_KEY]) window.history.back();
    else setQueryParams({ project: null });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Hero data={data} reconnecting={reconnecting} source={source} onSourceChange={setSource} />
      <div aria-busy={switching} className={cn("pb-24 transition-opacity duration-300", switching && "pointer-events-none opacity-40")}>
        <Standings
          entries={filtered}
          totalCount={ranked.length}
          sort={sort}
          onSortChange={setSort}
          query={query}
          onQueryChange={setQuery}
          movement={state.movement[sort]}
          changed={state.changed}
          tick={state.tick}
          onSelect={openProject}
          unavailable={Boolean(data.error)}
          animateLayout={animateLayout}
          totalRevenue={data.totals.revenue}
        />
      </div>
      <ProjectSheet
        entry={selected}
        sort={sort}
        totals={data.totals}
        isPreview={isPreview}
        unavailable={Boolean(data.error)}
        onClose={closeProject}
      />
    </MotionConfig>
  );
}

/** Decides how a polled snapshot updates state. */
function reconcile(prev: RaceState, next: Leaderboard): RaceState {
  // Switched between Prototype and Live: start over, no rank movement.
  if (next.source !== prev.data.source) {
    return { data: next, movement: { revenue: {}, users: {} }, changed: {}, tick: prev.tick + 1 };
  }
  const prevTime = Date.parse(prev.data.updatedAt);
  const nextTime = Date.parse(next.updatedAt);
  // A stale cache or CDN edge can hand back an older snapshot — ignore it.
  if (nextTime < prevTime) return prev;
  if (next.error) {
    // Keep the last good numbers on screen and just flag the outage.
    if (prev.data.totals.active > 0) {
      return prev.data.error === next.error ? prev : { ...prev, data: { ...prev.data, error: next.error } };
    }
    return nextTime === prevTime && prev.data.error === next.error ? prev : { ...prev, data: next };
  }
  if (nextTime === prevTime && !prev.data.error) return prev;
  return advance(prev, next);
}

function advance(prev: RaceState, next: Leaderboard): RaceState {
  const prevBySlug = new Map(prev.data.entries.map((e) => [e.project.slug, e.metrics]));
  const changed: Changed = {};
  for (const entry of next.entries) {
    const before = prevBySlug.get(entry.project.slug);
    const after = entry.metrics;
    if (!before || !after) continue;
    const revenue = before.revenue !== after.revenue;
    const users = before.users !== after.users;
    if (revenue || users) changed[entry.project.slug] = { revenue, users };
  }
  return {
    data: next,
    movement: {
      revenue: rankDelta(prev.data, next, "revenue"),
      users: rankDelta(prev.data, next, "users"),
    },
    changed,
    tick: prev.tick + 1,
  };
}

function rankDelta(prev: Leaderboard, next: Leaderboard, sort: SortKey): Movement {
  const before = new Map(rankEntries(prev.entries, sort).map((e) => [e.project.slug, e.rank]));
  const delta: Movement = {};
  for (const entry of rankEntries(next.entries, sort)) {
    const was = before.get(entry.project.slug);
    if (entry.rank && was && was !== entry.rank) delta[entry.project.slug] = was - entry.rank;
  }
  return delta;
}
