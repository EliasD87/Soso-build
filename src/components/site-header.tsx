import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/site";
import { SoSoValueLogo } from "./sosovalue-logo";
import { ThemeToggle } from "./theme-toggle";

export function Wordmark({ className = "", compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-fg ${className}`}>
      {compact && <SoSoValueLogo viewBox="0 0 28 32" className="h-6 w-auto md:hidden" />}
      <SoSoValueLogo className={`h-6 w-auto ${compact ? "hidden md:block" : ""}`} />
      <span className={`border-l border-line-strong pl-2.5 text-sm text-muted ${compact ? "hidden md:inline" : ""}`}>Buildathon</span>
    </span>
  );
}

const NAV = [
  { key: "leaderboard", href: "/", label: "Leaderboard" },
  { key: "builder-codes", href: "/builder-codes", label: "Builder Codes" },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

export function SiteHeader({ active }: { active: NavKey }) {
  return (
    <header className="absolute inset-x-0 top-4 z-40 px-4 sm:top-6">
      <nav
        aria-label="Primary"
        className="glass mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 rounded-full pr-2 pl-3 sm:pl-5"
      >
        <Link href="/" className="shrink-0 rounded-full" aria-label="SoSoValue Buildathon — Builder Race home">
          <Wordmark compact />
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {NAV.map((item) => {
            const current = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`rounded-full px-2.5 py-2 text-xs whitespace-nowrap transition sm:px-3.5 sm:text-sm ${
                  current ? "bg-fg/[0.08] text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <a
            href={site.links.buildathon}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buildathon on Akindo"
            className="bg-brand-gradient ml-1 hidden h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink transition sm:inline-flex"
          >
            Buildathon <ArrowUpRight className="size-4" />
          </a>
        </div>
      </nav>
    </header>
  );
}
