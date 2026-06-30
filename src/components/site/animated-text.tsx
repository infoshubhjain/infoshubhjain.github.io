"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AnimatedTextProps = {
  children: string;
  className?: string;
  delay?: number;
  /** Stagger between words in seconds. */
  stagger?: number;
  /** Animate per-word instead of per-line. */
  perWord?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

const container: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const child: Variants = {
  hidden: { y: "0.6em", opacity: 0 },
  visible: {
    y: "0em",
    opacity: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AnimatedText({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  perWord = false,
  as: Tag = "div",
}: AnimatedTextProps) {
  const units = perWord ? children.split(" ") : children.split("\n");

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={cn("inline-block", className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={stagger}
      transition={{ delayChildren: delay }}
      aria-label={children}
    >
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.08em" }}
        >
          <motion.span variants={child} className="inline-block">
            {unit}
            {perWord && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
          {!perWord && i < units.length - 1 ? "\n" : ""}
        </span>
      ))}
    </MotionTag>
  );
}

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: FadeInProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
