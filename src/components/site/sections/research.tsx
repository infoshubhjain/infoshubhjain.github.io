"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  Award,
  Quote,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  Cpu,
} from "lucide-react";
import { SectionShell, SectionHeading } from "../section-heading";
import { research, books, patents } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

type Tab = "papers" | "books" | "patent";

export function Research() {
  const [tab, setTab] = useState<Tab>("papers");

  return (
    <SectionShell id="research" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />

      <SectionHeading
        eyebrow="Research"
        fileLabel="04 · papers · books · patent"
        title={
          <>
            Peer-reviewed papers, authored books,{" "}
            <span className="text-aurora">and a patent.</span>
          </>
        }
        description={
          <>
            My research spans conversational AI evaluation, common-sense reasoning in
            LLMs, Explainable AI methods, and IoT systems for sustainable agriculture.
            Two published books and a filed patent extend the same threads.
          </>
        }
      />

      {/* Tabs */}
      <div className="mt-10 inline-flex rounded-xl border border-border bg-card/40 p-1 backdrop-blur-md">
        <TabButton active={tab === "papers"} onClick={() => setTab("papers")} icon={<FileText className="h-3.5 w-3.5" />}>
          Papers ({research.length})
        </TabButton>
        <TabButton active={tab === "books"} onClick={() => setTab("books")} icon={<BookOpen className="h-3.5 w-3.5" />}>
          Books ({books.length})
        </TabButton>
        <TabButton active={tab === "patent"} onClick={() => setTab("patent")} icon={<Award className="h-3.5 w-3.5" />}>
          Patent ({patents.length})
        </TabButton>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {tab === "papers" && (
            <motion.div
              key="papers"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-4"
            >
              {research.map((paper, i) => (
                <PublicationCard
                  key={paper.title}
                  type="paper"
                  title={paper.title}
                  venue={paper.venue}
                  date={paper.date}
                  abstract={paper.abstract}
                  citation={paper.citation}
                  topics={paper.topics}
                  link={paper.link}
                  isbn={undefined}
                  award={paper.date.includes("2023") ? "Best Junior Author · USD 1,000" : undefined}
                  index={i}
                />
              ))}
            </motion.div>
          )}

          {tab === "books" && (
            <motion.div
              key="books"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-4 lg:grid-cols-2"
            >
              {books.map((book, i) => (
                <PublicationCard
                  key={book.title}
                  type="book"
                  title={book.title}
                  venue={`ISBN ${book.isbn}`}
                  date={book.date}
                  abstract={book.abstract}
                  citation={book.citation}
                  topics={book.topics}
                  link={book.link}
                  isbn={book.isbn}
                  award={book.isbn === "978-9394351950" ? "Recognized by Governor of Madhya Pradesh" : undefined}
                  index={i}
                />
              ))}
            </motion.div>
          )}

          {tab === "patent" && (
            <motion.div
              key="patent"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-4"
            >
              {patents.map((pat, i) => (
                <PatentCard key={pat.title} patent={pat} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editorial history */}
      <div className="mt-12 rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Editorial work
          </h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Served as Junior Editor-in-Chief at MetroVaartha (a national newspaper),
          managing the technology section, supervising junior editors, and fact-checking
          200+ articles. Authored "Artificial Intelligence: Blessing or Curse?" — reaching
          50,000+ readers. Also worked as a freelance developmental editor on 10+ book
          projects and 300+ academic essays.
        </p>
      </div>
    </SectionShell>
  );
}

function TabButton({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

type PublicationCardProps = {
  type: "paper" | "book";
  title: string;
  venue: string;
  date: string;
  abstract: string;
  citation: string;
  topics: string[];
  link?: string;
  isbn?: string;
  award?: string;
  index: number;
};

function PublicationCard({
  type,
  title,
  venue,
  date,
  abstract,
  citation,
  topics,
  link,
  isbn,
  award,
  index,
}: PublicationCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCitation = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const Icon = type === "paper" ? FileText : BookOpen;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md transition-colors hover:border-primary/30"
    >
      {/* Spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at 50% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 60%)",
        }}
      />

      <div className="relative flex items-start gap-4">
        {/* Icon block */}
        <div className="hidden h-14 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/8 sm:flex">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              {type === "paper" ? "Journal Article" : "Authored Book"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {date}
            </span>
            {award && (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                <Award className="h-2.5 w-2.5" /> {award}
              </span>
            )}
          </div>

          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground">
            {title}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">{venue}</span>
            {isbn && <span className="font-mono">· ISBN {isbn}</span>}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  {abstract}
                </p>

                <div className="mt-4 rounded-xl border border-border bg-background/40 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      citation
                    </span>
                    <button
                      onClick={copyCitation}
                      className="text-[10px] font-medium text-primary hover:text-foreground"
                    >
                      {copied ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/80">
                    {citation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-foreground"
              aria-expanded={open}
            >
              {open ? "Hide abstract" : "Read abstract"}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
            </button>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Open <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function PatentCard({
  patent,
  index,
}: {
  patent: (typeof patents)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/5 p-6 backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
          <Cpu className="h-2.5 w-2.5" /> {patent.id}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {patent.date}
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
        {patent.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        {patent.abstract}
      </p>
    </motion.article>
  );
}
