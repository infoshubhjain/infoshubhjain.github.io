"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Tilt strength multiplier. 0.15 = subtle, 0.4 = strong. */
  intensity?: number;
};

export function TiltCard({
  children,
  className,
  intensity = 0.15,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  const spotlightX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const mx = useTransform(spotlightX, (v) => `${50 + v * 0.05}%`);
  const my = useTransform(spotlightY, (v) => `${50 + v * 0.05}%`);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    mouseX.set(dx);
    mouseY.set(dy);
    rotateX.set(-dy * intensity);
    rotateY.set(dx * intensity);
  }

  function onLeave() {
    mouseX.set(0);
    mouseY.set(0);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 800 } as MotionStyle}
      className={cn("group", className)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          // @ts-expect-error CSS custom properties via motion
          "--mx": mx,
          "--my": my,
        }}
        className="relative w-full h-full"
      >
        {children}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.15) 0%, transparent 60%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
