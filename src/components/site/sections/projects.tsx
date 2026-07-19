"use client";

import { Suspense, lazy, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup, useScroll, useTransform } from "framer-motion";
import {
  Search,
  Github,
  ExternalLink,
  FileText,
  ChevronDown,
  X,
  ArrowUpDown,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { SectionShell, SectionHeading } from "../section-heading";
import { projects, type Project } from "@/lib/portfolio-data";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TiltCard } from "../tilt-card";
import { ChromaticCard } from "../chromatic-card";
const CaseStudyModal = lazy(() =>
  import("../case-study-modal").then((m) => ({ default: m.CaseStudyModal }))
);


const CASE_STUDY_IDS = ["adaptive-learning", "bert-compliance", "sigaida"];

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
  const [openId, setOpenId] = useState<string | null>(null);
  const [caseStudyProject, setCaseStudyProject] = useState<Project | null>(null);

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

      {/* Horizontal scroll gallery for featured projects */}
      <FeaturedGallery />

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
                onCaseStudy={() => setCaseStudyProject(p)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Case study modal */}
      <Suspense>
        <CaseStudyModal
          project={caseStudyProject}
          onClose={() => setCaseStudyProject(null)}
        />
      </Suspense>

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
  onCaseStudy,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
  onCaseStudy: () => void;
}) {
  const hasCaseStudy = CASE_STUDY_IDS.includes(project.id);

  return (
    <ChromaticCard
      className={cn(
        "group relative overflow-hidden rounded-2xl liquid-glass transition-all",
        open ? "ring-1 ring-primary/40" : "hover:ring-1 hover:ring-primary/30"
      )}
    >
      <motion.article
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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


      <div className="relative">
        {/* Project preview image */}
        <div className="relative h-40 overflow-hidden sm:h-44">
          <ProjectImage
            project={project}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          {/* Featured badge overlays image */}
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-1.5">
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur-md">
                <Sparkles className="h-2.5 w-2.5" /> Featured
              </span>
            )}
            {hasCaseStudy && (
              <span className="inline-flex items-center rounded-full border border-accent/40 bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent backdrop-blur-md">
                Case Study
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
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
            {hasCaseStudy && (
              <button
                onClick={onCaseStudy}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-2.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
                data-cursor-label="Deep dive"
              >
                <Maximize2 className="h-3 w-3" /> Case Study
              </button>
            )}
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
      </div>
    </motion.article>
    </ChromaticCard>
  );
}

/** Project image with graceful fallback when the screenshot file is missing. */
function ProjectImage({
  project,
  sizes,
  className,
}: {
  project: Project;
  sizes: string;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20">
        <span className="font-mono text-xs text-muted-foreground/60">{project.category}</span>
      </div>
    );
  }

  return (
    <Image
      src={`/projects/${project.id}.png`}
      alt={project.title}
      fill
      sizes={sizes}
      className={cn("object-cover transition-transform duration-700", className)}
      onError={() => setImgError(true)}
    />
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

const featuredProjects = projects.filter((p) => p.featured);

function FeaturedGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]);

  return (
    <div ref={containerRef} className="mt-10 overflow-hidden">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          featured_work
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      <motion.div style={{ x }} className="flex gap-5 pb-4">
        {featuredProjects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="w-[340px] shrink-0 sm:w-[400px]"
          >
            <TiltCard>
              <div className="group relative overflow-hidden rounded-2xl liquid-glass transition-all hover:ring-1 hover:ring-primary/30">
                <div className="relative h-48 overflow-hidden">
                  <ProjectImage project={p} sizes="400px" className="group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur-md">
                      <Sparkles className="h-2.5 w-2.5" /> Featured
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.category} · {p.year}
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {p.oneLiner}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-card/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
