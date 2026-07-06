"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, Command, MousePointer2 } from "lucide-react";
import { navItems, profile } from "@/lib/portfolio-data";
import { scrollToSection } from "@/lib/hooks/use-smooth-scroll";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";
import { ThemeToggle } from "./theme-toggle";

export function Navbar({
  onOpenCommand,
  onOpenCursorPlayground,
}: {
  onOpenCommand: () => void;
  onOpenCursorPlayground: () => void;
}) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    // Hide on scroll down, reveal on scroll up.
    if (y > prev && y > 240 && !mobileOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    // Track active section.
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const midline = y + window.innerHeight * 0.35;
    let current = "home";
    for (const sec of sections) {
      const top = sec.offsetTop;
      if (midline >= top) current = sec.id;
    }
    setActive(current);
  });

  // Keyboard nav: number keys jump to sections.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs.
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      const num = Number(e.key);
      if (!Number.isNaN(num) && num >= 1 && num <= navItems.length) {
        e.preventDefault();
        scrollToSection(navItems[num - 1].id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = (id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4"
      >
        <nav
          className={cn(
            "mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl px-3 py-2.5 transition-all duration-500 sm:px-4 liquid-glass",
            scrolled && "shadow-2xl shadow-black/10 scale-[1.005]"
          )}
        >
          {/* Wordmark — text only, no icon */}
          <button
            onClick={() => go("home")}
            className="group relative flex items-center gap-1.5 rounded-lg px-1.5 py-1 font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
            data-cursor-label="Home"
            aria-label="Go to home"
          >
            <span className="text-primary/70">$</span>
            <span>
              shubh<span className="text-primary">_</span>jain
            </span>
            <motion.span
              className="inline-block w-[1.5ch] bg-primary"
              style={{ height: "1em", animation: "cursor-blink 1.1s steps(1) infinite" }}
              aria-hidden
            />
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-primary/10 ring-1 ring-primary/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCommand}
              className="group flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              aria-label="Open command palette"
            >
              <Command className="h-3 w-3" />
              <kbd className="hidden font-sans text-[10px] tracking-wide sm:inline">K</kbd>
            </button>

            <button
              onClick={onOpenCursorPlayground}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Open cursor playground"
              data-cursor-label="Cursors"
            >
              <MousePointer2 className="h-4 w-4" />
            </button>

            <ThemeToggle />

            <Magnetic strength={0.25} className="hidden sm:inline-flex">
              <button
                onClick={() => go("contact")}
                className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:glow-primary"
              >
                Connect
              </button>
            </Magnetic>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-4 top-24 rounded-2xl liquid-glass-strong p-3"
            >
              <div className="grid gap-1">
                {navItems.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-primary/10"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      0{i + 1}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  GitHub ↗
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  LinkedIn ↗
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Email ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
