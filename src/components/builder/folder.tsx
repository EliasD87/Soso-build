import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FolderTone = "solid" | "outline" | "mid";

/**
 * Flat folder: back panel with a tab, two sheets peeking out and a front
 * panel. On hover the sheets lift and the front tips forward.
 */
export function Folder({
  href,
  external,
  tone,
  title,
  meta,
  sheets,
  front,
  className,
}: {
  href: string;
  external?: boolean;
  tone: FolderTone;
  title: string;
  meta: string;
  sheets: [ReactNode, ReactNode];
  front?: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "folder group block rounded-2xl p-4 pb-5 transition-colors duration-300 hover:bg-fg/[0.04] focus-visible:bg-fg/[0.04] sm:p-5",
        `folder-${tone}`,
        className,
      )}
    >
      <div className="folder-obj" aria-hidden="true">
        <div className="folder-back" />
        <div className="folder-sheet folder-sheet-1">{sheets[0]}</div>
        <div className="folder-sheet folder-sheet-2">{sheets[1]}</div>
        <div className="folder-front">{front}</div>
      </div>
      <p className="mt-5 text-center font-display text-[0.9375rem] font-medium text-fg">{title}</p>
      <p className="mt-1 text-center text-xs text-faint">{meta}</p>
    </a>
  );
}
