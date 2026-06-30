"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, Suspense, lazy } from "react";
import { ArrowDownRight, Sparkles, FileDown, Github, Linkedin } from "lucide-react";
import { heroCopy, profile } from "@/lib/portfolio-data";
import { AnimatedText } from "../animated-text";
import { Magnetic } from "../magnetic";
import { scrollToSection } from "@/lib/hooks/use-smooth-scroll";

const HeroScene = lazy(() =>
  import("../hero/hero-scene").then((m) => ({ default: m.HeroScene }))
);

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 sm:px-8"
    >
      {/* Aurora blobs */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="aurora-blob left-[-10%] top-[-10%] h-[55vh] w-[55vh]"
          style={{ background: "var(--aurora-1)" }}
        />
        <div
          className="aurora-blob right-[-15%] top-[20%] h-[45vh] w-[45vh]"
          style={{ background: "var(--aurora-3)" }}
        />
        <div
          className="aurora-blob bottom-[-10%] left-[30%] h-[40vh] w-[40vh]"
          style={{ background: "var(--aurora-2)" }}
        />
      </div>

      {/* Animated grid */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-50" />

      {/* Three.js canvas */}
      <div aria-hidden className="absolute inset-0 -z-5">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Vignette so text stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 -z-5"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, color-mix(in oklch, var(--background) 80%, transparent) 70%, var(--background) 100%)",
        }}
      />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Left: text */}
          <div className="flex flex-col gap-7">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex w-fit items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary"
            >
              <Sparkles className="h-3 w-3" />
              {heroCopy.eyebrow}
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl xl:text-[5.5rem]">
              <AnimatedText
                as="span"
                className="block text-foreground"
                perWord
                stagger={0.06}
              >
                {heroCopy.headlineLines[0]}
              </AnimatedText>
              <AnimatedText
                as="span"
                className="block text-aurora"
                perWord
                stagger={0.06}
                delay={0.3}
              >
                {heroCopy.headlineLines[1]}
              </AnimatedText>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {heroCopy.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <Magnetic strength={0.3}>
                <button
                  onClick={() => scrollToSection("projects")}
                  data-cursor-label="View"
                  className="group relative inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
                >
                  View Projects
                  <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </button>
              </Magnetic>

              <Magnetic strength={0.3}>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-card/60"
                >
                  Connect With Me
                </button>
              </Magnetic>

              <Magnetic strength={0.3}>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:border-accent/50 hover:bg-card/60"
                  data-cursor-label="PDF"
                >
                  <FileDown className="h-4 w-4" />
                  Resume
                </a>
              </Magnetic>

              <div className="ml-1 hidden items-center gap-1 sm:flex">
                <Magnetic strength={0.4}>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Magnetic>
              </div>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            >
              {heroCopy.stats.map((s, i) => (
                <StatPill key={s.label} value={s.value} suffix={s.suffix} label={s.label} index={i} />
              ))}
            </motion.div>
          </div>

          {/* Right: side panel — feels like a HUD readout */}
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl border-gradient glass-strong p-6 conic-border">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  system_status
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  online
                </span>
              </div>

              <div className="space-y-4">
                <ReadoutRow label="Identity" value="CS · UIUC" />
                <ReadoutRow label="Focus" value="AI Systems · Research" />
                <ReadoutRow label="Graduation" value="May 2029" />
                <ReadoutRow label="CGPA" value="3.83 / 4.0" highlight />
                <ReadoutRow label="Honors" value="Dean's List · James Scholar" />
                <ReadoutRow label="Publications" value="2 papers · 2 books · 1 patent" highlight />
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  active_threads
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Multi-Agent Learning", "Bayesian KT", "DistilBERT NLP", "Rust NN", "Full-Stack Production"].map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-card/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
            </div>
          </motion.aside>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => scrollToSection("about")}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:flex"
          aria-label="Scroll to about"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
            Scroll
          </span>
          <span className="relative flex h-9 w-5 justify-center rounded-full border border-border pt-1.5">
            <span
              className="h-1.5 w-1 rounded-full bg-primary"
              style={{ animation: "scroll-dot 1.6s ease-in-out infinite" }}
            />
          </span>
        </motion.button>
      </motion.div>
    </section>
  );
}

function StatPill({
  value,
  suffix,
  label,
  index,
}: {
  value: string;
  suffix: string;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 + index * 0.06 }}
      className="rounded-xl border border-border bg-card/40 px-3 py-2.5 backdrop-blur-md transition-colors hover:border-primary/30 hover:bg-card/60"
    >
      <div className="flex items-baseline gap-0.5">
        <span className="font-display text-lg font-semibold tabular-nums text-foreground">
          {value}
        </span>
        <span className="text-[10px] font-medium text-primary">{suffix}</span>
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </motion.div>
  );
}

function ReadoutRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span
        className={
          highlight
            ? "text-sm font-semibold text-primary"
            : "text-sm font-medium text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}
