"use client";

import { ArrowDown, ArrowUp, ArrowUpRight, ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { UsdcIcon } from "@/components/icons-usdc";
import { BuilderAvatar } from "@/components/marks";
import { Segmented } from "@/components/segmented";
import { formatFee, formatInt, formatPercent, formatUsdCompact } from "@/lib/format";
import type { RankedEntry, SortKey } from "@/lib/ranking";
import { cn, hostname } from "@/lib/utils";
import { LinkButtons, videoUrl } from "./link-buttons";

export type Movement = Record<string, number>;
export type Changed = Record<string, { revenue: boolean; users: boolean }>;

const SORT_OPTIONS = [
  { key: "revenue", label: "Builder fees" },
  { key: "users", label: "Users" },
] as const;

// Shortcut hint: ⌘K on Apple platforms, Ctrl K elsewhere (server renders the latter).
const noopSubscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform);

const PHONE_QUERY = "(max-width: 639px)";
const subscribePhone = (onChange: () => void) => {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const isPhone = () => window.matchMedia(PHONE_QUERY).matches;

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
  totalRevenue,
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
  totalRevenue: number;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  const apple = useSyncExternalStore(noopSubscribe, isApple, () => false);
  const phone = useSyncExternalStore(subscribePhone, isPhone, () => false);
  // One expanded row at a time (phones only).
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (slug: string) => setExpanded((cur) => (cur === slug ? null : slug));
  // Phone search sits behind an icon; it stays open while there is a query.
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileSearch = searchOpen || query !== "";

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
      <h2 id="standings-title" className="sr-only">
        Standings
      </h2>

      {/* Phones: one slim row — sort pills, search tucked behind an icon */}
      <div className="mb-3 flex h-10 items-center gap-2 sm:hidden">
        {mobileSearch ? (
          <>
            <div className="relative flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search builders"
                aria-label="Search projects or builders"
                className="h-10 w-full rounded-full border border-fg bg-surface pr-4 pl-10 text-sm text-fg outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onQueryChange("");
                setSearchOpen(false);
              }}
              className="h-10 px-1 text-sm font-medium text-muted"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <Segmented
              label="Rank by"
              options={SORT_OPTIONS}
              value={sort}
              onChange={onSortChange}
              className="h-9"
              itemClassName="px-3.5 text-xs"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search builders"
              className="ml-auto grid size-9 place-items-center rounded-full border border-line bg-surface text-muted transition active:scale-95"
            >
              <Search className="size-4" />
            </button>
          </>
        )}
      </div>

      {/* Larger screens: sort toggle + search side by side */}
      <div className="mb-4 hidden items-center justify-end gap-2.5 sm:flex">
        <Segmented label="Rank by" options={SORT_OPTIONS} value={sort} onChange={onSortChange} className="h-10" />
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
            className="h-10 w-60 rounded-full border border-line bg-surface pr-14 pl-10 text-sm text-fg transition placeholder:text-faint focus:border-fg focus:ring-4 focus:ring-fg/10 focus-visible:outline-hidden [&::-webkit-search-cancel-button]:hidden"
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
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border border-line px-1.5 font-mono text-[0.625rem] text-faint"
            >
              {apple ? "⌘K" : "Ctrl K"}
            </kbd>
          )}
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
                <th scope="col" className="w-12 py-3 pl-4 font-normal sm:w-16 sm:pl-6">#</th>
                <th scope="col" className="py-3 pr-4 font-normal lg:w-[36%]">Project</th>
                <th scope="col" className="hidden py-3 pr-4 font-normal lg:table-cell lg:w-[22%]">Builder</th>
                <SortTh label="Users" active={sort === "users"} onClick={() => onSortChange("users")} className="hidden sm:table-cell" />
                <SortTh
                  label={phone && sort === "users" ? "Users" : "Builder fees"}
                  active={phone || sort === "revenue"}
                  onClick={() => onSortChange("revenue")}
                  className="w-px whitespace-nowrap"
                />
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
                    totalRevenue={totalRevenue}
                    phone={phone}
                    expanded={expanded === entry.project.slug}
                    onToggle={toggle}
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
  totalRevenue,
  phone,
  expanded,
  onToggle,
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
  totalRevenue: number;
  /** Phone layout: rows expand in place instead of opening the pop-up. */
  phone: boolean;
  expanded: boolean;
  onToggle: (slug: string) => void;
}) {
  const { project, metrics, rank } = entry;
  const missing = unavailable ? "Unavailable" : project.builderAddress ? "No data" : "Awaiting code";
  const open = () => onSelect(project.slug);
  const activate = () => (phone ? onToggle(project.slug) : open());
  const panelId = `row-${project.slug}`;
  const isOpen = phone && expanded;

  return (
    <>
      <motion.tr
        layout={animateLayout && !phone ? "position" : false}
        transition={{ type: "spring", stiffness: 300, damping: 34 }}
        // Pointer convenience only — the project name is the keyboard control.
        onClick={activate}
        className={cn(
          "group h-16 cursor-pointer transition-colors hover:bg-fg/[0.03] sm:h-[4.5rem]",
          isOpen ? "bg-fg/[0.03]" : "border-b border-line last:border-b-0",
        )}
        // `backwards` (not `both`) so the entrance animation never pins `transform` over layout animations.
        style={{ animation: `rise 0.5s cubic-bezier(0.2,0.7,0.2,1) ${Math.min(index, 12) * 25}ms backwards` }}
      >
        <td className="pl-4 sm:pl-6">
          <div className="flex items-center gap-1.5">
            <RankMark rank={rank} />
            <MoveChip move={move} />
          </div>
        </td>

        <td className="max-w-0 pr-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              activate();
            }}
            aria-expanded={phone ? expanded : undefined}
            aria-controls={phone ? panelId : undefined}
            className="block max-w-full text-left font-race text-[0.9375rem] leading-snug font-semibold tracking-tight text-fg hover:underline max-sm:line-clamp-2 sm:truncate sm:text-base"
          >
            {project.name}
            {!phone && <span className="sr-only">, view details</span>}
          </button>
          <a
            href={project.links.app}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open ${project.name} app: ${hostname(project.links.app)}`}
            className="mt-0.5 hidden max-w-full items-center gap-1 text-xs text-faint transition hover:text-fg sm:inline-flex"
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
          <div className="flex min-w-0 items-center gap-2.5">
            <BuilderAvatar github={project.builder.github} name={project.builder.name} size={26} />
            <div className="min-w-0">
              <p className="truncate text-soft">{project.builder.name}</p>
              {project.builder.x && (
                <a
                  href={`https://x.com/${project.builder.x}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="block truncate text-xs text-faint transition hover:text-fg"
                >
                  @{project.builder.x}
                  {(project.team?.length ?? 0) > 1 && <span className="text-faint"> +{project.team!.length - 1}</span>}
                </a>
              )}
            </div>
          </div>
        </td>

        <td className="hidden pr-4 text-right sm:table-cell sm:pr-6">
          <Metric value={metrics?.users} format="int" active={sort === "users"} flash={changed?.users ? tick : undefined} missing={missing} />
        </td>

        <td className="w-px pr-4 text-right whitespace-nowrap sm:pr-6">
          <span className="inline-flex items-center gap-2">
            {phone && sort === "users" ? (
              <Metric value={metrics?.users} format="int" active flash={changed?.users ? tick : undefined} missing={missing} />
            ) : (
              <Metric value={metrics?.revenue} format="fee" usdc active={sort === "revenue"} flash={changed?.revenue ? tick : undefined} missing={missing} />
            )}
            <ChevronDown
              aria-hidden="true"
              className={cn("size-4 text-faint transition-transform sm:hidden", isOpen && "rotate-180 text-fg")}
            />
          </span>
        </td>

        <td className="hidden w-44 pr-6 lg:table-cell">
          <div className="flex items-center justify-end gap-1">
            <LinkButtons project={project} />
            {/* Fills in on row hover — the cue that the whole row opens the pop-up */}
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="ml-1 inline-flex h-7 items-center gap-0.5 rounded-full border border-line pr-2 pl-3 text-xs font-medium text-muted transition-colors group-hover:border-fg group-hover:bg-fg group-hover:text-canvas"
            >
              Details
              <ChevronRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </td>
      </motion.tr>

      <AnimatePresence initial={false}>
        {isOpen && (
        <tr key="details" className="border-b border-line bg-fg/[0.03] last:border-b-0 sm:hidden">
          <td colSpan={6} className="p-0">
            <motion.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              // w-0 + min-w-full: fill the cell without letting wide content widen the table.
              className="w-0 min-w-full overflow-hidden"
            >
              <RowDetails entry={entry} sort={sort} totalRevenue={totalRevenue} missing={missing} onOpen={open} />
            </motion.div>
          </td>
        </tr>
        )}
      </AnimatePresence>
    </>
  );
}

/** Inline details for an expanded row on phones. */
function RowDetails({
  entry,
  sort,
  totalRevenue,
  missing,
  onOpen,
}: {
  entry: RankedEntry;
  sort: SortKey;
  totalRevenue: number;
  missing: string;
  onOpen: () => void;
}) {
  const { project, metrics } = entry;
  const share = metrics && totalRevenue > 0 ? metrics.revenue / totalRevenue : 0;
  const video = videoUrl(project);
  const links = [
    { label: hostname(project.links.app), href: project.links.app },
    project.links.github && { label: "GitHub", href: project.links.github },
    project.builder.x && { label: `@${project.builder.x}`, href: `https://x.com/${project.builder.x}` },
    project.team?.[0]?.telegram && { label: "Telegram", href: `https://t.me/${project.team[0].telegram}` },
    video && { label: "Demo", href: video },
    { label: "Akindo", href: project.links.akindo },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="px-4 pt-1 pb-4">
      {metrics ? (
        <dl className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-surface">
          <MiniStat label={sort === "users" ? "Builder fees" : "Users"}>
            {sort === "users" ? (
              <span className="inline-flex items-center gap-1">
                <UsdcIcon className="size-3.5" />
                {formatFee(metrics.revenue)}
              </span>
            ) : (
              formatInt(metrics.users)
            )}
          </MiniStat>
          <MiniStat label="Fee share">{formatPercent(share)}</MiniStat>
          <MiniStat label="Volume">{metrics.volume ? formatUsdCompact(metrics.volume) : "—"}</MiniStat>
        </dl>
      ) : (
        <p className="rounded-xl border border-line bg-surface px-3 py-3 text-sm text-muted">{missing}</p>
      )}

      <p className="mt-3 line-clamp-2 text-sm text-muted">{project.tagline}</p>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-3 text-xs text-soft"
          >
            {l.label}
            <ArrowUpRight aria-hidden="true" className="size-3 text-faint" />
          </a>
        ))}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="bg-brand-gradient mt-4 h-10 w-full rounded-full text-sm font-semibold text-ink"
      >
        Full details
      </button>
    </div>
  );
}

function MiniStat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 px-3 py-2.5">
      <dt className="truncate text-[0.6875rem] text-muted">{label}</dt>
      <dd className="num mt-0.5 truncate text-sm font-semibold text-fg">{children}</dd>
    </div>
  );
}

const SUFFIX: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };

/** Plain number; the top three get bold weight and a small ordinal suffix. */
function RankMark({ rank }: { rank: number | null }) {
  if (rank === null) {
    return (
      <span className="font-race text-base font-medium text-muted sm:text-lg">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Unranked</span>
      </span>
    );
  }
  const suffix = SUFFIX[rank];
  if (suffix) {
    return (
      <span className="inline-flex items-start font-race text-base font-bold tabular-nums text-fg sm:text-lg">
        <span className="sr-only">Rank </span>
        {rank}
        <span aria-hidden="true" className="mt-0.5 ml-px text-[0.5625rem] font-medium tracking-wide text-faint uppercase">
          {suffix}
        </span>
      </span>
    );
  }
  return <span className="font-race text-base font-medium tabular-nums text-muted sm:text-lg">{rank}</span>;
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
