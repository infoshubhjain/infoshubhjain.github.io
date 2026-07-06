"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import Lenis from "lenis";

/**
 * Liquid-wipe page transition.
 *
 * Listens for `scrollToSection()` calls. When triggered, plays a glass
 * curtain wipe (cover → hold → reveal) and scrolls to the target section
 * while the curtain is at full coverage.
 *
 * Multiple layers for a "liquid" feel:
 *   Layer 1: opaque glass (covers content)
 *   Layer 2: aurora gradient (visual interest)
 *   Layer 3: scanlines (CRT vibe)
 */

type WipeState = {
  active: boolean;
  phase: "idle" | "covering" | "holding" | "revealing";
};

export function LiquidWipe() {
  const [state, setState] = useState<WipeState>({ active: false, phase: "idle" });
  const targetIdRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  const trigger = useCallback((targetId: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    targetIdRef.current = targetId;
    setState({ active: true, phase: "covering" });

    // After the curtain covers, jump to the target section.
    const t1 = setTimeout(() => {
      setState({ active: true, phase: "holding" });
      // Scroll immediately while the curtain is at full coverage.
      const el = document.getElementById(targetId);
      if (el) {
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        if (lenis) {
          lenis.scrollTo(el, { offset: -80, duration: 0 });
        } else {
          el.scrollIntoView({ behavior: "auto", block: "start" });
        }
      }
    }, 500);

    // Reveal the curtain.
    const t2 = setTimeout(() => {
      setState({ active: true, phase: "revealing" });
    }, 800);

    // Reset.
    const t3 = setTimeout(() => {
      setState({ active: false, phase: "idle" });
      busyRef.current = false;
      targetIdRef.current = null;
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    // Register as the wipe handler.
    (window as unknown as { __liquidWipeActive?: boolean }).__liquidWipeActive = true;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ targetId: string }>).detail;
      if (detail?.targetId) {
        trigger(detail.targetId);
      }
    };
    window.addEventListener("liquid-wipe-request", handler);

    return () => {
      window.removeEventListener("liquid-wipe-request", handler);
      delete (window as unknown as { __liquidWipeActive?: boolean }).__liquidWipeActive;
    };
  }, [trigger]);

  return (
    <AnimatePresence>
      {state.active && (
        <>
          {/* Layer 1: opaque glass curtain */}
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[150]"
            initial={{ y: "100%" }}
            animate={{
              y:
                state.phase === "covering" || state.phase === "holding"
                  ? "0%"
                  : "-100%",
            }}
            exit={{ y: "-100%" }}
            transition={{
              duration: state.phase === "holding" ? 0 : 0.5,
              ease: [0.65, 0, 0.35, 1],
            }}
            style={{
              background: "var(--background)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Layer 2: aurora gradient overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="aurora-blob left-1/4 top-1/3 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2"
                style={{ background: "var(--aurora-1)" }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="aurora-blob right-1/4 bottom-1/3 h-[40vh] w-[40vh] translate-x-1/2 translate-y-1/2"
                style={{ background: "var(--aurora-3)" }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
            </div>

            {/* Layer 3: scanlines */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, var(--foreground) 2px, var(--foreground) 3px)",
              }}
            />

            {/* Center logo mark during hold */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: state.phase === "holding" ? 1 : 0,
                scale: state.phase === "holding" ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="font-display text-6xl font-bold text-gradient-primary">
                SJ
              </div>
            </motion.div>

            {/* Top + bottom edge highlights (liquid glass refraction) */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

