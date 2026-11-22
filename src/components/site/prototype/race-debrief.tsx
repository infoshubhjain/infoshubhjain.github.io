"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Github, ExternalLink, FileText, Flag, Target, Wrench } from "lucide-react";
import { anton } from "@/lib/prototype-fonts";
import type { Win } from "@/lib/prototype-data";

const POS_COLOR: Record<string, string> = { P1: "#ffd000", P2: "#c7ccd1", P3: "#cd7f32" };
const LINK_ICON = { github: Github, demo: ExternalLink, paper: FileText } as const;

/** Full project "race debrief" — opens when a Win card is tapped. */
export function RaceDebrief({ win, onClose }: { win: Win | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // `onClose` is usually an inline arrow, so keeping it in the deps re-ran the
  // scroll lock on every parent render — releasing and re-taking it mid-scroll.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!win) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() => dialogRef.current?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      const controls = dialog?.querySelectorAll<HTMLElement>('a[href], button, [tabindex="0"]');
      if (!dialog || !controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
        e.preventDefault(); first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    // body overflow alone doesn't stop Lenis — it drives window scroll itself.
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
      previousFocus?.focus({ preventScroll: true });
    };
  }, [win]);

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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="debrief-title"
            tabIndex={-1}
            initial={{ y: 36, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 36, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto my-6 w-full max-w-4xl px-4 sm:my-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-glass overflow-hidden rounded-2xl border" style={{ borderColor: "var(--pt-line)" }}>
              {win.image && (
                <div className="relative h-48 w-full sm:h-64">
                  <Image src={win.image} alt={`${win.name} screenshot`} fill sizes="900px" className="object-cover object-top" priority />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, transparent 30%, var(--pt-panel))" }}
                  />
                </div>
              )}
              {/* Header */}
              <div className="relative border-b p-6 sm:p-8" style={{ borderColor: "var(--pt-line)" }}>
                <div className="absolute inset-x-0 top-0 h-1" style={{ background: "var(--pt-primary)" }} />
                <button
                  onClick={onClose}
                  className="pt-glass absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg border"
                  style={{ borderColor: "var(--pt-line)", color: "var(--pt-white)" }}
                  aria-label="Close debrief"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-2 flex items-center gap-3 pr-10">
                  <span className={`${anton.className} text-3xl`} style={{ color: POS_COLOR[win.pos] ?? "var(--pt-white)" }}>
                    {win.pos}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--pt-muted)" }}>
                    {win.period ?? win.year} · {win.role}
                  </span>
                </div>
                <h2 id="debrief-title" className={`${anton.className} text-4xl uppercase leading-none sm:text-5xl`} style={{ color: "var(--pt-white)" }}>
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
                          rel="noopener noreferrer"
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
                        <div className="mt-0.5 font-mono text-xs uppercase tracking-[0.18em]" style={{ color: "var(--pt-muted)" }}>
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
                        <div className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--pt-primary)" }}>
                          {g.group}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {g.items.map((it) => (
                            <span key={it} className="rounded border px-2 py-0.5 font-mono text-xs" style={{ borderColor: "var(--pt-line)", color: "#cfcdc7" }}>
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
      <span className="font-mono text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "var(--pt-white)" }}>
        {children}
      </span>
      <span className="h-px flex-1" style={{ background: "var(--pt-line)" }} />
    </div>
  );
}

function Block({ icon, label, body }: { icon: React.ReactNode; label: string; body: string }) {
  return (
    <div className="rounded-lg border p-5" style={{ borderColor: "var(--pt-line)", background: "rgba(255,255,255,0.02)" }}>
      <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--pt-primary)" }}>
        {icon} {label}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#d8d6d0" }}>
        {body}
      </p>
    </div>
  );
}
