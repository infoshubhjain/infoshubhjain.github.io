"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FadeIn } from "./animated-text";
import { Scramble } from "./scramble";

type SectionHeadingProps = {
  eyebrow: string;
  /** When provided, shown as a code-style file path next to the eyebrow. */
  fileLabel?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  fileLabel,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <FadeIn>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Code-style file path chip */}
          <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 font-mono text-[11px] font-medium tracking-tight">
            <span className="text-muted-foreground">/</span>
            <Scramble className="text-primary">{eyebrow.toLowerCase().replace(/\s+/g, "_")}</Scramble>
            <span className="text-muted-foreground/70">.tsx</span>
          </div>
          {fileLabel && (
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
              {fileLabel}
            </span>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <h2 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </FadeIn>

      {description && (
        <FadeIn delay={0.16}>
          <p
            className={cn(
              "max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </FadeIn>
      )}
    </div>
  );
}

type SectionShellProps = {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function SectionShell({
  id,
  children,
  className,
  containerClassName,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32",
        className
      )}
    >
      <div className={cn("mx-auto w-full max-w-7xl", containerClassName)}>
        {children}
      </div>
      {/* Subtle fade-out gradient at section top for premium separation */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </section>
  );
}
