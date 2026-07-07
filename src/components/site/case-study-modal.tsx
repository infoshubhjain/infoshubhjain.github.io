"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Github,
  ExternalLink,
  Calendar,
  Tag,
  Target,
  Lightbulb,
  TrendingUp,
  Code2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { type Project } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { ArchitectureDiagram } from "./architecture-diagram";

type CaseStudyData = {
  codeSnippet?: string;
  architectureDiagram?: boolean;
  metrics?: { label: string; value: string }[];
  techBreakdown?: { category: string; items: string[] }[];
};

const CASE_STUDY_DATA: Record<string, CaseStudyData> = {
  "adaptive-learning": {
    architectureDiagram: true,
    codeSnippet: `// Bayesian Knowledge Tracing — per-skill mastery update
function updateMastery(prior, observation, params) {
  const { learn, guess, slip } = params;
  // P(known | observation) via Bayes' rule
  const predicted = prior * (1 - slip) + (1 - prior) * guess;
  const posterior = observation
    ? (prior * (1 - slip)) / predicted
    : (prior * slip) / (1 - predicted);
  // Account for learning between attempts
  return posterior + (1 - posterior) * learn;
}

// Select next question by maximizing information gain
function selectNextSkill(skills, frontier) {
  return frontier
    .map(s => ({ skill: s, entropy: -skills[s] * Math.log2(skills[s]) }))
    .sort((a, b) => b.entropy - a.entropy)[0];
}`,
    metrics: [
      { label: "AI Agents", value: "7" },
      { label: "DB Migrations", value: "11" },
      { label: "Context Window", value: "512 tokens" },
      { label: "Memory Budget", value: "8% of context" },
    ],
    techBreakdown: [
      { category: "Frontend", items: ["Next.js 15 App Router", "TypeScript", "Radix UI", "Framer Motion", "Monaco Editor", "KaTeX"] },
      { category: "Backend", items: ["FastAPI", "Python 3.11", "Pydantic v2", "ReAct Loop", "Mixin Architecture"] },
      { category: "AI/ML", items: ["OpenAI API", "Gemini", "OpenRouter", "Bayesian Knowledge Tracing", "Information Gain Heuristics"] },
      { category: "Data", items: ["Supabase PostgreSQL", "pgvector", "Row-Level Security", "Anonymous Auth"] },
      { category: "Deploy", items: ["Google Cloud Run", "Vercel SSR", "Docker", "Uvicorn"] },
    ],
  },
  "bert-compliance": {
    codeSnippet: `# DistilBERT tokenization pipeline
from transformers import DistilBertTokenizerFast
import torch

tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')

def tokenize_batch(texts, labels, max_length=512):
    encodings = tokenizer(
        texts,
        truncation=True,
        padding='max_length',
        max_length=max_length,
        return_tensors='pt'
    )
    return {
        'input_ids': encodings['input_ids'],
        'attention_mask': encodings['attention_mask'],
        'labels': torch.tensor(labels, dtype=torch.long)
    }

# 15 regulatory compliance categories
CATEGORIES = [
    'false_claims', 'unsubstantiated', 'misleading',
    'omission', 'comparative', 'endorsement',
    # ... 9 more FDA/FTC categories
]`,
    metrics: [
      { label: "Corpus Growth", value: "5.3×" },
      { label: "Categories", value: "15" },
      { label: "Context Window", value: "512 tokens" },
      { label: "Dataset Increase", value: "+430%" },
    ],
    techBreakdown: [
      { category: "Model", items: ["DistilBERT", "HuggingFace Transformers", "PyTorch"] },
      { category: "Data", items: ["Social media", "Influencer marketing", "E-commerce", "Broadcast", "Podcasts", "Email campaigns", "Print media"] },
      { category: "Pipeline", items: ["Tokenization", "Tensor artifacts", "Attention masking", "Padding/Truncation", "Data contracts"] },
    ],
  },
  sigaida: {
    codeSnippet: `# PyTorch LSTM for PM2.5 forecasting
import torch.nn as nn

class PM25Forecaster(nn.Module):
    def __init__(self, input_dim=7, hidden_dim=128, layers=2):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=layers,
            batch_first=True,
            dropout=0.2
        )
        self.fc = nn.Linear(hidden_dim, 24)  # 24h ahead

    def forward(self, x):
        # x: (batch, seq_len, features)
        out, (hn, cn) = self.lstm(x)
        return self.fc(hn[-1])  # predict next 24h`,
    metrics: [
      { label: "Forecast Horizon", value: "24h" },
      { label: "Data Sources", value: "4+" },
      { label: "Team Size", value: "10" },
      { label: "Architecture", value: "Full-stack" },
    ],
    techBreakdown: [
      { category: "Frontend", items: ["Next.js 14", "TypeScript", "FastAPI", "SQLite"] },
      { category: "ML", items: ["PyTorch LSTM", "PM2.5 Forecasting", "Scheduled Inference"] },
      { category: "Data Sources", items: ["OpenAQ", "Open-Meteo", "Google Earth Engine", "GTFS Transit"] },
      { category: "Deploy", items: ["Docker Compose", "FastAPI Endpoints", "Geospatial Viz"] },
    ],
  },
};

export function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto scroll-area"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" />

          {/* Panel */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto my-8 w-full max-w-5xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-3xl liquid-glass-strong border border-border shadow-2xl">
              {/* Hero image */}
              <div className="relative h-64 overflow-hidden sm:h-80">
                <Image
                  src={`/projects/${project.id}.png`}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 70vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl liquid-glass-strong border border-border text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="Close case study"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {project.featured && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Featured
                      </span>
                    )}
                    <span className="rounded-full border border-border bg-card/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {project.category}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                    {project.oneLiner}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                {/* Meta row */}
                <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {project.timeline}
                  </div>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      <Github className="h-4 w-4" /> Source
                    </a>
                  )}
                </div>

                {/* Overview */}
                <section className="mb-10">
                  <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                    Overview
                  </h3>
                  <p className="text-pretty text-base leading-relaxed text-foreground/90">
                    {project.description}
                  </p>
                </section>

                {/* Problem / Solution / Impact */}
                <div className="mb-10 grid gap-4 md:grid-cols-3">
                  <DetailCard
                    icon={<Target className="h-4 w-4" />}
                    label="Problem"
                    body={project.problem}
                  />
                  <DetailCard
                    icon={<Lightbulb className="h-4 w-4" />}
                    label="Solution"
                    body={project.solution}
                  />
                  <DetailCard
                    icon={<TrendingUp className="h-4 w-4" />}
                    label="Impact"
                    body={project.impact.join(" · ")}
                  />
                </div>

                {/* Metrics (if available) */}
                {CASE_STUDY_DATA[project.id]?.metrics && (
                  <section className="mb-10">
                    <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                      Key Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {CASE_STUDY_DATA[project.id]!.metrics!.map((m) => (
                        <div
                          key={m.label}
                          className="rounded-xl border border-border bg-card/40 p-4 text-center"
                        >
                          <div className="font-display text-2xl font-bold text-primary">
                            {m.value}
                          </div>
                          <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Architecture diagram (adaptive learning only) */}
                {CASE_STUDY_DATA[project.id]?.architectureDiagram && (
                  <section className="mb-10">
                    <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                      System Architecture
                    </h3>
                    <ArchitectureDiagram />
                  </section>
                )}

                {/* Code snippet (if available) */}
                {CASE_STUDY_DATA[project.id]?.codeSnippet && (
                  <section className="mb-10">
                    <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                      <Code2 className="h-4 w-4 text-primary" />
                      Implementation Highlight
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-border bg-[#0d1117]">
                      <div className="flex items-center justify-between border-b border-border px-4 py-2">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {project.id}.ts
                        </span>
                      </div>
                      <pre className="overflow-x-auto scroll-area p-4 font-mono text-xs leading-relaxed text-foreground/90">
                        <code>{CASE_STUDY_DATA[project.id]!.codeSnippet}</code>
                      </pre>
                    </div>
                  </section>
                )}

                {/* Tech breakdown (if available) */}
                {CASE_STUDY_DATA[project.id]?.techBreakdown && (
                  <section className="mb-10">
                    <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                      Technology Stack
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {CASE_STUDY_DATA[project.id]!.techBreakdown!.map((cat) => (
                        <div
                          key={cat.category}
                          className="rounded-xl border border-border bg-card/40 p-4"
                        >
                          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                            {cat.category}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {cat.items.map((item) => (
                              <span
                                key={item}
                                className="rounded-md border border-border bg-card/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Tags */}
                <section className="mb-8">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" /> Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary/80"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Footer actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" /> Close
                  </button>
                  <div className="flex items-center gap-2">
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
                      >
                        Visit Demo <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-primary/40"
                      >
                        <Github className="h-3.5 w-3.5" /> Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailCard({
  icon,
  label,
  body,
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}
