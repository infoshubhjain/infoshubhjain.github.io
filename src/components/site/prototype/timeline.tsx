"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shell, SectorTag, Heading } from "./sections";
import { anton } from "@/lib/prototype-fonts";
import { timeline, timelineTracks, timelineSpan, type TimelineStint, type TrackId } from "@/lib/prototype-data";

const TRACK_COLOR: Record<TrackId, string> = {
  eng: "var(--pt-primary)",
  research: "var(--pt-accent)",
  lead: "#a855f7",
};

const SPAN_LEN = timelineSpan.end - timelineSpan.start + 1; // inclusive year slots
const YEARS = Array.from({ length: SPAN_LEN }, (_, i) => timelineSpan.start + i);

/** Greedy lane-packing so overlapping stints stack into rows within a track. */
function packRows(items: TimelineStint[]) {
  const sorted = [...items].sort((a, b) => a.start - b.start || a.end - b.end);
  const rowEnd: number[] = [];
  const placed = sorted.map((it) => {
    let row = rowEnd.findIndex((end) => end < it.start);
    if (row === -1) {
      row = rowEnd.length;
      rowEnd.push(it.end);
    } else {
      rowEnd[row] = it.end;
    }
    return { ...it, row };
  });
  return { placed, rowCount: Math.max(1, rowEnd.length) };
}

const ROW_H = 46; // px per stacked row
const ROW_GAP = 10;

export function StrategyBoard() {
  const [active, setActive] = useState<TimelineStint | null>(null);

  const packedByTrack = useMemo(
    () => timelineTracks.map((t) => ({ track: t, ...packRows(timeline.filter((s) => s.track === t.id)) })),
    []
  );

  const pct = (year: number) => ((year - timelineSpan.start) / SPAN_LEN) * 100;
  const span = (s: TimelineStint) => ({ left: `${pct(s.start)}%`, width: `${((s.end - s.start + 1) / SPAN_LEN) * 100}%` });

  return (
    <Shell id="timeline">
      <SectorTag n="Strategy Board" label="Strategy Board (Timeline)" />
      <div>
        <Heading>
          Four years, run <span style={{ color: "var(--pt-primary)" }}>flat out.</span>
        </Heading>
        <p className="mt-6 max-w-2xl text-lg" style={{ color: "var(--pt-muted)" }}>
          Engineering, research and leadership — running at the same time, not in sequence. Hover or tap a
          stint to read it.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto">
        <div className="min-w-[860px]">
          {/* Year axis. The milestone diamonds that used to sit here were the
              same four awards the Trophy Cabinet now lists in full — and their
              labels are wider than a year column, so they collided into an
              unreadable stack. */}
          <div className="relative mb-4 h-8">
            {YEARS.map((y, i) => (
              <div key={y} className="absolute bottom-0 top-6 border-l" style={{ left: `${(i / SPAN_LEN) * 100}%`, borderColor: "var(--pt-line)" }}>
                <span className="absolute -top-6 left-2 font-mono text-xs font-bold" style={{ color: "var(--pt-white)" }}>
                  {y}
                </span>
              </div>
            ))}
          </div>

          {/* Track lanes */}
          <div className="space-y-6">
            {packedByTrack.map(({ track, placed, rowCount }) => (
              <div key={track.id} className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: TRACK_COLOR[track.id] }} />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--pt-white)" }}>
                    {track.label}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums" style={{ color: "var(--pt-muted)" }}>
                    {placed.length}
                  </span>
                </div>
                {/* gridlines behind bars */}
                <div className="relative rounded-lg" style={{ height: rowCount * ROW_H + (rowCount - 1) * ROW_GAP }}>
                  {YEARS.map((y, i) => (
                    <div key={y} className="absolute inset-y-0 border-l" style={{ left: `${(i / SPAN_LEN) * 100}%`, borderColor: "rgba(255,255,255,0.05)" }} />
                  ))}
                  {placed.map((s) => {
                    const isActive = active === s;
                    return (
                      <motion.button
                        key={`${s.title}-${s.start}`}
                        initial={{ opacity: 0, scaleX: 0.6 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onMouseEnter={() => setActive(s)}
                        onFocus={() => setActive(s)}
                        onClick={() => setActive(s)}
                        whileHover={{ y: -2 }}
                        className="group absolute flex flex-col justify-center overflow-hidden rounded-md border px-3 text-left backdrop-blur-md transition-[border-color,opacity,box-shadow] duration-200"
                        style={{
                          ...span(s),
                          top: s.row * (ROW_H + ROW_GAP),
                          height: ROW_H,
                          transformOrigin: "left",
                          // Dim the rest while one stint is being read, so a single
                          // bar stands out of a board this dense.
                          opacity: active && !isActive ? 0.45 : 1,
                          borderColor: isActive ? TRACK_COLOR[track.id] : "var(--pt-line)",
                          background: `linear-gradient(90deg, color-mix(in srgb, ${TRACK_COLOR[track.id]} 16%, transparent), color-mix(in srgb, var(--pt-canvas) 60%, transparent))`,
                          boxShadow: isActive ? `0 8px 24px -12px ${TRACK_COLOR[track.id]}` : undefined,
                        }}
                        aria-label={s.title}
                      >
                        {/* Track-colour accent as an element, not a border-left:
                            mixing `borderColor` with a per-side border style makes
                            React warn about shorthand/longhand conflicts. */}
                        <span
                          aria-hidden
                          className="absolute inset-y-0 left-0 w-[3px]"
                          style={{ background: TRACK_COLOR[track.id] }}
                        />
                        <span className="truncate text-[13px] font-semibold leading-tight" style={{ color: "var(--pt-white)" }}>
                          {s.title}
                        </span>
                        <span className="font-mono text-[9px] tabular-nums leading-tight" style={{ color: "var(--pt-muted)" }}>
                          &apos;{String(s.start).slice(2)}
                          {s.end !== s.start ? `–'${String(s.end).slice(2)}` : ""}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active-stint detail readout */}
      {/* pt-glass, not a 2%-white wash: the 3D car sits behind this and shows
          straight through an almost-transparent panel. */}
      <div className="pt-glass mt-6 min-h-[3.5rem] rounded-xl border p-4" style={{ borderColor: "var(--pt-line)" }}>
        {active ? (
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <div className={`${anton.className} text-lg uppercase`} style={{ color: "var(--pt-white)" }}>
              {active.title}
            </div>
            <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "var(--pt-primary)" }}>
              {active.start === active.end ? active.start : `${active.start}–${active.end}`}
            </div>
            <div className="text-sm sm:flex-1" style={{ color: "var(--pt-muted)" }}>
              {active.detail}
            </div>
          </div>
        ) : (
          <div className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--pt-muted)" }}>
            ▸ hover a stint to read the details
          </div>
        )}
      </div>
    </Shell>
  );
}
