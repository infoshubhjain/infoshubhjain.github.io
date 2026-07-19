"use client";

import { wins } from "@/lib/prototype-data";

/**
 * A broadcast-style timing tower — a thin auto-scrolling leaderboard of the work,
 * running like live F1 timing between sections.
 */

const POS_COLOR: Record<string, string> = { P1: "#ffd000", P2: "#c7ccd1", P3: "#cd7f32" };

const ENTRIES = wins.map((w, i) => ({
  pos: w.pos,
  name: w.name.toUpperCase(),
  gap: i === 0 ? "LEADER" : `+${(i * 0.137 + 0.062).toFixed(3)}`,
}));

export function TimingTower() {
  const row = [...ENTRIES, ...ENTRIES]; // duplicate for a seamless loop
  return (
    <div
      className="relative z-10 overflow-hidden border-y py-2.5"
      style={{ borderColor: "var(--pt-line)", background: "var(--pt-panel)", backdropFilter: "blur(8px)" }}
      aria-hidden
    >
      <div className="flex w-max gap-8 whitespace-nowrap animate-[ticker_38s_linear_infinite]">
        {row.map((e, i) => (
          <span key={i} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em]">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold"
              style={{ background: "rgba(255,255,255,0.06)", color: POS_COLOR[e.pos] ?? "var(--pt-white)" }}
            >
              {e.pos}
            </span>
            <span style={{ color: "var(--pt-white)" }}>{e.name}</span>
            <span style={{ color: "var(--pt-muted)" }}>{e.gap}</span>
            <span style={{ color: "var(--pt-primary)" }}>/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
