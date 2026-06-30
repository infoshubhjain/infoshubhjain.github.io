"use client";

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Calendar, ChevronDown, MapPin, TrendingUp } from "lucide-react";
import { SectionShell, SectionHeading } from "../section-heading";
import { experience } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<string, string> = {
  Research: "text-primary border-primary/30 bg-primary/10",
  Internship: "text-accent border-accent/30 bg-accent/10",
  Leadership: "text-primary border-primary/30 bg-primary/10",
  Engineering: "text-accent border-accent/30 bg-accent/10",
};

export function Experience() {
  return (
    <SectionShell id="experience" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-blob right-[-15%] top-[10%] h-[40vh] w-[40vh]" style={{ background: "var(--aurora-2)" }} />
      </div>

      <SectionHeading
        eyebrow="Experience"
        title={
          <>
            Internships, research, and engineering —{" "}
            <span className="text-aurora">in production.</span>
          </>
        }
        description={
          <>
            A chronological view of every role I have held: ML engineering, research
            internships, full-stack lead positions, and freelance work. Each entry is
            expandable with detailed responsibilities, impact metrics, and technologies.
          </>
        }
      />

      <div className="mt-12 relative">
        {/* Vertical line */}
        <div
          aria-hidden
          className="absolute left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-border to-transparent sm:left-[26px]"
        />

        <ol className="space-y-4">
          {experience.map((job, i) => (
            <ExperienceItem key={`${job.role}-${job.period}`} job={job} index={i} />
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}

function ExperienceItem({
  job,
  index,
}: {
  job: (typeof experience)[number];
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-14 sm:pl-20"
    >
      {/* Node */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="absolute left-0 top-1 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/40 bg-background text-primary transition-all hover:glow-primary sm:h-[52px] sm:w-[52px]"
        aria-expanded={open}
        aria-label={`Toggle ${job.role}`}
      >
        <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <div
        className={cn(
          "rounded-2xl border bg-card/40 p-5 backdrop-blur-md transition-colors sm:p-6",
          open ? "border-primary/40" : "border-border hover:border-primary/20"
        )}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  TYPE_COLORS[job.type] ?? "border-border bg-card/60 text-muted-foreground"
                )}
              >
                {job.type}
              </span>
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold leading-tight text-foreground sm:text-xl">
              {job.role}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">{job.org}</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {job.period}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            aria-label={open ? "Collapse" : "Expand"}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
        </div>

        {/* Summary (always visible) */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{job.summary}</p>

        {/* Metrics (always visible) */}
        {job.metrics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-1.5"
              >
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="font-display text-sm font-semibold tabular-nums text-foreground">
                  {m.value}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Expandable points */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 border-t border-border pt-4">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  responsibilities
                </div>
                <ul className="space-y-2">
                  {job.points.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    technologies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-card/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}
