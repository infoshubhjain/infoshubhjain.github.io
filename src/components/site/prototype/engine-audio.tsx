"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Synthesized F1 power unit — no audio files. Three detuned oscillators (saw +
 * saw + sub) through a sweeping low-pass and a limiter. Toggling on fires a
 * satisfying start-up rev; after that, pitch + brightness track scroll speed,
 * so the engine revs as you scroll (scroll = throttle). Also revved by the
 * easter-egg codes. Must start on a user gesture (browser autoplay policy).
 */

type SpeedRef = React.MutableRefObject<number>;
type Nodes = {
  ctx: AudioContext;
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  sub: OscillatorNode;
  filter: BiquadFilterNode;
  gain: GainNode;
};

export function EngineAudio({ speedRef }: { speedRef: SpeedRef }) {
  const [on, setOn] = useState(false);
  const nodes = useRef<Nodes | null>(null);
  const raf = useRef(0);
  const loopStart = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => stop(), []);

  function start() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const limiter = ctx.createDynamicsCompressor();
    osc1.type = "sawtooth";
    osc2.type = "sawtooth";
    osc2.detune.value = 14;
    sub.type = "sine";
    filter.type = "lowpass";
    filter.frequency.value = 500;
    filter.Q.value = 6;
    gain.gain.value = 0.0001;
    osc1.connect(filter);
    osc2.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(limiter);
    limiter.connect(ctx.destination);

    const t = ctx.currentTime;
    // Start-up rev: crank up, blip, settle to idle.
    osc1.frequency.setValueAtTime(45, t);
    osc1.frequency.exponentialRampToValueAtTime(280, t + 0.5);
    osc1.frequency.exponentialRampToValueAtTime(60, t + 1.0);
    osc2.frequency.setValueAtTime(67, t);
    osc2.frequency.exponentialRampToValueAtTime(420, t + 0.5);
    osc2.frequency.exponentialRampToValueAtTime(90, t + 1.0);
    sub.frequency.setValueAtTime(30, t);
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(3500, t + 0.5);
    filter.frequency.exponentialRampToValueAtTime(700, t + 1.0);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.13, t + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.03, t + 1.0);

    osc1.start();
    osc2.start();
    sub.start();
    nodes.current = { ctx, osc1, osc2, sub, filter, gain };

    // Hand over to scroll-driven control once the start-up rev finishes.
    loopStart.current = setTimeout(() => {
      const loop = () => {
        const n = nodes.current;
        if (n) {
          const s = speedRef.current;
          const now = n.ctx.currentTime;
          const fund = 58 + s * 210; // idle ~58Hz → ~270Hz on throttle
          n.osc1.frequency.setTargetAtTime(fund, now, 0.06);
          n.osc2.frequency.setTargetAtTime(fund * 1.5, now, 0.06);
          n.sub.frequency.setTargetAtTime(fund * 0.5, now, 0.06);
          n.filter.frequency.setTargetAtTime(500 + s * 4200, now, 0.06);
          n.gain.gain.setTargetAtTime(0.03 + s * 0.08, now, 0.09);
        }
        raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
    }, 1000);

    setOn(true);
  }

  function stop() {
    cancelAnimationFrame(raf.current);
    if (loopStart.current) clearTimeout(loopStart.current);
    const n = nodes.current;
    if (n) {
      try {
        n.gain.gain.cancelScheduledValues(n.ctx.currentTime);
        n.gain.gain.setTargetAtTime(0, n.ctx.currentTime, 0.05);
        setTimeout(() => n.ctx.close().catch(() => {}), 250);
      } catch {
        /* noop */
      }
      nodes.current = null;
    }
    setOn(false);
  }

  return (
    <button
      onClick={() => (on ? stop() : start())}
      className="pt-glass pointer-events-auto fixed bottom-28 left-5 z-30 hidden items-center gap-2 rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors sm:flex sm:bottom-32 sm:left-8"
      style={{
        borderColor: on ? "var(--pt-primary)" : "rgba(245,243,238,0.2)",
        color: on ? "var(--pt-primary)" : "rgba(245,243,238,0.65)",
      }}
      aria-pressed={on}
      title="Engine sound — revs as you scroll"
    >
      <span
        className={on ? "animate-pulse" : ""}
        style={{ display: "inline-block", height: 8, width: 8, borderRadius: 99, background: on ? "var(--pt-primary)" : "#555" }}
      />
      {on ? "engine running" : "start engine"}
    </button>
  );
}
