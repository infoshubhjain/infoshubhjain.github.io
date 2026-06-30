"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  /** Max tilt in degrees. */
  max?: number;
  /** Glow spotlight follows cursor. */
  spotlight?: boolean;
  className?: string;
};

/**
 * A card that tilts in 3D toward the cursor with an optional spotlight glow.
 */
export function TiltCard({
  children,
  max = 8,
  spotlight = true,
  className,
  ...rest
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), {
    stiffness: 220,
    damping: 22,
  });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px);
    my.set(py);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  }

  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn(
        "relative [transform-style:preserve-3d]",
        spotlight && "spotlight",
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
