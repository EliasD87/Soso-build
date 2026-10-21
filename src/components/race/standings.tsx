"use client";

import { ArrowDown, ArrowUp, ArrowUpRight, Search, X } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { UsdcIcon } from "@/components/icons-usdc";
import { BuilderAvatar } from "@/components/marks";
import { Segmented } from "@/components/segmented";
import type { RankedEntry, SortKey } from "@/lib/ranking";
import { cn, hostname } from "@/lib/utils";
import { LinkButtons } from "./link-buttons";

export type Movement = Record<string, number>;
export type Changed = Record<string, { revenue: boolean; users: boolean }>;

const SORT_OPTIONS = [
  { key: "revenue", label: "Builder fees" },
  { key: "users", label: "Users" },
] as const;

// Shortcut hint: ⌘K on Apple platforms, Ctrl K elsewhere (server renders the latter).
const noopSubscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform);

export function Standings({
  entries,
  totalCount,
  sort,
  onSortChange,
  query,
  onQueryChange,
  movement,
  changed,
  tick,
  onSelect,
  unavailable,
  animateLayout,
}: {
  entries: RankedEntry[];
  totalCount: number;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  query: string;
  onQueryChange: (query: string) => void;
  movement: Movement;
  changed: Changed;
  tick: number;
  onSelect: (slug: string) => void;
  /** Live API is down. */
  unavailable: boolean;
  animateLayout: boolean;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  const apple = useSyncExternalStore(noopSubscribe, isApple, () => false);

  // Ctrl/⌘ K focuses search (a modifier shortcut, so it never steals typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "k" || !(e.metaKey || e.ctrlKey) || e.altKey) return;
      if (document.querySelector("dialog[open]")) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const clear = () => {
    onQueryChange("");
    searchRef.current?.focus();
  };

  return (
    <section id="standings" aria-labelledby="standings-title" className="relative mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <h2 id="standings-title" className="sr-only">
          Standings
        </h2>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <Segmented label="Rank by" options={SORT_OPTIONS} value={sort} onChange={onSortChange} layoutId="sort-pill" className="h-10" />
          <div className="group relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint transition group-focus-within:text-fg"
            />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search builders"
              aria-label="Search projects or builders"
              aria-keyshortcuts="Control+K Meta+K"
              className="h-10 w-full rounded-full border border-line bg-surface pr-14 pl-10 text-sm text-fg transition placeholder:text-faint focus:border-fg focus:ring-4 focus:ring-fg/10 focus-visible:outline-hidden sm:w-60 [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={clear}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-faint hover:bg-fg/10 hover:text-fg"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-line px-1.5 font-mono text-[0.625rem] text-faint sm:block"
              >
                {apple ? "⌘K" : "Ctrl K"}
              </kbd>
            )}
          </div>
        </div>
      </div>

      <p role="status" className="sr-only">
        {query.trim() ? (entries.length ? `${entries.length} of ${totalCount} projects match` : `No projects match ${query}`) : ""}
      </p>

      <div className="overflow-clip rounded-2xl border border-line bg-surface">
        {entries.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-muted">
            No builders match “{query}”.{" "}
            <button type="button" onClick={clear} className="text-fg underline underline-offset-4">
              Clear search
            </button>
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Builder Race standings</caption>
            <thead className="bg-surface">
              <tr className="border-b border-line text-left text-xs text-faint">
                <th scope="col" className="w-10 py-3 pl-4 font-normal sm:w-14 sm:pl-6">#</th>
                <th scope="col" className="py-3 pr-4 font-normal lg:w-[36%]">Project</th>
                <th scope="col" className="hidden py-3 pr-4 font-normal lg:table-cell lg:w-[22%]">Builder</th>
                <SortTh label="Users" active={sort === "users"} onClick={() => onSortChange("users")} className="hidden sm:table-cell" />
                <SortTh label="Builder fees" active={sort === "revenue"} onClick={() => onSortChange("revenue")} />
                <th scope="col" className="hidden py-3 pr-6 font-normal lg:table-cell">
                  <span className="sr-only">Links</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <LayoutGroup>
                {entries.map((entry, i) => (
                  <Row
                    key={entry.project.slug}
                    entry={entry}
                    index={i}
                    sort={sort}
                    move={movement[entry.project.slug]}
                    changed={changed[entry.project.slug]}
                    tick={tick}
                    onSelect={onSelect}
                    unavailable={unavailable}
                    animateLayout={animateLayout}
                  />
                ))}
              </LayoutGroup>
            </tbody>
          </table>
        )}
      </div>

    </section>
  );
}

function SortTh({ label, active, onClick, className }: { label: string; active: boolean; onClick: () => void; className?: string }) {
  return (
    <th scope="col" aria-sort={active ? "descending" : "none"} className={cn("py-3 pr-4 text-right font-normal sm:pr-6", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn("inline-flex items-center gap-1 whitespace-nowrap transition hover:text-fg", active && "text-fg")}
      >
        {label}
      </button>
    </th>
  );
}

function Row({
  entry,
  index,
  sort,
  move,
  changed,
  tick,
  onSelect,
  unavailable,
  animateLayout,
}: {
  entry: RankedEntry;
  index: number;
  sort: SortKey;
  move?: number;
  changed?: { revenue: boolean; users: boolean };
  tick: number;
  onSelect: (slug: string) => void;
  unavailable: boolean;
  animateLayout: boolean;
}) {
  const { project, metrics, rank } = entry;
  const missing = unavailable ? "Unavailable" : project.builderId ? "No data" : "Awaiting code";
  const open = () => onSelect(project.slug);

  return (
    <motion.tr
      layout={animateLayout ? "position" : false}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
      // Pointer convenience only — the project name is the keyboard control.
      onClick={open}
      className="group h-[4.5rem] cursor-pointer border-b border-line last:border-b-0 hover:bg-fg/[0.03]"
      // `backwards` (not `both`) so the entrance animation never pins `transform` over layout animations.
      style={{ animation: `rise 0.5s cubic-bezier(0.2,0.7,0.2,1) ${Math.min(index, 12) * 25}ms backwards` }}
    >
      <td className="pl-4 sm:pl-6">
        <div className="flex items-center gap-1.5">
          <span className={cn("num tabular-nums", rank !== null && rank <= 3 ? "font-semibold text-fg" : "text-muted")}>
            {rank === null ? (
              <>
                <span aria-hidden="true">—</span>
                <span className="sr-only">Unranked</span>
              </>
            ) : (
              rank
            )}
          </span>
          <MoveChip move={move} />
        </div>
      </td>

      <td className="max-w-0 pr-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="block max-w-full truncate text-left font-medium text-fg hover:underline"
        >
          {project.name}
          <span className="sr-only">, view details</span>
        </button>
        <a
          href={project.links.app}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${project.name} app: ${hostname(project.links.app)}`}
          className="mt-0.5 inline-flex max-w-full items-center gap-1 text-xs text-faint transition hover:text-fg"
        >
          <span className="truncate">{hostname(project.links.app)}</span>
          <ArrowUpRight aria-hidden="true" className="size-3 shrink-0" />
        </a>
        {/* Builder under the name when the Builder column is hidden */}
        <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted lg:hidden">
          <BuilderAvatar github={project.builder.github} name={project.builder.name} size={14} />
          <span className="truncate">{project.builder.name}</span>
        </span>
      </td>

      <td className="hidden max-w-0 pr-4 lg:table-cell">
        <div className="flex min-w-0 items-center gap-2">
          <BuilderAvatar github={project.builder.github} name={project.builder.name} size={22} />
          <span className="truncate text-muted">{project.builder.name}</span>
        </div>
      </td>

      <td className="hidden pr-4 text-right sm:table-cell sm:pr-6">
        <Metric value={metrics?.users} format="int" active={sort === "users"} flash={changed?.users ? tick : undefined} missing={missing} />
      </td>

      <td className="pr-4 text-right sm:pr-6">
        <Metric value={metrics?.revenue} format="fee" usdc active={sort === "revenue"} flash={changed?.revenue ? tick : undefined} missing={missing} />
      </td>

      <td className="hidden w-36 pr-6 lg:table-cell">
        <div className="flex items-center justify-end gap-1">
          <LinkButtons project={project} />
        </div>
      </td>
    </motion.tr>
  );
}

function Metric({
  value,
  format,
  usdc,
  active,
  flash,
  missing,
}: {
  value?: number;
  format: "int" | "fee";
  /** Show the USDC mark before the amount. */
  usdc?: boolean;
  active: boolean;
  flash?: number;
  missing: string;
}) {
  if (value === undefined) return <span className="text-xs text-faint">{missing}</span>;
  return (
    <span className="relative -mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5">
      {flash !== undefined && <span key={flash} aria-hidden="true" className="absolute inset-0 animate-flash rounded-md" />}
      {usdc && <UsdcIcon className="relative size-4 shrink-0" />}
      <AnimatedNumber value={value} format={format} className={cn("num relative tabular-nums", active ? "font-semibold text-fg" : "text-muted")} />
    </span>
  );
}

function MoveChip({ move }: { move?: number }) {
  if (!move) return null;
  const up = move > 0;
  return (
    <motion.span
      key={move}
      initial={{ opacity: 0, y: up ? 4 : -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("num inline-flex items-center text-[0.625rem] font-semibold", up ? "text-up" : "text-down")}
    >
      <span aria-hidden="true" className="inline-flex items-center">
        {up ? <ArrowUp className="size-2.5" /> : <ArrowDown className="size-2.5" />}
        {Math.abs(move)}
      </span>
      <span className="sr-only">{up ? `up ${move}` : `down ${-move}`} since last update</span>
    </motion.span>
  );
}
