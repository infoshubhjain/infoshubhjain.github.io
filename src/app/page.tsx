"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { F1Scene } from "@/components/site/prototype/f1-scene";
import { TelemetryHud } from "@/components/site/prototype/telemetry-hud";
import {
  Driver,
  Wins,
  Directives,
  Standings,
  Setup,
  PitWall,
  Radio,
  Podium,
} from "@/components/site/prototype/sections";
import { EngineAudio } from "@/components/site/prototype/engine-audio";
import { Telemetry } from "@/components/site/prototype/telemetry-charts";
import { EasterEggs } from "@/components/site/prototype/easter-eggs";
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

/** Five reds light up, then lights out — go. */
function StartLights({ onDone }: { onDone: () => void }) {
  const [lit, setLit] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 5; i++) timers.push(setTimeout(() => setLit(i), 400 + i * 480));
    timers.push(setTimeout(() => setOut(true), 400 + 6 * 480));
    timers.push(setTimeout(onDone, 400 + 6 * 480 + 650));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 transition-opacity duration-500"
      style={{ background: CARBON, opacity: out ? 0 : 1 }}
    >
      <div className="flex gap-3 sm:gap-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            {[0, 1].map((r) => (
              <span
                key={r}
                className="h-8 w-8 rounded-full transition-all duration-150 sm:h-12 sm:w-12"
                style={{
                  background: !out && lit >= i ? "#e11d1d" : "#1c1e22",
                  boxShadow: !out && lit >= i ? "0 0 24px 2px rgba(230,20,20,0.7)" : "none",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="font-mono text-xs uppercase tracking-[0.4em]" style={{ color: out ? ROSSO : MUTED }}>
        {out ? "lights out — go go go" : "formation lap"}
      </span>
    </div>
  );
}

/** Right-edge lap-progress rail tied to scroll. */
function LapRail() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex">
      <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: MUTED }}>
        Lap
      </span>
      <div className="relative h-48 w-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
        <motion.div
          className="absolute inset-x-0 top-0 origin-top rounded-full"
          style={{ height: "100%", scaleY: scrollYProgress, background: `linear-gradient(${GIALLO}, ${ROSSO})` }}
        />
      </div>
      <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: MUTED }}>
        58
      </span>
    </div>
  );
}

function TeamToggle({ team, onChange }: { team: TeamId; onChange: (t: TeamId) => void }) {
  return (
    <div className="pointer-events-auto pt-glass fixed right-5 bottom-28 z-30 flex items-center gap-1 rounded-full border p-1 sm:right-8 sm:bottom-32" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
      {(["ferrari", "redbull"] as TeamId[]).map((t) => {
        const active = team === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className="rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
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
  const [team, setTeam] = useState<TeamId>("ferrari");
  const speedRef = useRef(0);
  useSmoothScroll();

  useEffect(() => {
    const saved = localStorage.getItem("pt-team");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "ferrari" || saved === "redbull") setTeam(saved);
  }, []);

  const changeTeam = (t: TeamId) => {
    setTeam(t);
    localStorage.setItem("pt-team", t);
  };

  const palette = PALETTES[team];

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
      {!launched && <StartLights onDone={() => setLaunched(true)} />}

      <F1Scene speedRef={speedRef} reduced={reduced} colors={palette.three} mobile={mobile} />
      <CinematicOverlay />
      <TelemetryHud speedRef={speedRef} />
      <LapRail />
      <EngineAudio speedRef={speedRef} />
      <TeamToggle team={team} onChange={changeTeam} />
      <EasterEggs speedRef={speedRef} team={team} />

      {/* Broadcast chrome */}
      <div className="pointer-events-none fixed inset-0 z-20">
        <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-8 sm:top-8">
          <span className={`${anton.className} text-lg uppercase`} style={{ color: ROSSO }}>
            SCUDERIA <span style={{ color: WHITE }}>·{driver.number}</span>
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
      <section className="relative z-10 flex min-h-screen flex-col justify-center px-5 sm:px-8 md:px-16">
        <div className="max-w-4xl">
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
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: MUTED }}>
            {seasonStats.slice(0, 4).map((s) => (
              <span key={s.label}>
                <span style={{ color: WHITE }}>{s.value}</span> · {s.sub}
              </span>
            ))}
          </div>
          <div className="mt-14 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: GIALLO }}>
            ↓ &nbsp;scroll to accelerate — telemetry is live
          </div>
        </div>
      </section>

      <Driver />
      <Wins />
      <Directives />
      <Standings />
      <Setup />
      <Telemetry colors={palette.three} />
      <PitWall />
      <Radio />
      <Podium />
    </main>
  );
}
