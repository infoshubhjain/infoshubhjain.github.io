"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@01";

/**
 * Text that scrambles through random glyphs and resolves left-to-right.
 * Wrap any mono/label text: <Scramble>projects</Scramble>
 * Triggers on hover by default; pass `trigger="mount"` to play once on mount.
 */
export function Scramble({
  children,
  trigger = "hover",
  className,
}: {
  children: string;
  trigger?: "hover" | "mount";
  className?: string;
}) {
  const [display, setDisplay] = useState(children);
  const raf = useRef(0);

  const play = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    // Each char resolves after i * 30ms; scrambles at ~60fps until then.
    const duration = 30;
    const step = (now: number) => {
      const elapsed = now - start;
      let out = "";
      let settled = true;
      for (let i = 0; i < children.length; i++) {
        if (children[i] === " " || elapsed >= (i + 1) * duration) {
          out += children[i];
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          settled = false;
        }
      }
      setDisplay(out);
      if (!settled) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [children]);

  useEffect(() => {
    if (trigger === "mount") play();
    return () => cancelAnimationFrame(raf.current);
  }, [trigger, play]);

  return (
    <span
      className={className}
      onMouseEnter={trigger === "hover" ? play : undefined}
      aria-label={children}
    >
      {display}
    </span>
  );
}
