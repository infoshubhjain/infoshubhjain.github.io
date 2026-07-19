"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live telemetry HUD driven by scroll velocity (speedRef 0..1).
 * Scroll fast → speed spikes, gears climb, DRS opens. Scroll = throttle.
 */

const PAPAYA = "var(--pt-primary)";
const BLUE = "var(--pt-accent)";
const GREEN = "#2ee56b";

type SpeedRef = React.MutableRefObject<number>;

export function TelemetryHud({ speedRef }: { speedRef: SpeedRef }) {
  const [kmh, setKmh] = useState(0);
  const [gear, setGear] = useState(1);
  const [drs, setDrs] = useState(false);
  const [throttle, setThrottle] = useState(0);
  const smooth = useRef(0);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      // ease displayed speed toward the raw scroll speed
      smooth.current += (speedRef.current - smooth.current) * 0.12;
      const s = smooth.current;
      setKmh(Math.round(s * 342));
      setGear(Math.max(1, Math.min(8, Math.ceil(s * 8))));
      setDrs(s > 0.62);
      setThrottle(Math.round(s * 100));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speedRef]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-5 pb-5 font-mono sm:px-8 sm:pb-7">
      <div
        className="pt-glass mx-auto flex w-full max-w-6xl items-end justify-between gap-4 rounded-t-xl border-t border-white/10 px-4 py-3 sm:px-6"
        style={{ boxShadow: "0 -20px 60px -30px rgba(0,0,0,0.9)" }}
      >
        {/* Speed */}
        <div className="flex items-baseline gap-2">
          <span className="tabular-nums text-4xl font-bold leading-none text-white sm:text-6xl">
            {kmh.toString().padStart(3, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-xs">km/h</span>
        </div>

        {/* Gear */}
        <div className="hidden flex-col items-center sm:flex">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">gear</span>
          <span className="text-3xl font-bold leading-none" style={{ color: PAPAYA }}>
            {gear}
          </span>
        </div>

        {/* Throttle bar */}
        <div className="hidden flex-1 flex-col gap-1 md:flex">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-white/40">
            <span>throttle</span>
            <span className="tabular-nums text-white/70">{throttle}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-100"
              style={{ width: `${throttle}%`, background: `linear-gradient(90deg, ${GREEN}, ${PAPAYA})` }}
            />
          </div>
        </div>

        {/* DRS */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">drs</span>
          <span
            className="rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors"
            style={
              drs
                ? { background: GREEN, color: "#04140a" }
                : { border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.4)" }
            }
          >
            {drs ? "open" : "—"}
          </span>
        </div>

        {/* Tyre */}
        <div className="hidden flex-col items-center sm:flex">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">tyre</span>
          <span className="flex items-center gap-1 text-xs font-bold text-white">
            <span className="inline-block h-3 w-3 rounded-full border-2" style={{ borderColor: PAPAYA }} />
            SOFT
          </span>
        </div>

        {/* Sectors */}
        <div className="hidden items-center gap-1 lg:flex">
          {["S1", "S2", "S3"].map((s, i) => (
            <span
              key={s}
              className="rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
              style={{
                background: i === 1 ? "rgba(180,80,255,0.85)" : GREEN,
                color: "#04140a",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-1 flex max-w-6xl items-center justify-between px-1 text-[9px] uppercase tracking-[0.3em] text-white/30">
        <span style={{ color: BLUE }}>● live telemetry</span>
        <span>scroll = throttle</span>
      </div>
    </div>
  );
}
