"use client";

import { useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

/**
 * A stylized circuit map fixed to the right edge. As the page scrolls, a car-dot
 * travels the lap and the racing line fills in behind it. Replaces the plain lap rail.
 */

const TRACK =
  "M36 10 C 54 10 60 24 54 37 C 49 48 37 47 37 60 C 37 74 55 72 57 88 C 59 106 43 108 42 124 C 41 140 56 142 52 158 C 48 174 27 176 21 163 C 16 152 27 143 24 128 C 21 112 11 111 14 93 C 17 76 30 78 29 62 C 28 47 14 48 17 33 C 20 20 26 10 36 10 Z";

export function CircuitMap() {
  const { scrollYProgress } = useScroll();
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(v * len);
    dot.setAttribute("cx", `${pt.x}`);
    dot.setAttribute("cy", `${pt.y}`);
  });

  return (
    <div className="pointer-events-none fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
      <span className="font-mono text-[8px] uppercase tracking-[0.3em]" style={{ color: "var(--pt-muted)" }}>
        Lap
      </span>
      <svg viewBox="0 0 72 190" className="h-52 w-16" fill="none">
        {/* base track */}
        <path ref={pathRef} d={TRACK} stroke="rgba(255,255,255,0.12)" strokeWidth={4} strokeLinecap="round" />
        {/* racing line (fills with scroll) */}
        <motion.path
          d={TRACK}
          style={{ pathLength: scrollYProgress, stroke: "var(--pt-primary)" }}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        {/* start/finish */}
        <rect x={31} y={7} width={10} height={3} rx={1} fill="var(--pt-accent)" />
        {/* car dot */}
        <circle ref={dotRef} cx={36} cy={10} r={4} fill="var(--pt-primary)" stroke="var(--pt-canvas)" strokeWidth={1.5} />
      </svg>
      <span className="font-mono text-[8px] uppercase tracking-[0.3em]" style={{ color: "var(--pt-muted)" }}>
        58
      </span>
    </div>
  );
}
