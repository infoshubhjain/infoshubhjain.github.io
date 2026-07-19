/**
 * F1-themed content, curated from Shubh Jain's CV.
 * The whole site is a race weekend: driver → wins → directives → standings →
 * setup → pit wall → radio → podium. Copy is race-flavored but factual.
 */

export const driver = {
  name: "Shubh Jain",
  number: "16",
  team: "Independent · Self-Built",
  role: "CS @ UIUC · AI Systems Engineer",
  grid: "Urbana-Champaign, IL",
  tagline: "I build intelligent systems that reason — and I race to ship them.",
  intro:
    "Computer Science at the University of Illinois. I design multi-agent architectures, train transformers from first principles, ship full-stack products to production, and lead teams that reach tens of thousands. Equal parts engineer, researcher, and builder.",
  email: "shubhj3@illinois.edu",
  github: "https://github.com/infoshubhjain",
  linkedin: "https://www.linkedin.com/in/infoshubhjain/",
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

export const honors = ["Dean's List", "James Scholar", "MLH Commit Fellow · 2.5%"];

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
};

export const wins: Win[] = [
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
    links: [],
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
    links: [],
  },
  {
    id: "helix",
    pos: "P3",
    name: "Project Helix",
    year: "2025",
    role: "Lead SWE",
    circuit: "Campus events are scattered across 15+ inconsistent university sources.",
    setup: "Multi-technique scraper (BeautifulSoup + Playwright) unifying 1000+ events into one schema, with OAuth2 Google Calendar export.",
    gap: "1000+ events · 15+ sources · dedup + scheduled scraping",
    tech: ["Python", "Playwright", "OAuth2", "REST"],
    overview:
      "A campus event-aggregation platform that scrapes and unifies 1000+ events from 15+ university sources into one queryable calendar.",
    impact: [
      "Multi-technique scraping (BeautifulSoup + Playwright) handles static and JS-rendered sources with dedup and scheduled workflows.",
      "Normalizes inconsistent HTML into a centralized relational schema for dynamic querying and filtering.",
      "REST API + OAuth2 Google Calendar integration lets authenticated users export events with token-based access control.",
    ],
    metrics: [
      { label: "Events", value: "1000+" },
      { label: "Sources", value: "15+" },
      { label: "Auth", value: "OAuth2" },
      { label: "Export", value: "Google Cal" },
    ],
    stack: [
      { group: "Scraping", items: ["BeautifulSoup", "Playwright", "Dedup"] },
      { group: "Backend", items: ["Python", "REST", "Relational schema"] },
      { group: "Integrations", items: ["OAuth2", "Google Calendar"] },
    ],
    links: [],
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
    links: [],
  },
  {
    id: "bert-compliance",
    pos: "P2",
    name: "BERT Ad Compliance",
    year: "2025",
    role: "ML Engineer",
    circuit: "FDA/FTC advertising violations are expensive to catch by hand.",
    setup: "Built the preprocessing + tokenization infra for a DistilBERT classifier across 15 regulatory categories; balanced corpus 5.3×.",
    gap: "15 categories · 512-token context · +430% dataset",
    tech: ["PyTorch", "HuggingFace", "DistilBERT", "NLP"],
    overview:
      "The data and tokenization backbone for a DistilBERT system that flags FDA/FTC advertising-compliance violations across 15 regulatory categories.",
    impact: [
      "End-to-end pipeline turns raw advertising scripts into model-ready tensors (input_ids, attention_mask, labels).",
      "Grew and balanced the training corpus 5.3× (10→53 labeled samples) toward near-equal class distribution.",
      "Defined the canonical dataset schema + tensor spec adopted across preprocessing, training and evaluation.",
      "DistilBERT tokenization with full 512-token context, padding, truncation and attention masking.",
    ],
    metrics: [
      { label: "Categories", value: "15" },
      { label: "Corpus growth", value: "5.3×" },
      { label: "Context", value: "512 tok" },
      { label: "Dataset", value: "+430%" },
    ],
    stack: [
      { group: "Model", items: ["DistilBERT", "HuggingFace", "PyTorch"] },
      { group: "Pipeline", items: ["Tokenization", "Tensor artifacts", "Attention masking"] },
      { group: "Data", items: ["Social", "Influencer", "E-commerce", "Broadcast", "Podcasts", "Print"] },
    ],
    links: [],
  },
];

export type Directive = {
  kind: "Patent" | "Paper" | "Book";
  title: string;
  venue: string;
  year: string;
  note: string;
};

export const directives: Directive[] = [
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
};

export const standings: Stint[] = [
  {
    team: "MLH × Transcend Network",
    role: "Commit Fellow · Founding Cohort",
    period: "2026",
    note: "2.5% acceptance. 24 lean experiments, 10 user interviews, 3 assumptions invalidated. Advised founders & GPs on pricing, AI integration and an acquisition deal.",
  },
  {
    team: "Exam Lounge",
    role: "Junior AI & NLP Lead Researcher",
    period: "2024",
    note: "Led a 31-intern team (Agile), +15% model accuracy, −40% production errors. Intern of the Month ×3.",
  },
  {
    team: "IETE",
    role: "Machine Learning Intern",
    period: "2023",
    note: "Full-stack AI chatbot at 200+ daily inquiries; BiLSTM misinformation detector at 87% accuracy; sentiment tool over 10,000+ reviews.",
  },
  {
    team: "Freelance",
    role: "Web Developer",
    period: "2023–25",
    note: "40+ websites shipped — SEO, responsive UI/UX, payments, e-commerce, booking. Full lifecycle, consult to launch.",
  },
  {
    team: "IIT Delhi IHFC · YBI Foundation",
    role: "AI/ML Programs",
    period: "2022–23",
    note: "Among 20 selected nationwide at Rancho Labs; intensive practical AI/ML foundations.",
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
  metric: string;
  note: string;
};

/** 3D chart datasets (F1 telemetry viz). */
export const skillBars: { label: string; value: number; detail: string }[] = [
  { label: "Power Unit", value: 8, detail: "Python · TypeScript · Rust · C++ …" },
  { label: "Aero / AI", value: 8, detail: "Multi-agent · Transformers · PyTorch …" },
  { label: "Chassis", value: 8, detail: "Next.js · FastAPI · Docker · Three.js …" },
  { label: "Telemetry", value: 7, detail: "pgvector · FAISS · ETL · Cloud Run …" },
  { label: "Strategy", value: 5, detail: "XAI · NLP · Bayesian · Experiment design" },
];

export const careerTrace: { year: string; value: number; detail: string }[] = [
  { year: "2022", value: 2, detail: "MUN, first clubs, editorial" },
  { year: "2023", value: 4, detail: "IETE ML intern · freelance · papers" },
  { year: "2024", value: 5, detail: "Exam Lounge lead · patent · 1st book" },
  { year: "2025", value: 7, detail: "Harvest · SIGAIDA · Helix · 2nd book" },
  { year: "2026", value: 9, detail: "Mnemostack · AstraSign · MLH · UIUC" },
];

export const pitWall: PitRole[] = [
  {
    org: "Project Uthaan",
    role: "Founder & President",
    metric: "200+ volunteers · 6 cities · $24K",
    note: "Built 8 classrooms, installed 100+ computers, educated 2,200+ across digital literacy and vocational programs.",
  },
  {
    org: "AI & STEM Club",
    role: "Founder & President",
    metric: "80+ members · $7K raised",
    note: "Established the city's first AI & STEM lab and recording studio; 'Best Club Exhibition' among 50+ clubs.",
  },
  {
    org: "Model United Nations",
    role: "Secretary General ×2",
    metric: "35+ MUNs · 17 Best Delegate",
    note: "Chaired 8+ committees, ran conferences of 700+ delegates, trained junior secretariats.",
  },
  {
    org: "UI-CON",
    role: "Panels Head",
    metric: "2,000+ attendees · 60+ volunteers",
    note: "Ran 20+ panels and 40+ guests across 8 event areas at a multi-day university convention.",
  },
  {
    org: "SBI Sustainability Drive",
    role: "Head of Operations",
    metric: "18,000+ trees · $10K",
    note: "Led an 80-member team with SBI, BHEL and NGOs across 6 acres of reforestation.",
  },
  {
    org: "CS Peer Mentor · CS 124 Tutor",
    role: "UIUC Siebel",
    metric: "80+ sessions",
    note: "One-on-one support across CS 124/128/173/225 — meeting each student at their exact point of confusion.",
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
  { track: "eng", start: 2025, end: 2026, title: "Adaptive Learning Platform", detail: "7-agent backend + Bayesian Knowledge Tracing from scratch." },
  { track: "eng", start: 2026, end: 2026, title: "Mnemostack", detail: "Graph-aware code-retrieval MCP for AI coding assistants." },
  { track: "eng", start: 2026, end: 2026, title: "AstraSign", detail: "Real-time bidirectional ASL ↔ speech translator, ~30 FPS." },

  // Research & Writing
  { track: "research", start: 2022, end: 2023, title: "MetroVaartha — Jr Editor-in-Chief", detail: "AI column reached 50k+ readers; led the technology section." },
  { track: "research", start: 2023, end: 2025, title: "Editor & Book Assistant", detail: "10+ book projects; edited 300+ academic essays." },
  { track: "research", start: 2023, end: 2023, title: "Paper — ChatGPT & Common Sense", detail: "IJETAE. Best Junior Author ($1,000); most-downloaded in journal history." },
  { track: "research", start: 2024, end: 2024, title: "Paper — Conversational Agents", detail: "IJETAE. Compared ChatGPT, Gemini, Perplexity & Claude." },
  { track: "research", start: 2024, end: 2024, title: "Book — IoT in Agriculture", detail: "ISBN; 500+ copies; recognized by the Governor of Madhya Pradesh." },
  { track: "research", start: 2025, end: 2025, title: "Book — Beyond the Black Box", detail: "ISBN; explainable AI across healthcare, finance & autonomy." },

  // Leadership
  { track: "lead", start: 2022, end: 2025, title: "Project Uthaan — Founder", detail: "200+ volunteers, 6 cities, $24K raised, 2,200+ educated." },
  { track: "lead", start: 2022, end: 2024, title: "Model UN — Secretary General ×2", detail: "35+ MUNs, 17 Best Delegate awards; ran 700+ delegate conferences." },
  { track: "lead", start: 2023, end: 2025, title: "AI & STEM Club — Founder", detail: "80+ members; built the city's first AI lab; $7K raised." },
  { track: "lead", start: 2025, end: 2026, title: "UI-CON — Panels Head", detail: "2,000+ attendees; 60+ volunteers; 20+ panels, 40+ guests." },
  { track: "lead", start: 2026, end: 2026, title: "MLH Commit Fellow", detail: "2.5% acceptance founder-track; advised founders & GPs on PMF." },
  { track: "lead", start: 2026, end: 2026, title: "CS Peer Mentor · Tutor", detail: "80+ one-on-one sessions across UIUC CS courses." },
];

/** Point-in-time milestones plotted above the tracks. */
export const milestones: { year: number; label: string }[] = [
  { year: 2023, label: "Best Junior Author · $1,000" },
  { year: 2024, label: "Patent granted · IoT" },
  { year: 2025, label: "UIUC · Dean's List · James Scholar" },
  { year: 2026, label: "MLH Commit Fellow · 2.5%" },
];
