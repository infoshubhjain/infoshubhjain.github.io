"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-media-query";

/**
 * Premium terminal-style boot sequence loading screen.
 * Stages:
 *  1. Boot messages stream in line-by-line (CS-themed)
 *  2. Progress bar fills
 *  3. Monogram glows
 *  4. Terminal "clears" and site reveals
 */
const BOOT_MESSAGES = [
  { text: "Initializing portfolio kernel...", delay: 0 },
  { text: "Loading AI agents [7/7] ✓", delay: 250 },
  { text: "Mounting Supabase schemas [11/11] ✓", delay: 450 },
  { text: "Calibrating Bayesian Knowledge Tracer ✓", delay: 650 },
  { text: "Warming DistilBERT tokenizers ✓", delay: 850 },
  { text: "Compiling Rust neural network ✓", delay: 1050 },
  { text: "Establishing liquid glass shaders ✓", delay: 1250 },
  { text: "Portfolio ready. Welcome.", delay: 1450 },
];

export function LoadingScreen() {
  const reduced = usePrefersReducedMotion();
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) return;

    // Stream boot messages.
    const messageTimers: ReturnType<typeof setTimeout>[] = [];
    BOOT_MESSAGES.forEach((msg, i) => {
      const t = setTimeout(() => setVisibleMessages(i + 1), msg.delay);
      messageTimers.push(t);
    });

    // Progress bar.
    let raf = 0;
    let start = 0;
    const duration = 1700;
    const tick = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        requestAnimationFrame(() => setDone(true));
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      messageTimers.forEach(clearTimeout);
    };
  }, [reduced]);

  const show = !reduced && !done;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background px-6"
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
        >
          {/* Aurora background */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <motion.div
              className="aurora-blob left-1/4 top-1/3 h-[40vh] w-[40vh] -translate-x-1/2 -translate-y-1/2"
              style={{ background: "var(--aurora-1)" }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="aurora-blob right-1/4 bottom-1/3 h-[35vh] w-[35vh] translate-x-1/2 translate-y-1/2"
              style={{ background: "var(--aurora-3)" }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>

          {/* Animated grid */}
          <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />

          {/* Scanline overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, var(--foreground) 2px, var(--foreground) 3px)",
            }}
          />

          {/* Content */}
          <div className="relative w-full max-w-md">
            {/* Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 flex flex-col items-center"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl liquid-glass-strong glow-primary">
                <span className="font-display text-xl font-bold text-gradient-primary">
                  SJ
                </span>
                {/* Rotating ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-primary/40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    borderTopColor: "var(--primary)",
                    borderRightColor: "transparent",
                    borderBottomColor: "transparent",
                    borderLeftColor: "transparent",
                  }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
              >
                Shubh Jain
              </motion.div>
            </motion.div>

            {/* Terminal boot log */}
            <div className="mb-5 h-[140px] overflow-hidden rounded-xl border border-border bg-background/60 p-3 font-mono text-[11px] leading-relaxed backdrop-blur-md">
              {BOOT_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-primary">›</span>
                  <span className="text-foreground/80">{msg.text.replace("✓", "")}</span>
                  {msg.text.includes("✓") && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="text-primary"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              ))}
              {/* Blinking cursor on the last line */}
              {visibleMessages < BOOT_MESSAGES.length && (
                <span className="inline-block h-3 w-1.5 animate-pulse bg-primary" />
              )}
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>loading</span>
                <span className="tabular-nums text-primary">{progress}%</span>
              </div>
              <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-border">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                  style={{ width: `${progress}%` }}
                />
                {/* Glowing edge */}
                <motion.div
                  className="absolute top-0 h-full w-8 rounded-full bg-primary blur-[4px]"
                  style={{ left: `calc(${progress}% - 16px)`, opacity: progress > 0 ? 1 : 0 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
