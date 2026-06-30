"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query subscription using useSyncExternalStore.
 * This is the React 19-recommended way to read media query state without
 * triggering cascading renders from setState-in-effect.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false // SSR snapshot
  );
}

/** True when the user prefers reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on touch-primary devices (no fine pointer). */
export function useIsTouch(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
