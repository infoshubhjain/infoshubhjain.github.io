"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * A terminal-style blinking cursor. Pure CSS animation, no JS state.
 */
export function TerminalCursor({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block w-[0.6ch] bg-primary align-middle ml-1 ${className ?? ""}`}
      style={{
        height: "0.9em",
        animation: "cursor-blink 1.1s steps(1) infinite",
      }}
      aria-hidden
    />
  );
}

/**
 * Types out the given text character-by-character, then shows a blinking cursor.
 * Respects prefers-reduced-motion (shows full text immediately, no cursor blink).
 */
export function Typewriter({
  text,
  speed = 70,
  delay = 0,
  className,
  cursor = true,
  onComplete,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
}) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(text);
      setDone(true);
      onComplete?.();
      return;
    }

    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const startTimer = setTimeout(() => {
      const tick = () => {
        if (i >= text.length) {
          setDone(true);
          onComplete?.();
          return;
        }
        i++;
        setDisplay(text.slice(0, i));
        timer = setTimeout(tick, speed);
      };
      tick();
    }, delay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [text, speed, delay, onComplete]);

  return (
    <span className={className}>
      {display}
      {cursor && !done && <span className="opacity-60">▋</span>}
      {cursor && done && <TerminalCursor />}
    </span>
  );
}

/**
 * Rotating typewriter — cycles through an array of phrases.
 * Types a phrase, holds, deletes it, then types the next one.
 *
 * Example phrases: ["CS @ UIUC", "AI Researcher", "Full-Stack Engineer"]
 */
export function RotatingTypewriter({
  phrases,
  typeSpeed = 65,
  deleteSpeed = 35,
  holdDuration = 1800,
  delay = 0,
  className,
}: {
  phrases: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
  delay?: number;
  className?: string;
}) {
  // Reduced-motion check happens inside the effect; for SSR we assume
  // full motion. Initial state is "waiting" so the effect kicks off the
  // first transition after `delay`.
  const [display, setDisplay] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting" | "waiting" | "static">("waiting");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Static mode — show the first phrase, no animation.
      // Use a microtask to avoid setState-during-render warnings.
      const id = requestAnimationFrame(() => {
        setDisplay(phrases[0] ?? "");
        setPhase("static");
      });
      return () => cancelAnimationFrame(id);
    }

    if (phase === "static") return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === "waiting") {
      timer = setTimeout(() => setPhase("typing"), delay);
    } else if (phase === "typing") {
      const current = phrases[phraseIndex] ?? "";
      if (display.length >= current.length) {
        timer = setTimeout(() => setPhase("holding"), holdDuration / 2);
      } else {
        timer = setTimeout(() => {
          setDisplay(current.slice(0, display.length + 1));
        }, typeSpeed);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), holdDuration);
    } else if (phase === "deleting") {
      if (display.length <= 0) {
        // Wrap in a microtask to avoid synchronous setState in effect body.
        Promise.resolve().then(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          setPhase("typing");
        });
      } else {
        timer = setTimeout(() => {
          setDisplay(display.slice(0, -1));
        }, deleteSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [display, phase, phraseIndex, phrases, typeSpeed, deleteSpeed, holdDuration, delay]);

  return (
    <span className={className} aria-live="polite">
      {display}
      {phase !== "static" && <TerminalCursor />}
    </span>
  );
}

/**
 * A vertical or horizontal stream of pseudo-random binary/hex characters.
 * Used as a subtle background decoration.
 */
export function BinaryStream({
  rows = 12,
  cols = 8,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  const lines = Array.from({ length: rows }, (_, i) => {
    const chars = Array.from({ length: cols }, () =>
      Math.random() > 0.5 ? "1" : "0"
    ).join("");
    const hex = parseInt(chars, 2).toString(16).padStart(Math.ceil(cols / 4), "0");
    return { bin: chars, hex, opacity: 0.15 + (i / rows) * 0.5 };
  });

  return (
    <div
      aria-hidden
      className={`font-mono text-[10px] leading-relaxed select-none ${className ?? ""}`}
    >
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: l.opacity }}
          transition={{ duration: 0.6, delay: i * 0.04 }}
          className="flex justify-between gap-3"
        >
          <span style={{ color: "var(--primary)" }}>{l.bin}</span>
          <span style={{ color: "var(--muted-foreground)" }}>0x{l.hex}</span>
        </motion.div>
      ))}
    </div>
  );
}
