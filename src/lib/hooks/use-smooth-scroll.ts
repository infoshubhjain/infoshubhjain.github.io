"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initializes Lenis smooth scrolling for the entire app.
 * Skips when prefers-reduced-motion is set, and disables on touch
 * (where native scroll is already good).
 */
export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || isTouch) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      lerp: 0.1,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Expose lenis globally so navbar/anchors can drive it.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
}

/**
 * Programmatic smooth scroll to a section id.
 * Fires a liquid-wipe transition (if available) before scrolling.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;

  // Try to fire the liquid wipe transition first.
  // The wipe component exposes itself via a custom event.
  const wipeAvailable = window.dispatchEvent(
    new CustomEvent("liquid-wipe-request", { detail: { targetId: id } })
  );

  // If something is listening for the wipe event, let it handle the scroll.
  // Otherwise scroll immediately.
  if (!wipeAvailable) return;

  // Check if a listener is actually registered by seeing if the event was
  // canceled. We use a simpler approach: a global flag.
  const hasWipe = (window as unknown as { __liquidWipeActive?: boolean }).__liquidWipeActive;
  if (hasWipe) {
    // Wipe will handle the scroll after the curtain covers.
    return;
  }

  // No wipe — scroll directly.
  if (lenis) {
    lenis.scrollTo(el, { offset: -80, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

