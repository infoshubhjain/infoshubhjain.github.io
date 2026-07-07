"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, Suspense, lazy, useState, useEffect } from "react";
import { ArrowDownRight, FileDown, Github, Linkedin, Terminal } from "lucide-react";
import { heroCopy, profile } from "@/lib/portfolio-data";
import { AnimatedText } from "../animated-text";
import { Magnetic } from "../magnetic";
import { scrollToSection } from "@/lib/hooks/use-smooth-scroll";
import { BinaryStream, RotatingTypewriter } from "../terminal";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/hooks/use-media-query";

const HeroScene = lazy(() =>
  import("../hero/hero-scene").then((m) => ({ default: m.HeroScene }))
);

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  // Skip the three.js scene on phones (battery/jank) and for reduced motion —
  // a static CSS orb stands in, and the three.js bundle never loads.
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const show3D = !isTouch && !reduced;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  // Scroll progress as a ref — passed to the Three.js scene for scroll-driven camera.
  const scrollProgressRef = useRef(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      scrollProgressRef.current = v;
    });
    return () => unsub();
  }, [scrollYProgress]);

  // Mouse parallax — depth layers for hero content.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Smoothed values for different layers (different spring stiffness = different depth).
  const layer1X = useSpring(mouseX, { stiffness: 50, damping: 20 }); // far back, slowest
  const layer1Y = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const layer2X = useSpring(mouseX, { stiffness: 80, damping: 20 }); // middle
  const layer2Y = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const layer3X = useSpring(mouseX, { stiffness: 120, damping: 20 }); // front, fastest
  const layer3Y = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalize to -1 → 1 from center.
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const yNorm = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseX.set(x * 20); // max 20px shift
    mouseY.set(yNorm * 20);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 sm:px-8"
    >
      {/* Aurora blobs — parallax layer 1 (far back, slowest) */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ x: layer1X, y: layer1Y }}
      >
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
      </motion.div>

      {/* Animated grid — parallax layer 2 */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid opacity-50"
        style={{ x: layer2X, y: layer2Y }}
      />

      {/* Three.js canvas — scroll-driven scene (desktop only; static orb on touch/reduced-motion) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-5">
        {show3D ? (
          <Suspense fallback={null}>
            <HeroScene scrollProgress={scrollProgressRef} eventSource={ref} />
          </Suspense>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div
              className="h-[48vmin] w-[48vmin] rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 36% 32%, color-mix(in oklch, var(--primary) 42%, transparent), color-mix(in oklch, var(--accent) 16%, transparent) 55%, transparent 72%)",
              }}
            />
          </div>
        )}
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

      {/* Binary stream decoration — left edge */}
      <div
        aria-hidden
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 xl:block"
      >
        <BinaryStream rows={14} cols={8} />
      </div>
      {/* Binary stream decoration — right edge */}
      <div
        aria-hidden
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 xl:block"
      >
        <BinaryStream rows={14} cols={8} />
      </div>

      <motion.div
        style={{ opacity, scale, x: layer3X, y: layer3Y }}
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Left: terminal-framed content */}
          <div className="flex flex-col gap-6">
            {/* Terminal window chrome */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex w-fit items-center gap-2.5 rounded-lg border border-border bg-background/60 px-3 py-1.5 backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-1 font-mono text-[11px] text-muted-foreground">
                <Terminal className="mr-1 inline h-3 w-3" />
                shubh@uiuc: ~/portfolio
              </span>
            </motion.div>

            {/* Command line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="font-mono text-sm text-muted-foreground"
            >
              <span className="text-primary">$</span>{" "}
              <span className="text-foreground/80">whoami</span>{" "}
              <span className="text-muted-foreground/60">--verbose</span>
            </motion.div>

            {/* THE NAME — big, sharp, with typing cursor */}
            <h1 className="font-display text-balance text-6xl font-bold leading-[0.92] tracking-tight sm:text-7xl md:text-8xl xl:text-[7rem]">
              <span className="block text-foreground text-glow-primary">
                SHUBH JAIN
              </span>
              <span className="mt-2 block font-mono text-2xl font-medium text-primary sm:text-3xl md:text-4xl">
                <RotatingTypewriter
                  phrases={[
                    "CS @ UIUC",
                    "AI Researcher",
                    "Multi-Agent Builder",
                    "DistilBERT Engineer",
                    "Bayesian KT Author",
                    "2× Published Author",
                  ]}
                  typeSpeed={65}
                  deleteSpeed={30}
                  holdDuration={1600}
                  delay={1200}
                />
              </span>
            </h1>

            {/* Tagline as a code comment */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-sm text-muted-foreground"
            >
              <span className="text-muted-foreground/60">{"// "}</span>
              <span className="text-foreground/90">
                Building ambitious AI systems. Shipping research. Leading at scale.
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {heroCopy.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <Magnetic strength={0.3}>
                <button
                  onClick={() => scrollToSection("projects")}
                  data-cursor-label="View"
                  className="group relative inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-mono text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
                >
                  <span className="text-primary-foreground/70">./</span>
                  view_projects
                  <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </button>
              </Magnetic>

              <Magnetic strength={0.3}>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3 font-mono text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-card/60"
                >
                  <span className="text-muted-foreground">~</span>
                  connect
                </button>
              </Magnetic>

              <Magnetic strength={0.3}>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3 font-mono text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:border-accent/50 hover:bg-card/60"
                  data-cursor-label="PDF"
                >
                  <FileDown className="h-4 w-4" />
                  resume.pdf
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

            {/* Stats strip — terminal log style */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            >
              {heroCopy.stats.map((s, i) => (
                <StatPill key={s.label} value={s.value} suffix={s.suffix} label={s.label} index={i} />
              ))}
            </motion.div>
          </div>

          {/* Right: terminal HUD readout */}
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <TerminalHUD />
          </motion.aside>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => scrollToSection("about")}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:flex"
          aria-label="Scroll to about"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
            scroll
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

function TerminalHUD() {
  return (
    <div className="relative rounded-2xl liquid-glass-strong scanlines overflow-hidden">
      {/* Terminal title bar */}
      <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          system_status.sh
        </span>
      </div>

      {/* Terminal body */}
      <div className="relative p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            $ ./status
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            online
          </span>
        </div>

        <div className="space-y-3 font-mono text-sm">
          <TerminalRow label="user" value="shubh_jain" />
          <TerminalRow label="role" value="CS @ UIUC" />
          <TerminalRow label="focus" value="AI · Systems · Research" />
          <TerminalRow label="grad" value="May 2029" />
          <TerminalRow label="cgpa" value="3.83 / 4.0" highlight />
          <TerminalRow label="honors" value="Dean's List · James Scholar" />
          <TerminalRow
            label="pubs"
            value="2 papers · 2 books · 1 patent"
            highlight
          />
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            $ ps aux | grep active
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              "multi_agent_learning",
              "bayesian_kt",
              "distilbert_nlp",
              "rust_nn",
              "full_stack_prod",
            ].map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-card/60 px-2 py-0.5 font-mono text-[10px] font-medium text-primary/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            $ uptime
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">up</span> 6+ years coding ·{" "}
            <span className="text-primary">load</span> 0.42, 0.38, 0.31
          </div>
        </div>

        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
      </div>
    </div>
  );
}

function TerminalRow({
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
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-muted-foreground/60">→ </span>
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
      transition={{ duration: 0.5, delay: 2.2 + index * 0.06 }}
      className="rounded-xl border border-border bg-card/40 px-3 py-2.5 backdrop-blur-md transition-colors hover:border-primary/30 hover:bg-card/60"
    >
      <div className="flex items-baseline gap-0.5">
        <span className="font-display text-lg font-semibold tabular-nums text-foreground">
          {value}
        </span>
        <span className="font-mono text-[10px] font-medium text-primary">{suffix}</span>
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </motion.div>
  );
}
