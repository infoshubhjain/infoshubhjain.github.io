"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-media-query";

/**
 * An immersive loading screen that plays once on mount.
 * - Animated aurora bar
 * - Counter that ticks from 0 → 100
 * - Big "SJ" monogram
 * - Fades out cleanly when complete
 */
export function LoadingScreen() {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) return; // Skip animation entirely on reduced-motion devices.

    let raf = 0;
    let start = 0;
    const duration = 1500;

    const tick = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        // Defer the done-flag flip to the next frame so the final
        // setProgress(100) commits before the exit animation triggers.
        requestAnimationFrame(() => setDone(true));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // When reduced motion is preferred, skip the loading screen entirely.
  const show = !reduced && !done;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
          {/* Background aurora */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="aurora-blob left-1/4 top-1/3 h-[40vh] w-[40vh] -translate-x-1/2 -translate-y-1/2" style={{ background: "var(--aurora-1)" }} />
            <div className="aurora-blob right-1/4 bottom-1/3 h-[30vh] w-[30vh] translate-x-1/2 translate-y-1/2" style={{ background: "var(--aurora-3)" }} />
          </div>

          {/* Monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-8"
          >
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 liquid-glass-strong glow-primary">
              <span className="font-display text-2xl font-bold text-gradient-primary">
                SJ
              </span>
            </div>
          </motion.div>

          {/* Progress */}
          <div className="relative w-[min(280px,70vw)]">
            <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              <span>Loading</span>
              <span className="tabular-nums text-primary">{progress}%</span>
            </div>
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-border">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
