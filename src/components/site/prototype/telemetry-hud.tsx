"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live telemetry HUD driven by scroll velocity (speedRef 0..1).
 * Scroll fast → speed spikes, gears climb, DRS opens. Scroll = throttle.
 */

const PAPAYA = "var(--pt-primary)";
const BLUE = "var(--pt-accent)";
const GREEN = "#2ee56b";
const PURPLE = "rgba(180,80,255,0.9)";

// A 3-stint race strategy across the page — real F1 compound colours.
const COMPOUNDS = [
  { name: "SOFT", color: "#ff3b3b" },
  { name: "MEDIUM", color: "#ffd93b" },
  { name: "HARD", color: "#f5f3ee" },
] as const;

type SpeedRef = React.MutableRefObject<number>;

export function TelemetryHud({ speedRef }: { speedRef: SpeedRef }) {
  // The speed/gear/DRS/throttle readouts update every animation frame while
  // scrolling. Driving them through state re-rendered this whole bar 60×/s, so
  // the loop writes to the DOM nodes directly; only `stint` — which changes
  // twice down the entire page — stays in React.
  const kmhEl = useRef<HTMLSpanElement>(null);
  const gearEl = useRef<HTMLSpanElement>(null);
  const drsEl = useRef<HTMLSpanElement>(null);
  const thrTextEl = useRef<HTMLSpanElement>(null);
  const thrBarEl = useRef<HTMLDivElement>(null);
  const [stint, setStint] = useState(0); // 0..2 — which third of the page
  // The bar is fixed to the bottom and was clipping card text on every section.
  // It slides away while you read and returns the moment you scroll.
  const [active, setActive] = useState(false);

  useEffect(() => {
    let raf = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    let smooth = 0;
    let lastDrs: boolean | null = null;

    const paint = () => {
      // ease displayed speed toward the raw scroll speed
      smooth += (speedRef.current - smooth) * 0.12;
      const s = smooth;
      const throttle = Math.round(s * 100);
      const drs = s > 0.62;
      if (kmhEl.current) kmhEl.current.textContent = String(Math.round(s * 342)).padStart(3, "0");
      if (gearEl.current) gearEl.current.textContent = String(Math.max(1, Math.min(8, Math.ceil(s * 8))));
      if (thrTextEl.current) thrTextEl.current.textContent = `${throttle}%`;
      if (thrBarEl.current) thrBarEl.current.style.width = `${throttle}%`;
      if (drsEl.current && drs !== lastDrs) {
        lastDrs = drs;
        drsEl.current.textContent = drs ? "open" : "—";
        Object.assign(drsEl.current.style, drs
          ? { background: GREEN, color: "#04140a", border: "none" }
          : { background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.2)" });
      }
    };

    const loop = () => {
      paint();
      raf = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      // Drive the loop only while scrolling (+ a short settle window after).
      // When idle the values have already converged to 0, so pausing is invisible.
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
      clearTimeout(idle);
      setActive(true);
      idle = setTimeout(() => {
        running = false;
        cancelAnimationFrame(raf);
        setActive(false);
      }, 1200);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setStint(Math.min(2, Math.floor(progress * 3))); // React bails out when unchanged
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speedRef]);

  const compound = COMPOUNDS[stint];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-5 pb-5 font-mono transition-[transform,opacity] duration-500 sm:px-8 sm:pb-7"
      style={{ transform: active ? "translateY(0)" : "translateY(115%)", opacity: active ? 1 : 0 }}
      aria-hidden={!active}
    >
      <div
        className="pt-glass mx-auto flex w-full max-w-6xl items-end justify-between gap-4 rounded-t-xl border-t border-white/10 px-4 py-3 sm:px-6"
        style={{ boxShadow: "0 -20px 60px -30px rgba(0,0,0,0.9)" }}
      >
        {/* Speed */}
        <div className="flex items-baseline gap-2">
          <span ref={kmhEl} className="tabular-nums text-4xl font-bold leading-none text-white sm:text-6xl">
            000
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-xs">km/h</span>
        </div>

        {/* Gear */}
        <div className="hidden flex-col items-center sm:flex">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">gear</span>
          <span ref={gearEl} className="text-3xl font-bold leading-none" style={{ color: PAPAYA }}>
            1
          </span>
        </div>

        {/* Throttle bar */}
        <div className="hidden flex-1 flex-col gap-1 md:flex">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-white/40">
            <span>throttle</span>
            <span ref={thrTextEl} className="tabular-nums text-white/70">
              0%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              ref={thrBarEl}
              className="h-full rounded-full transition-[width] duration-100"
              style={{ width: "0%", background: `linear-gradient(90deg, ${GREEN}, ${PAPAYA})` }}
            />
          </div>
        </div>

        {/* DRS */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">drs</span>
          <span
            ref={drsEl}
            className="rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.4)" }}
          >
            —
          </span>
        </div>

        {/* Tyre — compound changes per stint as you progress (SOFT→MEDIUM→HARD) */}
        <div className="hidden flex-col items-center sm:flex">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">
            tyre · stint {stint + 1}/3
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-white">
            <span
              className="inline-block h-3 w-3 rounded-full border-2 transition-colors"
              style={{ borderColor: compound.color }}
            />
            {compound.name}
          </span>
        </div>

        {/* Sectors — light purple (current) then green (done) as you scroll */}
        <div className="hidden items-center gap-1 lg:flex">
          {["S1", "S2", "S3"].map((s, i) => {
            const done = stint > i;
            const current = stint === i;
            return (
              <span
                key={s}
                className="rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums transition-colors"
                style={{
                  background: done ? GREEN : current ? PURPLE : "rgba(255,255,255,0.12)",
                  color: done || current ? "#04140a" : "rgba(255,255,255,0.5)",
                }}
              >
                {s}
              </span>
            );
          })}
        </div>
      </div>
      <div className="mx-auto mt-1 flex max-w-6xl items-center justify-between px-1 text-[9px] uppercase tracking-[0.3em] text-white/30">
        <span style={{ color: BLUE }}>● live telemetry</span>
        <span>scroll = throttle</span>
      </div>
    </div>
  );
}
