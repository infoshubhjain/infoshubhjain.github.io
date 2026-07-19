"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shell, SectorTag } from "./sections";
import { skillBars, careerTrace } from "@/lib/prototype-data";

/**
 * Premium animated SVG telemetry — a skill radar and a career trajectory.
 * Clean vector, themed via CSS vars, framer-motion draw-in. No WebGL.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

function Readout({ hint, title, detail }: { hint: string; title: string; detail: string }) {
  return (
    <div className="mt-4 min-h-[2.5rem] border-t pt-3 font-mono" style={{ borderColor: "var(--pt-line)" }}>
      <div className="text-[9px] uppercase tracking-[0.28em]" style={{ color: "var(--pt-muted)" }}>
        {hint}
      </div>
      <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3">
        <span className="text-sm font-bold" style={{ color: "var(--pt-white)" }}>
          {title}
        </span>
        <span className="text-xs" style={{ color: "var(--pt-muted)" }}>
          {detail}
        </span>
      </div>
    </div>
  );
}

/* ── skill radar ────────────────────────────────────────────── */

function SkillRadar() {
  const [hot, setHot] = useState<number | null>(null);
  const N = skillBars.length;
  const max = Math.max(...skillBars.map((d) => d.value));
  const C = 150;
  const R = 100;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const pt = (i: number, r: number) => [C + Math.cos(ang(i)) * r, C + Math.sin(ang(i)) * r] as const;

  const dataPts = skillBars.map((d, i) => pt(i, (d.value / max) * R));
  const dataPoly = dataPts.map((p) => p.join(",")).join(" ");
  const ringPoly = (f: number) =>
    skillBars.map((_, i) => pt(i, R * f).join(",")).join(" ");

  const active = hot !== null ? skillBars[hot] : null;

  return (
    <div className="pt-glass rounded-2xl border p-6" style={{ borderColor: "var(--pt-line)" }}>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--pt-muted)" }}>
        Car setup · skill channels
      </div>
      <svg viewBox="-52 -6 404 312" className="mx-auto block w-full max-w-[380px]">
        {/* grid rings */}
        {[0.4, 0.7, 1].map((f) => (
          <polygon key={f} points={ringPoly(f)} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={0.75} />
        ))}
        {/* spokes */}
        {skillBars.map((_, i) => {
          const [x, y] = pt(i, R);
          return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={0.75} />;
        })}
        {/* data polygon */}
        <motion.polygon
          points={dataPoly}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: EASE }}
          style={{ transformBox: "fill-box", transformOrigin: "center", fill: "color-mix(in srgb, var(--pt-primary) 22%, transparent)", stroke: "var(--pt-primary)", strokeWidth: 1.5 }}
        />
        {/* vertices + labels */}
        {skillBars.map((d, i) => {
          const [x, y] = dataPts[i];
          const [lx, ly] = pt(i, R + 22);
          const anchor = lx < C - 4 ? "end" : lx > C + 4 ? "start" : "middle";
          const on = hot === i;
          return (
            <g key={d.label} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} style={{ cursor: "pointer" }}>
              <motion.circle
                cx={x}
                cy={y}
                initial={{ r: 0 }}
                whileInView={{ r: on ? 5 : 3 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.06 }}
                style={{ fill: on ? "var(--pt-accent)" : "var(--pt-primary)" }}
              />
              <text x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" style={{ fontSize: 11, fontFamily: "var(--font-geist-mono), monospace", fill: on ? "var(--pt-white)" : "var(--pt-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {d.label}
              </text>
              {/* invisible hit target */}
              <circle cx={x} cy={y} r={14} fill="transparent" />
            </g>
          );
        })}
      </svg>
      <Readout hint="hover a channel" title={active ? `${active.label} · ${active.value}` : "Full setup sheet"} detail={active ? active.detail : "5 systems, tuned together"} />
    </div>
  );
}

/* ── career trajectory ──────────────────────────────────────── */

function CareerArea() {
  const [hot, setHot] = useState<number | null>(null);
  const W = 440;
  const H = 240;
  const PAD_X = 34;
  const PAD_T = 26;
  const PAD_B = 40;
  const N = careerTrace.length;
  const max = Math.max(...careerTrace.map((d) => d.value));
  const x = (i: number) => PAD_X + (i * (W - 2 * PAD_X)) / (N - 1);
  const y = (v: number) => H - PAD_B - (v / max) * (H - PAD_T - PAD_B);

  const linePath = careerTrace.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`).join(" ");
  const areaPath = `${linePath} L ${x(N - 1)} ${H - PAD_B} L ${x(0)} ${H - PAD_B} Z`;
  const active = hot !== null ? careerTrace[hot] : null;

  return (
    <div className="pt-glass rounded-2xl border p-6" style={{ borderColor: "var(--pt-line)" }}>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--pt-muted)" }}>
        Season trajectory · load per year
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--pt-primary)", stopOpacity: 0.28 }} />
            <stop offset="100%" style={{ stopColor: "var(--pt-primary)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        {/* horizontal gridlines */}
        {[0, 0.5, 1].map((f) => {
          const gy = H - PAD_B - f * (H - PAD_T - PAD_B);
          return <line key={f} x1={PAD_X} y1={gy} x2={W - PAD_X} y2={gy} stroke="rgba(255,255,255,0.06)" strokeWidth={0.75} />;
        })}
        {/* area */}
        <motion.path d={areaPath} fill="url(#areaFill)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1.2, delay: 0.3 }} />
        {/* line draw */}
        <motion.path d={linePath} fill="none" style={{ stroke: "var(--pt-primary)" }} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1.4, ease: EASE }} />
        {/* dots + year labels */}
        {careerTrace.map((d, i) => {
          const on = hot === i;
          return (
            <g key={d.year} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} style={{ cursor: "pointer" }}>
              <motion.circle cx={x(i)} cy={y(d.value)} initial={{ r: 0 }} whileInView={{ r: on ? 6 : 4 }} viewport={{ once: true }} transition={{ delay: 0.9 + i * 0.08 }} style={{ fill: on ? "var(--pt-accent)" : "var(--pt-primary)", stroke: "var(--pt-canvas)", strokeWidth: 2 }} />
              <text x={x(i)} y={H - 14} textAnchor="middle" style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", fill: on ? "var(--pt-white)" : "var(--pt-muted)" }}>
                {d.year}
              </text>
              <rect x={x(i) - 18} y={PAD_T} width={36} height={H - PAD_T - PAD_B} fill="transparent" />
            </g>
          );
        })}
      </svg>
      <Readout hint="hover a season" title={active ? active.year : "Five seasons, rising"} detail={active ? active.detail : "2022 → 2026, flat out"} />
    </div>
  );
}

/* ── section ────────────────────────────────────────────────── */

export function Telemetry() {
  return (
    <Shell id="telemetry">
      <SectorTag n="Pit Lane" label="Telemetry — the data" purple />
      <div className="max-w-2xl">
        <h2 className="text-5xl font-black uppercase italic leading-[0.95] tracking-[-0.02em] sm:text-6xl md:text-7xl" style={{ color: "var(--pt-white)" }}>
          The work, read as <span style={{ color: "var(--pt-primary)" }}>data.</span>
        </h2>
        <p className="mt-6 text-lg" style={{ color: "var(--pt-muted)" }}>
          Two readouts — the skill channels tuned across the car, and a five-season trajectory. Hover to
          read each.
        </p>
      </div>
      <div className="mt-10 grid gap-4 pb-20 lg:grid-cols-2">
        <SkillRadar />
        <CareerArea />
      </div>
    </Shell>
  );
}
