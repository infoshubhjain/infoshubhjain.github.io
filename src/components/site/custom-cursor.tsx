"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/hooks/use-media-query";

/**
 * A premium custom cursor with:
 *  - A small inner dot that tracks the mouse exactly.
 *  - A larger outer ring that lags with spring physics.
 *  - A magnetic "hover" state that grows when hovering interactive elements.
 *  - A "text" variant when hovering elements with [data-cursor="text"].
 *
 * Disabled on touch / reduced-motion devices.
 */
export function CustomCursor() {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const enabled = !isTouch && !reduced;

  const [variant, setVariant] = useState<"default" | "hover" | "text">("default");
  const [hidden, setHidden] = useState(true);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Outer ring lags.
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const hoverable = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'
      );
      const textEl = target.closest('[data-cursor="text"]');
      const labelEl = target.closest("[data-cursor-label]");

      if (textEl) {
        setVariant("text");
        setLabel(null);
      } else if (hoverable) {
        setVariant("hover");
        const customLabel =
          hoverable.getAttribute("data-cursor-label") ||
          labelEl?.getAttribute("data-cursor-label") ||
          null;
        setLabel(customLabel);
      } else {
        setVariant("default");
        setLabel(null);
      }
    };

    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.2s ease" }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border border-primary/60 backdrop-blur-[2px]"
          animate={{
            width: variant === "hover" ? 64 : 36,
            height: variant === "hover" ? 64 : 36,
            backgroundColor: variant === "hover" ? "rgba(16,217,163,0.12)" : "rgba(16,217,163,0.04)",
            borderColor: variant === "hover" ? "rgba(16,217,163,0.80)" : "rgba(16,217,163,0.45)",
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

      {/* Inner dot */}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-primary"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: variant === "hover" ? 6 : 7,
          height: variant === "hover" ? 6 : 7,
        }}
        animate={{ scale: variant === "text" ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
    </div>
  );
}
