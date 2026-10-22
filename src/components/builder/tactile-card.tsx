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
      {/* Phones: compact row (art left, text right). From md: tall spec-sheet card. */}
      <div className="tactile-inner flex h-full items-center gap-4 p-4 md:flex-col md:items-stretch md:gap-0 md:p-7">
        <div className="relative w-24 shrink-0 px-1.5 py-2 md:order-2 md:mt-6 md:mb-5 md:w-auto md:px-3 md:py-4">
          <span aria-hidden="true" className="crop crop-tl" />
          <span aria-hidden="true" className="crop crop-tr" />
          <span aria-hidden="true" className="crop crop-bl" />
          <span aria-hidden="true" className="crop crop-br" />
          {art}
        </div>
        <div className="min-w-0 flex-1 md:contents">
          <header className="flex items-start justify-between gap-3 md:order-1 md:gap-4">
            <h3 className="font-display text-base leading-tight font-medium tracking-[-0.02em] md:text-[1.375rem]">{title}</h3>
            <span className="tc-faint pt-0.5 font-mono text-[0.625rem] tracking-widest md:pt-1.5">{index}</span>
          </header>
          {children && <div className="tc-muted mt-1 text-sm leading-relaxed md:order-3 md:mt-auto">{children}</div>}
        </div>
      </div>
    </article>
  );
}
