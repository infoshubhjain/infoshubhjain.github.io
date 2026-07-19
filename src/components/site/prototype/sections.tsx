"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { anton, serif } from "@/lib/prototype-fonts";
import {
  driver,
  seasonStats,
  honors,
  wins,
  directives,
  standings,
  setup,
  pitWall,
  type Win,
} from "@/lib/prototype-data";

// Values reference the team CSS vars set on the prototype root, so both
// liveries theme automatically. `onPrimary` = readable text on the primary fill.
const P = {
  rosso: "var(--pt-primary)",
  rossoDk: "var(--pt-primary-dk)",
  carbon: "var(--pt-canvas)",
  panel: "var(--pt-panel)",
  giallo: "var(--pt-accent)",
  onPrimary: "var(--pt-on-primary)",
  white: "var(--pt-white)",
  muted: "var(--pt-muted)",
  line: "var(--pt-line)",
};

/* ── primitives ─────────────────────────────────────────────── */

export function Shell({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="relative z-10 overflow-hidden px-5 py-24 backdrop-blur-md sm:px-8 sm:py-32 md:px-16"
      style={{ background: P.panel, borderTop: `1px solid ${P.line}` }}
    >
      {/* Racing wipe — a rosso panel sweeps off as the section enters view. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        initial={{ x: "0%" }}
        whileInView={{ x: "101%" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.75, ease: [0.85, 0, 0.15, 1] }}
        style={{ background: P.rosso }}
      />
      <div className="relative z-[1] mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectorTag({ n, label, purple }: { n: string; label: string; purple?: boolean }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span
        className="rounded px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.28em]"
        style={{ background: purple ? "rgba(168,85,247,0.9)" : P.rosso, color: purple ? "#120222" : P.onPrimary }}
      >
        {n}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: P.muted }}>
        {label}
      </span>
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${P.line}, transparent)` }} />
    </div>
  );
}

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2
      className={`${anton.className} text-5xl uppercase leading-[0.9] tracking-[0.01em] sm:text-6xl md:text-7xl`}
      style={{ color: P.white }}
    >
      {children}
    </h2>
  );
}

function AnimatedStat({ value, label, sub, delay }: { value: string; label: string; sub: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const m = value.match(/^([^\d]*)([\d.]+)(.*)$/);
    if (!m) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    const [, pre, num, post] = m;
    const target = parseFloat(num);
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const start = performance.now();
    const dur = 1100 + delay * 400;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplay(`${pre}${(target * eased).toFixed(decimals)}${post}`);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, delay]);

  return (
    <div ref={ref} className="pt-glass rounded-lg border p-4" style={{ borderColor: P.line }}>
      <div className="font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: P.muted }}>
        {label}
      </div>
      <div className={`${anton.className} mt-1 text-4xl tabular-nums`} style={{ color: P.white }}>
        {display}
      </div>
      <div className="mt-0.5 text-xs" style={{ color: P.muted }}>
        {sub}
      </div>
    </div>
  );
}

/* ── sections ───────────────────────────────────────────────── */

export function Driver() {
  return (
    <Shell id="driver">
      <SectorTag n="Sector 1" label="The Driver" />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <Heading>
            Engineer.
            <br />
            <span style={{ color: P.rosso }}>Researcher.</span>
            <br />
            <span className={`${serif.className} normal-case italic`} style={{ color: P.white }}>
              Builder.
            </span>
          </Heading>
          <p className="mt-8 max-w-xl text-lg leading-relaxed" style={{ color: "#cfcdc7" }}>
            {driver.intro}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {honors.map((h) => (
              <span
                key={h}
                className="rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider"
                style={{ borderColor: P.rosso, color: P.giallo }}
              >
                {h}
              </span>
            ))}
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {seasonStats.map((s, i) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} sub={s.sub} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </Shell>
  );
}

const POS_COLOR: Record<string, string> = { P1: "#ffd000", P2: "#c7ccd1", P3: "#cd7f32" };

function WinCard({ win, i }: { win: Win; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={(i % 2) * 0.08}>
      <motion.article
        whileHover={{ y: -4 }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="pt-glass group relative h-full overflow-hidden rounded-xl border p-6 transition-colors"
        style={{ borderColor: open ? P.rosso : P.line }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`${anton.className} text-2xl`}
                style={{ color: POS_COLOR[win.pos] ?? P.white }}
              >
                {win.pos}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: P.muted }}>
                {win.year} · {win.role}
              </span>
            </div>
            <h3 className={`${anton.className} mt-1 text-2xl uppercase`} style={{ color: P.white }}>
              {win.name}
            </h3>
          </div>
          {win.featured && (
            <span
              className="rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
              style={{ background: P.rosso, color: P.onPrimary }}
            >
              Win
            </span>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed" style={{ color: "#cfcdc7" }}>
          <span style={{ color: P.giallo }}>Circuit · </span>
          {win.circuit}
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: P.muted }}>
          <span style={{ color: P.giallo }}>Setup · </span>
          {win.setup}
        </p>

        <div className="mt-4 flex items-center gap-2 font-mono text-[11px]" style={{ color: P.white }}>
          <span
            className="rounded px-1.5 py-0.5"
            style={{ background: "rgba(46,229,107,0.15)", color: "#2ee56b" }}
          >
            ⚑ FL
          </span>
          <span style={{ color: "#cfcdc7" }}>{win.gap}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {win.tech.map((t) => (
            <span
              key={t}
              className="rounded border px-2 py-0.5 font-mono text-[10px]"
              style={{ borderColor: P.line, color: P.muted }}
            >
              {t}
            </span>
          ))}
        </div>

        {(win.demo || win.github) && (
          <div className="mt-4 flex gap-4 font-mono text-[11px] uppercase tracking-wider">
            {win.demo && (
              <a href={win.demo} target="_blank" rel="noreferrer" style={{ color: P.rosso }}>
                ↗ demo
              </a>
            )}
            {win.github && (
              <a href={win.github} target="_blank" rel="noreferrer" style={{ color: P.muted }}>
                ↗ source
              </a>
            )}
          </div>
        )}
        {/* checkered accent on hover */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left transition-transform duration-300"
          style={{ background: P.rosso, transform: open ? "scaleX(1)" : "scaleX(0)" }}
        />
      </motion.article>
    </Reveal>
  );
}

export function Wins() {
  return (
    <Shell id="wins">
      <SectorTag n="Sector 2" label="Race Wins — Projects" purple />
      <Reveal>
        <Heading>
          Things I&apos;ve <span style={{ color: P.rosso }}>shipped</span> at the{" "}
          <span className={`${serif.className} normal-case italic`}>limit.</span>
        </Heading>
        <p className="mt-6 max-w-2xl text-lg" style={{ color: P.muted }}>
          Every project is a race result — the problem is the circuit, the approach is the setup, and the
          measured impact is the gap to the field.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {wins.map((w, i) => (
          <WinCard key={w.id} win={w} i={i} />
        ))}
      </div>
    </Shell>
  );
}

export function Directives() {
  const badge: Record<string, string> = { Patent: P.giallo, Paper: P.rosso, Book: "#a855f7" };
  return (
    <Shell id="directives">
      <SectorTag n="Sector 3" label="Technical Directives — Research" />
      <Reveal>
        <Heading>
          Published from the <span style={{ color: P.rosso }}>R&amp;D</span> bay.
        </Heading>
      </Reveal>
      <div className="mt-10 space-y-3">
        {directives.map((d, i) => (
          <Reveal key={d.title} delay={i * 0.05}>
            <div
              className="pt-glass grid gap-3 rounded-xl border p-5 sm:grid-cols-[auto_1fr] sm:items-center"
              style={{ borderColor: P.line }}
            >
              <div className="flex items-center gap-3 sm:w-40 sm:flex-col sm:items-start">
                <span
                  className="rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: badge[d.kind], color: "#0a0a0b" }}
                >
                  {d.kind}
                </span>
                <span className="font-mono text-[11px]" style={{ color: P.muted }}>
                  {d.venue} · {d.year}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: P.white }}>
                  {d.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: P.muted }}>
                  {d.note}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

export function Standings() {
  return (
    <Shell id="standings">
      <SectorTag n="Sector 4" label="Career Standings — Experience" purple />
      <Reveal>
        <Heading>
          The <span style={{ color: P.rosso }}>season</span> so far.
        </Heading>
      </Reveal>
      <div className="mt-10">
        {standings.map((s, i) => (
          <Reveal key={s.team} delay={i * 0.04}>
            <div
              className="grid grid-cols-[auto_1fr] items-baseline gap-4 border-b py-5 sm:grid-cols-[3rem_12rem_1fr]"
              style={{ borderColor: P.line }}
            >
              <span className={`${anton.className} text-3xl`} style={{ color: P.rosso }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="font-semibold" style={{ color: P.white }}>
                  {s.team}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: P.giallo }}>
                  {s.role} · {s.period}
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: P.muted }}>
                {s.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

export function Setup() {
  return (
    <Shell id="setup">
      <SectorTag n="Sector 5" label="Car Setup — Skills" />
      <Reveal>
        <Heading>
          The <span style={{ color: P.rosso }}>build sheet.</span>
        </Heading>
        <p className="mt-6 max-w-2xl text-lg" style={{ color: P.muted }}>
          Every system on the car, tuned. Drag isn&apos;t optional — the whole package has to work together.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {setup.map((u, i) => (
          <Reveal key={u.unit} delay={i * 0.05}>
            <div className="pt-glass rounded-xl border p-5" style={{ borderColor: P.line }}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: P.rosso }} />
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: P.white }}>
                  {u.unit}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {u.parts.map((part) => (
                  <span
                    key={part}
                    className="rounded-md border px-2 py-1 text-xs transition-colors hover:border-current"
                    style={{ borderColor: P.line, color: "#cfcdc7" }}
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

export function PitWall() {
  return (
    <Shell id="pitwall">
      <SectorTag n="Sector 6" label="The Pit Wall — Leadership" purple />
      <Reveal>
        <Heading>
          Calling the <span style={{ color: P.rosso }}>strategy.</span>
        </Heading>
        <p className="mt-6 max-w-2xl text-lg" style={{ color: P.muted }}>
          Races aren&apos;t won by drivers alone. 200+ people, six cities, tens of thousands reached.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pitWall.map((r, i) => (
          <Reveal key={r.org} delay={(i % 3) * 0.06}>
            <div
              className="pt-glass h-full rounded-xl border p-5"
              style={{ borderColor: P.line }}
            >
              <h3 className={`${anton.className} text-xl uppercase`} style={{ color: P.white }}>
                {r.org}
              </h3>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider" style={{ color: P.giallo }}>
                {r.role}
              </div>
              <div className="mt-3 font-mono text-sm font-bold" style={{ color: P.rosso }}>
                {r.metric}
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: P.muted }}>
                {r.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

export function Radio() {
  return (
    <Shell id="radio">
      <SectorTag n="Box, box" label="Team Radio — Contact" />
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <Heading>
            Let&apos;s go <span style={{ color: P.rosso }}>racing.</span>
          </Heading>
          <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ color: P.muted }}>
            Open to internships, research collaborations, and ambitious builds. Radio in — I usually reply
            within a day.
          </p>
          <div className="mt-8 space-y-3 font-mono text-sm">
            {[
              { k: "email", v: driver.email, href: `mailto:${driver.email}` },
              { k: "github", v: "github.com/infoshubhjain", href: driver.github },
              { k: "linkedin", v: "in/infoshubhjain", href: driver.linkedin },
              { k: "grid", v: driver.grid, href: undefined },
            ].map((row) => (
              <div key={row.k} className="flex items-center gap-4 border-b pb-3" style={{ borderColor: P.line }}>
                <span className="w-20 uppercase tracking-[0.2em]" style={{ color: P.muted }}>
                  {row.k}
                </span>
                {row.href ? (
                  <a href={row.href} target="_blank" rel="noreferrer" style={{ color: P.white }}>
                    {row.v}
                  </a>
                ) : (
                  <span style={{ color: P.white }}>{row.v}</span>
                )}
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="pt-glass rounded-xl border p-6" style={{ borderColor: P.rosso }}>
            <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: P.rosso }}>
              <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: P.rosso }} />
              radio channel open
            </div>
            <a
              href={`mailto:${driver.email}`}
              className={`${anton.className} block text-4xl uppercase transition-transform hover:translate-x-1 sm:text-5xl`}
              style={{ color: P.white }}
            >
              Send it →
            </a>
            <p className="mt-4 text-sm" style={{ color: P.muted }}>
              {driver.tagline}
            </p>
          </div>
        </Reveal>
      </div>
    </Shell>
  );
}

export function Podium() {
  return (
    <footer
      className="relative z-10 px-5 py-16 backdrop-blur-md sm:px-8 md:px-16"
      style={{ background: P.carbon, borderTop: `2px solid ${P.rosso}` }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className={`${anton.className} text-2xl uppercase`} style={{ color: P.white }}>
            Shubh Jain · <span style={{ color: P.rosso }}>#{driver.number}</span>
          </div>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: P.muted }}>
            Chequered flag · built with Next.js · Three.js · Framer Motion
          </p>
          <p className="mt-2 max-w-md text-[10px] leading-relaxed" style={{ color: P.muted }}>
            3D cars:{" "}
            <a
              href="https://sketchfab.com/3d-models/ferrari-f1-75-06454e0f23a44fcdabcc7808aee6caf9"
              target="_blank"
              rel="noreferrer"
              style={{ color: P.rosso }}
            >
              &ldquo;Ferrari F1-75&rdquo;
            </a>{" "}
            by Sketcher (CC-BY-NC-4.0); Red Bull RB18 via FetchCFD. Fan homage — not affiliated with either team.
          </p>
        </div>
        {/* checkered flag strip */}
        <div className="flex h-8 overflow-hidden rounded">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="h-full w-4"
              style={{ background: i % 2 === 0 ? P.white : P.carbon, borderTop: i % 2 ? `1px solid ${P.line}` : "none" }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
