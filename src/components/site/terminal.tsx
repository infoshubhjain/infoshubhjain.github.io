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
