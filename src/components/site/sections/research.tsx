"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Award, Quote, Cpu } from "lucide-react";
import { SectionShell, SectionHeading } from "../section-heading";
import { research } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

type Tab = "all" | "papers" | "books" | "patent" | "editorial";

export function Research() {
  const [tab, setTab] = useState<Tab>("all");

  const filteredResearch = tab === "all" 
    ? research 
    : research.filter(item => {
        if (tab === "papers") return item.type === "Paper";
        if (tab === "books") return item.type === "Book";
        if (tab === "patent") return item.type === "Patent";
        if (tab === "editorial") return item.type === "Editorial";
        return true;
      });

  return (
    <SectionShell id="research" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />

      <SectionHeading
        eyebrow="Research"
        fileLabel="05 · papers · books · patent · editorial"
        title={
          <>
            Peer-reviewed papers, authored books,{" "}
            <span className="text-aurora">patent, and editorial work.</span>
          </>
        }
        description={
          <>
            My research spans conversational AI evaluation, common-sense reasoning in
            LLMs, Explainable AI methods, and IoT systems for sustainable agriculture.
            Includes published books, a patent, and editorial work in national media.
          </>
        }
      />

      {/* Tabs */}
      <div className="mt-10 inline-flex rounded-xl border border-border bg-card/40 p-1 backdrop-blur-md">
        <TabButton active={tab === "all"} onClick={() => setTab("all")} icon={<FileText className="h-3.5 w-3.5" />}>
          All ({research.length})
        </TabButton>
        <TabButton active={tab === "papers"} onClick={() => setTab("papers")} icon={<FileText className="h-3.5 w-3.5" />}>
          Papers ({research.filter(r => r.type === "Paper").length})
        </TabButton>
        <TabButton active={tab === "books"} onClick={() => setTab("books")} icon={<BookOpen className="h-3.5 w-3.5" />}>
          Books ({research.filter(r => r.type === "Book").length})
        </TabButton>
        <TabButton active={tab === "patent"} onClick={() => setTab("patent")} icon={<Award className="h-3.5 w-3.5" />}>
          Patent ({research.filter(r => r.type === "Patent").length})
        </TabButton>
        <TabButton active={tab === "editorial"} onClick={() => setTab("editorial")} icon={<Quote className="h-3.5 w-3.5" />}>
          Editorial ({research.filter(r => r.type === "Editorial").length})
        </TabButton>
      </div>

      <div className="mt-8">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-4"
        >
          {filteredResearch.map((item, i) => (
            <ResearchCard key={item.title} item={item} index={i} />
          ))}
        </motion.div>
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

function ResearchCard({
  item,
  index,
}: {
  item: (typeof research)[number];
  index: number;
}) {
  const getIcon = () => {
    switch (item.type) {
      case "Patent": return <Cpu className="h-4 w-4" />;
      case "Book": return <BookOpen className="h-4 w-4" />;
      case "Editorial": return <Quote className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getColor = () => {
    switch (item.type) {
      case "Patent": return "border-accent/30 bg-accent/10 text-accent";
      case "Book": return "border-primary/30 bg-primary/10 text-primary";
      case "Editorial": return "border-border bg-card/60 text-muted-foreground";
      default: return "border-primary/30 bg-primary/10 text-primary";
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md transition-colors hover:border-primary/30"
    >
      <div className="flex items-start gap-4">
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/8 sm:flex">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", getColor())}>
              {item.type}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.year}
            </span>
          </div>

          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground">
            {item.title}
          </h3>

          <div className="mt-1 text-xs text-muted-foreground">
            {item.venue}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            {item.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
