/**
 * Shubh Jain — Portfolio Source of Truth
 * Every fact here is sourced directly from the attached CV.
 * No achievements are invented. Copy has been rewritten for narrative clarity.
 */

export const profile = {
  name: "Shubh Jain",
  role: "Computer Science @ UIUC",
  tagline: "AI Systems. Research. Engineering. Leadership.",
  email: "shubhj3@illinois.edu",
  phone: "+1 217 979 5689",
  location: "Urbana-Champaign, IL",
  github: "https://github.com/infoshubhjain",
  linkedin: "https://www.linkedin.com/in/infoshubhjain/",
  resumeUrl: "/resume.pdf",
  // No Google Scholar was listed on the CV — leave undefined so the UI can hide it.
  scholar: undefined as string | undefined,
  website: "https://aiceuiuc.vercel.app/",
  languages: [
    { name: "English", level: "IELTS 8.0 / 9.0", fluency: 95 },
    { name: "Hindi", level: "Native", fluency: 100 },
  ],
} as const;

export const heroCopy = {
  eyebrow: "Computer Science · University of Illinois Urbana-Champaign",
  headlineLines: [
    "Building ambitious",
    "AI systems that ship.",
  ],
  description:
    "CS @ UIUC. I design multi-agent learning architectures, train transformers from scratch, ship full-stack products to production, and lead research that reaches tens of thousands of readers. Equal parts engineer, researcher, and builder.",
  stats: [
    { label: "CGPA", value: "3.83", suffix: "/4.0" },
    { label: "Research papers", value: "2", suffix: " published" },
    { label: "Books authored", value: "2", suffix: " ISBN" },
    { label: "Volunteers led", value: "200", suffix: "+" },
    { label: "MUN wins", value: "17", suffix: " Best Delegate" },
    { label: "Funds raised", value: "$34", suffix: "K+" },
  ],
};

export const about = {
  mission:
    "I want to build AI systems that genuinely expand human capability — tools that teach, that reason, that help people do things they could not do alone. I treat research, engineering, and leadership as three lenses on the same goal: making intelligent systems useful, trustworthy, and accessible.",
  vision:
    "The next decade of AI will not be won by bigger models alone. It will be won by people who can connect rigorous research, careful systems engineering, and the human contexts where the technology actually lives. I am building toward that intersection.",
  stats: [
    { label: "Years coding", value: 6, suffix: "+" },
    { label: "Websites shipped", value: 40, suffix: "+" },
    { label: "Volunteers coordinated", value: 200, suffix: "+" },
    { label: "Lives impacted", value: 2300, suffix: "+" },
    { label: "Trees planted", value: 18000, suffix: "+" },
    { label: "Readers reached", value: 50000, suffix: "+" },
  ],
  timeline: [
    {
      year: "2026",
      title: "CS Peer Mentor & CS 124 Tutor",
      org: "Siebel Center, UIUC",
      description:
        "Delivered 80+ one-on-one sessions across CS 124, 128, 173, and 225. Built pattern-based explanations for high-friction topics in Kotlin, OOP, type systems, and data structures.",
      tag: "Teaching",
    },
    {
      year: "2025",
      title: "Founder-class CS Researcher & Engineer",
      org: "UIUC — Llama Naturals / REVAMP",
      description:
        "Owned the data layer of a DistilBERT compliance classifier and shipped an adaptive multi-agent learning platform with a from-scratch Bayesian Knowledge Tracing engine.",
      tag: "Research",
    },
    {
      year: "2024",
      title: "Junior AI & NLP Lead Researcher",
      org: "Exam Lounge",
      description:
        "Led a 31-intern Agile team, lifted exam-model accuracy by 15%, cut critical production errors by 40%, and earned Intern of the Month in 3 of 4 months.",
      tag: "Leadership",
    },
    {
      year: "2024",
      title: "Published Author & Patent Holder",
      org: "IJETAE / ISBN",
      description:
        "Published two peer-reviewed papers on conversational AI, filed an IoT precision-agriculture patent, and authored 'IoT in Agriculture: Revolutionizing Indian Farming'.",
      tag: "Research",
    },
    {
      year: "2023",
      title: "Founder & President",
      org: "AI & STEM Club · Project Uthaan",
      description:
        "Founded the city's first AI/STEM lab (80+ members, $7K+ funding) and led Project Uthaan ($24K raised, 8 classrooms built, 2,200+ educated across 6 cities).",
      tag: "Leadership",
    },
    {
      year: "2029",
      title: "B.S. Computer Science",
      org: "University of Illinois Urbana-Champaign",
      description:
        "Dean's List · James Scholar. CGPA 3.83 / 4.0. Focused on AI/ML, systems, and rigorous CS foundations.",
      tag: "Education",
    },
  ],
};

export const skills = {
  Languages: [
    "Python", "TypeScript", "Rust", "Kotlin", "JavaScript", "C++", "SQL", "Java",
  ],
  Frameworks: [
    "Next.js 16", "React 19", "FastAPI", "Node.js", "Flask", "PyTorch", "HuggingFace Transformers", "Tailwind CSS",
  ],
  "AI & ML": [
    "Multi-Agent Orchestration", "Bayesian Knowledge Tracing", "Transformers", "DistilBERT", "LSTMs",
    "ReAct Loops", "RAG", "Embeddings", "Information Gain Heuristics",
  ],
  "Backend & APIs": [
    "FastAPI", "REST", "OAuth2", "Pydantic v2", "Supabase", "PostgreSQL", "SQLite", "pgvector", "Row-Level Security",
  ],
  "Cloud & DevOps": [
    "Google Cloud Run", "Vercel", "Docker", "Docker Compose", "GitHub Actions CI/CD", "Selenium", "Playwright",
  ],
  "Frontend": [
    "Next.js App Router", "Framer Motion", "Three.js / R3F", "Radix UI", "shadcn/ui", "Monaco Editor", "KaTeX", "p5.js",
  ],
  "Research": [
    "Mixed-methods evaluation", "Quantitative & qualitative analysis", "Common-sense reasoning benchmarks",
    "Explainable AI", "Counterfactual reasoning", "Surrogate modeling", "Citation-grade writing",
  ],
  "Data & Visualization": [
    "BeautifulSoup", "Playwright", "OpenAQ", "Open-Meteo", "Google Earth Engine", "GTFS", "Recharts",
  ],
  "Cybersecurity": [
    "Workshop facilitation (15+ sessions, 900+ participants)", "Privacy awareness", "Ethical-hacking basics",
    "Network hardening", "School website & network admin",
  ],
  "Tools": [
    "Git", "Linux", "Bun", "npm", "Vite", "Postman", "Linear", "Figma", "Notion", "Supabase Studio",
  ],
};

export type Project = {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  problem: string;
  solution: string;
  impact: string[];
  timeline: string;
  tags: string[];
  tech: string[];
  github?: string;
  demo?: string;
  research?: string;
  category: "AI" | "Full Stack" | "Research" | "Systems" | "Leadership";
  year: number;
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: "adaptive-learning",
    title: "AI-Powered Adaptive Learning Platform",
    oneLiner:
      "Multi-agent adaptive learning system with a from-scratch Bayesian Knowledge Tracing engine.",
    description:
      "A full-stack platform that orchestrates 7 specialized AI agents — Roadmap, Knowledge, Quiz, Conversation, Tasker, Memory Compactor, and Orchestrator — to personalize learning end-to-end. The core novelty is a hand-built Bayesian Knowledge Tracing engine that maintains per-skill mastery probabilities and selects the next question by maximizing expected information gain over the learner's current skill frontier.",
    problem:
      "Adaptive learning systems typically treat learners as averages. Per-skill mastery is rarely modeled across sessions, and most platforms lean entirely on LLM vibes for sequencing rather than rigorous probabilistic estimation.",
    solution:
      "Built a 4-layer architecture (Next.js frontend, FastAPI agent API, orchestration runtime, Supabase persistence) with dual-scope knowledge state — global per-user and local per-project — so skill priors transfer across roadmaps. The ReAct orchestration loop coordinates 7 agents through a mixin-based architecture, while the BKT engine keeps knowledge estimation deterministic and explainable.",
    impact: [
      "7 specialized AI agents orchestrated via a custom ReAct loop",
      "Bayesian Knowledge Tracing engine written from scratch with entropy-based information gain",
      "11 Supabase migrations + pgvector for semantic roadmap retrieval + RLS for isolation",
      "Frontend deployed on Vercel, backend on Google Cloud Run via Docker",
    ],
    timeline: "Dec 2025 – May 2026",
    tags: ["AI", "Machine Learning", "LLMs", "Full Stack", "Research", "Production"],
    tech: ["Next.js 15", "FastAPI", "Python", "Supabase", "OpenAI API", "Pydantic v2", "Docker", "Cloud Run", "pgvector"],
    demo: "https://aiceuiuc.vercel.app/",
    github: "https://github.com/infoshubhjain",
    category: "AI",
    year: 2026,
    featured: true,
  },
  {
    id: "bert-compliance",
    title: "BERT Ad Compliance Classifier",
    oneLiner:
      "DistilBERT NLP system that detects FDA/FTC advertising compliance violations across 15 categories.",
    description:
      "A regulatory NLP system built on DistilBERT that classifies advertising scripts for FDA/FTC compliance violations across 15 regulatory categories. Owned the data preprocessing and tokenization infrastructure end-to-end, defining the canonical dataset schema and tensor artifact specification adopted across the project.",
    problem:
      "Advertising compliance across 15 regulatory categories requires structured, auditable classification — not vibes from an LLM. Labeled data was scarce (10 initial samples), and raw advertising content arrived in wildly heterogeneous formats: social, influencer, e-commerce, broadcast, podcasts, email, and print.",
    solution:
      "Designed a DistilBERT-compatible tokenization pipeline with full 512-token context handling, padding, truncation, and attention masking. Engineered an end-to-end text processing pipeline producing model-ready tensor datasets (input_ids, attention_mask, labels), and curated a domain-specific corpus spanning every advertising channel.",
    impact: [
      "Expanded the labeled corpus 5.3× (10 → 53 samples) with near-equal class distribution",
      "430% increase in labeled dataset size while maintaining balanced binary labels across 15 categories",
      "Defined project-wide data contracts used by all downstream contributors",
      "Authored comprehensive technical documentation reducing onboarding friction",
    ],
    timeline: "Jan 2025 – May 2026",
    tags: ["AI", "NLP", "Machine Learning", "Research"],
    tech: ["PyTorch", "HuggingFace Transformers", "DistilBERT", "Python", "Git"],
    github: "https://github.com/infoshubhjain",
    category: "Research",
    year: 2025,
    featured: true,
  },
  {
    id: "neuro-rust",
    title: "neuro-rust — Neural Network in Rust",
    oneLiner:
      "Feedforward neural network built from scratch in Rust with zero ML libraries.",
    description:
      "An honors project for CS 128 — a fully configurable feedforward neural network implemented from scratch in Rust, using only ndarray for matrix math and rand for weight initialization. Implements forward propagation, backpropagation, and online stochastic gradient descent, with Xavier/Glorot initialization, sigmoid activation, and MSE loss.",
    problem:
      "Most ML practitioners never build a network from primitives. The honors brief was to do exactly that — implement forward prop, backprop, and SGD with no ML libraries, and prove the network can actually learn.",
    solution:
      "Owned the Network struct, constructor, and full backpropagation implementation including delta computation and upstream gradient propagation. Wrote 15 unit tests covering sigmoid correctness, layer output shapes, forward-pass cache consistency, exact weight-update verification via hand-computed gradients, loss decrease over 500 steps, and XOR convergence after 20k epochs.",
    impact: [
      "Successfully learns XOR in 10,000 epochs with online SGD at learning rate 1.0",
      "15 unit tests including exact hand-computed gradient verification",
      "Zero ML dependencies — only ndarray + rand",
      "Full doc-comment coverage on every public struct and method",
    ],
    timeline: "Spring 2026",
    tags: ["Systems", "Machine Learning", "Open Source"],
    tech: ["Rust", "ndarray", "rand"],
    github: "https://github.com/infoshubhjain",
    category: "Systems",
    year: 2026,
    featured: true,
  },
  {
    id: "sigaida",
    title: "SIGAIDA — Campus Environmental Intelligence",
    oneLiner:
      "Full-stack environmental monitoring platform with PyTorch LSTM air-quality forecasting.",
    description:
      "Led a 10-person team to architect and ship a full-stack environmental monitoring platform delivering real-time air quality, weather, vegetation, and transit analytics. The system predicts PM2.5 levels 24 hours ahead using a PyTorch LSTM trained on multi-year environmental datasets, with scheduled inference wired directly into the FastAPI backend.",
    problem:
      "Campus environmental data is fragmented across OpenAQ, Open-Meteo, Google Earth Engine, and GTFS transit feeds — all in incompatible schemas. Predictive forecasting required unifying them and turning scheduled inference into a first-class backend primitive.",
    solution:
      "Built automated ETL pipelines integrating 4+ external sources, standardizing heterogeneous satellite and sensor data into unified queryable schemas. Containerized backend services with Docker Compose and deployed production-ready FastAPI endpoints with interactive geospatial and time-series visualizations.",
    impact: [
      "Led 10-person team from architecture through production deployment",
      "PyTorch LSTM predicting PM2.5 24 hours ahead, integrated into backend APIs",
      "4+ external data sources unified through automated ETL",
      "Real-time + historical geospatial and time-series visualizations",
    ],
    timeline: "Aug 2025 – Dec 2025",
    tags: ["AI", "Machine Learning", "Full Stack", "Leadership", "Production", "IoT"],
    tech: ["Next.js 14", "TypeScript", "FastAPI", "PyTorch", "SQLite", "Docker Compose", "OpenAQ", "Google Earth Engine"],
    github: "https://github.com/infoshubhjain",
    category: "Full Stack",
    year: 2025,
    featured: true,
  },
  {
    id: "harvest",
    title: "Project Harvest — Dining Intelligence",
    oneLiner:
      "Full-stack dining ecosystem for 4 dining halls serving 1000+ daily users with automated scraping CI/CD.",
    description:
      "A real-time dining hall ecosystem for 4 campus dining halls, integrating React, Python Selenium scrapers, and a Node.js API. Serves 1000+ daily users with calories, macros, allergens, and meal filtering. CI/CD via GitHub Actions automates daily scraping, validation, and deployment.",
    problem:
      "Campus dining data is updated daily but locked in inconsistent HTML. Students need accurate nutrition, allergen, and filtering data without manual maintenance overhead.",
    solution:
      "Engineered Python Selenium scrapers that collect daily menus automatically, designed RESTful endpoints and a Node.js backend serving all frontend requests from SQLite, and implemented CI/CD pipelines that automate scraping, validation, and deployment end-to-end.",
    impact: [
      "Serves 1000+ daily users across 4 dining halls",
      "100% up-to-date menu data via automated scraping",
      "90% reduction in manual maintenance via GitHub Actions CI/CD",
      "100% of frontend requests served efficiently from SQLite",
    ],
    timeline: "Dec 2025 – Present",
    tags: ["Full Stack", "Automation", "Production"],
    tech: ["React", "Python", "Selenium", "Node.js", "SQLite", "GitHub Actions"],
    github: "https://github.com/infoshubhjain",
    category: "Full Stack",
    year: 2025,
    featured: false,
  },
  {
    id: "helix",
    title: "Project Helix — Campus Event Aggregation",
    oneLiner:
      "Aggregates 1000+ events from 15+ university sources with OAuth2 Google Calendar export.",
    description:
      "A full-stack campus event aggregation platform that scrapes and unifies 1000+ events from 15+ university sources into a centralized relational schema. Built a scalable multi-technique scraping pipeline combining BeautifulSoup and Playwright, with OAuth2 Google Calendar integration for authenticated event export.",
    problem:
      "University events live across 15+ heterogeneous sources — some static HTML, some JavaScript-rendered. No unified API existed, and deduplication across sources was unsolved.",
    solution:
      "Engineered a multi-technique scraping pipeline combining BeautifulSoup (static) and Playwright (JS-rendered) with deduplication logic and scheduled workflows. Designed a RESTful API layer and OAuth2-based Google Calendar integration with token-based secure access control.",
    impact: [
      "1000+ events aggregated from 15+ sources",
      "Static + JavaScript-rendered scraping unified in one pipeline",
      "OAuth2 Google Calendar export with secure token-based access",
      "Normalized inconsistent HTML into a centralized relational schema",
    ],
    timeline: "Aug 2025 – Dec 2025",
    tags: ["Full Stack", "Automation"],
    tech: ["Next.js", "BeautifulSoup", "Playwright", "OAuth2", "Google Calendar API"],
    github: "https://github.com/infoshubhjain",
    category: "Full Stack",
    year: 2025,
    featured: false,
  },
  {
    id: "iete-chatbot",
    title: "IETE — AI Chatbot & Misinformation Detector",
    oneLiner:
      "Bidirectional LSTM misinformation detector hitting 87% accuracy and a full-stack AI chatbot handling 200+ daily inquiries.",
    description:
      "Built a full-stack AI chatbot with database integration that handled 200+ daily inquiries, alongside a Bidirectional LSTM misinformation-detection model achieving 87% accuracy. Also created a customer-sentiment analysis tool processing 10,000+ reviews and a regression-based price-prediction capstone with <5% mean error.",
    problem:
      "Customer support volume was overwhelming manual teams, while misinformation in user content required automated detection. Sentiment signals were trapped in 10,000+ unstructured reviews.",
    solution:
      "Deployed a full-stack chatbot with real-time data pipelines, trained a BiLSTM for misinformation classification, and built a SQL-backed sentiment analysis tool. Completed a capstone regression project for price prediction.",
    impact: [
      "87% accuracy on BiLSTM misinformation detection",
      "200+ daily inquiries handled automatically",
      "10,000+ reviews processed by sentiment tool",
      "<5% mean error on regression price prediction capstone",
    ],
    timeline: "Jun 2023 – Aug 2023",
    tags: ["AI", "Machine Learning", "NLP", "Full Stack"],
    tech: ["Python", "Bidirectional LSTM", "SQL", "Full-stack chatbot"],
    category: "AI",
    year: 2023,
    featured: false,
  },
];

export const experience = [
  {
    role: "Machine Learning Engineer — BERT Ad Compliance Classifier",
    org: "Llama Naturals × REVAMP UIUC",
    period: "Jan 2025 – May 2026",
    location: "Urbana-Champaign, IL",
    type: "Research",
    summary:
      "Owned the data layer of a DistilBERT-based NLP system that classifies FDA/FTC advertising compliance violations across 15 regulatory categories.",
    points: [
      "Built the data preprocessing and tokenization infrastructure for a DistilBERT NLP system in PyTorch + HuggingFace Transformers.",
      "Engineered an end-to-end text processing pipeline transforming raw advertising scripts into model-ready tensor datasets (input_ids, attention_mask, labels).",
      "Expanded the labeled corpus 5.3× (10 → 53 samples) with near-equal class distribution across 15 compliance categories.",
      "Designed the canonical dataset schema and tensor artifact specification adopted across the entire project.",
      "Curated a domain-specific NLP dataset spanning social, influencer, e-commerce, broadcast, podcasts, email, and print media.",
      "Authored comprehensive technical documentation covering data flow, tensor specs, pipeline architecture, and deployment.",
    ],
    tech: ["PyTorch", "HuggingFace Transformers", "DistilBERT", "Python"],
    metrics: [
      { value: "430%", label: "labeled dataset growth" },
      { value: "15", label: "compliance categories" },
      { value: "512", label: "token context window" },
    ],
  },
  {
    role: "Junior AI & NLP Lead Researcher and Intern",
    org: "Exam Lounge",
    period: "May 2024 – Aug 2024",
    location: "Remote",
    type: "Internship",
    summary:
      "Led a 31-intern Agile team and shipped performance improvements across model accuracy, optimization, and error reduction.",
    points: [
      "Led a cross-functional team of 31 interns using Agile methodology, improving exam model accuracy by 15%.",
      "Designed and implemented data pipelines for large-scale educational datasets.",
      "Developed optimization techniques that enhanced software performance by 20%.",
      "Coordinated multiple bug-detection teams, reducing critical production errors by 40%.",
      "Awarded Intern of the Month in 3 of 4 months for exceptional problem-solving and communication.",
    ],
    tech: ["Python", "Agile", "Data Pipelines", "Optimization"],
    metrics: [
      { value: "31", label: "interns led" },
      { value: "+15%", label: "model accuracy" },
      { value: "-40%", label: "critical errors" },
      { value: "3×", label: "Intern of the Month" },
    ],
  },
  {
    role: "Lead Software Engineer & Project Manager — SIGAIDA",
    org: "Campus Energy Monitoring",
    period: "Aug 2025 – Dec 2025",
    location: "UIUC",
    type: "Leadership",
    summary:
      "Led a 10-person team building a full-stack environmental monitoring platform with PyTorch LSTM forecasting.",
    points: [
      "Architected a full-stack environmental monitoring platform using Next.js 14, TypeScript, FastAPI, and SQLite.",
      "Engineered a PyTorch LSTM forecasting pipeline predicting PM2.5 levels 24 hours ahead, with scheduled inference wired into backend APIs.",
      "Built automated ETL pipelines integrating OpenAQ, Open-Meteo, Google Earth Engine, and GTFS into unified schemas.",
      "Containerized backend services with Docker Compose and deployed production-ready FastAPI endpoints.",
    ],
    tech: ["Next.js 14", "TypeScript", "FastAPI", "PyTorch", "Docker Compose"],
    metrics: [
      { value: "10", label: "team members led" },
      { value: "24h", label: "PM2.5 forecast horizon" },
      { value: "4+", label: "data sources unified" },
    ],
  },
  {
    role: "Lead Software Engineer — Project Harvest",
    org: "Campus Dining Intelligence",
    period: "Dec 2025 – Present",
    location: "UIUC",
    type: "Engineering",
    summary:
      "Full-stack dining ecosystem serving 1000+ daily users across 4 dining halls with automated CI/CD.",
    points: [
      "Developed a full-stack ecosystem for 4 dining halls integrating React, Python scrapers, and a Node.js API for real-time updates.",
      "Built a responsive dashboard for 1000+ daily users showing calories, macros, allergens, and meal filtering.",
      "Engineered Python Selenium scrapers to collect daily menus automatically.",
      "Implemented CI/CD pipelines via GitHub Actions, cutting manual maintenance by 90%.",
    ],
    tech: ["React", "Python", "Selenium", "Node.js", "SQLite", "GitHub Actions"],
    metrics: [
      { value: "1000+", label: "daily users" },
      { value: "4", label: "dining halls" },
      { value: "-90%", label: "manual maintenance" },
    ],
  },
  {
    role: "Lead Software Engineer — Project Helix",
    org: "Campus Event Aggregation",
    period: "Aug 2025 – Dec 2025",
    location: "UIUC",
    type: "Engineering",
    summary:
      "Aggregated 1000+ events from 15+ university sources with OAuth2 Google Calendar export.",
    points: [
      "Built a full-stack event aggregation platform scraping 1000+ events from 15+ university sources.",
      "Engineered a multi-technique scraping pipeline combining BeautifulSoup and Playwright.",
      "Developed a RESTful API layer with OAuth2 Google Calendar integration for authenticated event export.",
    ],
    tech: ["Next.js", "BeautifulSoup", "Playwright", "OAuth2"],
    metrics: [
      { value: "1000+", label: "events aggregated" },
      { value: "15+", label: "sources unified" },
    ],
  },
  {
    role: "Machine Learning Intern",
    org: "IETE",
    period: "Jun 2023 – Aug 2023",
    location: "India",
    type: "Internship",
    summary:
      "Built and deployed a full-stack AI chatbot, a BiLSTM misinformation detector, and a sentiment analysis tool.",
    points: [
      "Developed and deployed a full-stack AI chatbot with database integration, handling 200+ daily inquiries.",
      "Implemented a Bidirectional LSTM model with 87% accuracy for misinformation detection.",
      "Created a customer sentiment analysis tool processing 10,000+ reviews using SQL databases.",
      "Completed a capstone price-prediction project using regression models with <5% mean error.",
    ],
    tech: ["Python", "BiLSTM", "SQL", "Regression"],
    metrics: [
      { value: "87%", label: "BiLSTM accuracy" },
      { value: "200+", label: "daily chatbot inquiries" },
      { value: "10K+", label: "reviews analyzed" },
    ],
  },
  {
    role: "Freelance Web Developer",
    org: "Independent",
    period: "May 2023 – May 2025",
    location: "India · Remote",
    type: "Engineering",
    summary:
      "Designed, developed, and shipped 40+ websites with SEO, e-commerce, booking, and analytics integrations.",
    points: [
      "Designed and developed 40+ websites across Wix, Squarespace, and custom HTML/CSS.",
      "Implemented SEO, responsive UI/UX, payment gateways, e-commerce, booking systems, and analytics.",
      "Managed complete project lifecycles from client consultation to launch.",
    ],
    tech: ["HTML/CSS", "JavaScript", "Wix", "Squarespace", "SEO"],
    metrics: [
      { value: "40+", label: "websites shipped" },
    ],
  },
];

export const research = [
  {
    title: "A Comparative Assessment of Advanced Conversational Agents: ChatGPT, Gemini, Perplexity, and Claude",
    venue: "International Journal of Emerging Technology and Advanced Engineering (IJETAE)",
    date: "June 2024",
    type: "Journal Article",
    topics: ["LLMs", "Evaluation", "Conversational AI"],
    abstract:
      "A comprehensive comparative analysis evaluating factual accuracy, relevance, completeness, coherence, creativity, and bias across four leading conversational AI models using a mixed-methods approach. Revealed significant performance variations: ChatGPT excels in creative text generation, Gemini demonstrates superior factual accuracy, while Perplexity and Claude show varying interpretability and bias levels.",
    citation:
      "Jain, S. (2024). A Comparative Assessment of Advanced Conversational Agents: ChatGPT, Gemini, Perplexity, and Claude. International Journal of Emerging Technology and Advanced Engineering.",
    link: undefined as string | undefined,
  },
  {
    title:
      "Investigation of the Performance of ChatGPT in Answering Common Sense-Based Questionnaires",
    venue: "International Journal of Emerging Technology and Advanced Engineering (IJETAE)",
    date: "September 2023",
    type: "Journal Article",
    topics: ["Common-sense Reasoning", "LLMs", "Evaluation"],
    abstract:
      "Developed a comprehensive questionnaire evaluating ChatGPT's common-sense reasoning abilities across diverse domains, identifying high error rates and inconsistencies in fundamental factual knowledge. Most downloaded high school-authored research paper in journal history; awarded Best Junior Author of the Year 2023 (USD 1,000).",
    citation:
      "Jain, S. (2023). Investigation of the Performance of ChatGPT in Answering Common Sense-Based Questionnaires. International Journal of Emerging Technology and Advanced Engineering.",
    link: undefined as string | undefined,
  },
];

export const books = [
  {
    title: "Beyond the Black Box: Unlocking the Secrets of Explainable AI",
    isbn: "B0F38TX4ZR",
    date: "May 2025",
    type: "Authored Book",
    topics: ["Explainable AI", "Interpretability", "Ethics"],
    abstract:
      "Investigates the black-box problem in AI systems, presenting comprehensive methods including post-hoc interpretability, counterfactual reasoning, rule-based models, and surrogate modeling techniques. Applies Explainable AI techniques to real-world domains including healthcare diagnostics, financial risk assessment, and autonomous vehicle systems, while highlighting ethical, regulatory, and fairness considerations in AI deployment.",
    citation:
      "Jain, S. (2025). Beyond the Black Box: Unlocking the Secrets of Explainable AI. ISBN B0F38TX4ZR.",
    link: undefined as string | undefined,
  },
  {
    title: "IoT in Agriculture: Revolutionizing Indian Farming",
    isbn: "978-9394351950",
    date: "November 2024",
    type: "Authored Book",
    topics: ["IoT", "Agriculture", "Sustainability"],
    abstract:
      "Explores IoT applications in Indian agriculture, addressing challenges of climate change, water scarcity, soil degradation, and crop productivity through comprehensive research and practical frameworks. Developed and documented practical frameworks for smart farming including sensor deployment, crop monitoring, predictive analytics, and automated alerts. Distributed 500+ copies to universities across India and recognized by the Governor of Madhya Pradesh for significant contribution to agricultural innovation.",
    citation:
      "Jain, S. (2024). IoT in Agriculture: Revolutionizing Indian Farming. ISBN 978-9394351950.",
    link: undefined as string | undefined,
  },
];

export const patents = [
  {
    title: "IoT-Based Precision Agriculture System",
    id: "Patent — IoT & Agriculture",
    date: "June 2024",
    abstract:
      "A comprehensive IoT-based precision agriculture system enabling real-time monitoring of soil, crop, water, and environmental parameters to improve efficiency and reduce resource waste. Integrates sensor networks, automated irrigation control, and predictive analytics for optimized yield, water usage, and crop health management. Developed scalable frameworks contributing to sustainable farming and smart agriculture initiatives in India.",
  },
];

export const leadership = [
  {
    role: "CS Peer Mentor",
    org: "Siebel Center for Computer Science, UIUC",
    period: "Jan 2026 – Present",
    category: "Mentoring",
    summary:
      "Delivered 80+ one-on-one academic support sessions across CS 124, 128, 173, and 225.",
    points: [
      "Adapted explanations in real time based on each student's specific point of confusion rather than delivering scripted walkthroughs.",
      "Advised 80+ students on navigating the UIUC CS ecosystem: RSO discovery, internship sourcing, research access, course sequencing.",
      "Identified recurring patterns of confusion and built clearer explanation frameworks for high-friction topics.",
    ],
    impact: { value: "80+", label: "students mentored" },
  },
  {
    role: "CS 124 Assistant Tutor",
    org: "University of Illinois Urbana-Champaign",
    period: "Jan 2026 – Present",
    category: "Teaching",
    summary:
      "Delivered targeted tutoring on Kotlin, OOP, type systems, control flow, and data structure fundamentals.",
    points: [
      "Supported students through homework problem sets and machine problems end-to-end — from problem decomposition to bug tracing.",
      "Built a pattern-recognition approach identifying the 3-4 conceptual misunderstandings that cause most student errors.",
      "Framed sessions around guided questioning rather than direct answers, pushing students to reason independently.",
    ],
    impact: { value: "CS 124", label: "course supported" },
  },
  {
    role: "Panels Head — UI-CON",
    org: "University of Illinois Urbana-Champaign",
    period: "Oct 2025 – Feb 2026",
    category: "Event Management",
    summary:
      "Led panel programming for a large-scale university comic convention with 2,000+ attendees.",
    points: [
      "Managed 60+ volunteers across panel operations, registration, crowd management, and guest coordination.",
      "Oversaw 20+ panels, workshops, and Q&A sessions with 40+ speakers, artists, and industry guests.",
      "Directed volunteer shift planning covering 250+ total volunteer hours.",
      "Handled live troubleshooting across 6+ simultaneous panels under tight time constraints.",
    ],
    impact: { value: "2,000+", label: "attendees" },
  },
  {
    role: "Director of Board Development — SSUAB",
    org: "Student Board, UIUC",
    period: "Aug 2025 – Present",
    category: "Leadership",
    summary:
      "Planned skill-development events and authored a comprehensive report on undergraduate research and career services.",
    points: [
      "Designed and authored a comprehensive report identifying opportunities for undergraduate research and career services improvement.",
      "Built relationships with faculty, university departments, and external stakeholders.",
      "Mentored peers in LinkedIn optimization, resume refinement, and professional communication.",
    ],
    impact: { value: "Board-wide", label: "professional development" },
  },
  {
    role: "Management Head — Diwali on the Quad",
    org: "Indian Graduate Student Association, UIUC",
    period: "October 2025",
    category: "Event Management",
    summary:
      "Directed operational planning for a campus-wide Diwali festival with 1,000+ attendees.",
    points: [
      "Managed a 30+ member volunteer team across logistics, setup, guest coordination, and operations.",
      "Designed a centralized scheduling and task-management system overseeing 50+ operational tasks.",
      "Led outreach across 15+ student organizations and campus networks.",
      "Oversaw 10+ cultural performances and 80+ volunteer hours.",
    ],
    impact: { value: "1,000+", label: "attendees" },
  },
  {
    role: "Founder & President — AI and STEM Club",
    org: "Independent",
    period: "Mar 2023 – Mar 2025",
    category: "Founder",
    summary:
      "Founded the city's first AI & STEM lab and led the school's largest student club (80+ members).",
    points: [
      "Established the city's first AI & STEM lab and professional recording studio with Raspberry Pi, Arduino, AI platforms, and audio production tools.",
      "Built and led the school's largest student club (80+ members) with mentorship programs and project pipelines.",
      "Developed an AI-powered chatbot for school operations, winning Best Club Exhibition among 50+ clubs.",
      "Secured $7,000+ annual funding from sponsors and school grants.",
    ],
    impact: { value: "$7K+", label: "annual funding secured" },
  },
  {
    role: "Founder & President — Project Uthaan",
    org: "Independent NGO",
    period: "Dec 2022 – Dec 2025",
    category: "Founder",
    summary:
      "Raised $24,000+ in funding, directed 200+ volunteers across 6 cities, and educated 2,200+ participants.",
    points: [
      "Raised $24,000+ in funding through grant proposals, corporate partnerships, and social outreach.",
      "Directed 200+ volunteers across 6 cities with regional leaders and uniform program delivery.",
      "Oversaw construction of 8 classrooms and installation of 100+ computers.",
      "Designed programs benefiting 700+ women, 600+ children, and 300+ senior citizens.",
      "Partnered with Techno Global University to expand educational access for underserved communities.",
    ],
    impact: { value: "$24K+", label: "funds raised" },
  },
  {
    role: "Head of Operations — SBI Sustainability Drive",
    org: "SBI × BHEL × NGOs",
    period: "Jun 2023 – Jul 2023",
    category: "Event Management",
    summary:
      "Led an 80-member team, raised $10,000+, and oversaw the plantation of 18,000+ trees across 6 acres.",
    points: [
      "Led and coordinated an 80-member team, liaising with SBI, BHEL, and local NGOs.",
      "Raised $10,000+ and oversaw plantation of 18,000+ trees (including 100+ native species) across 6 acres.",
      "Managed media coverage, press releases, and community engagement.",
    ],
    impact: { value: "18,000+", label: "trees planted" },
  },
  {
    role: "ICT Captain — TSVS Student Council",
    org: "Independent",
    period: "Aug 2023 – Aug 2024",
    category: "Leadership",
    summary:
      "Organized 15+ cybersecurity workshops for 900+ participants and hosted a 1,000+ participant TechFest.",
    points: [
      "Organized 15+ cybersecurity workshops for 900+ participants on safe digital practices and ethical hacking basics.",
      "Hosted Sanskaar TechFest attracting 1,000+ nationwide participants.",
      "Managed school website, internal networks, and cybersecurity protocols.",
      "Recognized with School Colour for ICT — the only high-school recipient.",
    ],
    impact: { value: "School Colour", label: "for ICT (sole recipient)" },
  },
  {
    role: "Secretary General & Committee Chair — MUN",
    org: "Model United Nations",
    period: "Feb 2022 – Nov 2024",
    category: "Leadership",
    summary:
      "Chaired 8+ committees, served as Secretary General for 2 MUNs (700+ delegates), won 17 Best Delegate awards.",
    points: [
      "Chaired 8+ committees, enforcing parliamentary procedure and managing debate flow.",
      "Served as Secretary General for 2 large-scale MUNs with 700+ delegates.",
      "Trained junior chairs and secretariat in minute-taking, roll calls, motions, and conflict resolution.",
      "Participated in 35+ MUNs, winning 17 Best Delegate awards.",
    ],
    impact: { value: "17×", label: "Best Delegate" },
  },
  {
    role: "Junior Editor-in-Chief — MetroVaartha",
    org: "National Newspaper",
    period: "Aug 2022 – Aug 2023",
    category: "Editorial",
    summary:
      "Managed the technology section, supervised junior editors, and authored an AI article reaching 50,000+ readers.",
    points: [
      "Authored 'Artificial Intelligence: Blessing or Curse?' — reached 50,000+ readers and sparked community discussions.",
      "Supervised a team of junior editors and contributors; improved readership by 15% within six months.",
      "Proofread, fact-checked, and edited 200+ articles.",
      "Conducted industry interviews with tech professionals and startups.",
    ],
    impact: { value: "50,000+", label: "readers reached" },
  },
  {
    role: "Teacher & Mentor — Bharat Scouts and Guides",
    org: "Volunteer",
    period: "Mar 2022 – Mar 2023",
    category: "Volunteer",
    summary:
      "Mentored 400+ underprivileged children and managed campaigns reaching 30,000+ individuals.",
    points: [
      "Mentored 400+ underprivileged children with educational materials and personal guidance.",
      "Managed 90+ volunteers and organized community campaigns reaching 30,000+ individuals.",
      "Raised $1,500+ to fund education initiatives.",
    ],
    impact: { value: "30,000+", label: "individuals reached" },
  },
];

export const volunteerRoles = [
  {
    org: "Hira Nyas Trust",
    contribution: "Designed and executed computer literacy workshops for underprivileged communities; organized fundraising via handmade product sales.",
  },
  {
    org: "Lalitambha Social Welfare Society",
    contribution: "Conducted workshops on computer basics and digital literacy; improved community access to educational resources.",
  },
  {
    org: "S.H.E Foundation",
    contribution: "Coordinated project management, operational strategy, and execution for social initiatives supporting education and community development.",
  },
];

export const achievements = [
  {
    title: "Best Junior Author of the Year 2023",
    issuer: "IJETAE",
    value: "USD 1,000",
    category: "Research",
    description: "Awarded for the most downloaded high school-authored research paper in journal history.",
  },
  {
    title: "Patent — IoT Precision Agriculture",
    issuer: "Patent Filing",
    value: "1 patent",
    category: "Research",
    description: "Designed and patented a comprehensive IoT-based precision agriculture system for sustainable farming.",
  },
  {
    title: "Author — 'Beyond the Black Box: Explainable AI'",
    issuer: "ISBN B0F38TX4ZR",
    value: "Book · May 2025",
    category: "Publication",
    description: "Authored a comprehensive book on Explainable AI methods across healthcare, finance, and autonomous systems.",
  },
  {
    title: "Author — 'IoT in Agriculture: Revolutionizing Indian Farming'",
    issuer: "ISBN 978-9394351950",
    value: "500+ copies distributed",
    category: "Publication",
    description: "Distributed to universities across India; recognized by the Governor of Madhya Pradesh for contribution to agricultural innovation.",
  },
  {
    title: "Dean's List — UIUC",
    issuer: "University of Illinois Urbana-Champaign",
    value: "Academic Honors",
    category: "Academic",
    description: "Recognized for sustained academic excellence in the Computer Science program.",
  },
  {
    title: "James Scholar — UIUC",
    issuer: "University of Illinois Urbana-Champaign",
    value: "Honors Program",
    category: "Academic",
    description: "Selected for UIUC's prestigious James Scholar honors program recognizing outstanding academic achievement.",
  },
  {
    title: "Intern of the Month — Exam Lounge",
    issuer: "Exam Lounge",
    value: "3 of 4 months",
    category: "Professional",
    description: "Awarded 3 times out of a 4-month internship for exceptional problem-solving and communication.",
  },
  {
    title: "School Colour for ICT — TSVS",
    issuer: "TSVS",
    value: "Sole recipient",
    category: "Leadership",
    description: "The only high school recipient of the School Colour for contributions to technology advancement and student empowerment.",
  },
  {
    title: "17× Best Delegate — Model United Nations",
    issuer: "MUN Circuit",
    value: "17 awards · 35+ MUNs",
    category: "Leadership",
    description: "Won 17 Best Delegate awards across 35+ MUNs; served as Secretary General for 2 large-scale conferences (700+ delegates).",
  },
  {
    title: "Best Club Exhibition — AI & STEM Club",
    issuer: "Annual Fest",
    value: "Among 50+ clubs",
    category: "Leadership",
    description: "Won Best Club Exhibition for the AI-powered chatbot developed to streamline school operations.",
  },
  {
    title: "Recognized by the Governor of Madhya Pradesh",
    issuer: "Government of Madhya Pradesh",
    value: "State Recognition",
    category: "Recognition",
    description: "Recognized for significant contribution to agricultural innovation through the IoT in Agriculture book.",
  },
  {
    title: "Selected — IIT Delhi IHFC × Rancho Labs Summer",
    issuer: "IIT Delhi",
    value: "Top 20 nationwide",
    category: "Selection",
    description: "Among 20 students selected nationwide for an intensive summer program at IIT Delhi's IHFC, mentored by Rancho Labs.",
  },
];

export const navItems = [
  { id: "home", label: "Home", shortcut: "1" },
  { id: "about", label: "About", shortcut: "2" },
  { id: "projects", label: "Projects", shortcut: "3" },
  { id: "research", label: "Research", shortcut: "4" },
  { id: "experience", label: "Experience", shortcut: "5" },
  { id: "leadership", label: "Leadership", shortcut: "6" },
  { id: "skills", label: "Skills", shortcut: "7" },
  { id: "achievements", label: "Awards", shortcut: "8" },
  { id: "contact", label: "Contact", shortcut: "9" },
] as const;
