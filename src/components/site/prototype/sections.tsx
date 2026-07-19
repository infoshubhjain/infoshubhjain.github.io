"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { anton, serif } from "@/lib/prototype-fonts";
import { RaceDebrief } from "./race-debrief";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
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

/** One rolling digit — a 0-9 reel that settles on the target (odometer/trip-meter feel). */
function DigitReel({ target, delay }: { target: number; delay: number }) {
  return (
    <span className="inline-block overflow-hidden" style={{ height: "1em", lineHeight: 1, verticalAlign: "bottom" }}>
      <motion.span
        className="flex flex-col"
        initial={{ y: "0em" }}
        whileInView={{ y: `-${target}em` }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n} style={{ height: "1em", lineHeight: 1 }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function Odometer({ value, baseDelay = 0 }: { value: string; baseDelay?: number }) {
  return (
    <span className="inline-flex tabular-nums" style={{ lineHeight: 1 }}>
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <DigitReel key={i} target={Number(ch)} delay={baseDelay + i * 0.06} />
        ) : (
          <span key={i} className="inline-block" style={{ height: "1em", lineHeight: 1, verticalAlign: "bottom" }}>
            {ch}
          </span>
        )
      )}
    </span>
  );
}

function AnimatedStat({ value, label, sub, delay }: { value: string; label: string; sub: string; delay: number }) {
  return (
    <div className="pt-glass rounded-lg border p-4" style={{ borderColor: P.line }}>
      <div className="font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: P.muted }}>
        {label}
      </div>
      <div className={`${anton.className} mt-1 text-4xl`} style={{ color: P.white }}>
        <Odometer value={value} baseDelay={delay} />
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
      <SectorTag n="Paddock" label="The Driver" />
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

/** Cursor-tracking specular sheen + subtle 3D tilt (Apple-style). Writes CSS vars directly (no re-render). */
function useCardFx() {
  const ref = useRef<HTMLElement>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - py) * 5}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 5}deg`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return { ref, onMouseMove, reset };
}

function WinCard({ win, i, onOpen }: { win: Win; i: number; onOpen: (w: Win) => void }) {
  const [hover, setHover] = useState(false);
  const fx = useCardFx();
  return (
    <Reveal delay={(i % 2) * 0.08}>
      <article
        ref={fx.ref as React.RefObject<HTMLElement>}
        onMouseEnter={() => setHover(true)}
        onMouseMove={fx.onMouseMove}
        onMouseLeave={() => {
          setHover(false);
          fx.reset();
        }}
        onClick={() => onOpen(win)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(win)}
        className="pt-glass group relative h-full cursor-pointer overflow-hidden rounded-xl border p-6"
        style={{
          borderColor: hover ? P.rosso : P.line,
          transform: "perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(var(--ty,0px))",
          transformStyle: "preserve-3d",
          transition: "transform 0.25s ease, border-color 0.3s ease",
          "--ty": hover ? "-4px" : "0px",
        } as React.CSSProperties}
        aria-label={`Open debrief for ${win.name}`}
      >
        {/* cursor-tracking specular sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(300px circle at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.10), transparent 55%)" }}
        />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`${anton.className} text-2xl`} style={{ color: POS_COLOR[win.pos] ?? P.white }}>
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
            <span className="rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider" style={{ background: P.rosso, color: P.onPrimary }}>
              Win
            </span>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed" style={{ color: "#cfcdc7" }}>
          {win.circuit}
        </p>

        <div className="mt-4 flex items-center gap-2 font-mono text-[11px]">
          <span className="rounded px-1.5 py-0.5" style={{ background: "rgba(46,229,107,0.15)", color: "#2ee56b" }}>
            ⚑ FL
          </span>
          <span style={{ color: "#cfcdc7" }}>{win.gap}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {win.tech.map((t) => (
            <span key={t} className="rounded border px-2 py-0.5 font-mono text-[10px]" style={{ borderColor: P.line, color: P.muted }}>
              {t}
            </span>
          ))}
        </div>

        {/* footer: debrief affordance + quick links (links stop card click) */}
        <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: P.line }}>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider" style={{ color: P.rosso }}>
            View debrief →
          </span>
          {win.links.length > 0 && (
            <div className="flex gap-3 font-mono text-[10px] uppercase tracking-wider">
              {win.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="transition-colors hover:opacity-80"
                  style={{ color: l.kind === "demo" ? P.giallo : P.muted }}
                >
                  ↗ {l.kind}
                </a>
              ))}
            </div>
          )}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left transition-transform duration-300"
          style={{ background: P.rosso, transform: hover ? "scaleX(1)" : "scaleX(0)" }}
        />
      </article>
    </Reveal>
  );
}

export function Wins() {
  const [selected, setSelected] = useState<Win | null>(null);
  const mobile = useMediaQuery("(max-width: 768px)");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [dist, setDist] = useState(0);

  useEffect(() => {
    if (mobile) return;
    const measure = () => {
      const t = trackRef.current;
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth + 64));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mobile]);

  const x = useTransform(scrollYProgress, [0.06, 0.94], [0, -dist]);

  const header = (
    <>
      <SectorTag n="Pit Lane" label="Race Wins — the projects" purple />
      <Heading>
        Things I&apos;ve <span style={{ color: P.rosso }}>shipped</span> at the{" "}
        <span className={`${serif.className} normal-case italic`}>limit.</span>
      </Heading>
      <p className="mt-5 max-w-2xl text-lg" style={{ color: P.muted }}>
        Down the pit lane — every build is a race result. Tap any car for the full debrief.
      </p>
    </>
  );

  if (mobile) {
    return (
      <Shell id="wins">
        {header}
        <div className="mt-8 grid gap-4">
          {wins.map((w, i) => (
            <WinCard key={w.id} win={w} i={i} onOpen={setSelected} />
          ))}
        </div>
        <RaceDebrief win={selected} onClose={() => setSelected(null)} />
      </Shell>
    );
  }

  const vh = 120 + wins.length * 26; // taller section → more scroll to traverse the lane
  return (
    <section
      ref={sectionRef}
      id="wins"
      className="relative z-10"
      style={{ height: `${vh}vh`, background: "var(--pt-panel)", borderTop: "1px solid var(--pt-line)" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-16">{header}</div>
        <motion.div ref={trackRef} style={{ x }} className="mt-10 flex gap-5 pl-5 pr-[32vw] will-change-transform sm:pl-8 md:pl-16">
          {wins.map((w, i) => (
            <div key={w.id} className="w-[400px] shrink-0">
              <WinCard win={w} i={i} onOpen={setSelected} />
            </div>
          ))}
        </motion.div>
      </div>
      <RaceDebrief win={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

export function Directives() {
  const badge: Record<string, string> = { Patent: P.giallo, Paper: P.rosso, Book: "#a855f7" };
  return (
    <Shell id="directives">
      <SectorTag n="R&D Bay" label="Research & publications" />
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
      <SectorTag n="Car Setup" label="The skill sheet" />
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
      <SectorTag n="Pit Wall" label="Leadership & impact" purple />
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
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5"
              style={{ background: P.rosso, color: P.onPrimary }}
            >
              ↓ Download press kit — résumé
            </a>
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
