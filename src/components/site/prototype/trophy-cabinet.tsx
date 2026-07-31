"use client";

import { motion } from "framer-motion";
import { Shell, SectorTag, Heading } from "./sections";
import { anton, serif } from "@/lib/prototype-fonts";
import { trophies, type Trophy } from "@/lib/prototype-data";

/**
 * The honours board — a podium for the three headline awards, then the cabinet
 * behind it. Replaces the old skill radar (which redrew the build sheet) and the
 * career area chart (which plotted an invented "load per year" score).
 */

// `rank` is the finishing position (0 = P1) and indexes everything below. DOM
// order stays P1 · P2 · P3 so the winner leads when the grid stacks on phones;
// flex `order` puts P1 in the centre slot once there's a row to arrange.
const SLOT = ["md:order-2", "md:order-1", "md:order-3"];
const STEP = ["h-12", "h-6", "h-3"]; // plinth height by rank — P1 stands tallest
const MEDAL = ["#ffd000", "#c7ccd1", "#cd7f32"]; // gold · silver · bronze

function PodiumTrophy({ t, rank }: { t: Trophy; rank: number }) {
  return (
    <motion.div
      className={`flex flex-col justify-end ${SLOT[rank]}`}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay: rank * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="pt-glass relative overflow-hidden rounded-xl border p-5 pt-6"
        style={{ borderColor: "var(--pt-line)" }}
      >
        {/* Medal bar as an element — a border-top here would conflict with the
            `borderColor` above and trip React's shorthand warning. */}
        <span aria-hidden className="absolute inset-x-0 top-0 h-0.5" style={{ background: MEDAL[rank] }} />
        <span
          className={`${anton.className} absolute right-4 top-3 text-xl leading-none`}
          style={{ color: MEDAL[rank] }}
        >
          P{rank + 1}
        </span>
        <div className={`${anton.className} text-4xl uppercase leading-none sm:text-5xl`} style={{ color: MEDAL[rank] }}>
          {t.value}
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-tight" style={{ color: "var(--pt-white)" }}>
          {t.title}
        </h3>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--pt-muted)" }}>
          {t.issuer} · {t.year}
        </div>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--pt-muted)" }}>
          {t.note}
        </p>
      </div>
      {/* Plinth — steps down from the centre, so P1 physically stands tallest.
          Only once the podium is a row; stacked on phones it's just noise. */}
      <motion.div
        aria-hidden
        className={`hidden md:block ${STEP[rank]} rounded-b-md`}
        style={{ background: `linear-gradient(180deg, ${MEDAL[rank]}, transparent)`, opacity: 0.32 }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.5, delay: 0.35 + rank * 0.12, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

export function TrophyCabinet() {
  const podium = trophies.filter((t) => t.tier === 1);
  const cabinet = trophies.filter((t) => t.tier === 2);

  return (
    <Shell id="trophies">
      <SectorTag n="Trophy Cabinet" label="Trophy Cabinet (Awards · Honours)" purple />
      <div>
        <Heading>
          What the season{" "}
          <span className={`${serif.className} normal-case italic`} style={{ color: "var(--pt-primary)" }}>
            won.
          </span>
        </Heading>
        <p className="mt-6 max-w-2xl text-lg" style={{ color: "var(--pt-muted)" }}>
          A patent, a paid research prize, and a 2.5% founder fellowship — plus the rest of the cabinet.
        </p>
      </div>

      {/* Podium — P2 · P1 · P3, stacked on phones where there's no room to step. */}
      <div className="mt-10 flex flex-col items-stretch gap-4 md:grid md:grid-cols-3 md:items-end">
        {podium.map((t, rank) => (
          <PodiumTrophy key={t.title} t={t} rank={rank} />
        ))}
      </div>

      {/* The cabinet behind the podium */}
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cabinet.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="pt-glass group flex h-full gap-4 rounded-xl border p-4 transition-transform hover:-translate-y-1"
            style={{ borderColor: "var(--pt-line)" }}
          >
            <span
              aria-hidden
              className="mt-1 w-1 shrink-0 rounded-full transition-colors"
              style={{ background: "var(--pt-primary)" }}
            />
            <div>
              <div className={`${anton.className} text-2xl uppercase leading-none`} style={{ color: "var(--pt-accent)" }}>
                {t.value}
              </div>
              <h3 className="mt-1.5 text-sm font-semibold leading-tight" style={{ color: "var(--pt-white)" }}>
                {t.title}
              </h3>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--pt-muted)" }}>
                {t.issuer} · {t.year}
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--pt-muted)" }}>
                {t.note}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Shell>
  );
}
