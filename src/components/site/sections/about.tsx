"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionShell, SectionHeading } from "../section-heading";
import { about, profile } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

export function About() {
  return (
    <SectionShell id="about" className="relative overflow-hidden">
      {/* Ambient grid */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-dots opacity-30" />

      <SectionHeading
        eyebrow="About"
        fileLabel="02 · mission · vision"
        title={
          <>
            A builder operating at the intersection of{" "}
            <span className="text-aurora">research, engineering, and leadership.</span>
          </>
        }
        description={
          <>
            Computer Science at the University of Illinois Urbana-Champaign. I build
            ambitious AI systems, publish research, ship real products, and lead at scale.
            Leadership reinforces the engineering — never replaces it.
          </>
        }
      />

      {/* Mission / Vision */}
      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <MissionCard
          tag="Mission"
          body={about.mission}
          accent="primary"
        />
        <MissionCard
          tag="Vision"
          body={about.vision}
          accent="accent"
        />
      </div>

      {/* Stats */}
      <div className="mt-14">
        <div className="mb-5 flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            by_the_numbers
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {about.stats.map((s, i) => (
            <StatCounter
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Languages
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            IELTS 8.0/9.0. Comfortable in technical, editorial, and cross-cultural contexts.
          </p>
          <div className="mt-5 space-y-4">
            {profile.languages.map((l) => (
              <div key={l.name}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">{l.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {l.level}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.fluency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Education
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            B.S. Computer Science · University of Illinois Urbana-Champaign
          </p>
          <div className="mt-5 space-y-3">
            <DetailRow label="Expected Graduation" value="May 2029" />
            <DetailRow label="CGPA" value="3.81 / 4.0" highlight />
            <DetailRow label="Honors" value="Dean's List · James Scholar" highlight />
            <DetailRow label="Location" value="Urbana-Champaign, IL" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function MissionCard({
  tag,
  body,
  accent,
}: {
  tag: string;
  body: string;
  accent: "primary" | "accent";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-7 backdrop-blur-md transition-colors hover:border-primary/30"
    >
      <div
        className={cn(
          "absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-60",
          accent === "primary" ? "bg-primary/25" : "bg-accent/25"
        )}
      />
      <div className="relative">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
            accent === "primary"
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-accent/30 bg-accent/10 text-accent"
          )}
        >
          {tag}
        </span>
        <p className="mt-5 text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
          {body}
        </p>
      </div>
    </motion.div>
  );
}

function StatCounter({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const animate = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl border border-border bg-card/40 px-4 py-4 backdrop-blur-md transition-colors hover:border-primary/30"
    >
      <div className="flex items-baseline gap-0.5">
        <span className="font-display text-2xl font-semibold tabular-nums text-foreground">
          {display.toLocaleString()}
        </span>
        <span className="text-xs font-semibold text-primary">{suffix}</span>
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </motion.div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-medium",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}
