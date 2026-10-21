"use client";

import { Flag } from "lucide-react";
import { useNow } from "./use-now";

/** Optional race clock, shown when NEXT_PUBLIC_RACE_ENDS_AT is set (ISO date). */
const ENDS_AT = process.env.NEXT_PUBLIC_RACE_ENDS_AT;

export function Countdown() {
  const now = useNow(1000);
  if (!ENDS_AT) return null;
  const end = Date.parse(ENDS_AT);
  if (Number.isNaN(end) || now === null) return null;

  const remaining = Math.max(0, end - now);
  const d = Math.floor(remaining / 86_400_000);
  const h = Math.floor((remaining / 3_600_000) % 24);
  const m = Math.floor((remaining / 60_000) % 60);
  const s = Math.floor((remaining / 1000) % 60);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span className="glass inline-flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-3 text-xs text-muted">
      <Flag className="size-3.5 text-brand" aria-hidden="true" />
      {remaining === 0 ? (
        <span className="font-medium text-fg">Race finished</span>
      ) : (
        <>
          <span>Ends in</span>
          <span className="num font-medium text-fg">
            {d > 0 && `${d}d `}
            {pad(h)}:{pad(m)}:{pad(s)}
          </span>
        </>
      )}
    </span>
  );
}
