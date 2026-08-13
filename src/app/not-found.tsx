"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { anton, grotesk, serif } from "@/lib/prototype-fonts";
import { PALETTES, DEFAULT_TEAM } from "@/lib/prototype-theme";

/**
 * Dead links land here — including /prototype, which search engines still have
 * indexed from the retired site. It applies the palette vars itself because
 * they live inline on the homepage's .pt-root, which this page never mounts.
 *
 * DNF is what a car scores when it retires without finishing.
 */
export default function NotFound() {
  const palette = PALETTES[DEFAULT_TEAM];

  return (
    <main
      className={`pt-root relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 ${grotesk.className}`}
      style={{ ...palette.vars, background: "var(--pt-canvas)", color: "var(--pt-white)" } as React.CSSProperties}
    >
      {/* Livery stripe, matching the header rule across the site. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[5px]"
        style={{
          background:
            "linear-gradient(90deg, var(--pt-primary) 0%, var(--pt-primary) 42%, var(--pt-accent) 42%, var(--pt-accent) 52%, transparent 52%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[1] w-full max-w-2xl"
      >
        <div
          className="font-mono text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "var(--pt-muted)" }}
        >
          Race Control · Status
        </div>

        <div
          className={`${anton.className} mt-4 text-[8rem] uppercase leading-[0.82] sm:text-[11rem]`}
          style={{ color: "var(--pt-primary)" }}
        >
          DNF
        </div>

        <h1 className={`${anton.className} mt-4 text-3xl uppercase leading-tight sm:text-4xl`}>
          This lap{" "}
          <span className={`${serif.className} normal-case italic`} style={{ color: "var(--pt-accent)" }}>
            never finished.
          </span>
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: "var(--pt-muted)" }}>
          Error 404 — no page at this address. It may have been retired in a rebuild.
          Head back to the grid and pick a sector from the menu.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="rounded px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--pt-primary)", color: "var(--pt-on-primary)" }}
          >
            ← Return to the grid
          </Link>
          <button
            onClick={() => history.back()}
            className="rounded border px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] transition-colors"
            style={{ borderColor: "var(--pt-line)", color: "var(--pt-white)" }}
          >
            Previous lap
          </button>
        </div>
      </motion.div>

      {/* Checkered strip — the same motif that closes the homepage. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 flex h-3.5">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="h-full flex-1"
            style={{ background: i % 2 ? "var(--pt-white)" : "var(--pt-canvas)" }}
          />
        ))}
      </div>
    </main>
  );
}
