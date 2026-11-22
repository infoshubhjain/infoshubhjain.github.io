"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { anton } from "@/lib/prototype-fonts";
import { SECTIONS } from "@/lib/prototype-data";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";

/**
 * The page runs ~14 screens deep with no other way to move around it. This is a
 * pit board: a always-visible Menu button (⌘K) that opens a filterable list of
 * every section, labelled with both the race name and the plain one a recruiter
 * is actually scanning for.
 */

export { SECTIONS };

export function PitNav({ onGo }: { onGo: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const goRef = useRef(onGo);
  goRef.current = onGo;

  const hits = SECTIONS.filter((s) =>
    `${s.race} ${s.plain}`.toLowerCase().includes(q.trim().toLowerCase())
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQ("");
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") setOpen(false);
      // Number keys jump straight to a section — but not while typing, and not
      // while the easter-egg letter codes are being entered.
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!open) return;
      const hit = SECTIONS.find((s) => s.key === e.key);
      if (hit) {
        setOpen(false);
        goRef.current(hit.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    onGo(id);
  };

  return (
    <>
      <button
        ref={menuButtonRef}
        onClick={() => {
          setQ("");
          setOpen(true);
        }}
        className="pt-glass pointer-events-auto fixed right-4 top-4 z-40 flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5 sm:right-8 sm:top-8 sm:px-4"
        style={{ borderColor: "var(--pt-line)", color: "var(--pt-white)" }}
        aria-label="Open section menu"
      >
        <span className="flex flex-col gap-[3px]" aria-hidden>
          <span className="block h-px w-3.5" style={{ background: "var(--pt-primary)" }} />
          <span className="block h-px w-3.5" style={{ background: "var(--pt-primary)" }} />
          <span className="block h-px w-2.5" style={{ background: "var(--pt-primary)" }} />
        </span>
        Menu
        <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-xs tracking-normal sm:inline">⌘K</kbd>
      </button>

      <Link href="/" className="pt-glass pointer-events-auto fixed left-4 top-4 z-40 rounded-full border px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] sm:left-8 sm:top-8 sm:px-4" style={{ borderColor: "var(--pt-line)", color: "var(--pt-white)" }}>
        Formal version
      </Link>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal container={typeof document === "undefined" ? undefined : document.querySelector(".pt-root")}><Dialog.Overlay className="fixed inset-0 z-[90] bg-black/70" /><Dialog.Content onOpenAutoFocus={(event) => { event.preventDefault(); inputRef.current?.focus(); }} onCloseAutoFocus={(event) => { event.preventDefault(); menuButtonRef.current?.focus({preventScroll:true}); }} aria-describedby={undefined} className="fixed left-1/2 top-[12vh] z-[91] w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2"><Dialog.Title className="sr-only">Section navigation</Dialog.Title>{open && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
                        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              className="pt-glass w-full max-w-lg overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--pt-line)" }}
              initial={{ y: 18, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 18, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--pt-line)" }}>
                <span className="font-mono text-xs uppercase tracking-[0.28em]" style={{ color: "var(--pt-primary)" }}>
                  Pit board
                </span>
                <Dialog.Close aria-label="Close menu" className="shrink-0 rounded border px-3 py-2 text-sm">Close</Dialog.Close>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && hits[0] && go(hits[0].id)}
                  placeholder="Jump to a section…"
                  aria-label="Find a section" className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none"
                  style={{ color: "var(--pt-white)" }}
                />
              </div>
              <ul className="max-h-[55vh] overflow-y-auto p-2">
                {hits.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => go(s.id)}
                      className="flex w-full items-baseline gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/10"
                    >
                      <span className={`${anton.className} text-base uppercase`} style={{ color: "var(--pt-white)" }}>
                        {s.race}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--pt-muted)" }}>
                        {s.plain}
                      </span>
                      <kbd
                        className="ml-auto rounded border px-1.5 py-0.5 font-mono text-xs"
                        style={{ borderColor: "var(--pt-line)", color: "var(--pt-muted)" }}
                      >
                        {s.key}
                      </kbd>
                    </button>
                  </li>
                ))}
                {hits.length === 0 && (
                  <li className="px-3 py-4 font-mono text-xs" style={{ color: "var(--pt-muted)" }}>
                    No sector by that name.
                  </li>
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </Dialog.Content></Dialog.Portal></Dialog.Root>
    </>
  );
}
