"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Magnetic } from "./magnetic";

// SSR-safe "is mounted" flag without setState-in-effect.
const subscribeMounted = (cb: () => void) => {
  // The store never changes after mount — this is just to trigger hydration.
  // We listen to a no-op event so React knows we're subscribed.
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const getMounted = () => true;
const getMountedSSR = () => false;

/**
 * Animated dark/light theme toggle.
 * - Renders a neutral placeholder until mounted (avoids hydration mismatch).
 * - Uses next-themes to set the .dark class on <html>.
 * - Magnetic wrapper + smooth icon crossfade.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeMounted, getMounted, getMountedSSR);

  const current = mounted ? (theme === "system" ? resolvedTheme : theme) : "dark";
  const isDark = current === "dark";

  return (
    <Magnetic strength={0.3}>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        data-cursor-label={isDark ? "Light" : "Dark"}
        className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 text-foreground backdrop-blur-md transition-all hover:border-primary/40 hover:text-primary"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
            >
              <Moon className="h-4 w-4" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
            >
              <Sun className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Glow ring on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            boxShadow: "0 0 20px -4px var(--primary)",
          }}
        />
      </button>
    </Magnetic>
  );
}
