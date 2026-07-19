"use client";

import { useEffect, useState } from "react";
import { anton } from "@/lib/prototype-fonts";
import type { TeamId } from "@/lib/prototype-theme";

/**
 * Hidden F1 easter eggs. Type a code (or the Konami code) anywhere:
 *   forza → Ferrari · wings → Red Bull · box → team radio · drs / p1 / vroom
 *   ↑↑↓↓←→←→ b a → "DRS deployed" pace mode
 * Most also blip the throttle (revs the engine if it's on, spikes telemetry).
 */

const KONAMI = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";

type Egg = { seq: string; msg: string; team?: TeamId; rev?: boolean };
const EGGS: Egg[] = [
  { seq: "forza", msg: "🐎 FORZA FERRARI", team: "ferrari", rev: true },
  { seq: "wings", msg: "🐂 IT GIVES YOU WINGS", team: "redbull", rev: true },
  { seq: "box", msg: "📻 BOX BOX BOX", rev: false },
  { seq: "drs", msg: "🟢 DRS ENABLED — SEND IT", rev: true },
  { seq: "p1", msg: "🏆 P1 — CHEQUERED FLAG", rev: false },
  { seq: "vroom", msg: "🏎️ FULL THROTTLE", rev: true },
  // deep-fan radio classics
  { seq: "bwoah", msg: "🧊 BWOAH. — KIMI", rev: false },
  { seq: "hammertime", msg: "🔨 IT'S HAMMER TIME", rev: true },
  { seq: "multi21", msg: "🅰️ MULTI 21, SEB.", rev: false },
  { seq: "lightsout", msg: "🚦 IT'S LIGHTS OUT AND AWAY WE GO", rev: true },
  { seq: "purple", msg: "🟣 PURPLE SECTOR — FASTEST OF ANYONE", rev: false },
  { seq: "planb", msg: "📻 PLAN B. PLAN B.", rev: false },
  { seq: "deg", msg: "🛞 DEG'S HIGH — BOX THIS LAP", rev: false },
  { seq: "tea", msg: "☕ LEAVE ME ALONE, I KNOW WHAT I'M DOING", rev: false },
  { seq: "checo", msg: "🇲🇽 ¡ÁNDALE, CHECO!", rev: true },
  { seq: "gp2", msg: "😤 GP2 ENGINE. GP2!", rev: false },
];

export function EasterEggs({ speedRef, team }: { speedRef: React.MutableRefObject<number>; team: TeamId }) {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let letters = "";
    let konami: string[] = [];
    let hideTimer: ReturnType<typeof setTimeout>;

    const fire = (m: string, rev: boolean) => {
      setMsg(m);
      if (rev) speedRef.current = 1;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setMsg(null), 2200);
    };

    const onKey = (e: KeyboardEvent) => {
      // ignore typing in inputs
      const el = e.target as HTMLElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;

      konami = [...konami, e.key].slice(-10);
      if (konami.join(",") === KONAMI) {
        fire("🏁 DRS DEPLOYED — PACE MODE", true);
        konami = [];
        return;
      }

      if (e.key.length === 1) {
        letters = (letters + e.key.toLowerCase()).slice(-12);
        for (const egg of EGGS) {
          if (letters.endsWith(egg.seq)) {
            const m = egg.team && egg.team !== team ? `${egg.msg} · (wrong garage!)` : egg.msg;
            fire(m, !!egg.rev);
            letters = "";
            break;
          }
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(hideTimer);
    };
  }, [speedRef, team]);

  if (!msg) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[18%] z-40 flex justify-center px-4">
      <div
        className={`pt-glass ${anton.className} animate-[pulse_1.2s_ease-in-out_infinite] rounded-xl border px-6 py-3 text-center text-2xl uppercase tracking-wide sm:text-4xl`}
        style={{ borderColor: "var(--pt-primary)", color: "var(--pt-white)" }}
      >
        {msg}
      </div>
    </div>
  );
}
