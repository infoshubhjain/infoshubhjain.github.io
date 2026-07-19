"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Github, ExternalLink, FileText, Flag, Target, Wrench } from "lucide-react";
import { anton } from "@/lib/prototype-fonts";
import type { Win } from "@/lib/prototype-data";

const POS_COLOR: Record<string, string> = { P1: "#ffd000", P2: "#c7ccd1", P3: "#cd7f32" };
const LINK_ICON = { github: Github, demo: ExternalLink, paper: FileText } as const;

/** Full project "race debrief" — opens when a Win card is tapped. */
export function RaceDebrief({ win, onClose }: { win: Win | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (win) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [win, onClose]);

  const ui = (
    <AnimatePresence>
      {win && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto"
          onClick={onClose}
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ y: 36, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 36, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto my-6 w-full max-w-4xl px-4 sm:my-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-glass overflow-hidden rounded-2xl border" style={{ borderColor: "var(--pt-line)" }}>
              {/* Header */}
              <div className="relative border-b p-6 sm:p-8" style={{ borderColor: "var(--pt-line)" }}>
                <div className="absolute inset-x-0 top-0 h-1" style={{ background: "var(--pt-primary)" }} />
                <button
                  onClick={onClose}
                  className="pt-glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border"
                  style={{ borderColor: "var(--pt-line)", color: "var(--pt-white)" }}
                  aria-label="Close debrief"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-2 flex items-center gap-3">
                  <span className={`${anton.className} text-3xl`} style={{ color: POS_COLOR[win.pos] ?? "var(--pt-white)" }}>
                    {win.pos}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--pt-muted)" }}>
                    {win.year} · {win.role}
                  </span>
                </div>
                <h2 className={`${anton.className} text-4xl uppercase leading-none sm:text-5xl`} style={{ color: "var(--pt-white)" }}>
                  {win.name}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "#d8d6d0" }}>
                  {win.overview}
                </p>
                {win.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {win.links.map((l) => {
                      const Icon = LINK_ICON[l.kind];
                      const primary = l.kind === "demo";
                      return (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-transform hover:-translate-y-0.5"
                          style={
                            primary
                              ? { background: "var(--pt-primary)", color: "var(--pt-on-primary)", borderColor: "var(--pt-primary)" }
                              : { borderColor: "var(--pt-line)", color: "var(--pt-white)" }
                          }
                        >
                          <Icon className="h-3.5 w-3.5" /> {l.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="space-y-8 p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Block icon={<Target className="h-4 w-4" />} label="Circuit — the problem" body={win.circuit} />
                  <Block icon={<Wrench className="h-4 w-4" />} label="Setup — the approach" body={win.setup} />
                </div>

                <div>
                  <SectionLabel>Results</SectionLabel>
                  <ul className="mt-3 space-y-2.5">
                    {win.impact.map((line, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-relaxed sm:text-[15px]" style={{ color: "#d8d6d0" }}>
                        <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--pt-primary)" }} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <SectionLabel>Key telemetry</SectionLabel>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {win.metrics.map((m) => (
                      <div key={m.label} className="rounded-lg border p-3 text-center" style={{ borderColor: "var(--pt-line)", background: "rgba(255,255,255,0.02)" }}>
                        <div className={`${anton.className} text-2xl`} style={{ color: "var(--pt-primary)" }}>
                          {m.value}
                        </div>
                        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "var(--pt-muted)" }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionLabel>Build sheet</SectionLabel>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {win.stack.map((g) => (
                      <div key={g.group} className="rounded-lg border p-4" style={{ borderColor: "var(--pt-line)", background: "rgba(255,255,255,0.02)" }}>
                        <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--pt-primary)" }}>
                          {g.group}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {g.items.map((it) => (
                            <span key={it} className="rounded border px-2 py-0.5 font-mono text-[11px]" style={{ borderColor: "var(--pt-line)", color: "#cfcdc7" }}>
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Portal to the themed root (has --pt-* vars, no backdrop-filter) so the overlay
  // is truly viewport-fixed and inherits the active team palette.
  if (!mounted) return null;
  const target = document.querySelector(".pt-root") ?? document.body;
  return createPortal(ui, target);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: "var(--pt-white)" }}>
        {children}
      </span>
      <span className="h-px flex-1" style={{ background: "var(--pt-line)" }} />
    </div>
  );
}

function Block({ icon, label, body }: { icon: React.ReactNode; label: string; body: string }) {
  return (
    <div className="rounded-lg border p-5" style={{ borderColor: "var(--pt-line)", background: "rgba(255,255,255,0.02)" }}>
      <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--pt-primary)" }}>
        {icon} {label}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#d8d6d0" }}>
        {body}
      </p>
    </div>
  );
}
