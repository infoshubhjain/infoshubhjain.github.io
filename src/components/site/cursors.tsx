"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/hooks/use-media-query";

/**
 * All custom cursor variants live here. The active variant is controlled
 * by the CursorProvider via localStorage + a custom event.
 *
 * Variants:
 *  - "default"  — dot + ring (the original)
 *  - "blob"     — morphing liquid blob that stretches with velocity
 *  - "spotlight"— radial light that illuminates content near the cursor
 *  - "trail"    — comet trail of fading particles
 *  - "crosshair"— precision crosshair with X/Y coords, snaps to elements
 *  - "gooey"    — dot + ring with SVG gooey filter that merges when close
 *  - "glitch"   — RGB-split chromatic aberration that intensifies on hover
 */

export type CursorVariant =
  | "default"
  | "blob"
  | "spotlight"
  | "trail"
  | "crosshair"
  | "gooey"
  | "glitch";

const STORAGE_KEY = "cursor-variant";

export function getStoredCursorVariant(): CursorVariant {
  if (typeof window === "undefined") return "gooey";
  const stored = localStorage.getItem(STORAGE_KEY);
  const valid: CursorVariant[] = [
    "default", "blob", "spotlight", "trail", "crosshair", "gooey", "glitch"
  ];
  // Default to gooey magnetic — it's the most premium-feeling and
  // complements the liquid glass aesthetic.
  return valid.includes(stored as CursorVariant) ? (stored as CursorVariant) : "gooey";
}

export function setCursorVariant(variant: CursorVariant) {
  localStorage.setItem(STORAGE_KEY, variant);
  window.dispatchEvent(new CustomEvent("cursor-variant-change", { detail: variant }));
}

/** The main cursor controller — reads the active variant and renders it. */
export function CustomCursor() {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const [variant, setVariant] = useState<CursorVariant>("default");

  useEffect(() => {
    // Defer to microtask to avoid synchronous setState in effect body.
    Promise.resolve().then(() => setVariant(getStoredCursorVariant()));
    const handler = (e: Event) => {
      setVariant((e as CustomEvent<CursorVariant>).detail);
    };
    window.addEventListener("cursor-variant-change", handler);
    return () => window.removeEventListener("cursor-variant-change", handler);
  }, []);

  if (isTouch || reduced) return null;

  return (
    <>
      {variant === "default" && <DefaultCursor />}
      {variant === "blob" && <BlobCursor />}
      {variant === "spotlight" && <SpotlightCursor />}
      {variant === "trail" && <TrailCursor />}
      {variant === "crosshair" && <CrosshairCursor />}
      {variant === "gooey" && <GooeyCursor />}
      {variant === "glitch" && <GlitchCursor />}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Shared hook — tracks mouse position + hover state
   ════════════════════════════════════════════════════════════════ */

function useMouseTracking() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const hoverable = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'
      );
      const labelEl = target.closest("[data-cursor-label]");

      if (hoverable) {
        setHovering(true);
        const customLabel =
          hoverable.getAttribute("data-cursor-label") ||
          labelEl?.getAttribute("data-cursor-label") ||
          null;
        setLabel(customLabel);
      } else {
        setHovering(false);
        setLabel(null);
      }
    };

    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return { x, y, hovering, label, hidden };
}

/* ════════════════════════════════════════════════════════════════
   1. DEFAULT — dot + ring (the original)
   ════════════════════════════════════════════════════════════════ */

function DefaultCursor() {
  const { x, y, hovering, label, hidden } = useMouseTracking();
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.2s ease" }}
    >
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border border-primary/60 backdrop-blur-[2px]"
          animate={{
            width: hovering ? 64 : 36,
            height: hovering ? 64 : 36,
            backgroundColor: hovering ? "color-mix(in oklch, var(--primary) 12%, transparent)" : "color-mix(in oklch, var(--primary) 4%, transparent)",
            borderColor: hovering ? "color-mix(in oklch, var(--primary) 80%, transparent)" : "color-mix(in oklch, var(--primary) 45%, transparent)",
          }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          style={{ translateX: "-50%", translateY: "-50%" }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-primary"
        style={{ x, y, translateX: "-50%", translateY: "-50%", width: 7, height: 7 }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. BLOB — morphing liquid blob that stretches with velocity
   ════════════════════════════════════════════════════════════════ */

function BlobCursor() {
  const { x, y, hovering, hidden } = useMouseTracking();
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.8 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.8 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    const unsub = x.on("change", (newX) => {
      const newY = y.get();
      const now = performance.now();
      const dt = now - lastPos.current.t;
      if (dt > 0) {
        setVelocity({
          x: (newX - lastPos.current.x) / dt,
          y: (newY - lastPos.current.y) / dt,
        });
      }
      lastPos.current = { x: newX, y: newY, t: now };
    });
    return () => unsub();
  }, [x, y]);

  const speed = Math.hypot(velocity.x, velocity.y);
  const stretch = Math.min(1.5, 1 + speed * 0.3);
  const angle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.2s ease" }}
    >
      <motion.div
        className="absolute top-0 left-0"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="rounded-full"
          style={{
            background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 70%, transparent) 0%, color-mix(in oklch, var(--primary) 20%, transparent) 60%, transparent 100%)",
            translateX: "-50%",
            translateY: "-50%",
            scaleX: stretch,
            scaleY: 1 / stretch,
            rotate: angle,
            filter: "blur(4px)",
          }}
          animate={{
            width: hovering ? 80 : 48,
            height: hovering ? 80 : 48,
          }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        />
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-primary"
        style={{ x, y, translateX: "-50%", translateY: "-50%", width: 8, height: 8 }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. SPOTLIGHT — radial light that illuminates content near cursor
   ════════════════════════════════════════════════════════════════ */

function SpotlightCursor() {
  const { x, y, hidden } = useMouseTracking();
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const unsubX = x.on("change", (v) => setPos((p) => ({ ...p, x: v })));
    const unsubY = y.on("change", (v) => setPos((p) => ({ ...p, y: v })));
    return () => { unsubX(); unsubY(); };
  }, [x, y]);

  return (
    <>
      {/* Full-screen spotlight overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9998] hidden md:block transition-opacity"
        style={{
          opacity: hidden ? 0 : 1,
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, transparent 0%, transparent 30%, color-mix(in oklch, var(--background) 85%, transparent) 100%)`,
        }}
      />
      {/* Bright center dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-3 w-3 rounded-full bg-primary md:block"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          boxShadow: hidden
            ? "0 0 0px transparent"
            : "0 0 20px 4px var(--primary), 0 0 60px 8px color-mix(in oklch, var(--primary) 40%, transparent)",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. TRAIL — comet trail of fading particles
   ════════════════════════════════════════════════════════════════ */

type Particle = { id: number; x: number; y: number };

function TrailCursor() {
  const { x, y, hovering, hidden } = useMouseTracking();
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    let last = 0;
    const throttled = (newX: number, newY: number) => {
      const now = performance.now();
      if (now - last < 40) return;
      last = now;
      const id = idRef.current++;
      setParticles((prev) => [...prev.slice(-12), { id, x: newX, y: newY }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 800);
    };

    const unsubX = x.on("change", (v) => throttled(v, y.get()));
    return () => unsubX();
  }, [x, y]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.3s ease" }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary"
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            left: p.x,
            top: p.y,
            translateX: "-50%",
            translateY: "-50%",
            width: 8 - i * 0.4,
            height: 8 - i * 0.4,
            filter: "blur(1px)",
          }}
        />
      ))}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-primary"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 12 : 10,
          height: hovering ? 12 : 10,
          boxShadow: "0 0 16px 2px var(--primary)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. CROSSHAIR — precision crosshair with X/Y coords
   ════════════════════════════════════════════════════════════════ */

function CrosshairCursor() {
  const { x, y, hovering, hidden } = useMouseTracking();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const unsubX = x.on("change", (v) => setPos((p) => ({ ...p, x: Math.round(v) })));
    const unsubY = y.on("change", (v) => setPos((p) => ({ ...p, y: Math.round(v) })));
    return () => { unsubX(); unsubY(); };
  }, [x, y]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.2s ease" }}
    >
      {/* Horizontal + vertical lines */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-primary/30"
        animate={{ top: pos.y }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      />
      <motion.div
        className="absolute top-0 bottom-0 w-px bg-primary/30"
        animate={{ left: pos.x }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      />
      {/* Center crosshair box */}
      <motion.div
        className="absolute top-0 left-0 border border-primary"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 32 : 20,
          height: hovering ? 32 : 20,
          backgroundColor: hovering ? "color-mix(in oklch, var(--primary) 10%, transparent)" : "transparent",
        }}
      >
        {/* Corner ticks */}
        <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-primary" />
        <span className="absolute -right-1 -top-1 h-2 w-2 border-r border-t border-primary" />
        <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b border-l border-primary" />
        <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-primary" />
      </motion.div>
      {/* Coordinates label */}
      <motion.div
        className="absolute top-0 left-0 font-mono text-[10px] text-primary/80"
        style={{ x, y }}
        animate={{
          translateX: hovering ? 24 : 16,
          translateY: hovering ? 24 : 16,
        }}
      >
        {String(pos.x).padStart(4, "0")}, {String(pos.y).padStart(4, "0")}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   6. GOOEY — dot + ring with SVG gooey filter that merges
   ════════════════════════════════════════════════════════════════ */

function GooeyCursor() {
  const { x, y, hovering, hidden } = useMouseTracking();
  const ringX = useSpring(x, { stiffness: 300, damping: 25, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 300, damping: 25, mass: 0.5 });

  return (
    <>
      {/* SVG gooey filter definition */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="gooey-cursor">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
        style={{
          opacity: hidden ? 0 : 1,
          transition: "opacity 0.2s ease",
          filter: "url(#gooey-cursor)",
        }}
      >
        <motion.div
          className="absolute top-0 left-0 rounded-full bg-primary"
          style={{ x, y, translateX: "-50%", translateY: "-50%", width: 12, height: 12 }}
        />
        <motion.div
          className="absolute top-0 left-0 rounded-full bg-primary/70"
          style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
          animate={{
            width: hovering ? 56 : 32,
            height: hovering ? 56 : 32,
          }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        />
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   7. GLITCH — RGB-split chromatic aberration
   ════════════════════════════════════════════════════════════════ */

function GlitchCursor() {
  const { x, y, hovering, hidden } = useMouseTracking();
  const ringX = useSpring(x, { stiffness: 400, damping: 30 });
  const ringY = useSpring(y, { stiffness: 400, damping: 30 });
  const [velocity, setVelocity] = useState(0);
  const lastPos = useRef({ x: 0, t: 0 });

  useEffect(() => {
    const unsub = x.on("change", (newX) => {
      const now = performance.now();
      const dt = now - lastPos.current.t;
      if (dt > 0) {
        setVelocity(Math.min(8, Math.abs((newX - lastPos.current.x) / dt) * 2));
      }
      lastPos.current = { x: newX, t: now };
    });
    return () => unsub();
  }, [x]);

  const offset = 2 + velocity * 1.5 + (hovering ? 3 : 0);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.2s ease" }}
    >
      {/* Red channel (offset left) */}
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{
          x: ringX, y: ringY,
          translateX: `calc(-50% - ${offset}px)`,
          translateY: "-50%",
          width: hovering ? 48 : 28,
          height: hovering ? 48 : 28,
          backgroundColor: "rgba(255, 0, 80, 0.5)",
          mixBlendMode: "screen",
        }}
      />
      {/* Green channel (center) */}
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{
          x: ringX, y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 48 : 28,
          height: hovering ? 48 : 28,
          backgroundColor: "rgba(0, 255, 130, 0.5)",
          mixBlendMode: "screen",
        }}
      />
      {/* Blue channel (offset right) */}
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{
          x: ringX, y: ringY,
          translateX: `calc(-50% + ${offset}px)`,
          translateY: "-50%",
          width: hovering ? 48 : 28,
          height: hovering ? 48 : 28,
          backgroundColor: "rgba(0, 130, 255, 0.5)",
          mixBlendMode: "screen",
        }}
      />
      {/* Center dot */}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-white"
        style={{ x, y, translateX: "-50%", translateY: "-50%", width: 4, height: 4 }}
      />
    </div>
  );
}
