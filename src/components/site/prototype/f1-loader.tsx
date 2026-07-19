"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { anton } from "@/lib/prototype-fonts";

/**
 * F1 start-lights launch. Five reds build column-by-column, hold the tension,
 * then LIGHTS OUT — and the screen accelerates away (streaks + scale + blur) as
 * the site crossfades in. Plays once per session. Rendered inside a parent
 * <AnimatePresence> so the exit animation plays when it unmounts.
 */
export function F1Loader({ onDone }: { onDone: () => void }) {
  const [lit, setLit] = useState(0);
  const [out, setOut] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (sessionStorage.getItem("f1-launched")) {
      onDoneRef.current();
      return;
    }
    const t: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 5; i++) t.push(setTimeout(() => setLit(i), 500 + i * 460));
    const OUT = 500 + 5 * 460 + 850; // hold the tension, then lights out
    t.push(setTimeout(() => setOut(true), OUT));
    t.push(
      setTimeout(() => {
        sessionStorage.setItem("f1-launched", "1");
        onDoneRef.current(); // parent removes us → exit animation + site crossfade
      }, OUT + 900)
    );
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-9 overflow-hidden"
      style={{ background: "var(--pt-canvas)" }}
      exit={{ opacity: 0, scale: 1.12, filter: "blur(7px)" }}
      transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
    >
      {/* accelerate-away speed streaks (fire on lights-out) */}
      {out &&
        Array.from({ length: 16 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute bottom-0 w-px"
            style={{ left: `${4 + i * 6}%`, background: "linear-gradient(to top, transparent, var(--pt-primary))" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "150%", opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.7, delay: i * 0.012, ease: "easeIn" }}
          />
        ))}

      <div className="absolute top-[28%] h-2 w-40 rounded-full sm:w-56" style={{ background: "rgba(255,255,255,0.08)" }} />

      <div className="flex gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col gap-2 rounded-md p-1.5" style={{ background: "rgba(0,0,0,0.4)" }}>
            {[0, 1].map((r) => (
              <span
                key={r}
                className="h-8 w-8 rounded-full transition-all duration-200 sm:h-11 sm:w-11"
                style={{
                  background: !out && lit >= i ? "#e21b1b" : "#16171b",
                  boxShadow:
                    !out && lit >= i
                      ? "0 0 26px 3px rgba(226,27,27,0.8), inset 0 0 9px rgba(255,140,140,0.65)"
                      : "inset 0 0 7px rgba(0,0,0,0.85)",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <motion.span
        className={`${anton.className} text-3xl uppercase italic tracking-[0.12em] sm:text-5xl`}
        style={{ color: out ? "var(--pt-primary)" : "var(--pt-white)" }}
        animate={out ? { scale: [1, 1.16, 1] } : {}}
        transition={{ duration: 0.42 }}
      >
        {out ? "Lights out." : lit < 5 ? "Standby" : "Hold…"}
      </motion.span>

      <span className="absolute bottom-9 font-mono text-[10px] uppercase tracking-[0.42em]" style={{ color: "var(--pt-muted)" }}>
        {out ? "and away we go" : "formation lap complete"}
      </span>
    </motion.div>
  );
}
