"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  BookMarked,
  GraduationCap,
  Award,
  Users,
  Star,
  Medal,
  Crown,
} from "lucide-react";
import { SectionShell, SectionHeading } from "../section-heading";
import { achievements } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; accent: "primary" | "accent" }
> = {
  Research: { icon: <BookMarked className="h-4 w-4" />, accent: "primary" },
  Publication: { icon: <BookMarked className="h-4 w-4" />, accent: "primary" },
  Academic: { icon: <GraduationCap className="h-4 w-4" />, accent: "primary" },
  Professional: { icon: <Award className="h-4 w-4" />, accent: "accent" },
  Leadership: { icon: <Users className="h-4 w-4" />, accent: "accent" },
  Recognition: { icon: <Crown className="h-4 w-4" />, accent: "accent" },
  Selection: { icon: <Star className="h-4 w-4" />, accent: "primary" },
};

export function Achievements() {
  return (
    <SectionShell id="achievements" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-blob left-1/2 top-0 h-[40vh] w-[50vh] -translate-x-1/2" style={{ background: "var(--aurora-3)" }} />
      </div>

      <SectionHeading
        eyebrow="Awards"
        fileLabel="08 · recognition · scholarships"
        title={
          <>
            A wall of{" "}
            <span className="text-aurora">recognition.</span>
          </>
        }
        description={
          <>
            Awards, scholarships, publications, and selections — spanning research,
            academics, professional internships, and leadership. Each card represents a
            verified milestone from the CV.
          </>
        }
      />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a, i) => {
          const meta = CATEGORY_META[a.category] ?? {
            icon: <Trophy className="h-4 w-4" />,
            accent: "primary" as const,
          };
          return (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-md transition-colors hover:border-primary/30"
            >
              {/* Spotlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: `radial-gradient(400px circle at 50% 0%, color-mix(in oklch, var(--${meta.accent}) 10%, transparent), transparent 60%)`,
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border",
                      meta.accent === "primary"
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-accent/30 bg-accent/10 text-accent"
                    )}
                  >
                    {meta.icon}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {a.category}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-base font-semibold leading-tight text-foreground">
                  {a.title}
                </h3>
                <div className="mt-1.5 text-xs text-muted-foreground">{a.issuer}</div>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                      meta.accent === "primary"
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-accent/30 bg-accent/10 text-accent"
                    )}
                  >
                    {a.value}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
              </div>

              {/* Corner decoration */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -right-6 -top-6 h-12 w-12 rounded-full opacity-30 blur-xl transition-opacity group-hover:opacity-60",
                  meta.accent === "primary" ? "bg-primary/30" : "bg-accent/30"
                )}
              />
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}
