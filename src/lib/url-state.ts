"use client";

import { useSyncExternalStore } from "react";

/*
 * Tiny URL query store. Reading via useSyncExternalStore keeps the page fully
 * static (no useSearchParams Suspense boundary) while still letting
 * `?sort=` and `?project=` deep links and the back button work.
 */

const EVENT = "builder-race:querychange";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export function useQueryParam(key: string): string | null {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return new URLSearchParams(search).get(key);
}

/**
 * Updates the query string. Next's own history keys are never forwarded — its
 * patched pushState/replaceState only sync the App Router when they are absent,
 * otherwise a later router commit would revert the URL.
 */
export function setQueryParams(
  updates: Record<string, string | null>,
  mode: "push" | "replace" = "replace",
  state?: Record<string, unknown>,
) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  if (url.href === window.location.href) return;
  if (mode === "push") {
    window.history.pushState(state ?? null, "", url);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip Next's internal keys, keep ours
    const { __NA, __PRIVATE_NEXTJS_INTERNALS_TREE, ...custom } = (window.history.state ?? {}) as Record<string, unknown>;
    window.history.replaceState({ ...custom, ...state }, "", url);
  }
  window.dispatchEvent(new Event(EVENT));
}
