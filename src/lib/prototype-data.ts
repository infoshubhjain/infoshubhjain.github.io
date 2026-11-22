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
  team: "Backend systems · ML research",
  role: "CS @ UIUC · AI Systems Engineer",
  grid: "Urbana-Champaign, IL",
  graduation: "May 2028",
  degree: "B.S. Computer Science",
  gpa: "3.83 / 4.00",
  coursework: ["Data Structures & Algorithms", "Systems Design", "Computer Architecture", "Discrete Structures", "Probability & Statistics", "Linear Algebra"],
  summary: "I build reliable backend systems, data pipelines, and AI tools. At UIUC, I study how agents handle changing requirements and contribute to human-centered AI research.",
  tagline: "I build intelligent systems that reason - and I race to ship them.",
  intro:
    "I'm a Computer Science undergraduate at UIUC, graduating in May 2028. I build backend systems, research software, and AI infrastructure, from concurrent budget controls to verified code changes. My research spans agent evaluation in ConvAI Lab and exploratory work on AI-assisted learning in OnCARE Lab. I also lead student engineering projects and teach in CS124 and ENG177.",
  email: "shubhj3@illinois.edu",
  github: "https://github.com/infoshubhjain",
  linkedin: "https://www.linkedin.com/in/infoshubhjain/",
  resumeUrl: "https://infoshubhjain.github.io/Shubh_Jain_SWE_Resume.pdf",
};

export const honors = ["Dean's List", "James Scholar"];

export type WinLink = { label: string; href: string; kind: "github" | "demo" | "paper" };
export type Win = {
  id: string;
  pos: string; // P1 / P2 / P3
  name: string;
  year: string;
  period?: string;
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
    id: "recallrush", period: "Aug 2026 – Present", pos: "P1", name: "RecallRush", year: "2026", role: "Architect & Project Manager", featured: true,
    circuit: "Students need practice that tests recall and responds to specific weaknesses.",
    setup: "Three layers separate browser-side typing, deterministic mastery and drill selection, and server-side AI generation. Managed five student developers and integrated their implementation into a working MVP.",
    gap: "5 developers · 3 practice modes · 60 drills per course",
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Zod"],
    overview: "A CS124 Honors study application that turns source material into skills and active-recall drills. I designed the architecture, managed five student developers, and integrated their work; the team implemented the features.",
    impact: [
      "Defined Sprint, Recall, and Missing Pieces modes with per-attempt accuracy, WPM, backspace counts, and error classification.",
      "Kept network requests outside the keystroke path and made mastery scoring and drill ranking deterministic.",
      "Specified structured AI outputs for skill extraction, 60 generated drills per course, and session summaries, with Zod validation, one retry, and fixture fallbacks.",
      "Coordinated five developers across the game engine, backend, AI, integration, and adaptive-learning components.",
    ],
    metrics: [{ label: "Developers managed", value: "5" }, { label: "Practice modes", value: "3" }, { label: "Drills per course", value: "60" }],
    stack: [{ group: "Application", items: ["Next.js", "TypeScript"] }, { group: "Data", items: ["Supabase Auth", "PostgreSQL", "Row-level security"] }, { group: "AI reliability", items: ["Zod schemas", "Bounded retries", "Offline fixtures"] }],
    links: [],
  },
  {
    id: "scrolleat", period: "Aug 2026 – Present", pos: "P1", name: "ScrollEat", year: "2026", role: "ACM SIGMobile Technical Director & Project Lead", featured: true,
    circuit: "UIUC students need a practical way to discover dishes and make food decisions together.",
    setup: "React Native/Expo mobile flows connect to FastAPI and PostgreSQL. Group updates use polling; the scope excludes in-app ordering and payments.",
    gap: "REST APIs · transactional voting · schema migrations",
    tech: ["React Native", "Expo", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic"],
    overview: "A dish-first food-discovery application for UIUC students, with preference scoring, favorites, and shared group decisions. I lead project development, contribute mobile/backend features, and maintain the SIGMobile website.",
    impact: [
      "Implemented nearby/time-constrained feed filters and deterministic preference scoring with persistent preferences.",
      "Contributed membership validation, transactional row locking, and preference-aware candidate selection for group voting.",
      "Added SQLAlchemy/Alembic migrations, API/mobile CI checks, and a one-command local startup workflow.",
    ],
    metrics: [{ label: "Group size", value: "2–5" }, { label: "API", value: "REST" }, { label: "Database", value: "PostgreSQL" }],
    stack: [{ group: "Mobile", items: ["React Native", "Expo"] }, { group: "Backend", items: ["FastAPI", "REST", "Polling"] }, { group: "Data", items: ["PostgreSQL", "SQLAlchemy", "Alembic"] }],
    links: [],
  },
  {
    id: "geocrop", period: "Aug 2026 – Present", pos: "P2", name: "GeoCrop", year: "2026", role: "Developer",
    circuit: "A satellite basemap alone does not explain vegetation changes within a field.",
    setup: "A map-first workflow analyzes imagery within field boundaries, with raster alignment, cloud masking, pixel quality, and vegetation-index trends.",
    gap: "Sentinel-2 · field boundaries · quality-aware analysis",
    tech: ["Python", "Sentinel-2", "Raster analysis", "Geospatial data"],
    overview: "A crop-monitoring tool for defining a field and examining vegetation-index trends across satellite scenes. It distinguishes calculated analysis from demonstration data and visual basemaps.",
    impact: ["Built a Python workflow for Sentinel-2 imagery within field boundaries.", "Handled raster alignment, cloud masking, and pixel-quality information when comparing vegetation trends.", "Made demonstration inputs and map imagery distinguishable from computed analysis."],
    metrics: [{ label: "Imagery", value: "Sentinel-2" }, { label: "Analysis", value: "Field-level" }],
    stack: [{ group: "Analysis", items: ["Python", "Raster alignment", "Cloud masks", "Vegetation indices"] }],
    links: [{ label: "Source", href: "https://github.com/infoshubhjain/geocrop", kind: "github" }],
  },
  {
    id: "floodsense", period: "Aug 2026 – Present", pos: "P2", name: "FloodSense", year: "2026", role: "Developer",
    circuit: "Spatial screening needs valid geometries and traceable results, not an unexplained map overlay.",
    setup: "Validate selected/uploaded geometries, intersect flood zones, avoid double counting overlapping polygons, and export results with provenance.",
    gap: "Geometry validation · overlap analysis · provenance",
    tech: ["TypeScript", "Node.js", "Turf.js", "Spatial analysis"],
    overview: "A geographic screening tool that summarizes flood-zone overlap with a selected area or uploaded assets. Synthetic examples are labeled; an intersection is not an official flood determination or a complete property-risk assessment.",
    impact: ["Implemented geometry validation and flood-zone intersections.", "Handled overlapping polygons to avoid double counting and retained source/geometry details.", "Exported screening results with provenance so users can inspect their basis."],
    metrics: [{ label: "Checks", value: "Geometry" }, { label: "Exports", value: "Provenance" }],
    stack: [{ group: "Spatial workflow", items: ["TypeScript", "Node.js", "Turf.js", "Polygon intersections", "Source provenance"] }],
    links: [{ label: "Demo", href: "https://floodsense-rosy.vercel.app/", kind: "demo" }, { label: "Source", href: "https://github.com/infoshubhjain/floodsense", kind: "github" }],
  },
  {
    id: "meter", period: "Aug 2026",
    pos: "P1",
    name: "Meter",
    year: "2026",
    role: "Backend & Infra Lead",
    circuit: "Concurrent LLM requests can bypass naive budget checks: concurrent requests race past the same budget ceiling and streamed responses silently under-bill.",
    setup: "FastAPI metering proxy with an authorize/capture reservation system under a single asyncio lock, dual-protocol SSE usage parsing, and a two-condition circuit breaker.",
    gap: "~3,600 LOC · 256-assertion suite · ~400 req/s · 1 round trip removed",
    tech: ["Python", "FastAPI", "asyncio", "PostgreSQL", "Docker"],
    featured: true,
    overview:
      "An OpenAI/Anthropic-compatible proxy that reserves budget before forwarding requests and reconciles streamed usage afterward. The concurrency test exercised 40 simultaneous requests; the soak test measured approximately 400 requests/sec over 5,000 requests at 16 clients. These are test results, not a claim about production traffic or distributed-worker safety.",
    impact: [
      "Authorize/capture reservations count in-flight holds alongside settled ledger spend inside one asyncio lock, closing the read-then-call race that lets N concurrent requests overspend a shared ceiling; proved with a 40-way concurrent test against a ceiling funding exactly 4 requests.",
      "Renewed reservation holds every 30s against a 120s TTL so a hold can't expire mid-stream - the under-billing failure mode that raised no exception and hit the longest, most expensive requests hardest.",
      "Dual-protocol SSE usage parser reconciles formats that disagree: injects and strips OpenAI's stream_options.include_usage, and reassembles Anthropic usage split across message_start and message_delta - reading only the first under-counts output tokens ~40×.",
      "Fixed gzip SSE parsing that caused compressed streams to fall back to byte-count cost estimates. Added a gzipping upstream HTTP server to cover the case that uncompressed test fixtures missed.",
      "Reframed proxy latency as a round-trip count model, proved the published 52.7 ms benchmark measured a config nobody runs, and removed one database round trip (~50 ms/request remote) by folding two spend aggregates into a single scan.",
      "Two-condition circuit breaker: absolute spend floor over a 5-minute window AND a 3× burst ratio against the trailing hour, with tag-scoped 429 throttling, key-scoped 403 revocation and half-open recovery - Google's multi-burn-rate pattern adapted, not ported.",
      "Led a full-codebase security audit reproducing every finding against a running service: a CORS regex matching any attacker-published *.vercel.app deployment, an unauthenticated endpoint exposing the payment loop, and a per-IP rate-limit bypass from a missing --proxy-headers flag.",
      "Authored the test and measurement infrastructure - 256-assertion proxy suite, 750-LOC soak harness, latency benchmark - sustaining ~400 req/s over ~5,000 requests at 16 clients with zero dropped ledger writes; the harnesses surfaced 6 pre-existing defects.",
    ],
    metrics: [
      { label: "Proxy LOC", value: "~3,600" },
      { label: "Proxy assertions", value: "256" },
      { label: "Throughput", value: "~400 req/s" },
      { label: "Concurrency test", value: "40-way" },
    ],
    stack: [
      { group: "Proxy", items: ["FastAPI", "asyncio", "httpx", "SSE"] },
      { group: "Data", items: ["PostgreSQL", "spend ledger", "reservations"] },
      { group: "Control", items: ["Circuit breaker", "Rate limits", "Audit"] },
      { group: "Ops", items: ["Docker (non-root)", "GitHub Actions", "ruff", "pip-audit"] },
    ],
    links: [
      { label: "Source", href: "https://github.com/infoshubhjain/meter", kind: "github" },
      { label: "Live demo", href: "https://meter-three-beta.vercel.app/", kind: "demo" },
    ],
  },
  {
    id: "mnemostack", period: "Jun 2026 – Aug 2026",
    pos: "P1",
    name: "Mnemostack",
    year: "2026",
    role: "Lead SWE",
    circuit: "AI coding assistants retrieve isolated files, losing the dependency chain.",
    setup: "Local MCP daemon: hybrid FAISS HNSW + SQLite FTS5/BM25 fused with RRF (k=60), plus 2-hop BFS call-graph expansion.",
    gap: "150+ tests · 5.6k LOC · 8 MCP tools · HNSW retrieval",
    tech: ["Python", "tree-sitter", "FAISS HNSW", "BM25 / RRF", "MCP"],
    featured: true,
    overview:
      "A local MCP server that gives AI coding assistants graph-aware memory - it retrieves whole dependency chains (callers and callees), not isolated files, so the model sees the real context around a symbol.",
    impact: [
      "Fused FAISS HNSW semantic search with SQLite FTS5/BM25 keyword search via Reciprocal Rank Fusion (k=60) and 3× top-k over-fetch.",
      "2-hop BFS call-graph expansion over CALLS / IMPORTS_FROM edges surfaces cross-file dependencies 1–2 hops away.",
      "Multi-signal re-ranking weighted 0.6 semantic · 0.25 recency · 0.15 dependency, with a 60-minute recency half-life.",
      "AST chunking via tree-sitter for Python and JavaScript/TypeScript files; live re-indexing on save with a 500 ms debounce.",
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
      { group: "Parsing", items: ["tree-sitter", "AST chunking", "Python / JS / TS"] },
      { group: "Graph", items: ["2-hop BFS", "CALLS / IMPORTS_FROM"] },
      { group: "Runtime", items: ["MCP over stdio", "watchdog", "500ms debounce"] },
    ],
    links: [{ label: "Source", href: "https://github.com/Switchblack-Labs/Mnemostack", kind: "github" }],
  },
  {
    id: "astrasign", period: "Feb 2026",
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
      "An ASL/speech translation prototype combining browser hand tracking, sign classification, speech tools, and animated avatars, processing video at approximately 30 FPS.",
    impact: [
      "MediaPipe HandLandmarker tracks 2 hands × 21 landmarks (63 coordinate features per hand) on a ~33 ms requestAnimationFrame loop.",
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
    id: "adaptive-learning", period: "Dec 2025 – May 2026",
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
      "An adaptive learning platform with a Bayesian Knowledge Tracing engine and a multi-agent backend. Public deployment check, November 21, 2026: onboarding is visible, but session creation currently fails.",
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
    links: [{ label: "Preview (session unavailable)", href: "https://aiceuiuc.vercel.app/", kind: "demo" }],
  },
  {
    id: "sigaida", period: "Aug 2025 – Dec 2025",
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
    id: "neuro-rust", period: "Spring 2026",
    pos: "P2",
    name: "neuro-rust",
    year: "2026",
    role: "CS 128 Honors",
    circuit: "Understand backprop by building a neural net with zero ML libraries.",
    setup: "Feedforward net in pure Rust - Xavier init, sigmoid, MSE, chain-rule backprop, online SGD across a configurable architecture.",
    gap: "0 ML libs · learns XOR in 10k epochs · 15 unit tests",
    tech: ["Rust", "ndarray", "SGD", "backprop"],
    overview:
      "A feedforward neural network built from scratch in Rust with zero ML libraries - just ndarray for matrices and rand for init - to understand backprop end to end.",
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
    id: "harvest", period: "Dec 2025 – Present",
    pos: "P3",
    name: "Project Harvest",
    year: "2025",
    role: "Lead SWE",
    circuit: "Dining-hall nutrition data is stale and hard to filter.",
    setup: "Full-stack ecosystem for 4 dining halls - Selenium scrapers + Node API + responsive macro/allergen dashboard, CI/CD via GitHub Actions.",
    gap: "1000+ daily users · 4 halls · 90% less manual upkeep",
    tech: ["React", "Selenium", "Node.js", "SQLite"],
    overview:
      "A full-stack ecosystem for four dining halls that keeps nutrition data fresh and filterable for 1000+ daily users.",
    impact: [
      "React + Node.js dashboard shows calories, macros, allergens and meal filtering for 1000+ daily users.",
      "Python Selenium scrapers collect daily menus automatically, with scheduled refreshes.",
      "RESTful Node.js backend serves all frontend requests from SQLite.",
      "GitHub Actions CI/CD automates daily scraping, validation and deployment - cutting manual upkeep ~90%.",
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
    id: "helix", period: "Aug 2025 – Dec 2025",
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
      "A campus event aggregation platform that scrapes and unifies 1000+ events from 15+ university sources into a single queryable, filterable schema - and lets authenticated users push them straight into their own calendar.",
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
    links: [{ label: "Source", href: "https://github.com/infoshubhjain/Project-Helix", kind: "github" }],
  },
];

export type Directive = {
  kind: "Patent" | "Paper" | "Book" | "Training";
  title: string;
  venue: string;
  year: string;
  note: string;
  link?: string;
  status?: "Submitted";
};

export const seasonStats: { label: string; value: string; sub: string }[] = [
  { label: "Championship", value: driver.gpa.split(" / ")[0], sub: "CGPA / 4.0" },
  { label: "Builds", value: String(wins.length), sub: "documented projects" },
  { label: "Research", value: "1", sub: "ICLR 2027 submission" },
  { label: "Titles", value: "2", sub: "authored books" },
  { label: "Patents", value: "1", sub: "IoT agriculture" },
  { label: "Grid crew", value: "200+", sub: "volunteers led" },
  { label: "Fastest laps", value: "17", sub: "MUN Best Delegate" },
  { label: "Sponsorship", value: "$42K+", sub: "funds raised" },
];

export const directives: Directive[] = [
  {
    kind: "Paper", status: "Submitted", year: "2026", venue: "ICLR 2027 submission · fourth author",
    title: "GroundWorks: Agents Can Complete Tasks Yet Fail Under Plausible Perturbations in Multi-Turn Interactions",
    note: "With Parisa Rabbani, Siyan Li, Yi Evie Zhang, Hyeonjeong Ha, and Dilek Hakkani-Tür. Contributed Python implementation, experimental execution, and analysis. The study spans five agents, 30 perturbation operators, and 1,040 paired evaluations; agents failed on 47% of perturbed scenarios whose originals they completed, averaged across agents.",
    link: "https://openreview.net/forum?id=AB5kRc0EkX",
  },
  {
    kind: "Training",
    title: "UR2PhD Pre-REC Research Training Program",
    venue: "Research methods & reproducibility",
    year: "2026",
    note: "Reproduced a published protein-structure-classification benchmark across 72 datasets in Python/pandas/Matplotlib - finding traditional ML stays competitive with deep learning at a fraction of the runtime - plus a counterfactual name-perturbation replication of an NLP toxicity-bias workflow.",
  },
  {
    kind: "Patent",
    title: "IoT Based System for Increasing Crop Production Using Machine Learning Model",
    venue: "India · 202421028435 · June 21, 2024",
    year: "2024",
    note: "Real-time soil / crop / water monitoring with automated irrigation and predictive analytics for sustainable farming in India.",
  },
  {
    kind: "Paper",
    title: "A Comparative Assessment of Advanced Conversational Agents: A Multifaceted Evaluation of ChatGPT, Gemini, Perplexity, and Claude",
    venue: "International Journal of Emerging Technology and Advanced Engineering, 14(2), 59–69",
    year: "2024",
    note: "Compared ChatGPT, Gemini, Perplexity, and Claude using structured factual, open-ended, situational, hypothetical, and creative prompts, with quantitative and qualitative review. The paper reports Gemini higher on factual accuracy and ChatGPT stronger on creative text generation in its examples.",
    link: "https://doi.org/10.46338/ijetae0224_07",
  },
  {
    kind: "Paper",
    title: "Investigation on the Performance of ChatGPT's in Answering Common Sense Based Questionnaire",
    venue: "IJETAE, 13(9), 1–8 · September 2023",
    year: "2023",
    note: "Examines ChatGPT responses to commonsense questions using quantitative and qualitative analysis, with examples of incorrect reasoning and inconsistent answers.",
    link: "https://www.ijetae.com/files/Volume13Issue9/IJETAE_0923_01.pdf",
  },
  {
    kind: "Book",
    title: "Beyond the Black Box: Unlocking the Secrets of Explainable AI",
    venue: "ASIN B0F38TX4ZR",
    year: "2025",
    note: "Post-hoc interpretability, counterfactuals & surrogate models applied to healthcare, finance and autonomous systems.",
  },
  {
    kind: "Book",
    title: "IoT in Agriculture: Revolutionizing Indian Farming",
    venue: "ISBN 978-9394351950",
    year: "2024",
    note: "500+ copies distributed to universities; recognized by the Governor of Madhya Pradesh for agricultural innovation.",
  },
];

export type Stint = {
  team: string;
  role: string;
  period: string;
  note: string;
  points: string[];
  link?: string;
  featured?: boolean;
};

export const standings: Stint[] = [
  {
    team: "Mega Service Solutions", role: "Software Engineering Lead · Revamp UIUC client project", period: "Aug 2026 – Present", featured: true,
    note: "Lead three engineers within a 10+ person team on Python pipelines for an ongoing migration of 1,000+ HubSpot CRM records toward an in-house Supabase-backed CRM.",
    points: ["Design field mappings that preserve HubSpot identifiers, company hierarchies, and associations between deals, companies, contacts, and notes.", "Develop Excel/CSV validation and exception reports for duplicate or uncertain relationships before import.", "Coordinate sales review and export handoff with the client's database team; migration remains in progress."],
  },
  {
    team: "ConvAI Lab · UIUC", role: "Undergraduate Researcher", period: "Aug 2026 – Present", featured: true,
    note: "Work with Parisa Rabbani and Prof. Dilek Hakkani-Tür on GroundWorks, evaluating multi-turn agents under changing requirements and tool evidence.",
    points: ["Contribute Python implementation, dataset/scenario execution, and analysis for five agents, 30 perturbation operators, and 1,040 paired evaluations.", "Distinguish task completion, targeted hallucinations, and other failures under controlled interaction changes.", "Fourth author on the ICLR 2027 submission, contributing implementation, experiments, and analysis."],
    link: "https://uiuc-conversational-ai-lab.github.io/",
  },
  {
    team: "OnCARE Lab · UIUC", role: "Undergraduate Researcher", period: "Aug 2026 – Present", featured: true,
    note: "Worked with Veda Duddu and Prof. Koustuv Saha on an exploratory pilot examining AI-assisted learning and student wellbeing.",
    points: ["Designed, prepared, and conducted the exploratory pilot, incorporating co-design into its preparation and execution.", "Investigated how student perspectives could inform study design for educational AI and wellbeing research."],
    link: "https://oncare.cs.illinois.edu/",
  },
  {
    team: "QuantHQ",
    featured: true,
    role: "Software Engineering Intern",
    period: "May 2026 – Aug 2026",
    note: "Built Alpha Engine for reproducible multi-asset signal research, with data ingestion, provider failover, and CLI, HTTP and MCP interfaces.",
    points: [
      "Built a deterministic research engine - 22 independent analyzers synthesized into directional signals with calibrated confidence and explicit invalidation prices (33K LOC, solo).",
      "Integrated 25+ market data sources (Binance, Glassnode, FRED, OANDA, Dhan, AngelOne, NSE, RBI, Finnhub) behind a unified ingestion layer with caching, health tracking and automatic failover.",
      "Backtested 6,788 signals across 7 assets / 5 years via no-lookahead replay - measured +0.0% edge over base rates and published the null result in FINDINGS.md instead of an unvalidated claim.",
      "Maintained 1,009 tests across 57 suites; shipped CLI, HTTP API and MCP server interfaces with Docker packaging and daily signal collection via GitHub Actions.",
      "Designed and built the public organisation site (quanthq.in) solo as a static Astro 5 SSG - type-safe MDX content collections with Zod schemas, interactive canvas visualisations in vanilla script tags, light/dark theming and a contrast audit, deployed to a custom domain via GitHub Pages CI.",
    ],
    link: "https://quanthq.in",
  },
  {
    team: "The HDF Group",
    featured: true,
    role: "Software Engineer (part-time) - HDF5 AI Pipeline",
    period: "May 2026 – Aug 2026",
    note: "LLM refactoring engine for the HDF5 C library. Independent Claude and GPT-4o reviews gate proposed changes and route disagreements to human review.",
    points: [
      "Built the primary LLM refactoring engine (457 LOC) generating git-format-patch-validated diffs with invariants enforcing no-new-API / no-new-export / no-new-file.",
      "Designed the multi-model consensus gate - Claude Sonnet and GPT-4o independently review every diff, with split verdicts routed to a human-review disagreements ledger.",
      "Parallelized the dual-LLM gate (ThreadPoolExecutor, ~2× faster per diff) and added a zero-API-cost faithfulness pre-check catching hallucinated RAG citations in ~1 ms.",
      "Authored ~280 unit and mocked-E2E tests (14-person repo, 809 total), contributing 80 commits and ~22K lines; prompt caching cut repeat-call cost ~80%.",
    ],
    link: "https://www.hdfgroup.org",
  },
  {
    team: "Llama Naturals × REVAMP UIUC",
    featured: true,
    role: "Machine Learning Engineer",
    period: "Jan 2026 – May 2026",
    note: "Owned the data layer of a DistilBERT classifier that detects FDA/FTC advertising compliance violations across 15 regulatory categories.",
    points: [
      "Built the preprocessing and tokenization infrastructure turning raw advertising scripts into model-ready tensor datasets (input_ids, attention_mask, labels) in PyTorch and HuggingFace Transformers.",
      "Expanded the labelled corpus 5.3× (10 to 53 samples), balancing binary compliance labels across examples covering 15 violation categories.",
      "Designed the canonical dataset schema and tensor artifact specification adopted project-wide - the data contract downstream contributors built against.",
      "Curated a domain-specific corpus spanning social, influencer, e-commerce, broadcast, podcast, email and print advertising covering multiple advertising formats.",
      "Implemented DistilBERT-compatible tokenization across the full 512-token context window with padding, truncation and attention masking.",
    ],
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
    team: "Rancho Labs · IIT Delhi",
    role: "AI/ML Training Program - Top 20 Nationwide",
    period: "2022 – 2023",
    note: "Selected among 20 students nationwide for an intensive AI/ML program at IIT Delhi's IHFC innovation hub.",
    points: [
      "Selected nationwide (top 20) for a hands-on AI/ML program hosted at IIT Delhi's IHFC.",
      "Built practical models on real datasets - training, evaluation and deployment fundamentals.",
      "Earned a strong early foundation that directly fed into later research and engineering work.",
    ],
  },
];

export const setup: { unit: string; parts: string[] }[] = [
  { unit: "Power Unit - Languages", parts: ["Python", "TypeScript", "Rust", "Kotlin", "JavaScript", "C", "C++", "SQL", "Java"] },
  { unit: "Aero - AI & ML", parts: ["Multi-Agent Systems", "Transformers", "PyTorch", "BKT", "MediaPipe", "TensorFlow.js", "HuggingFace", "LLM Pipelines"] },
  { unit: "Chassis - Full-Stack", parts: ["Next.js", "React", "React Native", "Expo", "FastAPI", "Node.js", "REST APIs", "Tailwind", "Three.js", "Zod"] },
  { unit: "Telemetry - Data & Infra", parts: ["PostgreSQL", "Supabase", "SQLAlchemy", "Alembic", "pgvector", "FAISS", "BM25", "ChromaDB", "SQLite", "ETL pipelines", "pandas", "NumPy", "tree-sitter"] },
  { unit: "Pit Tools - Cloud & Testing", parts: ["Docker", "GitHub Actions", "CI/CD", "Google Cloud Run", "Vercel", "Git", "pytest", "Unit/integration tests", "asyncio", "SSE", "MCP"] },
  { unit: "Strategy - Research", parts: ["Agent evaluation", "Reproducibility", "Experimental design", "Co-design", "NLP bias analysis", "Data visualization", "Matplotlib", "Spatial analysis", "Scientific communication"] },
  // Spoken languages, kept distinct from the programming ones in "Power Unit".
  // Each carries its evidence rather than a self-assessed fluency label.
  { unit: "Comms - Spoken Languages", parts: ["English · IELTS 8.0 / 9.0", "Hindi · Native"] },
];

export type PitRole = {
  org: string;
  role: string;
  period: string;
  /** Short category chip - Founder / Fellowship / Events / Mentoring / Editorial / Service. */
  tag: string;
  metric: string;
  note: string;
  /** The three headline roles get the wide treatment in the Pit Wall grid. */
  featured?: boolean;
};

export type Trophy = {
  /** The headline figure - what a recruiter reads first. */
  value: string;
  title: string;
  issuer: string;
  year: string;
  note: string;
  /** 1 = the three podium trophies, 2 = the cabinet grid behind them. */
  tier: 1 | 2;
};

/** The honours board - every entry verbatim from the CV. */
export const trophies: Trophy[] = [
  {
    value: "2.5%",
    title: "MLH Commit Fellow",
    issuer: "Major League Hacking × Transcend Network",
    year: "2026",
    note: "One of 30 fellows in the inaugural founder-track cohort, selected through a global application process.",
    tier: 1,
  },
  {
    value: "2024",
    title: "IoT & Machine Learning Agriculture Patent",
    issuer: "Government of India",
    year: "2024",
    note: "IoT Based System for Increasing Crop Production Using Machine Learning Model. Record 202421028435, dated June 21, 2024.",
    tier: 1,
  },
  {
    value: "$1,000",
    title: "Best Junior Author of the Year",
    issuer: "IJETAE",
    year: "2023",
    note: "For the ChatGPT common-sense study - the most-downloaded high-school-authored paper in the journal's history.",
    tier: 1,
  },
  {
    value: "Dean's List",
    title: "Academic Honours",
    issuer: "University of Illinois Urbana-Champaign",
    year: "2025–26",
    note: "Dean's List and James Scholar recognition at UIUC, with a 3.83/4.0 GPA.",
    tier: 2,
  },
  {
    value: "Topper",
    title: "High School Overall Topper - Science Batch",
    issuer: "Grade 12",
    year: "2025",
    note: "Ranked first across the entire science batch in the final school year.",
    tier: 2,
  },
  {
    value: "Topper",
    title: "Physics Topper - Grade 12",
    issuer: "Grade 12",
    year: "2025",
    note: "Highest marks in Physics across the graduating cohort.",
    tier: 2,
  },
  {
    value: "Sole",
    title: "School Colour for ICT",
    issuer: "TSVS",
    year: "2024",
    note: "The only high-school recipient - awarded for cybersecurity workshops, TechFest and network administration.",
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
    value: "3A",
    title: "Overall Topper - Grade 11",
    issuer: "Grade 11",
    year: "2024",
    note: "Ranked first among 250 students, achieving 3A - the maximum grade attainable.",
    tier: 2,
  },
  {
    value: "Governor",
    title: "Recognition for Agricultural Innovation",
    issuer: "State of Madhya Pradesh",
    year: "2024",
    note: "For 'IoT in Agriculture' - 500+ copies distributed to universities across India.",
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
  {
    value: "Rank 1",
    title: "SilverZone Science Olympiad - International Gold Medalist",
    issuer: "SilverZone Foundation",
    year: "2023",
    note: "100% marks, ranking first internationally among thousands of participants.",
    tier: 2,
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
    value: "Top 20",
    title: "AI/ML Program - Nationwide",
    issuer: "Rancho Labs · IIT Delhi IHFC",
    year: "2022",
    note: "Selected among 20 students nationally for an intensive hands-on AI/ML program at IIT Delhi's innovation hub.",
    tier: 2,
  },
];

/** Mirrors `leadership` in portfolio-data.ts - same CV, race-flavored copy. */
export const pitWall: PitRole[] = [
  {
    org: "CS124 Honors · UIUC", role: "Project Manager · RecallRush", period: "Aug 2026 – Present", tag: "Mentoring", metric: "5 student developers", featured: true,
    note: "Designed the application architecture, coordinated implementation across five developers, and integrated their work into a working adaptive-study MVP.",
  },
  {
    org: "ACM SIGMobile · UIUC", role: "Technical Director & Project Lead", period: "Aug 2026 – Present", tag: "Leadership", metric: "ScrollEat + SIG website", featured: true,
    note: "Lead ScrollEat development and maintain the SIGMobile website; contribute mobile/backend features, transactional voting, migrations, and CI checks.",
  },
  {
    org: "ENG177 GFX Scholars · UIUC", role: "Course Assistant", period: "Aug 2026 – Present", tag: "Teaching", metric: "15–20 students", featured: true,
    note: "Support design theory and physical/toy-design projects, grade technical papers, assist presentations, and lead class sessions during the professor's absence.",
  },
  {
    org: "CS124 · UIUC", role: "Course Assistant / Tutor", period: "Jan 2026 – Present", tag: "Teaching", metric: "Programming & debugging", featured: true,
    note: "Tutor programming fundamentals, object-oriented concepts, control flow, and introductory data structures. Use code tracing and questions to help students identify incorrect assumptions and debug independently.",
  },
  {
    org: "UIUC Siebel",
    role: "CS Peer Mentor",
    period: "Jan 2026 – Present",
    tag: "Mentoring",
    metric: "80+ sessions",
    note: "80+ one-on-one sessions across CS124/128/173/225, plus advising on course choices, research, RSOs, and internships. This mentoring count is separate from the CS124 CA role.",
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
    org: "MLH × Transcend Network",
    role: "Commit Fellow - Founding Cohort",
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
    org: "Project Uthaan",
    role: "Founder & President",
    period: "Dec 2022 – Dec 2025",
    tag: "Founder",
    metric: "200+ volunteers · 6 cities · $24K",
    note: "Built 8 classrooms, installed 100+ computers, educated 2,200+ across digital literacy and vocational programs - 700+ women, 600+ children, 300+ seniors.",
    featured: true,
  },
  {
    org: "Diwali on the Quad",
    role: "Management Head",
    period: "Oct 2025",
    tag: "Events",
    metric: "1,000+ attendees · 30+ volunteers",
    note: "Directed a 4-hour campus festival on a centralized task system - 50+ tracked tasks, 10+ cultural performances, vendor and crowd-flow coordination.",
  },
  {
    org: "Book writing & editorial work",
    role: "Book Writing Assistant / Editor & Proofreader",
    period: "Mar 2023 – May 2025",
    tag: "Editorial",
    metric: "10+ book projects · 300+ essays",
    note: "Researched, drafted, and edited book content; reviewed academic essays for clarity, structure, technical accuracy, and style. Developed style guides and detailed feedback for authors.",
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
    org: "TSVS Student Council",
    role: "ICT Captain",
    period: "Aug 2023 – Aug 2024",
    tag: "Leadership",
    metric: "15+ workshops · 900+ trained",
    note: "Ran cybersecurity workshops and a 1,000+ participant TechFest while managing the school website and network - School Colour for ICT, the only high-school recipient.",
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
    org: "SBI Sustainability Drive",
    role: "Head of Operations",
    period: "Jun 2023 – Jul 2023",
    tag: "Events",
    metric: "18,000+ trees · $10K",
    note: "Led an 80-member team with SBI, BHEL and local NGOs across 6 acres of reforestation, including 100+ native species, plus press and community outreach.",
  },
  {
    org: "Bharat Scouts and Guides",
    role: "Teacher & Mentor",
    period: "Mar 2022 – Mar 2023",
    tag: "Service",
    metric: "30,000+ reached · 90+ volunteers",
    note: "Mentored 400+ underprivileged children, managed 90+ volunteers on community campaigns, and raised $1,500+ for education initiatives.",
  },
];

/** Headline numbers behind the leadership work - each traceable to one role above. */
export const crewStats: { label: string; value: string; sub: string }[] = [
  { label: "Funds raised", value: "$42K+", sub: "across every program" },
  { label: "Educated", value: "2,200+", sub: "Project Uthaan" },
  { label: "Reached", value: "30,000+", sub: "Scouts campaigns" },
  { label: "Trees planted", value: "18,000+", sub: "SBI drive · 6 acres" },
];

/** Unpaid crews joined rather than led - the short list under the Pit Wall. */
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
  // Engineering - newest first
  { track: "eng", start: 2026, end: 2026, title: "Mega Service Solutions · Engineering Lead", detail: "Three-engineer HubSpot migration workstream within a 10+ person team; 1,000+ records, Python validation and Supabase integration." },
  { track: "eng", start: 2026, end: 2026, title: "RecallRush · Architect & PM", detail: "Managed five developers and integrated an adaptive-learning MVP with deterministic scoring and validated AI outputs." },
  { track: "eng", start: 2026, end: 2026, title: "SIGMobile · ScrollEat", detail: "Technical Director & Project Lead; React Native, FastAPI, transactional group voting and PostgreSQL." },
  { track: "eng", start: 2026, end: 2026, title: "GeoCrop & FloodSense", detail: "Aug 2026–present: satellite-quality analysis and geometry-based screening with provenance." },
  { track: "eng", start: 2026, end: 2026, title: "HDF Group - SWE", detail: "LLM refactoring engine for the HDF5 C library; dual-model consensus gate (Claude + GPT-4o)." },
  { track: "eng", start: 2026, end: 2026, title: "QuantHQ - SWE Intern", detail: "Solo-built Alpha Engine: multi-asset signal research, 22 analyzers, 1,009 tests." },
  { track: "eng", start: 2026, end: 2026, title: "Mnemostack", detail: "Graph-aware code-retrieval MCP for AI coding assistants." },
  { track: "eng", start: 2026, end: 2026, title: "AstraSign", detail: "Real-time bidirectional ASL ↔ speech translator, ~30 FPS." },
  { track: "eng", start: 2026, end: 2026, title: "Meter", detail: "LLM cost-governance proxy: reservation-based spend ceilings, dual-protocol SSE metering." },
  { track: "eng", start: 2026, end: 2026, title: "BERT Ad Compliance Classifier", detail: "Jan–May 2026: preprocessing and tensor contracts for a DistilBERT FDA/FTC classifier across 15 categories." },
  { track: "eng", start: 2025, end: 2026, title: "Project Harvest", detail: "Dec 2025–present: four dining halls, automated menu collection, nutrition filtering and CI/CD." },
  { track: "eng", start: 2025, end: 2026, title: "Adaptive Learning Platform", detail: "7-agent backend + Bayesian Knowledge Tracing from scratch." },
  { track: "eng", start: 2025, end: 2025, title: "SIGAIDA Campus Energy", detail: "Env-monitoring platform + PyTorch LSTM PM2.5 forecast; 10-person team." },
  { track: "eng", start: 2025, end: 2025, title: "Project Helix", detail: "1000+ campus events unified from 15+ sources; OAuth2 calendar export." },
  { track: "eng", start: 2024, end: 2024, title: "Exam Lounge - AI/NLP Lead", detail: "Led 31 interns; +15% model accuracy; Intern of the Month ×3." },
  { track: "eng", start: 2023, end: 2023, title: "IETE - ML Intern", detail: "AI chatbot (200+/day), BiLSTM misinformation detector at 87%." },

  // Research & Writing - newest first
  { track: "research", start: 2026, end: 2026, title: "ConvAI · GroundWorks", detail: "Implementation, experiments and analysis; fourth author on an ICLR 2027 submission." },
  { track: "research", start: 2026, end: 2026, title: "OnCARE · Exploratory Pilot", detail: "AI-assisted learning and student wellbeing; study preparation, execution and co-design." },
  { track: "research", start: 2026, end: 2026, title: "UR2PhD Pre-REC Training", detail: "Reproduced a 72-dataset protein-classification benchmark and an NLP bias workflow." },
  { track: "research", start: 2025, end: 2025, title: "Book - Beyond the Black Box", detail: "Explainable AI, counterfactuals and surrogate models across healthcare, finance and autonomy; ASIN B0F38TX4ZR." },
  { track: "research", start: 2023, end: 2025, title: "Editor & Book Assistant", detail: "10+ book projects; edited 300+ academic essays." },
  { track: "research", start: 2024, end: 2024, title: "Paper - Conversational Agents", detail: "IJETAE. Compared ChatGPT, Gemini, Perplexity & Claude." },
  { track: "research", start: 2024, end: 2024, title: "Book - IoT in Agriculture", detail: "ISBN; 500+ copies; recognized by the Governor of Madhya Pradesh." },
  { track: "research", start: 2023, end: 2023, title: "Paper - ChatGPT & Common Sense", detail: "IJETAE. Best Junior Author ($1,000); most-downloaded high-school-authored paper in journal history." },
  { track: "research", start: 2022, end: 2023, title: "MetroVaartha - Jr Editor-in-Chief", detail: "AI column reached 50k+ readers; led the technology section." },

  // Leadership - newest first
  { track: "lead", start: 2026, end: 2026, title: "ENG177 · Course Assistant", detail: "Support 15–20 students in physical design, technical papers, presentations and class sessions." },
  { track: "lead", start: 2026, end: 2026, title: "CS124 · Course Assistant / Tutor", detail: "Programming fundamentals and debugging support since January 2026, separate from peer mentoring." },
  { track: "lead", start: 2026, end: 2026, title: "MLH Commit Fellow", detail: "2.5% acceptance founder-track; advised founders & GPs on PMF." },
  { track: "lead", start: 2026, end: 2026, title: "CS Peer Mentor", detail: "80+ one-on-one sessions across UIUC CS courses, separate from the CS124 CA role." },
  { track: "lead", start: 2025, end: 2026, title: "SSUAB - Director of Board Development", detail: "Board-wide professional development; authored comprehensive research & career services report." },
  { track: "lead", start: 2025, end: 2026, title: "UI-CON - Panels Head", detail: "2,000+ attendees; 60+ volunteers; 20+ panels, 40+ guests." },
  { track: "lead", start: 2023, end: 2025, title: "AI & STEM Club - Founder", detail: "80+ members; built the city's first AI lab; $7K raised." },
  { track: "lead", start: 2022, end: 2025, title: "Project Uthaan - Founder", detail: "200+ volunteers, 6 cities, $24K raised, 2,200+ educated." },
  { track: "lead", start: 2022, end: 2024, title: "Model UN - Secretary General ×2", detail: "35+ MUNs, 17 Best Delegate awards; ran 700+ delegate conferences." },
];
