"use client";

import { useState } from "react";
import { cn, initials } from "@/lib/utils";

/** Flat monogram tile for a project. */
export function ProjectMark({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden border border-line-strong bg-raised font-display font-semibold text-fg select-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        fontSize: size * 0.38,
      }}
    >
      <span className="relative drop-">{initials(name)}</span>
    </span>
  );
}

/** GitHub avatar with an initials fallback. */
export function BuilderAvatar({
  github,
  name,
  size = 24,
  className,
}: {
  github: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };
  if (failed) {
    return (
      <span
        aria-hidden="true"
        style={{ ...style, fontSize: size * 0.4 }}
        className={cn(
          "inline-grid shrink-0 place-items-center rounded-full bg-raised font-medium text-muted ring-1 ring-line-strong",
          className,
        )}
      >
        {initials(name)}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- GitHub's avatar CDN already resizes; a fallback is needed on error
    <img
      src={`https://avatars.githubusercontent.com/${encodeURIComponent(github)}?s=${size * 2}`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={style}
      className={cn("shrink-0 rounded-full bg-raised object-cover ring-1 ring-fg/10", className)}
    />
  );
}
