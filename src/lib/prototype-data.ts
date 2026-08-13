/**
 * F1-themed content, curated from Shubh Jain's CV.
 * The whole site is a race weekend: driver → wins → directives → standings →
 * setup → pit wall → radio → podium. Copy is race-flavored but factual.
 */

/**
 * Every section on the page, in document order. Lives here rather than in
 * pit-nav so the sitemap (a server module) can read it without pulling a
 * client component into the server graph.
 */
export const SECTIONS = [
  { id: "driver", race: "Paddock", plain: "About", key: "1" },
  { id: "standings", race: "Career Standings", plain: "Experience", key: "2" },
  { id: "wins", race: "Race Wins", plain: "Projects", key: "3" },
  { id: "directives", race: "R&D Bay", plain: "Research & Publications", key: "4" },
  { id: "pitwall", race: "Pit Wall", plain: "Leadership & Volunteering", key: "5" },
  { id: "trophies", race: "Trophy Cabinet", plain: "Awards & Honours", key: "6" },
  { id: "timeline", race: "Strategy Board", plain: "Timeline", key: "7" },
  { id: "setup", race: "Build Sheet", plain: "Skills & Tech Stack", key: "8" },
  { id: "radio", race: "Team Radio", plain: "Contact", key: "9" },
];

export const driver = {
  name: "Shubh Jain",
  number: "16",
  team: "Independent · Self-Built",
  role: "CS @ UIUC · AI Systems Engineer",
  grid: "Urbana-Champaign, IL",
  tagline: "I build intelligent systems that reason — and I race to ship them.",
  intro:
    "Computer Science at the University of Illinois Urbana-Champaign — a top-5 CS program in the U.S. I design multi-agent architectures, train transformers from first principles, ship full-stack products to production, and lead teams that reach tens of thousands. Equal parts engineer, researcher, and builder.",
  email: "shubhj3@illinois.edu",
  github: "https://github.com/infoshubhjain",
  linkedin: "https://www.linkedin.com/in/infoshubhjain/",
  // Résumé is an external link (Google Drive / Dropbox) so updating the file
  // there keeps the site current with no redeploy. Replace with your share link.
  resumeUrl: "https://drive.google.com/file/d/1U3oReqdlwml0lJItc7a57zbN2a1BMrwx/view?usp=sharing",
};

export const seasonStats: { label: string; value: string; sub: string }[] = [
  { label: "Championship", value: "3.83", sub: "CGPA / 4.0" },
  { label: "Wins", value: "15+", sub: "projects shipped" },
  { label: "Podiums", value: "2", sub: "research papers" },
  { label: "Titles", value: "2", sub: "books · ISBN" },
  { label: "Patents", value: "1", sub: "IoT agriculture" },
  { label: "Grid crew", value: "200+", sub: "volunteers led" },
  { label: "Fastest laps", value: "17", sub: "MUN Best Delegate" },
  { label: "Sponsorship", value: "$42K+", sub: "funds raised" },
];

export const honors = ["B.S. CS · Expected May 2028", "Dean's List", "James Scholar"];

export type WinLink = { label: string; href: string; kind: "github" | "demo" | "paper" };
export type Win = {
  id: string;
  pos: string; // P1 / P2 / P3
  name: string;
  year: string;
  role: string;
  circuit: string; // the problem
  setup: string; // the approach
  gap: string; // fastest-lap / key metric
  tech: string[];
  featured?: boolean;
  // Race-debrief (expanded modal):
  overview: string;
  impact: string[];
  metrics: { label: string; value: string }[];
  stack: { group: string; items: string[] }[];
  links: WinLink[];
  /** Screenshot in /public/projects. Cards without one just lead with the header. */
  image?: string;
};

export const wins: Win[] = [
  {
    id: "meter",
    pos: "P1",
    name: "Meter",
    year: "2026",
    role: "Backend & Infra Lead",
    circuit: "LLM spend has no enforcement layer — concurrent requests race past the same budget ceiling and streamed responses silently under-bill.",
    setup: "FastAPI metering proxy with an authorize/capture reservation system under a single asyncio lock, dual-protocol SSE usage parsing, and a two-condition circuit breaker.",
    gap: "~3,600 LOC · 256-assertion suite · ~400 req/s · 1 round trip removed",
    tech: ["Python", "FastAPI", "asyncio", "PostgreSQL", "Docker"],
    featured: true,
    overview:
      "An autonomous LLM cost-governance proxy that sits in front of OpenAI and Anthropic. It enforces per-project and per-feature spend ceilings on the hot path — authenticate → attribute → predict → circuit-break → reserve → forward → capture — while a caller's existing provider SDK keeps working unmodified.",
    impact: [
      "Authorize/capture reservations count in-flight holds alongside settled ledger spend inside one asyncio lock, closing the read-then-call race that lets N concurrent requests overspend a shared ceiling; proved with a 40-way concurrent test against a ceiling funding exactly 4 requests.",
      "Heartbeats reservations every 30s against a 120s TTL so a hold can't expire mid-stream — the under-billing failure mode that raised no exception and hit the longest, most expensive requests hardest.",
      "Dual-protocol SSE usage parser reconciles formats that disagree: injects and strips OpenAI's stream_options.include_usage, and reassembles Anthropic usage split across message_start and message_delta — reading only the first under-counts output tokens ~40×.",
      "Found and fixed a silent corruption invalidating 100% of streamed cost data: real providers gzip SSE, the raw read found no data: lines and quietly downgraded to byte-count estimates. The whole suite passed throughout, because fake upstreams don't compress — pinned with a purpose-built gzipping HTTP server.",
      "Reframed proxy latency as a round-trip count model, proved the published 52.7 ms benchmark measured a config nobody runs, and removed one database round trip (~50 ms/request remote) by folding two spend aggregates into a single scan.",
      "Two-condition circuit breaker: absolute spend floor over a 5-minute window AND a 3× burst ratio against the trailing hour, with tag-scoped 429 throttling, key-scoped 403 revocation and half-open recovery — Google's multi-burn-rate pattern adapted, not ported.",
      "Led a full-codebase security audit reproducing every finding against a running service: a CORS regex matching any attacker-published *.vercel.app deployment, an unauthenticated endpoint exposing the payment loop, and a per-IP rate-limit bypass from a missing --proxy-headers flag.",
      "Authored the test and measurement infrastructure — 256-assertion proxy suite, 750-LOC soak harness, latency benchmark — sustaining ~400 req/s over ~5,000 requests at 16 clients with zero dropped ledger writes; the harnesses surfaced 6 pre-existing defects.",
    ],
    metrics: [
      { label: "Proxy LOC", value: "~3,600" },
      { label: "Assertions", value: "867" },
      { label: "Throughput", value: "~400 req/s" },
      { label: "Concurrency test", value: "40-way" },
    ],
    stack: [
      { group: "Proxy", items: ["FastAPI", "asyncio", "httpx", "SSE"] },
      { group: "Data", items: ["PostgreSQL", "spend ledger", "reservations"] },
      { group: "Control", items: ["Circuit breaker", "Rate limits", "Audit"] },
      { group: "Ops", items: ["Docker (non-root)", "GitHub Actions", "ruff", "pip-audit"] },
    ],
    links: [],
  },
  {
    id: "mnemostack",
    pos: "P1",
    name: "Mnemostack",
    year: "2026",
    role: "Lead SWE",
    circuit: "AI coding assistants retrieve isolated files, losing the dependency chain.",
    setup: "Local MCP daemon: hybrid FAISS HNSW + SQLite FTS5/BM25 fused with RRF (k=60), plus 2-hop BFS call-graph expansion.",
    gap: "150+ tests · 5.6k LOC · 8 MCP tools · O(log n) ANN",
    tech: ["Python", "tree-sitter", "FAISS HNSW", "BM25 / RRF", "MCP"],
    featured: true,
    overview:
      "A local MCP server that gives AI coding assistants graph-aware memory — it retrieves whole dependency chains (callers and callees), not isolated files, so the model sees the real context around a symbol.",
    impact: [
      "Fused FAISS HNSW semantic search with SQLite FTS5/BM25 keyword search via Reciprocal Rank Fusion (k=60) and 3× top-k over-fetch.",
      "2-hop BFS call-graph expansion over CALLS / IMPORTS_FROM edges surfaces cross-file dependencies 1–2 hops away.",
      "Multi-signal re-ranking weighted 0.6 semantic · 0.25 recency · 0.15 dependency, with a 60-minute recency half-life.",
      "AST chunking via tree-sitter across 6 language extensions; live re-indexing on save with a 500 ms debounce.",
      "Validated with 150+ tests across ~5.6k lines of Python; shipped 8 typed MCP tools over stdio.",
    ],
    metrics: [
      { label: "Tests", value: "150+" },
      { label: "MCP tools", value: "8" },
      { label: "Python LOC", value: "5.6k" },
      { label: "RRF · k", value: "60" },
    ],
    stack: [
      { group: "Retrieval", items: ["FAISS HNSW", "SQLite FTS5/BM25", "RRF fusion"] },
      { group: "Parsing", items: ["tree-sitter", "AST chunking", "6 languages"] },
      { group: "Graph", items: ["2-hop BFS", "CALLS / IMPORTS_FROM"] },
      { group: "Runtime", items: ["MCP over stdio", "watchdog", "500ms debounce"] },
    ],
    links: [{ label: "Source", href: "https://github.com/Switchblack-Labs/Mnemostack", kind: "github" }],
  },
  {
    id: "astrasign",
    pos: "P1",
    name: "AstraSign",
    year: "2026",
    role: "Lead SWE",
    circuit: "ASL users and speakers can't communicate in real time, both directions.",
    setup: "Bidirectional ASL ↔ speech: MediaPipe dual-hand tracking → TF.js classifier → Whisper/Gemini/ElevenLabs pipeline, 3D avatars.",
    gap: "~30 FPS · 21 landmarks · 262-sign DB · 10+ REST APIs",
    tech: ["React", "FastAPI", "MediaPipe", "TensorFlow.js", "Three.js"],
    featured: true,
    overview:
      "A real-time, bidirectional ASL ↔ speech translator: sign-to-speech and speech-to-signed-3D-avatars, running dual-hand tracking in the browser at ~30 FPS.",
    impact: [
      "MediaPipe HandLandmarker tracks 2 hands × 21 landmarks (63 features/frame) on a ~33 ms requestAnimationFrame loop.",
      "Browser TensorFlow.js classifier (68→128/64/32 dense, dropout, softmax) with landmark smoothing and temporal confidence accumulation.",
      "Multi-model NLP pipeline: Whisper STT → Gemini English→ASL gloss → 262-sign lookup → ElevenLabs TTS.",
      "30+ React components and custom hooks (useHandTracking, useVoicePipeline) keep the UI responsive under continuous video inference.",
      "10+ REST endpoints across 6 route modules; interactive 3D avatars via React Three Fiber (3 characters, 8 sign GLBs).",
    ],
    metrics: [
      { label: "Frame rate", value: "~30 FPS" },
      { label: "Landmarks", value: "21 × 2" },
      { label: "Sign DB", value: "262" },
      { label: "Endpoints", value: "10+" },
    ],
    stack: [
      { group: "Frontend", items: ["React 18", "TypeScript", "Three.js / R3F", "Tailwind"] },
      { group: "CV / ML", items: ["MediaPipe", "TensorFlow.js"] },
      { group: "AI", items: ["Whisper", "Gemini", "ElevenLabs"] },
      { group: "Backend", items: ["FastAPI", "Pydantic", "Modal"] },
    ],
    links: [
      { label: "Live demo", href: "https://astrasign-f8d8832c.aedify.ai/", kind: "demo" },
      { label: "Source", href: "https://github.com/AashnaAnand25/AstraSign", kind: "github" },
    ],
  },
  {
    id: "adaptive-learning",
    pos: "P1",
    name: "Adaptive Learning Platform",
    year: "2026",
    role: "Architect",
    circuit: "One-size-fits-all learning ignores each student's real mastery frontier.",
    setup: "Multi-agent backend (7 ReAct agents) + a Bayesian Knowledge Tracing engine built from scratch that picks questions by expected information gain.",
    gap: "7 agents · BKT from scratch · 200+ msg memory · Vercel + Cloud Run",
    tech: ["Next.js 15", "FastAPI", "Supabase", "OpenAI", "pgvector"],
    featured: true,
    overview:
      "A full-stack adaptive learning platform whose multi-agent backend personalizes every step — powered by a Bayesian Knowledge Tracing engine written from scratch.",
    impact: [
      "7 specialized ReAct agents (Roadmap, Knowledge, Quiz, Conversation, Tasker, Memory Compactor, Orchestrator) coordinate in real time via a mixin architecture.",
      "BKT engine models per-skill mastery with learn/guess/slip parameters and selects the next question by maximizing expected information gain.",
      "Durable Bayesian posteriors in Supabase resume accurate knowledge state across sessions and projects (dual global + per-project skill tables).",
      "Sliding-window memory manager with dynamic token budgeting sustains coherent 200+ message teaching sessions.",
      "11 Postgres migrations, pgvector semantic retrieval, RLS isolation; Dockerized FastAPI on Cloud Run, Next.js 15 on Vercel.",
    ],
    metrics: [
      { label: "AI agents", value: "7" },
      { label: "Migrations", value: "11" },
      { label: "Memory", value: "200+ msgs" },
      { label: "Deploy", value: "Vercel + GCR" },
    ],
    stack: [
      { group: "Frontend", items: ["Next.js 15", "TypeScript", "Framer Motion", "Monaco"] },
      { group: "Backend", items: ["FastAPI", "Python 3.11", "ReAct loop"] },
      { group: "AI", items: ["OpenAI", "Gemini", "BKT", "Info-gain"] },
      { group: "Data", items: ["Supabase", "pgvector", "RLS"] },
    ],
    links: [{ label: "Live demo", href: "https://aiceuiuc.vercel.app/", kind: "demo" }],
  },
  {
    id: "sigaida",
    pos: "P2",
    name: "SIGAIDA Campus Energy",
    year: "2025",
    role: "Lead SWE / PM",
    circuit: "Campus air-quality and environmental data is fragmented and un-forecast.",
    setup: "Full-stack monitoring platform + a PyTorch LSTM forecasting PM2.5 24h ahead, with ETL over OpenAQ / Open-Meteo / Earth Engine / GTFS.",
    gap: "10-member team · 4+ data sources · Docker Compose",
    tech: ["Next.js", "FastAPI", "PyTorch LSTM", "Docker"],
    overview:
      "A full-stack environmental-monitoring platform for campus energy and air quality, with a PyTorch LSTM that forecasts PM2.5 24 hours ahead.",
    impact: [
      "Led a 10-member team across Next.js 14 / TypeScript / FastAPI / SQLite delivering real-time air, weather, vegetation and transit analytics.",
      "PyTorch LSTM forecasting pipeline predicts PM2.5 24h ahead, trained on multi-year data with scheduled backend inference.",
      "Automated ETL over OpenAQ, Open-Meteo, Google Earth Engine and GTFS, standardizing satellite + sensor data into one schema.",
      "Containerized with Docker Compose; production FastAPI endpoints with geospatial and time-series visualizations.",
    ],
    metrics: [
      { label: "Team", value: "10" },
      { label: "Forecast", value: "24h ahead" },
      { label: "Data sources", value: "4+" },
      { label: "Delivery", value: "Full-stack" },
    ],
    stack: [
      { group: "Frontend", items: ["Next.js 14", "TypeScript"] },
      { group: "Backend", items: ["FastAPI", "SQLite", "Docker Compose"] },
      { group: "ML", items: ["PyTorch LSTM", "Scheduled inference"] },
      { group: "Data", items: ["OpenAQ", "Open-Meteo", "Earth Engine", "GTFS"] },
    ],
    links: [{ label: "Source", href: "https://github.com/infoshubhjain/SIGAIDA-CAMPUS-ENERGY", kind: "github" }],
  },
  {
    id: "neuro-rust",
    pos: "P2",
    name: "neuro-rust",
    year: "2026",
    role: "CS 128 Honors",
    circuit: "Understand backprop by building a neural net with zero ML libraries.",
    setup: "Feedforward net in pure Rust — Xavier init, sigmoid, MSE, chain-rule backprop, online SGD across a configurable architecture.",
    gap: "0 ML libs · learns XOR in 10k epochs · 15 unit tests",
    tech: ["Rust", "ndarray", "SGD", "backprop"],
    overview:
      "A feedforward neural network built from scratch in Rust with zero ML libraries — just ndarray for matrices and rand for init — to understand backprop end to end.",
    impact: [
      "Forward propagation, chain-rule backpropagation, and online SGD across a configurable layer architecture.",
      "Xavier/Glorot initialization, sigmoid with analytic derivative, MSE loss; learns XOR in 10,000 epochs at lr 1.0.",
      "Owned the Network struct, backprop (delta computation + upstream gradient propagation), docs, and RUN.md.",
      "15 unit tests: sigmoid correctness, layer shapes, forward-cache consistency, hand-computed gradient verification, XOR convergence.",
    ],
    metrics: [
      { label: "ML libraries", value: "0" },
      { label: "Unit tests", value: "15" },
      { label: "XOR epochs", value: "10k" },
      { label: "Language", value: "Rust" },
    ],
    stack: [
      { group: "Core", items: ["Rust", "ndarray", "rand"] },
      { group: "Algorithms", items: ["Forward prop", "Backprop", "Online SGD"] },
      { group: "Init / Loss", items: ["Xavier", "Sigmoid", "MSE"] },
    ],
    links: [{ label: "Source", href: "https://github.com/infoshubhjain/cs128hons", kind: "github" }],
  },
  {
    id: "harvest",
    pos: "P3",
    name: "Project Harvest",
    year: "2025",
    role: "Lead SWE",
    circuit: "Dining-hall nutrition data is stale and hard to filter.",
    setup: "Full-stack ecosystem for 4 dining halls — Selenium scrapers + Node API + responsive macro/allergen dashboard, CI/CD via GitHub Actions.",
    gap: "1000+ daily users · 4 halls · 90% less manual upkeep",
    tech: ["React", "Selenium", "Node.js", "SQLite"],
    overview:
      "A full-stack ecosystem for four dining halls that keeps nutrition data fresh and filterable for 1000+ daily users.",
    impact: [
      "React + Node.js dashboard shows calories, macros, allergens and meal filtering for 1000+ daily users.",
      "Python Selenium scrapers collect daily menus automatically, keeping data 100% up to date.",
      "RESTful Node.js backend serves all frontend requests from SQLite.",
      "GitHub Actions CI/CD automates daily scraping, validation and deployment — cutting manual upkeep ~90%.",
    ],
    metrics: [
      { label: "Users / day", value: "1000+" },
      { label: "Dining halls", value: "4" },
      { label: "Manual upkeep", value: "−90%" },
      { label: "CI/CD", value: "Actions" },
    ],
    stack: [
      { group: "Frontend", items: ["React", "Responsive dashboard"] },
      { group: "Backend", items: ["Node.js", "REST", "SQLite"] },
      { group: "Data", items: ["Python Selenium"] },
      { group: "Ops", items: ["GitHub Actions CI/CD"] },
    ],
    links: [{ label: "Source", href: "https://github.com/infoshubhjain/Project-Harvest", kind: "github" }],
  },
  {
    id: "bert-compliance",
    pos: "P2",
    name: "BERT Ad Compliance Classifier",
    year: "2026",
    role: "Machine Learning Engineer",
    circuit:
      "FDA/FTC advertising rules span 15 regulatory categories, and the labelled corpus for training a classifier on them was 10 samples deep.",
    setup:
      "Owned the data layer of a DistilBERT classifier — an end-to-end preprocessing and tokenization pipeline turning raw ad scripts into model-ready tensors, plus the dataset schema the rest of the project built against.",
    gap: "15 categories · 5.3× corpus growth · 512-token context",
    tech: ["PyTorch", "HuggingFace Transformers", "DistilBERT", "Python"],
    overview:
      "A DistilBERT NLP system that detects FDA/FTC advertising compliance violations across 15 regulatory categories. I owned the data stage end to end — preprocessing, tokenization, dataset curation and the artifact specification that formed the interface between dataset curation and transformer fine-tuning.",
    impact: [
      "Built the preprocessing and tokenization infrastructure transforming raw advertising scripts into model-ready tensor datasets (input_ids, attention_mask, labels).",
      "Expanded and balanced the training corpus 5.3× (10 → 53 labelled samples), reaching near-equal class distribution across all 15 violation categories.",
      "Designed the canonical dataset schema and tensor artifact specification adopted project-wide, defining the data contract downstream contributors built against.",
      "Curated a domain-specific corpus spanning social media, influencer marketing, e-commerce listings, broadcast, podcasts, email and print — so the model generalises across ad formats rather than one channel.",
      "Implemented DistilBERT-compatible tokenization using the full 512-token context window with padding, truncation and attention masking, keeping preprocessing consistent with the downstream architecture.",
    ],
    metrics: [
      { label: "Categories", value: "15" },
      { label: "Corpus growth", value: "5.3×" },
      { label: "Context window", value: "512" },
      { label: "Pipeline stage", value: "Owned" },
    ],
    stack: [
      { group: "Modelling", items: ["DistilBERT", "HuggingFace Transformers", "PyTorch"] },
      { group: "Data", items: ["Tokenization", "Dataset curation", "Tensor artifacts"] },
      { group: "Process", items: ["Git", "Technical documentation"] },
    ],
    links: [],
  },
  {
    id: "helix",
    pos: "P3",
    name: "Project Helix",
    year: "2025",
    role: "Lead SWE",
    circuit:
      "Campus events are scattered across 15+ university sources, every one publishing a different and inconsistent HTML structure.",
    setup:
      "Multi-technique scraping pipeline pairing BeautifulSoup with Playwright to cover static and JavaScript-rendered sources, normalising everything into one relational schema with OAuth2 export to Google Calendar.",
    gap: "1000+ events · 15+ sources unified",
    tech: ["Next.js", "BeautifulSoup", "Playwright", "OAuth2"],
    overview:
      "A campus event aggregation platform that scrapes and unifies 1000+ events from 15+ university sources into a single queryable, filterable schema — and lets authenticated users push them straight into their own calendar.",
    impact: [
      "Scraped and unified 1000+ events from 15+ university sources, normalising inconsistent HTML into a centralised relational schema for dynamic querying and filtering.",
      "Combined BeautifulSoup and Playwright in one pipeline to handle both static and JavaScript-rendered sources, with deduplication logic and scheduled scraping workflows.",
      "Built a RESTful API layer with OAuth2 Google Calendar integration, letting authenticated users export aggregated events to personal calendars under token-based access control.",
    ],
    metrics: [
      { label: "Events", value: "1000+" },
      { label: "Sources", value: "15+" },
      { label: "Auth", value: "OAuth2" },
      { label: "Schema", value: "Unified" },
    ],
    stack: [
      { group: "Frontend", items: ["Next.js"] },
      { group: "Scraping", items: ["BeautifulSoup", "Playwright", "Deduplication"] },
      { group: "Integration", items: ["REST", "OAuth2", "Google Calendar API"] },
    ],
    links: [],
  },
];

export type Directive = {
  kind: "Patent" | "Paper" | "Book" | "Training";
  title: string;
  venue: string;
  year: string;
  note: string;
};

export const directives: Directive[] = [
  {
    kind: "Training",
    title: "UR2PhD Pre-REC Research Training Program",
    venue: "Research methods & reproducibility",
    year: "2026",
    note: "Reproduced a published protein-structure-classification benchmark across 72 datasets in Python/pandas/Matplotlib — finding traditional ML stays competitive with deep learning at a fraction of the runtime — plus a counterfactual name-perturbation replication of an NLP toxicity-bias workflow.",
  },
  {
    kind: "Patent",
    title: "IoT & Precision Agriculture System",
    venue: "Granted Patent",
    year: "2024",
    note: "Real-time soil / crop / water monitoring with automated irrigation and predictive analytics for sustainable farming in India.",
  },
  {
    kind: "Paper",
    title: "A Comparative Assessment of Advanced Conversational Agents",
    venue: "IJETAE",
    year: "2024",
    note: "Mixed-methods evaluation of ChatGPT, Gemini, Perplexity & Claude across accuracy, coherence, creativity and bias.",
  },
  {
    kind: "Paper",
    title: "Performance of ChatGPT on Common-Sense Questionnaires",
    venue: "IJETAE",
    year: "2023",
    note: "Best Junior Author of the Year ($1,000) · most-downloaded high-school-authored paper in journal history.",
  },
  {
    kind: "Book",
    title: "IoT in Agriculture: Revolutionizing Indian Farming",
    venue: "ISBN 978-9394351950",
    year: "2024",
    note: "500+ copies distributed to universities; recognized by the Governor of Madhya Pradesh for agricultural innovation.",
  },
  {
    kind: "Book",
    title: "Beyond the Black Box: Unlocking Explainable AI",
    venue: "ISBN B0F38TX4ZR",
    year: "2025",
    note: "Post-hoc interpretability, counterfactuals & surrogate models applied to healthcare, finance and autonomous systems.",
  },
];

export type Stint = {
  team: string;
  role: string;
  period: string;
  note: string;
  points: string[];
  link?: string;
};

export const standings: Stint[] = [
  {
    team: "QuantHQ",
    role: "Software Engineering Intern",
    period: "May 2026 – Aug 2026",
    note: "Solo-built Alpha Engine: deterministic multi-asset signal research across crypto, US & Indian equities, F&O and forex — then backtested it honestly and published the null result rather than a claim.",
    points: [
      "Built a deterministic research engine — 22 independent analyzers synthesized into directional signals with calibrated confidence and explicit invalidation prices (33K LOC, solo).",
      "Integrated 25+ market data sources (Binance, Glassnode, FRED, OANDA, Dhan, AngelOne, NSE, RBI, Finnhub) behind a unified ingestion layer with caching, health tracking and automatic failover.",
      "Backtested 6,788 signals across 7 assets / 5 years via no-lookahead replay — measured +0.0% edge over base rates and published the null result in FINDINGS.md instead of an unvalidated claim.",
      "Maintained 1,009 tests across 57 suites; shipped CLI, HTTP API and MCP server interfaces with Docker packaging and daily signal collection via GitHub Actions.",
      "Designed and built the public organisation site (quanthq.in) solo as a static Astro 5 SSG — type-safe MDX content collections with Zod schemas, interactive canvas visualisations in vanilla script tags, light/dark theming and a contrast audit, deployed to a custom domain via GitHub Pages CI.",
    ],
    link: "https://quanthq.in",
  },
  {
    team: "The HDF Group",
    role: "Software Engineer (part-time) — HDF5 AI Pipeline",
    period: "May 2026 – Aug 2026",
    note: "LLM refactoring engine for the 25-year-old HDF5 C library with a dual-LLM consensus gate (Claude + GPT-4o both_approve/disagree).",
    points: [
      "Built the primary LLM refactoring engine (457 LOC) generating git-format-patch-validated diffs with invariants enforcing no-new-API / no-new-export / no-new-file.",
      "Designed the multi-model consensus gate — Claude Sonnet and GPT-4o independently review every diff, with split verdicts routed to a human-review disagreements ledger.",
      "Parallelized the dual-LLM gate (ThreadPoolExecutor, ~2× faster per diff) and added a zero-API-cost faithfulness pre-check catching hallucinated RAG citations in ~1 ms.",
      "Authored ~280 unit and mocked-E2E tests (14-person repo, 809 total), contributing 80 commits and ~22K lines; prompt caching cut repeat-call cost ~80%.",
    ],
    link: "https://www.hdfgroup.org",
  },
  {
    team: "Exam Lounge",
    role: "Junior AI & NLP Lead Researcher",
    period: "May 2024 – Aug 2024",
    note: "Led a 31-intern team (Agile) improving a production exam platform.",
    points: [
      "Led a cross-functional team of 31 interns with Agile methodology, improving exam model accuracy by 15%.",
      "Designed data pipelines for large-scale educational datasets and optimization techniques that lifted performance 20%.",
      "Coordinated multiple bug-detection teams, cutting critical production errors by 40%.",
      "Awarded Intern of the Month in 3 of 4 months for problem-solving and communication.",
    ],
  },
  {
    team: "IETE",
    role: "Machine Learning Intern",
    period: "Jun 2023 – Aug 2023",
    note: "Shipped three production AI systems end to end.",
    points: [
      "Built and deployed a full-stack AI chatbot with database integration handling 200+ daily inquiries.",
      "Implemented a BiLSTM misinformation detector at 87% accuracy and a sentiment tool processing 10,000+ reviews.",
      "Completed a regression price-prediction capstone with <5% mean error.",
    ],
  },
  {
    team: "Freelance",
    role: "Web Developer",
    period: "May 2023 – May 2025",
    note: "40+ websites shipped across the full product lifecycle.",
    points: [
      "Designed and developed 40+ websites — SEO, responsive UI/UX, payment gateways, e-commerce, booking systems and analytics.",
      "Managed complete project lifecycles from client consultation to launch.",
      "Delivered against a diverse client base spanning personal brands, local businesses and online stores.",
    ],
  },
  {
    team: "YBI Foundation",
    role: "AI & ML Intern",
    period: "2023",
    note: "Intensive one-month practical AI/ML program.",
    points: [
      "Worked through a hands-on AI/ML curriculum end to end — data preparation, model training and evaluation.",
      "Built and evaluated models on real datasets rather than toy examples.",
    ],
  },
  {
    team: "Rancho Labs · IIT Delhi",
    role: "AI/ML Program — Top 20 Nationwide",
    period: "2022 – 2023",
    note: "Selected among 20 students nationwide for an intensive AI/ML program at IIT Delhi's IHFC innovation hub.",
    points: [
      "Selected nationwide (top 20) for a hands-on AI/ML program hosted at IIT Delhi's IHFC.",
      "Built practical models on real datasets — training, evaluation and deployment fundamentals.",
      "Earned a strong early foundation that directly fed into later research and engineering work.",
    ],
  },
];

export const setup: { unit: string; parts: string[] }[] = [
  { unit: "Power Unit — Languages", parts: ["Python", "TypeScript", "Rust", "Kotlin", "JavaScript", "C++", "SQL", "Java"] },
  { unit: "Aero — AI & ML", parts: ["Multi-Agent Systems", "Transformers", "PyTorch", "BKT", "MediaPipe", "TensorFlow.js", "HuggingFace", "LLM Pipelines"] },
  { unit: "Chassis — Full-Stack", parts: ["Next.js", "React", "FastAPI", "Node.js", "Supabase", "Docker", "Tailwind", "Three.js"] },
  { unit: "Telemetry — Data & Infra", parts: ["pgvector", "FAISS", "SQLite", "ETL Pipelines", "Cloud Run", "GitHub Actions", "OAuth2"] },
  { unit: "Strategy — Research", parts: ["Explainable AI", "NLP", "Bayesian Methods", "Technical Writing", "Experiment Design"] },
];

export type PitRole = {
  org: string;
  role: string;
  period: string;
  /** Short category chip — Founder / Fellowship / Events / Mentoring / Editorial / Service. */
  tag: string;
  metric: string;
  note: string;
  /** The three headline roles get the wide treatment in the Pit Wall grid. */
  featured?: boolean;
};

export type Trophy = {
  /** The headline figure — what a recruiter reads first. */
  value: string;
  title: string;
  issuer: string;
  year: string;
  note: string;
  /** 1 = the three podium trophies, 2 = the cabinet grid behind them. */
  tier: 1 | 2;
};

/** The honours board — every entry verbatim from the CV. */
export const trophies: Trophy[] = [
  {
    value: "2.5%",
    title: "MLH Commit Fellow",
    issuer: "Major League Hacking × Transcend Network",
    year: "2026",
    note: "One of 30 fellows in the inaugural founder-track cohort, selected globally alongside Stanford, MIT and Ivy League peers.",
    tier: 1,
  },
  {
    value: "$1,000",
    title: "Best Junior Author of the Year",
    issuer: "IJETAE",
    year: "2023",
    note: "For the ChatGPT common-sense study — the most-downloaded high-school-authored paper in the journal's history.",
    tier: 1,
  },
  {
    value: "Granted",
    title: "IoT & Precision Agriculture Patent",
    issuer: "Government of India",
    year: "2024",
    note: "Real-time soil, crop and water monitoring with automated irrigation and predictive analytics for sustainable farming.",
    tier: 1,
  },
  {
    value: "17×",
    title: "Best Delegate",
    issuer: "Model United Nations",
    year: "2022–24",
    note: "Across 35+ conferences, while chairing 8+ committees and serving twice as Secretary General.",
    tier: 2,
  },
  {
    value: "Sole",
    title: "School Colour for ICT",
    issuer: "TSVS",
    year: "2024",
    note: "The only high-school recipient — awarded for cybersecurity workshops, TechFest and network administration.",
    tier: 2,
  },
  {
    value: "3 of 4",
    title: "Intern of the Month",
    issuer: "Exam Lounge",
    year: "2024",
    note: "Three months out of a four-month internship, for problem-solving and communication while leading 31 interns.",
    tier: 2,
  },
  {
    value: "Top 20",
    title: "AI/ML Program — Nationwide",
    issuer: "Rancho Labs · IIT Delhi IHFC",
    year: "2022",
    note: "Selected among 20 students nationally for an intensive hands-on AI/ML program at IIT Delhi's innovation hub.",
    tier: 2,
  },
  {
    value: "Dean's List",
    title: "Academic Honours",
    issuer: "University of Illinois Urbana-Champaign",
    year: "2025–26",
    note: "Sustained academic excellence in a top-5 US Computer Science program, alongside the James Scholar honours program.",
    tier: 2,
  },
  {
    value: "Governor",
    title: "Recognition for Agricultural Innovation",
    issuer: "State of Madhya Pradesh",
    year: "2024",
    note: "For 'IoT in Agriculture' — 500+ copies distributed to universities across India.",
    tier: 2,
  },
  {
    value: "1 of 50+",
    title: "Best Club Exhibition",
    issuer: "AI & STEM Club",
    year: "2024",
    note: "Won against 50+ clubs with an AI-powered chatbot built for school operations.",
    tier: 2,
  },
];

/** Mirrors `leadership` in portfolio-data.ts — same CV, race-flavored copy. */
export const pitWall: PitRole[] = [
  {
    org: "Project Uthaan",
    role: "Founder & President",
    period: "Dec 2022 – Dec 2025",
    tag: "Founder",
    metric: "200+ volunteers · 6 cities · $24K",
    note: "Built 8 classrooms, installed 100+ computers, educated 2,200+ across digital literacy and vocational programs — 700+ women, 600+ children, 300+ seniors.",
    featured: true,
  },
  {
    org: "AI & STEM Club",
    role: "Founder & President",
    period: "Mar 2023 – Mar 2025",
    tag: "Founder",
    metric: "80+ members · $7K raised",
    note: "Established the city's first AI & STEM lab and recording studio; built the school's largest club and won 'Best Club Exhibition' among 50+ clubs.",
    featured: true,
  },
  {
    org: "Model United Nations",
    role: "Secretary General ×2",
    period: "Feb 2022 – Nov 2024",
    tag: "Leadership",
    metric: "35+ MUNs · 17 Best Delegate",
    note: "Chaired 8+ committees, ran conferences of 700+ delegates, trained junior secretariats in procedure, motions and conflict resolution.",
    featured: true,
  },
  {
    org: "MLH × Transcend Network",
    role: "Commit Fellow — Founding Cohort",
    period: "Jun 2026 – Jul 2026",
    tag: "Fellowship",
    metric: "2.5% acceptance · 30 fellows",
    note: "Ran 24 lean experiments and 15 founder conversations, invalidated 3 core assumptions, and advised founders and Transcend Fund GPs on B2B pricing and AI integration.",
  },
  {
    org: "UI-CON",
    role: "Panels Head",
    period: "Oct 2025 – Feb 2026",
    tag: "Events",
    metric: "2,000+ attendees · 60+ volunteers",
    note: "Ran 20+ panels and 40+ guests across 8 event areas, planning 250+ volunteer hours and troubleshooting 6+ simultaneous rooms live.",
  },
  {
    org: "SBI Sustainability Drive",
    role: "Head of Operations",
    period: "Jun 2023 – Jul 2023",
    tag: "Events",
    metric: "18,000+ trees · $10K",
    note: "Led an 80-member team with SBI, BHEL and local NGOs across 6 acres of reforestation, including 100+ native species, plus press and community outreach.",
  },
  {
    org: "SSUAB · UIUC",
    role: "Director of Board Development",
    period: "Aug 2025 – Present",
    tag: "Leadership",
    metric: "Board-wide development",
    note: "Authored a comprehensive report on undergraduate research and career-services gaps; mentors peers on résumés, LinkedIn and professional communication.",
  },
  {
    org: "Diwali on the Quad",
    role: "Management Head",
    period: "Oct 2025",
    tag: "Events",
    metric: "1,000+ attendees · 30+ volunteers",
    note: "Directed a 4-hour campus festival on a centralized task system — 50+ tracked tasks, 10+ cultural performances, vendor and crowd-flow coordination.",
  },
  {
    org: "TSVS Student Council",
    role: "ICT Captain",
    period: "Aug 2023 – Aug 2024",
    tag: "Leadership",
    metric: "15+ workshops · 900+ trained",
    note: "Ran cybersecurity workshops and a 1,000+ participant TechFest while managing the school website and network — School Colour for ICT, the only high-school recipient.",
  },
  {
    org: "MetroVaartha",
    role: "Junior Editor-in-Chief",
    period: "Aug 2022 – Aug 2023",
    tag: "Editorial",
    metric: "50,000+ readers · 200+ articles",
    note: "Led the technology section of a national newspaper: supervised junior editors, edited 200+ articles, and wrote an AI feature that reached 50,000+ readers.",
  },
  {
    org: "Bharat Scouts and Guides",
    role: "Teacher & Mentor",
    period: "Mar 2022 – Mar 2023",
    tag: "Service",
    metric: "30,000+ reached · 90+ volunteers",
    note: "Mentored 400+ underprivileged children, managed 90+ volunteers on community campaigns, and raised $1,500+ for education initiatives.",
  },
  {
    org: "UIUC Siebel",
    role: "CS Peer Mentor · CS 124 Tutor",
    period: "Jan 2026 – Present",
    tag: "Mentoring",
    metric: "80+ sessions",
    note: "One-on-one support across CS 124/128/173/225 — meeting each student at their exact point of confusion, and advising on RSOs, research access and course sequencing.",
  },
];

/** Headline numbers behind the leadership work — each traceable to one role above. */
export const crewStats: { label: string; value: string; sub: string }[] = [
  { label: "Funds raised", value: "$42K+", sub: "across every program" },
  { label: "Educated", value: "2,200+", sub: "Project Uthaan" },
  { label: "Reached", value: "30,000+", sub: "Scouts campaigns" },
  { label: "Trees planted", value: "18,000+", sub: "SBI drive · 6 acres" },
];

/** Unpaid crews joined rather than led — the short list under the Pit Wall. */
export const volunteering: { org: string; contribution: string }[] = [
  {
    org: "Hira Nyas Trust",
    contribution:
      "Designed and ran computer-literacy workshops for underprivileged communities; organized fundraising through handmade product sales.",
  },
  {
    org: "Lalitambha Social Welfare Society",
    contribution:
      "Ran digital-literacy and computer-basics workshops, improving community access to educational resources.",
  },
  {
    org: "S.H.E Foundation",
    contribution:
      "Coordinated project management, operational strategy and execution for education and community-development initiatives.",
  },
];

/* ── Strategy board: a multi-track timeline (parallel stints, 2022–2026) ── */

export type TrackId = "eng" | "research" | "lead";
export const timelineSpan = { start: 2022, end: 2026 };
export const timelineTracks: { id: TrackId; label: string }[] = [
  { id: "eng", label: "Engineering" },
  { id: "research", label: "Research & Writing" },
  { id: "lead", label: "Leadership" },
];

export type TimelineStint = {
  track: TrackId;
  start: number;
  end: number;
  title: string;
  detail: string;
};

export const timeline: TimelineStint[] = [
  // Engineering
  { track: "eng", start: 2023, end: 2025, title: "Freelance Web Dev", detail: "40+ sites — SEO, e-commerce, booking; full lifecycle, consult to launch." },
  { track: "eng", start: 2023, end: 2023, title: "IETE — ML Intern", detail: "AI chatbot (200+/day), BiLSTM misinformation detector at 87%." },
  { track: "eng", start: 2024, end: 2024, title: "Exam Lounge — AI/NLP Lead", detail: "Led 31 interns; +15% model accuracy; Intern of the Month ×3." },
  { track: "eng", start: 2025, end: 2025, title: "SIGAIDA Campus Energy", detail: "Env-monitoring platform + PyTorch LSTM PM2.5 forecast; 10-person team." },
  { track: "eng", start: 2025, end: 2025, title: "Project Helix", detail: "1000+ campus events unified from 15+ sources; OAuth2 calendar export." },
  { track: "eng", start: 2025, end: 2026, title: "BERT Ad Compliance Classifier", detail: "Owned the data layer of a DistilBERT FDA/FTC classifier across 15 categories." },
  { track: "eng", start: 2025, end: 2026, title: "Adaptive Learning Platform", detail: "7-agent backend + Bayesian Knowledge Tracing from scratch." },
  { track: "eng", start: 2026, end: 2026, title: "HDF Group — SWE", detail: "LLM refactoring engine for the HDF5 C library; dual-model consensus gate (Claude + GPT-4o)." },
  { track: "eng", start: 2026, end: 2026, title: "QuantHQ — SWE Intern", detail: "Solo-built Alpha Engine: multi-asset signal research, 22 analyzers, 1,009 tests." },
  { track: "eng", start: 2026, end: 2026, title: "Mnemostack", detail: "Graph-aware code-retrieval MCP for AI coding assistants." },
  { track: "eng", start: 2026, end: 2026, title: "AstraSign", detail: "Real-time bidirectional ASL ↔ speech translator, ~30 FPS." },
  { track: "eng", start: 2026, end: 2026, title: "Meter", detail: "LLM cost-governance proxy: reservation-based spend ceilings, dual-protocol SSE metering." },

  // Research & Writing
  { track: "research", start: 2022, end: 2023, title: "MetroVaartha — Jr Editor-in-Chief", detail: "AI column reached 50k+ readers; led the technology section." },
  { track: "research", start: 2023, end: 2025, title: "Editor & Book Assistant", detail: "10+ book projects; edited 300+ academic essays." },
  { track: "research", start: 2023, end: 2023, title: "Paper — ChatGPT & Common Sense", detail: "IJETAE. Best Junior Author ($1,000); most-downloaded in journal history." },
  { track: "research", start: 2024, end: 2024, title: "Paper — Conversational Agents", detail: "IJETAE. Compared ChatGPT, Gemini, Perplexity & Claude." },
  { track: "research", start: 2024, end: 2024, title: "Book — IoT in Agriculture", detail: "ISBN; 500+ copies; recognized by the Governor of Madhya Pradesh." },
  { track: "research", start: 2025, end: 2025, title: "Book — Beyond the Black Box", detail: "ISBN; explainable AI across healthcare, finance & autonomy." },
  { track: "research", start: 2026, end: 2026, title: "UR2PhD Pre-REC Training", detail: "Reproduced a 72-dataset protein-classification benchmark and an NLP bias workflow." },

  // Leadership
  { track: "lead", start: 2022, end: 2025, title: "Project Uthaan — Founder", detail: "200+ volunteers, 6 cities, $24K raised, 2,200+ educated." },
  { track: "lead", start: 2022, end: 2024, title: "Model UN — Secretary General ×2", detail: "35+ MUNs, 17 Best Delegate awards; ran 700+ delegate conferences." },
  { track: "lead", start: 2023, end: 2025, title: "AI & STEM Club — Founder", detail: "80+ members; built the city's first AI lab; $7K raised." },
  { track: "lead", start: 2025, end: 2026, title: "SSUAB — Director of Board Development", detail: "Board-wide professional development; authored comprehensive research & career services report." },
  { track: "lead", start: 2025, end: 2026, title: "UI-CON — Panels Head", detail: "2,000+ attendees; 60+ volunteers; 20+ panels, 40+ guests." },
  { track: "lead", start: 2026, end: 2026, title: "MLH Commit Fellow", detail: "2.5% acceptance founder-track; advised founders & GPs on PMF." },
  { track: "lead", start: 2026, end: 2026, title: "CS Peer Mentor · Tutor", detail: "80+ one-on-one sessions across UIUC CS courses." },
];
