"use client";

import { useEffect, useRef, useCallback } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface TextScrambleProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
}

export function TextScramble({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  duration = 1.2,
  stagger = 0.02,
  once = true,
}: TextScrambleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-10%" });
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (!ref.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const el = ref.current;
    const chars = text.split("");
    const totalFrames = Math.floor(duration / stagger);
    let frame = 0;

    // Pre-generate random indices for each character
    const resolveOrder = chars.map((_, i) => ({
      char: chars[i],
      resolveAt: Math.floor((i / chars.length) * totalFrames * 0.6 + Math.random() * totalFrames * 0.3),
    }));

    const tick = () => {
      if (frame >= totalFrames) {
        el.textContent = text;
        return;
      }

      const result = resolveOrder.map(({ char, resolveAt }, i) => {
        if (char === " ") return " ";
        if (frame >= resolveAt) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      el.textContent = result.join("");
      frame++;
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [text, duration, stagger]);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(animate, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [inView, animate, delay]);

  // Set initial text to scrambled state on mount
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = text
        .split("")
        .map((c) => (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join("");
    }
  }, [text]);

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
