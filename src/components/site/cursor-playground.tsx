"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, X, Check, ExternalLink } from "lucide-react";
import { CursorVariant, getStoredCursorVariant, setCursorVariant } from "./cursors";
import { cn } from "@/lib/utils";

type CursorOption = {
  id: CursorVariant;
  name: string;
  description: string;
  inspiration: string;
  inspirationUrl: string;
};

const CURSOR_OPTIONS: CursorOption[] = [
  {
    id: "default",
    name: "Dot + Ring",
    description: "A small dot tracks the mouse exactly; a larger ring lags behind with spring physics. Grows on hover with contextual labels.",
    inspiration: "Linear, Vercel",
    inspirationUrl: "https://linear.app",
  },
  {
    id: "blob",
    name: "Liquid Blob",
    description: "A morphing blob that stretches and rotates based on cursor velocity. Slow = circle, fast = elongated streak. Soft gradient with blur.",
    inspiration: "Apple Vision Pro, Rauno.me",
    inspirationUrl: "https://rauno.me",
  },
  {
    id: "spotlight",
    name: "Spotlight Reveal",
    description: "A radial light follows the cursor and illuminates content nearby. Areas outside the spotlight dim slightly. Feels like a flashlight in a dark room.",
    inspiration: "Awwwards dark sites",
    inspirationUrl: "https://www.awwwards.com/sites/best-dark",
  },
  {
    id: "trail",
    name: "Trailing Particles",
    description: "A comet trail of fading particles follows the cursor. Particles inherit velocity and dissipate over ~0.8 seconds. Premium when slow, playful when fast.",
    inspiration: "Framer Motion showcase",
    inspirationUrl: "https://www.framer.com/motion/",
  },
  {
    id: "crosshair",
    name: "Crosshair Hacker",
    description: "A precision crosshair with full-width X/Y guide lines and live coordinates in monospace. Corner ticks snap on hover. Reinforces the CS/engineering identity hard.",
    inspiration: "Figma, VS Code",
    inspirationUrl: "https://figma.com",
  },
  {
    id: "gooey",
    name: "Gooey Magnetic",
    description: "Dot + ring with an SVG gooey filter that makes them merge into a single blob when close, then separate when moving. Organic, liquid feel.",
    inspiration: "CSS Gooey filter demos",
    inspirationUrl: "https://css-tricks.com/gooey-effect/",
  },
  {
    id: "glitch",
    name: "Glitch RGB",
    description: "RGB-split chromatic aberration — three offset colored copies (red, green, blue) that converge when still and split when moving. Cyberpunk aesthetic.",
    inspiration: "Awwwards experimental",
    inspirationUrl: "https://www.awwwards.com/sites/glitch",
  },
];

export function CursorPlayground({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState<CursorVariant>("default");

  useEffect(() => {
    if (!open) return;
    // Defer to microtask to avoid synchronous setState in effect body.
    Promise.resolve().then(() => setActive(getStoredCursorVariant()));
  }, [open]);

  const handleSelect = (variant: CursorVariant) => {
    setActive(variant);
    setCursorVariant(variant);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] overflow-y-auto scroll-area"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" />

          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto my-8 w-full max-w-4xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-3xl liquid-glass-strong border border-border shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                    <MousePointer2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      Cursor Playground
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Pick a cursor. Move your mouse to test it live.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="Close playground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Live test area */}
              <div className="relative h-48 overflow-hidden border-b border-border bg-grid">
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      move your cursor here to test
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button className="rounded-lg border border-border bg-card/40 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40">
                        Hover me
                      </button>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                      >
                        And me
                      </a>
                    </div>
                  </div>
                </div>
                {/* Aurora */}
                <div
                  aria-hidden
                  className="aurora-blob left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2"
                  style={{ background: "var(--aurora-1)", opacity: 0.3 }}
                />
              </div>

              {/* Options grid */}
              <div className="grid gap-3 p-6 sm:grid-cols-2">
                {CURSOR_OPTIONS.map((option) => {
                  const isActive = active === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all",
                        isActive
                          ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
                          : "border-border bg-card/40 hover:border-primary/30"
                      )}
                    >
                      {/* Active check */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </motion.div>
                      )}

                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={cn(
                            "font-mono text-[10px] font-semibold uppercase tracking-wider",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {String(CURSOR_OPTIONS.indexOf(option) + 1).padStart(2, "0")}
                        </span>
                        <h3
                          className={cn(
                            "font-display text-base font-semibold",
                            isActive ? "text-primary" : "text-foreground"
                          )}
                        >
                          {option.name}
                        </h3>
                      </div>

                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {option.description}
                      </p>

                      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
                        <span>inspiration:</span>
                        <a
                          href={option.inspirationUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-0.5 font-medium text-primary/70 hover:text-primary"
                        >
                          {option.inspiration}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>

                      {/* Spotlight hover */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(400px circle at 50% 0%, color-mix(in oklch, var(--primary) 8%, transparent), transparent 60%)",
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4">
                <p className="text-center text-xs text-muted-foreground">
                  Your choice is saved automatically.{" "}
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    Esc
                  </kbd>{" "}
                  to close.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
