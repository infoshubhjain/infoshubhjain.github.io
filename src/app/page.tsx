"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, FileDown, ArrowRight } from "lucide-react";
import { F1Scene } from "@/components/site/prototype/f1-scene";
import { TelemetryHud } from "@/components/site/prototype/telemetry-hud";
import {
  Driver,
  Wins,
  Directives,
  Setup,
  PitWall,
  Radio,
  Podium,
} from "@/components/site/prototype/sections";
import { EngineAudio } from "@/components/site/prototype/engine-audio";
import { Telemetry } from "@/components/site/prototype/telemetry-charts";
import { EasterEggs } from "@/components/site/prototype/easter-eggs";
import { StrategyBoard } from "@/components/site/prototype/timeline";
import { CircuitMap } from "@/components/site/prototype/circuit-map";
import { TimingTower } from "@/components/site/prototype/timing-tower";
import { F1Loader } from "@/components/site/prototype/f1-loader";
import { GridRun } from "@/components/site/prototype/grid-run";
import { anton, serif, grotesk } from "@/lib/prototype-fonts";
import { driver, seasonStats } from "@/lib/prototype-data";
import { usePrefersReducedMotion, useMediaQuery } from "@/lib/hooks/use-media-query";
import { useSmoothScroll } from "@/lib/hooks/use-smooth-scroll";
import { PALETTES, type TeamId } from "@/lib/prototype-theme";

const ROSSO = "var(--pt-primary)";
const CARBON = "var(--pt-canvas)";
const GIALLO = "var(--pt-accent)";
const WHITE = "var(--pt-white)";
const MUTED = "var(--pt-muted)";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Filmic overlay: soft vignette + subtle film grain. */
function CinematicOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 220px 50px rgba(0,0,0,0.6)" }} />
      <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
    </div>
  );
}


/** F1 "swipe" flash on team change — a skewed colour panel in the incoming
 *  team's colour sweeps across and fades, branding the swap. Remounted via a
 *  changing `key` so each toggle replays it. */
function TeamWipe({ team }: { team: TeamId }) {
  const p = PALETTES[team];
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.72, times: [0, 0.22, 0.5, 1], ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-y-0 -left-1/4 w-[150%] -skew-x-12"
        style={{ background: p.vars["--pt-primary"] }}
        initial={{ x: "-30%" }}
        animate={{ x: ["-30%", "0%", "30%"] }}
        transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
      />
      <span
        className={`${anton.className} relative text-[12vw] uppercase leading-none`}
        style={{ color: p.vars["--pt-on-primary"] }}
      >
        {p.label}
      </span>
    </motion.div>
  );
}

function TeamToggle({ team, onChange }: { team: TeamId; onChange: (t: TeamId) => void }) {
  return (
    <div className="pointer-events-auto pt-glass fixed left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border p-1.5 sm:top-6" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
      {(["ferrari", "redbull"] as TeamId[]).map((t) => {
        const active = team === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className="whitespace-nowrap rounded-full px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-colors sm:px-6 sm:py-2.5 sm:text-sm sm:tracking-[0.18em]"
            style={{
              background: active ? "var(--pt-primary)" : "transparent",
              color: active ? "var(--pt-on-primary)" : "var(--pt-muted)",
            }}
            aria-pressed={active}
          >
            {PALETTES[t].label}
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const reduced = usePrefersReducedMotion();
  const mobile = useMediaQuery("(max-width: 768px)");
  const [launched, setLaunched] = useState(false);
  const [team, setTeam] = useState<TeamId>("redbull");
  const [racing, setRacing] = useState(false);
  const speedRef = useRef(0);
  useSmoothScroll();

  useEffect(() => {
    const saved = localStorage.getItem("pt-team");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "ferrari" || saved === "redbull") setTeam(saved);
  }, []);

  // `flash.n` is a nonce that remounts TeamWipe so its animation replays.
  const [flash, setFlash] = useState<{ team: TeamId; n: number } | null>(null);
  const changeTeam = (t: TeamId) => {
    if (t === team) return;
    setTeam(t);
    localStorage.setItem("pt-team", t);
    if (!reduced) setFlash((f) => ({ team: t, n: (f?.n ?? 0) + 1 }));
  };

  const palette = PALETTES[team];

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY);
      const dt = Math.max(1, now - lastT);
      speedRef.current = Math.max(speedRef.current, Math.min(1, dy / dt / 2.4));
      lastY = window.scrollY;
      lastT = now;
    };
    const decay = () => {
      speedRef.current *= 0.9;
      raf = requestAnimationFrame(decay);
    };
    raf = requestAnimationFrame(decay);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <main className={`pt-root ${grotesk.className}`} style={{ ...palette.vars, background: CARBON, color: WHITE } as React.CSSProperties}>
      {/* Liquid-glass refraction filter (referenced by .pt-glass backdrop-filter) */}
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <filter id="glassRefract" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="7" result="n" />
          <feGaussianBlur in="n" stdDeviation="1.2" result="sn" />
          <feDisplacementMap in="SourceGraphic" in2="sn" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <AnimatePresence>
        {!launched && <F1Loader key="f1-loader" onDone={() => setLaunched(true)} />}
      </AnimatePresence>

      {/* F1 endless-runner minigame — launched from the hero Drive button */}
      <AnimatePresence>
        {racing && <GridRun key="grid-run" team={team} onExit={() => setRacing(false)} />}
      </AnimatePresence>

      {/* Mount the heavy 3D scene only after the loader — keeps the launch sequence
          smooth (no timer starvation) and crossfades the car in. */}
      {launched && (
        <div style={{ animation: "ptFade 1s ease" }}>
          <F1Scene speedRef={speedRef} reduced={reduced} colors={palette.three} mobile={mobile} />
        </div>
      )}
      <CinematicOverlay />
      <TelemetryHud speedRef={speedRef} />
      <CircuitMap />
      <EngineAudio speedRef={speedRef} />
      <TeamToggle team={team} onChange={changeTeam} />
      {flash && <TeamWipe key={flash.n} team={flash.team} />}
      <EasterEggs speedRef={speedRef} team={team} />

      {/* Broadcast chrome — hidden on phones (toggle carries the team identity there) */}
      <div className="pointer-events-none fixed inset-0 z-20 hidden sm:block">
        <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-8 sm:top-8">
          <span className={`${anton.className} text-lg uppercase`} style={{ color: ROSSO }}>
            {palette.label} <span style={{ color: WHITE }}>·{driver.number}</span>
          </span>
          <span className="h-4 w-px bg-white/20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            Round 01 · Urbana GP
          </span>
        </div>
        <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 sm:right-8 sm:top-8">
          {driver.name}
        </div>
      </div>

      {/* Hero — the grid */}
      <section className="relative z-10 flex min-h-screen flex-col justify-center px-5 pb-28 pt-20 sm:px-8 sm:pb-0 sm:pt-0 md:px-16">
        {/* Mobile legibility scrim — dims the car behind the hero text on phones */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 sm:hidden"
          style={{
            background:
              "linear-gradient(180deg, var(--pt-canvas) 14%, color-mix(in srgb, var(--pt-canvas) 55%, transparent) 46%, var(--pt-canvas) 90%)",
          }}
        />
        <motion.div
          className="relative w-full max-w-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={launched ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="lg:max-w-3xl">
          <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: ROSSO }}>
            <span className="h-2 w-2 rounded-full" style={{ background: ROSSO }} />
            {driver.role} · {driver.team}
          </div>
          <h1 className={`${anton.className} text-[19vw] uppercase leading-[0.8] tracking-[0.005em] sm:text-[15vw] md:text-[13rem]`}>
            Shubh
            <br />
            <span style={{ color: ROSSO }}>Jain</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed sm:text-2xl" style={{ color: "#d6d4ce" }}>
            {driver.tagline} <span className={`${serif.className} italic`}>Built from first principles.</span>
          </p>
          {/* Credentials */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.18em]" style={{ color: MUTED }}>
            <span><span style={{ color: WHITE }}>CS @ UIUC</span> · grad May 2029</span>
            <span><span style={{ color: WHITE }}>3.83</span> CGPA</span>
            <span style={{ color: GIALLO }}>Dean&apos;s List · James Scholar</span>
          </div>
          </div>{/* /left column */}
          {/* CTAs — Résumé + Drive are the two focal actions; the rest is secondary. */}
          <div className="flex flex-col items-stretch gap-3 lg:w-80 lg:shrink-0">
            {/* Résumé — biggest, boldest */}
            <a
              href={driver.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={`${anton.className} group flex items-center justify-between gap-3 rounded-2xl px-6 py-4 text-2xl uppercase tracking-wide shadow-lg transition-transform hover:-translate-y-0.5`}
              style={{ background: ROSSO, color: "var(--pt-on-primary)" }}
            >
              <span className="flex items-center gap-3"><FileDown className="h-6 w-6" /> Résumé</span>
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </a>
            {/* Drive — same prominence, the game */}
            <button
              onClick={() => setRacing(true)}
              className={`${anton.className} group flex items-center justify-between gap-3 rounded-2xl px-6 py-4 text-2xl uppercase tracking-wide shadow-lg transition-transform hover:-translate-y-0.5`}
              style={{ background: GIALLO, color: "var(--pt-canvas)" }}
            >
              <span className="flex items-center gap-3"><span className="text-xl leading-none">▶</span> Drive</span>
              <span className="rounded-md bg-black/20 px-2 py-1 font-mono text-[10px] font-bold tracking-normal">GAME</span>
            </button>
            {/* Secondary — less focus */}
            <div className="mt-1 flex items-center justify-between gap-2">
              <button
                onClick={() => goTo("wins")}
                className="pt-glass inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5"
                style={{ borderColor: "var(--pt-line)", color: WHITE }}
              >
                View the work <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-2">
                {[
                  { Icon: Github, href: driver.github, label: "GitHub" },
                  { Icon: Linkedin, href: driver.linkedin, label: "LinkedIn" },
                  { Icon: Mail, href: `mailto:${driver.email}`, label: "Email" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="pt-glass flex h-10 w-10 items-center justify-center rounded-xl border transition-transform hover:-translate-y-0.5"
                    style={{ borderColor: "var(--pt-line)", color: WHITE }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          </div>{/* /hero two-column */}
          <div className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: GIALLO }}>
            ↓ &nbsp;scroll to accelerate — telemetry is live
          </div>
        </motion.div>
      </section>

      {/* Recruiter-optimized: work → skills → data → experience → research → about → leadership → contact */}
      <TimingTower />
      <Wins />
      <Setup />
      <Telemetry />
      <StrategyBoard />
      <Directives />
      <Driver />
      <PitWall />
      <Radio />
      <Podium />
    </main>
  );
}
