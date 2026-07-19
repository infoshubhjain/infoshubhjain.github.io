/**
 * F1-themed content, curated from Shubh Jain's CV.
 * The whole site is a race weekend: driver → wins → directives → standings →
 * setup → pit wall → radio → podium. Copy is race-flavored but factual.
 */

export const driver = {
  name: "Shubh Jain",
  number: "16",
  team: "Scuderia · Self-Built",
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
  github?: string;
  demo?: string;
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
    github: "https://github.com/Switchblack-Labs/Mnemostack",
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
    demo: "https://astrasign-f8d8832c.aedify.ai/",
    github: "https://github.com/AashnaAnand25/AstraSign",
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
    demo: "https://aiceuiuc.vercel.app/",
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
