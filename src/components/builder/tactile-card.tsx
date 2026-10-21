import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Chamfered "spec sheet" card: dark at rest, flips to warm paper on hover with
 * its line-art illustration animating (see `.tactile` in globals.css).
 */
export function TactileCard({
  index,
  title,
  art,
  children,
  className,
}: {
  index: string;
  title: string;
  art: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <article tabIndex={0} className={cn("tactile group outline-none", className)}>
      <div className="tactile-inner flex h-full flex-col p-6 sm:p-7">
        <header className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[1.375rem] leading-tight font-medium tracking-[-0.02em]">{title}</h3>
          <span className="tc-faint pt-1.5 font-mono text-[0.625rem] tracking-widest">{index}</span>
        </header>
        <div className="relative mt-6 mb-5 px-3 py-4">
          <span aria-hidden="true" className="crop crop-tl" />
          <span aria-hidden="true" className="crop crop-tr" />
          <span aria-hidden="true" className="crop crop-bl" />
          <span aria-hidden="true" className="crop crop-br" />
          {art}
        </div>
        {children && <div className="tc-muted mt-auto text-sm leading-relaxed">{children}</div>}
      </div>
    </article>
  );
}
