"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  Clock,
  Tag,
  ChevronDown,
  ExternalLink,
  PenLine,
} from "lucide-react";
import { SectionShell, SectionHeading } from "../section-heading";
import { books, research } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

type WritingItem = {
  title: string;
  venue: string;
  date: string;
  type: "Book" | "Paper";
  abstract: string;
  topics: string[];
  isbn?: string;
  link?: string;
  award?: string;
};

// Merge books and papers into a unified writing list, sorted by date (newest first).
const ALL_WRITING: WritingItem[] = [
  ...books.map((b) => ({
    title: b.title,
    venue: `ISBN ${b.isbn}`,
    date: b.date,
    type: "Book" as const,
    abstract: b.abstract,
    topics: b.topics,
    isbn: b.isbn,
    link: b.link,
    award:
      b.isbn === "978-9394351950"
        ? "Recognized by the Governor of Madhya Pradesh"
        : undefined,
  })),
  ...research.map((r) => ({
    title: r.title,
    venue: r.venue,
    date: r.date,
    type: "Paper" as const,
    abstract: r.abstract,
    topics: r.topics,
    link: r.link,
    award:
      r.date.includes("2023")
        ? "Best Junior Author · USD 1,000"
        : undefined,
  })),
].sort((a, b) => {
  // Parse "May 2025", "June 2024", "September 2023", "November 2024"
  const parseDate = (s: string) => new Date(s).getTime();
  return parseDate(b.date) - parseDate(a.date);
});

const FILTERS = ["All", "Books", "Papers"] as const;
type Filter = (typeof FILTERS)[number];

// Estimate reading time based on abstract length (rough: 200 words per minute).
function estimateReadingTime(abstract: string): string {
  const words = abstract.split(/\s+/).length;
  // Books and papers typically have much more content than the abstract.
  // Use abstract as a proxy but multiply for a realistic estimate.
  const minutes = Math.max(2, Math.round(words / 50));
  return `${minutes} min read`;
}

const ALL_TOPICS = Array.from(
  new Set(ALL_WRITING.flatMap((w) => w.topics))
).sort();

export function Writing() {
  const [filter, setFilter] = useState<Filter>("All");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(0);

  const filtered = ALL_WRITING.filter((w) => {
    if (filter === "Books" && w.type !== "Book") return false;
    if (filter === "Papers" && w.type !== "Paper") return false;
    if (activeTopic && !w.topics.includes(activeTopic)) return false;
    return true;
  });

  return (
    <SectionShell id="writing" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-dots opacity-20" />

      <SectionHeading
        eyebrow="Writing"
        fileLabel="09 · books · papers · essays"
        title={
          <>
            Books, papers, and{" "}
            <span className="text-aurora">words worth reading.</span>
          </>
        }
        description={
          <>
            Two authored books on IoT and Explainable AI. Two peer-reviewed
            papers on conversational AI evaluation. Plus editorial work reaching
            50,000+ readers. This is the writing layer of the portfolio —
            blog-ready for future posts.
          </>
        }
      />

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-border bg-card/40 p-1 backdrop-blur-md">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALL_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() =>
                setActiveTopic((prev) => (prev === t ? null : t))
              }
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                activeTopic === t
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="mt-5 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} of writing
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <WritingCard
              key={item.title}
              item={item}
              index={i}
              open={openId === i}
              onToggle={() => setOpenId((prev) => (prev === i ? null : i))}
            />
          ))}
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}

function WritingCard({
  item,
  index,
  open,
  onToggle,
}: {
  item: WritingItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = item.type === "Book" ? BookOpen : FileText;
  const readingTime = estimateReadingTime(item.abstract);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl liquid-glass transition-all",
        open ? "ring-1 ring-primary/40" : "hover:ring-1 hover:ring-primary/30"
      )}
    >
      {/* Spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at 50% 0%, color-mix(in oklch, var(--primary) 8%, transparent), transparent 60%)",
        }}
      />

      <button
        onClick={onToggle}
        className="relative w-full p-6 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
              item.type === "Book"
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-primary/30 bg-primary/10 text-primary"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  item.type === "Book"
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-primary/30 bg-primary/10 text-primary"
                )}
              >
                {item.type}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {item.date}
              </span>
              {item.award && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  ★ {item.award}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" /> {readingTime}
              </span>
            </div>

            <h3 className="mt-2 font-display text-lg font-semibold leading-tight text-foreground">
              {item.title}
            </h3>
            <div className="mt-1 text-xs text-muted-foreground">{item.venue}</div>

            {/* Topics */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.topics.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-card/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {t}
                </span>
              ))}
            </div>

            {/* Expandable content */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      abstract
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {item.abstract}
                    </p>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-foreground"
                      >
                        Read full text <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle hint */}
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
              {open ? "Show less" : "Read abstract"}
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
