"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface ChromaticCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card with velocity-reactive chromatic aberration on hover.
 * The faster the cursor moves, the stronger the RGB split effect.
 */
export function ChromaticCard({ children, className }: ChromaticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const lastPos = useRef({ x: 0, y: 0, t: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    const dt = now - lastPos.current.t;

    if (dt > 0) {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const speed = Math.min(1, Math.hypot(dx, dy) / dt / 0.5);
      setVelocity(speed);
    }

    // Offset from center, normalized to -1..1
    const nx = (x / rect.width - 0.5) * 2;
    const ny = (y / rect.height - 0.5) * 2;
    setOffset({ x: nx, y: ny });
    lastPos.current = { x, y, t: now };
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    setVelocity(0);
  };

  const strength = velocity * 4;

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative" }}
    >
      {/* Red channel offset */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${offset.x * strength}px, ${offset.y * strength}px)`,
          mixBlendMode: "screen",
          opacity: velocity * 0.5,
          filter: `hue-rotate(-30deg) saturate(2)`,
          pointerEvents: "none",
          zIndex: 1,
          borderRadius: "inherit",
        }}
      />
      {/* Blue channel offset */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${-offset.x * strength}px, ${-offset.y * strength}px)`,
          mixBlendMode: "screen",
          opacity: velocity * 0.5,
          filter: `hue-rotate(30deg) saturate(2)`,
          pointerEvents: "none",
          zIndex: 1,
          borderRadius: "inherit",
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
