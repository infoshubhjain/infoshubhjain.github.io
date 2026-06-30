"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Search,
  Github,
  ExternalLink,
  FileText,
  ChevronDown,
  X,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { SectionShell, SectionHeading } from "../section-heading";
import { projects, type Project } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const ALL_TAGS = Array.from(
  new Set(projects.flatMap((p) => p.tags))
).sort();

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "ai", label: "AI" },
  { id: "research", label: "Research" },
  { id: "production", label: "Production" },
  { id: "leadership", label: "Leadership" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

export function Projects() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortId>("featured");
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);

  const filtered = useMemo(() => {
    let list = [...projects];

    if (activeTag) {
      list = list.filter((p) => p.tags.includes(activeTag));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.oneLiner.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "newest":
        list.sort((a, b) => b.year - a.year);
        break;
      case "ai":
        list.sort((a, b) => Number(b.tags.includes("AI")) - Number(a.tags.includes("AI")));
        break;
      case "research":
        list.sort((a, b) => Number(b.category === "Research") - Number(a.category === "Research"));
        break;
      case "production":
        list.sort((a, b) => Number(b.tags.includes("Production")) - Number(a.tags.includes("Production")));
        break;
      case "leadership":
        list.sort((a, b) => Number(b.tags.includes("Leadership")) - Number(a.tags.includes("Leadership")));
        break;
      case "featured":
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return list;
  }, [query, activeTag, sort]);

  return (
    <SectionShell id="projects" className="relative overflow-hidden">
      {/* Ambient glow */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-blob left-1/2 top-0 h-[40vh] w-[60vh] -translate-x-1/2" style={{ background: "var(--aurora-1)" }} />
      </div>

      <SectionHeading
        eyebrow="Projects"
        fileLabel="03 · filter · search · sort"
        title={
          <>
            Things I have{" "}
            <span className="text-aurora">architected, built, and shipped.</span>
          </>
        }
        description={
          <>
            Multi-agent learning platforms, from-scratch neural networks, production
            full-stack systems, and research-grade NLP. Each entry includes the problem,
            the approach, and the measured impact.
          </>
        }
      />

      {/* Controls */}
      <div className="mt-10 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tech, tags…"
              className="h-11 w-full rounded-xl border border-border bg-card/40 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-md focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 overflow-x-auto scroll-area rounded-xl border border-border bg-card/40 p-1 backdrop-blur-md">
            <ArrowUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  sort === s.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-1.5">
          <TagChip
            label="All"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {ALL_TAGS.map((t) => (
            <TagChip
              key={t}
              label={t}
              active={activeTag === t}
              onClick={() => setActiveTag((prev) => (prev === t ? null : t))}
            />
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="mt-5 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>

      {/* Grid */}
      <LayoutGroup>
        <motion.div layout className="mt-6 grid gap-4 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                open={openId === p.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === p.id ? null : p.id))
                }
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <Search className="h-8 w-8 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">
            No projects match your filters. Try clearing the search.
          </p>
        </div>
      )}
    </SectionShell>
  );
}

function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function ProjectCard({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl liquid-glass transition-all",
        open ? "border-primary/40" : "border border-border hover:border-primary/30"
      )}
    >
      {/* Spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at 50% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 60%)",
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {project.featured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="h-2.5 w-2.5" /> Featured
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-border bg-card/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {project.category}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {project.year}
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold leading-tight text-foreground">
              {project.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {project.oneLiner}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 6).map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-card/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 6 && (
            <span className="rounded-md border border-border bg-card/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              +{project.tech.length - 6}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary/80"
              style={{ background: "color-mix(in oklch, var(--primary) 8%, transparent)" }}
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <DetailBlock label="Problem" body={project.problem} />
                <DetailBlock label="Solution" body={project.solution} />
              </div>

              <div className="mt-4">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  impact
                </div>
                <ul className="space-y-1.5">
                  {project.impact.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {project.timeline}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer actions */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-foreground"
            aria-expanded={open}
          >
            {open ? "Collapse" : "Expand details"}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>

          <div className="flex items-center gap-1.5">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                aria-label="Live demo"
                className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card/40 px-2.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <ExternalLink className="h-3 w-3" /> Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Source code"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
            {project.research && (
              <a
                href={project.research}
                target="_blank"
                rel="noreferrer"
                aria-label="Research paper"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                <FileText className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function DetailBlock({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/30 p-4">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}
