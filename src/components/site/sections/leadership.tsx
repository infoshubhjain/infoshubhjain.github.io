"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  GraduationCap,
  CalendarDays,
  Crown,
  Megaphone,
  PenLine,
  HandHeart,
  ChevronDown,
} from "lucide-react";
import { SectionShell, SectionHeading } from "../section-heading";
import { leadership, volunteerRoles } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; color: string }
> = {
  Mentoring: { icon: <GraduationCap className="h-4 w-4" />, color: "primary" },
  Teaching: { icon: <GraduationCap className="h-4 w-4" />, color: "primary" },
  "Event Management": { icon: <CalendarDays className="h-4 w-4" />, color: "accent" },
  Leadership: { icon: <Users className="h-4 w-4" />, color: "primary" },
  Founder: { icon: <Crown className="h-4 w-4" />, color: "accent" },
  Editorial: { icon: <PenLine className="h-4 w-4" />, color: "accent" },
  Volunteer: { icon: <HandHeart className="h-4 w-4" />, color: "primary" },
};

const FILTERS = [
  "All",
  "Founder",
  "Leadership",
  "Event Management",
  "Mentoring",
  "Teaching",
  "Editorial",
  "Volunteer",
] as const;

export function Leadership() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered =
    filter === "All"
      ? leadership
      : leadership.filter((l) => l.category === filter);

  return (
    <SectionShell id="leadership" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-dots opacity-25" />

      <SectionHeading
        eyebrow="Leadership"
        fileLabel="06 · founder · events · mentoring"
        title={
          <>
            Leading at scale —{" "}
            <span className="text-aurora">2,000+ attendees, 200+ volunteers, $34K+ raised.</span>
          </>
        }
        description={
          <>
            Leadership reinforces the engineering, never replaces it. I have founded
            two organizations, led campus-wide events at UIUC, mentored CS students at
            Siebel Center, and chaired 35+ Model UN committees.
          </>
        }
      />

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
              filter === f
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <motion.div layout className="mt-6 grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <LeadershipCard key={`${item.role}-${item.period}`} item={item} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Volunteer roles */}
      <div className="mt-12">
        <div className="mb-5 flex items-center gap-3">
          <HandHeart className="h-4 w-4 text-primary" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            additional_volunteer_roles
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {volunteerRoles.map((v, i) => (
            <motion.div
              key={v.org}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md transition-colors hover:border-primary/30"
            >
              <div className="mb-2 font-display text-sm font-semibold text-foreground">
                {v.org}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {v.contribution}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function LeadershipCard({
  item,
  index,
}: {
  item: (typeof leadership)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const meta = CATEGORY_META[item.category] ?? {
    icon: <Megaphone className="h-4 w-4" />,
    color: "primary",
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/40 backdrop-blur-md transition-colors",
        open ? "border-primary/40" : "border-border hover:border-primary/30"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at 50% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 60%)",
        }}
      />

      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-full p-6 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
              meta.color === "primary"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-accent/30 bg-accent/10 text-accent"
            )}
          >
            {meta.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-base font-semibold leading-tight text-foreground">
                {item.role}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {item.period}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{item.org}</div>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  meta.color === "primary"
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-accent/30 bg-accent/10 text-accent"
                )}
              >
                {item.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <span className="font-display text-xs font-semibold text-foreground">
                  {item.impact.value}
                </span>
                · {item.impact.label}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.summary}
            </p>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {item.points.map((p, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
              {open ? "Show less" : "Show details"}
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
              />
            </div>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
