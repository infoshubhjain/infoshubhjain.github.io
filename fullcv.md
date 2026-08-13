SHUBH JAIN
 
Phone: +2179795689
Email: shubhj3@illinois.edu

Linkedin 
https://www.linkedin.com/in/infoshubhjain/

Github
https://github.com/infoshubhjain 

Personal website
https://infoshubhjain.github.io/


Languages: English (IELTS 8.0/9.0), Hindi (Native)

Education
Bachelor of Science in Computer Science, University of Illinois Urbana-Champaign
Expected Graduation: May 2028

CGPA: 3.83/4.0
 
Deans List @ UIUC

James Scholar @ UIUC

RESEARCH EXPERIENCE
UR2PhD Pre-REC Research Training Program
Research Methods, Reproducibility, and Scientific Communication
Completed structured research training in literature review, citation tracing, research-question development, hypothesis formation, experimental design, quantitative and qualitative methods, data visualization, research writing, and scientific presentations.
Conducted backward- and forward-literature searches using Google Scholar and primary research sources to identify foundational studies, follow-up work, publication venues, author affiliations, and connections between related research papers.
Reproduced published benchmark visualizations for a protein structure classification study using Python, Google Colab, pandas, NumPy, and Matplotlib.
Analyzed benchmark results across 72 protein-classification datasets and compared traditional machine learning, regular deep learning, and graph-based deep learning methods using misclassification rates, runtime measurements, rank-based comparisons, and strict versus relaxed tie definitions.
Evaluated the trade-off between predictive performance and computational cost, finding that traditional machine-learning approaches can remain competitive with deep-learning methods while requiring substantially less runtime.
Recreated and interpreted publication figures, including method-ranking plots, runtime-summary tables, per-dataset misclassification plots, and supplementary ranking visualizations.
Studied dynamic protein structure networks, dynamic graphlets, graph convolutional networks, CNN–LSTM architectures, logistic regression, protein structure classification, and CATH/SCOP(e) structural labels.
Reproduced a text-bias evaluation workflow based on counterfactual name perturbation, testing whether an NLP toxicity model changed its predictions when only a person’s name was substituted into otherwise identical sentences.
Computed and interpreted bias-sensitivity measures, including score sensitivity, score deviation, score range, and label distance, and examined how model behavior changed across classification thresholds.
Investigated experimental validity and reproducibility issues, including control and experimental groups, measurement noise, hardware dependence, self-report bias, dataset selection, sample size, confounding variables, and limitations of benchmark studies.
Critically evaluated research methods in studies involving educational reading guides, computational phylogenetics, NLP bias detection, protein classification, and data visualization.
Used Anscombe’s quartet to demonstrate how summary statistics can conceal important patterns and how visualization can reveal outliers, nonlinear relationships, clustering, and differences between datasets with similar numerical summaries.
Designed sample research topics, research questions, and testable hypotheses, and revised them using feedback focused on specificity, measurability, variables, and alignment between questions and methods.
Practiced scientific communication by creating research presentations with background, methods, results, interpretation, limitations, and conclusions sections.
Developed skills in critically reviewing scientific writing and presentations, including organization, transitions, clarity, visual design, audience engagement, slide structure, and explanation of technical results.
RESEARCH SKILLS
Python · Google Colab · pandas · NumPy · Matplotlib · Data visualization · Literature review · Citation analysis · Reproducibility · Experimental design · Hypothesis development · Quantitative research · Qualitative research · Machine-learning evaluation · NLP bias analysis · Scientific writing · Research presentations

(personal project)
**Meter — Autonomous LLM Cost Governance Proxy** | Backend & Infrastructure Lead | Aug 2026
*Python, FastAPI, asyncio, PostgreSQL, httpx, Docker, GitHub Actions, Next.js 16, TypeScript*
*1.** Architected and shipped the core FastAPI metering proxy — ~3,600 LOC across 6 of
7 hot-path modules, sole author by `git blame` — implementing the full request lifecycle
(authenticate → attribute → predict → circuit-break → reserve → forward → capture) for
both the OpenAI (`/v1/chat/completions`) and Anthropic-native (`/v1/messages`) wire
protocols, with model-prefix routing so a caller's existing provider SDK works unmodified
against a single endpoint.

**2.** Designed and implemented an **authorize/capture reservation system** that enforces
per-project and per-feature daily spend ceilings under concurrency: in-flight holds are
counted alongside settled ledger spend inside a single `asyncio.Lock`, closing the
read-then-call race in which N simultaneous requests each observe the same healthy
balance and collectively overspend. Proved correctness with a 40-way concurrent test
against a ceiling that funds exactly 4 requests, plus TTL-expiry, heartbeat-rescue and
zero-hold-leak assertions.

**3.** Eliminated a class of silent under-billing on streaming responses by **heartbeating
reservations every 30s against a 120s TTL**, so a hold cannot expire mid-flight — a
failure mode that raised no exception and degraded spend accounting specifically on the
longest and most expensive requests in the system. Validated with a negative-control
harness flag (`--break-heartbeat`) that must make the check fail; the first version of
that check passed under the control and was therefore worthless, because expired holds
are reaped lazily and lingered in the map being counted.

**4.** Built the **dual-protocol SSE usage parser** that reconstructs token accounting
from provider streaming formats that fundamentally disagree: injects
`stream_options.include_usage` into OpenAI requests and strips the resulting extra chunk
back out of the client-facing stream, and reassembles Anthropic usage split across
`message_start` (input + cache tiers) and `message_delta` (output) frames — reading only
the first under-counts output tokens by ~40×. Buffers complete SSE events because TCP
chunk boundaries do not align to event boundaries; regression-tested by feeding the
parser one byte at a time.

**5.** Diagnosed a **silent data-corruption bug that invalidated 100% of streamed cost
data**, found only by verifying against live provider APIs rather than fixtures: real
providers gzip SSE responses, the streaming path read still-compressed bytes via
`aiter_raw()`, found no `data:` lines, and quietly downgraded every streamed request to a
byte-count estimate — while simultaneously forwarding gzip to clients labelled
`text/event-stream`, which no SSE client can parse. The entire test suite passed
throughout, because fake upstreams do not compress. Fixed and pinned with the suite's only
real-socket test: a purpose-built gzipping HTTP server.

**6.** Reframed proxy latency from a single quoted figure into a **round-trip count model**
(`overhead ≈ sequential round trips × RTT`) by instrumenting the PostgreSQL connection
layer directly — at loopback latency, timing alone cannot distinguish 3 round trips from
5 — and proved the published 52.7 ms benchmark measured a 2-trip configuration nobody
runs, while the shipping configuration issues 5. Then **removed one trip from every
governed request** by folding two spend aggregates (same table, same window, differing
only by a filter) into a single scan, worth ~50 ms per enforced request against a remote
database, and locked it in with a test asserting the code path issues exactly one database
call — the class of regression that surfaces only as latency.

**7.** Engineered a **two-condition circuit breaker** requiring both an absolute spend
floor over a 5-minute rolling window *and* a 3× burst ratio against the trailing hour's
average spend rate, with tag-scoped throttling (429), key-scoped revocation (403) for
leaked credentials, and automatic half-open recovery. Deliberately adapted Google's SRE
multi-window multi-burn-rate pattern rather than porting it: a second absolute threshold
over a long window cannot trip until an hour of sustained burn accumulates — acceptable
for paging a human about SLO burn, catastrophic for a leaked API key — so the long window
serves as a **rate baseline** instead, keeping "normal for this tag stops alerting" while
detection stays as fast as the floor allows.

**8.** Led a **full-codebase security audit** with every finding reproduced against a
running service rather than read from source, closing three exploitable defects: a CORS
preview regex matching *any* attacker-published `*.vercel.app` deployment (rebuilt from
configured origins, with tests pinning `…vercel.app.evil.com` lookalikes against
Starlette's `fullmatch` semantics); a completely unauthenticated endpoint that exposed the
autonomous payment loop on demand to any caller who could reach the port; and a per-IP
rate-limit bypass where a missing `--proxy-headers` flag collapsed the entire internet
into one shared quota behind the platform edge. Wrote the authorization test as a **set
assertion over money-moving routes**, so the next payment endpoint added is caught by
default rather than silently inheriting read-level access — the exact omission that
produced the original vulnerability.

**9.** Authored the project's entire test and measurement infrastructure — a
**256-assertion proxy suite** (grown from 78), a 750-LOC concurrency soak harness, and a
latency benchmark — sustaining ~400 req/s across ~5,000 requests at 16 concurrent clients
with **zero dropped ledger writes and zero lock contention errors**, and measuring
throughput against a no-proxy control at matched concurrency so the saturation ceiling was
*attributable* rather than assumed. The harnesses found 6 pre-existing defects, including
a `from __future__ import annotations` interaction that made FastAPI reject 100% of
benchmark traffic as HTTP 422 — meaning every prior latency number had skipped usage
parsing and pricing entirely — and a config key typo (`ceiling_usd_day` vs
`ceiling_usd_per_day`) that silently routed every previous soak run down the
*unenforced* fast path while reporting enforced numbers.

**10.** Owned build and release infrastructure end to end: multi-stage Docker images
running as **non-root uid 10001**, a GitHub Actions pipeline running `ruff`,
`pip-audit`, `npm audit` and 5 test suites (867 assertions) against an ephemeral
`postgres:16` service container isolated from production data — and discovered the
pipeline had **never actually passed**, its lint step exiting 127 "command not found"
on every run because the linter was never installed.

---
HDF5 AI Sustainability Pipeline (The HDF Group)
Software engineer
May 2026 - august 2026

Python, Claude/GPT-4o APIs, tree-sitter, ChromaDB, Lizard, pytest — 80 commits, ~22K lines added across a 14-person team repo
Built the primary LLM refactoring engine (llm/primary.py, 457 LOC) that generates verified refactoring diffs for the 25-year-old HDF5 C library — constrained system prompt enforcing no-new-API/no-new-export/no-new-file invariants, git format-patch validation, and prompt caching that cut repeat-call cost ~80%.
Designed and shipped the multi-model consensus gate (Gate 2 of a 6-gate stack): Claude Sonnet and GPT-4o review every diff in full independence, with both_approve / both_reject / disagree states; split verdicts route to human review and log to a disagreements ledger instead of being silently resolved.
Parallelized the dual-LLM gate with ThreadPoolExecutor, halving per-diff wall time, and extracted shared verdict parsing into llm/verdict_utils.py to delete duplicate logic across two reviewer clients.
Added a zero-API-cost faithfulness pre-check that validates the LLM's Pattern-Citation trailers against actually-retrieved RAG chunks, catching hallucinated citations in ~1 ms before a $0.01–0.05 GPT-4o verifier call.
Wrote an in-house cognitive-complexity calculator for C after finding Lizard's cognitive extension doesn't exist (upstream issue #432) and the codebase was silently defaulting to None — plus a nesting-depth signal from the same traversal, and a Maintainability Index derived from existing token data with no new parse pass or dependency.
Recalibrated the complexity consensus to fix a false-negative class: a pure guard-clause refactor (CCN 10→10, cognitive 22→9) was being hard-failed because CCN is structurally blind to nesting-only restructuring. Introduced zero-delta abstention plus route_consensus() human-review disposition wired end-to-end as a first-class harness outcome (exit code 8).
Built the AI-comment static detector (analysis/comment_check.py) that flags LLM-generated redundant/history-narrating comments and deprecated } /* end if */ markers, with carve-outs for HDF5 function banners — diff-based and net-new-only, so a 25-year-old file's existing comments never count against a contributor.
Improved finding attribution honesty on live GitHub PRs: added a NAME_ATTRIBUTED class that maps complexity regressions named only in message text to touched functions, raising attributable scope on PR #6470 from 10/14 to 12/14 (85.7%) without force-pinning unmatched findings.
Authored ~280 unit and mocked-E2E tests across the LLM engine, consensus gate, faithfulness check, and complexity analyzers (repo total 809), plus guided demo walkthroughs and stakeholder documentation used in weekly HDF Group reviews.



Alpha Engine — Open Market Signal Research Engine - QuantHQ 
May 2026 - august 2026
Software engineering intern (can also use Project manager (intern) if relevant  for app)


Python 3.10+, FastAPI, MCP, Docker, GitHub Actions — solo, 33K LOC, 1,009 tests
Built a deterministic multi-asset research engine spanning crypto, US equities, Indian equities, Indian F&O, and forex — 22 independent analyzers (RSI, MACD, Bollinger, VWAP, volatility, on-chain, options OI, macro calendar, correlation) synthesized into a directional signal with calibrated confidence, a full audit trail of contributing opinions, and an explicit invalidation price.
Integrated 25+ market data sources (Binance, Yahoo, CoinGecko, Glassnode, FRED, OANDA, Dhan, AngelOne, NSE, RBI, Finnhub) behind a unified ingestion layer with caching, source-health tracking, retention policies, and automatic failover.
Backtested the engine against 6,788 signals across 7 assets and up to 5 years using a no-lookahead replay of the live pipeline — measured +0.0% directional edge over direction-matched base rates, and published the null result in FINDINGS.md rather than shipping an unvalidated claim.
Caught and documented two measurement errors that each looked like real alpha — survivorship conditioning on non-stopped-out signals produced a spurious +10% edge — turning the project's headline finding into a reproducible methodology writeup.
Shipped a quant layer with Black-Scholes pricing, factor models, cross-sectional ranking, and options backtesting; exposed the same toolset three ways — CLI, HTTP API, and an MCP server for LLM agents.
Wrote a one-command installer (./start.sh) that provisions an isolated venv, self-diagnoses via a doctor subcommand (Python version, empty CA trust store, thin signal logs), and runs correctly from any working directory.
Automated daily signal collection via GitHub Actions git-scraping with committed data artifacts, hardened concurrency, and pre-wired optional API-key secrets.
Maintained 1,009 tests across 57 suites with coverage tracking, ruff, Docker/compose packaging, and a security/reliability audit (AUDIT.md).


QuantHQ — Organization Site (quanthq.in)

Astro 5, Tailwind CSS 4, MDX, GitHub Pages — solo, 46 commits
Designed and built the full public site for QuantHQ as a static Astro 5 SSG — homepage, About, Research archive, Blog, Community, Contact — deployed to a custom domain via a GitHub Pages CI pipeline.
Built a ~2,900-line standalone homepage with an editorial design system: tri-voice typography (Instrument Serif display + mono figures), liquid-glass navigation, terminal chrome, section-dot navigation, and a gold signature accent propagated site-wide through CSS custom properties.
Implemented interactive canvas visualizations — a rotating globe, a draggable force-directed graph, an interactive dashboard, and a ⌘K command palette — all built with vanilla <script> tags and zero JS framework dependencies.
Shipped light/dark theming with theme-aware canvas rendering, a full contrast audit, and prefers-reduced-motion support that disables all animation for users who ask for it.
Modeled Research and Blog content as type-safe MDX collections using Astro 5's glob() loader with Zod schemas (enum-validated categories and publication status), rendered through [...slug].astro dynamic routes.
Ran a deep visual and accessibility audit across all pages — layout rhythm, container alignment, a11y contrast, light-mode parity — and documented remaining CSS duplication as tracked tech debt in FURTHER_WORK.md.



MLH Commit Fellow — MLH × Transcend Network · Founding Cohort (v1 2026) · Remote · June 2026 – July 2026
Resume Bullet Points (Pick your top 4-5)
Selected from a global applicant pool for the inaugural founding cohort of the MLH × Transcend Network Commit Fellowship—a highly selective founder-track program with a 2.5% acceptance rate. Admitted alongside an elite cohort of 30 fellows from Stanford, MIT, and Ivy League institutions.
Engaged directly with tech millionaires, angel investors, General Partners at the Transcend Fund, and edtech founders, providing high-level strategic advisory on critical business operations and deals.
Advised a startup founder on their B2B pricing strategy, consulted on AI integration for an investor's portfolio company, provided feedback on a target demographic strategy, and helped evaluate a potential acquisition deal.
Spearheaded market validation for AI tools focused on student career navigation and reducing LLM token waste, pressure-testing the thesis using Transcend's proprietary product-market-fit (PMF) playbook.
Executed 24 rapid, low-cost lean experiments and conducted 10 in-depth user interviews via cold outreach, synthesizing insights from 15 founder conversations to document every learning cycle.
Successfully invalidated 3 core assumptions through rigorous customer discovery, pivoting the venture thesis and moving the project from a broad concept to a defensible, validated problem-solution narrative.
Culminated the fellowship by designing and presenting a comprehensive pitch deck to the MLH × Transcend leadership team and cohort peers, securing actionable feedback and strategic alignment for the venture's next phase.
MLH Commit Fellow | Major League Hacking (MLH) × Transcend Network
June 2026 – July 2026 · Remote
Selected from a highly competitive global applicant pool (2.5% acceptance rate) for the inaugural founding cohort of the MLH × Transcend Network Commit Fellowship. Admitted alongside 30 elite peers from Stanford, MIT, and Ivy League institutions to pressure-test and build ventures using Transcend's proprietary product-market-fit (PMF) playbook.
During the fellowship, I led market validation for AI tools focused on student career navigation and reducing LLM token waste. I executed 24 lean experiments, conducted 10 user interviews via cold outreach, and synthesized insights from 15 founder conversations, ultimately invalidating 3 core assumptions and successfully pivoting my venture thesis toward product-market fit.
Alongside the core build work, I engaged directly with tech millionaires, angel investors, Transcend Fund General Partners, and seasoned edtech founders. I provided strategic advisory on high-level operations, including advising a founder on B2B pricing strategy, consulting on AI integration for a portfolio company, evaluating a potential acquisition deal, and giving feedback on target demographics.
Culminated the program by designing and presenting a comprehensive pitch deck to MLH × Transcend leadership, securing strategic alignment for the venture's next stage of development.

Short CV Narrative (For a 1-paragraph summary or cover letter)
MLH Commit Fellow, MLH × Transcend Network (Founding Cohort, v1 2026). June 2026 – July 2026. Admitted via a rigorous application and interview process with a 2.5% acceptance rate to a highly selective cohort of 30 elite fellows from Stanford, MIT, and Ivy League institutions. Explored and pressure-tested AI tools for student career navigation and reducing LLM token waste by executing 24 lean experiments, conducting 10 user interviews, and synthesizing insights from 15 founder conversations, successfully invalidating 3 core assumptions. Engaged directly with tech millionares, angel investors, Transcend Fund GPs, and edtech founders, providing strategic advisory on B2B pricing strategies, AI integration, target demographics, and a potential acquisition deal. Culminated the program by presenting a comprehensive venture pitch deck to MLH × Transcend leadership.

A Quick Tip for Interviews
If an interviewer asks about the June–July timeline, simply say: "It was an intensive, sprint-based founder accelerator. We treated it like a full-time, high-stakes environment, compressing months of standard market research, investor relations, and PMF validation into a highly focused window." This frames the timeline as a feature of intensity and efficiency, rather than a limitation.



Mnemostack 
Lead SWE (also can use SWE intern if you wanna show internship)
June 2026 to Aug 2026
Header
Mnemostack — Graph-aware code retrieval MCP for AI coding assistants
Python · tree-sitter · FAISS HNSW · SQLite FTS5/BM25 · RRF · MCP
GitHub: https://github.com/Switchblack-Labs/Mnemostack
Deploy: local MCP daemon (no public web URL)

───

Best resume set (copy these)

• Architected a local MCP code-memory daemon that retrieves full dependency chains (callers + callees), not isolated files, for AI coding assistants.
• Engineered hybrid retrieval: FAISS HNSW + SQLite FTS5/BM25, fused with Reciprocal Rank Fusion (k=60) and 3× top_k over-fetch (default top_k=5).
• Implemented 2-hop BFS call-graph expansion on CALLS/IMPORTS_FROM edges so hits surface cross-file deps 1–2 hops away.
• Built AST chunking with tree-sitter across 6 extensions (Python / JS / TS / JSX / TSX) and fallback chunking for broader indexable files.
• Designed multi-signal re-ranking at 0.6 semantic · 0.25 recency · 0.15 dependency with a 60-minute recency half-life.
• Tuned local CPU ANN search (HNSW M=32, efConstruction=200, efSearch=128) for O(log n)-style nearest-neighbor retrieval.
• Shipped 8 MCP tools (index_project, query_codebase, get_full_context, session memory, constraints, consolidation, stats).
• Automated incremental re-indexing with watchdog and 500 ms debounce so the index stays live during active edits.
• Resolved cross-file imports (absolute, relative, aliases, packages) to link real symbols in the call graph instead of string-similar noise.
• Validated the pipeline with 150+ tests across ~5.6k lines of Python (RRF, BFS, import edges, MCP wire models, e2e query).
• Added two-tier session memory: record every turn, auto-consolidate every 25 turns under a ~3,000-token budget.

───

Compact (pick 4–5)

1. Built Mnemostack, a local MCP server for dependency-aware code retrieval (Python, tree-sitter, FAISS, FTS5).
2. Fused FAISS HNSW + BM25 with RRF (k=60) and 2-hop BFS graph expansion for cross-file context.
3. Parsed 6 language extensions via AST and re-indexed on save with 500 ms file-watch debounce.
4. Ranked results using 0.6 / 0.25 / 0.15 semantic–recency–dependency weights (60-min half-life).
5. Exposed 8 typed MCP tools and 150+ tests to cut wasted tokens from blind file dumps.

───

Ultra-dense one-liners (high density)

┌─────────────┬───────────────────────────────────────────────────────────┐
│ Action      │ Metric-heavy bullet                                       │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Architected │ Local MCP daemon: graph-aware retrieval for AI assistants │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Engineered  │ Hybrid search: FAISS HNSW + FTS5/BM25 + RRF (k=60)        │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Expanded    │ Call graph via 2-hop BFS (both directions)                │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Chunked     │ AST boundaries for 6 TS/JS/Python extensions              │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Re-ranked   │ 0.6 / 0.25 / 0.15 score mix; 60-min recency decay         │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Indexed     │ HNSW M=32, efC=200, efS=128; fetch 3× top_k               │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Watched     │ Live re-index with 500 ms debounce                        │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Shipped     │ 8 MCP tools over stdio                                    │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Tested      │ 150+ tests · ~5.6k LOC Python                             │
├─────────────┼───────────────────────────────────────────────────────────┤
│ Compressed  │ Memory consolidate every 25 turns · ~3k token budge





Jan 2025 - May 2026
Llama naturals, REVAMP UIUC BERT

BERT Ad Compliance Classifier | Machine Learning Engineer
Built the data preprocessing and tokenization infrastructure for a DistilBERT-based NLP system that detects FDA/FTC advertising compliance violations across 15 regulatory categories using PyTorch and HuggingFace Transformers.
Engineered an end-to-end text processing pipeline that transformed raw advertising scripts into model-ready tensor datasets (input_ids, attention_mask, labels), establishing the interface between dataset curation and transformer fine-tuning workflows.
Expanded and balanced the training corpus by 5.3× (10 → 53 labeled samples), achieving near-equal class distribution while increasing coverage across regulatory violation scenarios and advertising channels.
Designed the canonical dataset schema and tensor artifact specification adopted throughout the project, enabling seamless integration between preprocessing, training, and evaluation stages.
Curated a domain-specific NLP dataset spanning social media, influencer marketing, e-commerce listings, broadcast advertising, podcasts, email campaigns, and print media to improve model robustness across heterogeneous input formats.
Implemented DistilBERT-compatible tokenization with 512-token context handling, padding, truncation, and attention masking, ensuring consistency between preprocessing and downstream transformer architecture.
Authored comprehensive technical documentation covering data flow, tensor specifications, pipeline architecture, and deployment instructions, reducing onboarding complexity for future contributors.
Technical Highlights
Owned an entire stage of a multi-component machine learning pipeline from architecture design through implementation, artifact generation, validation, and documentation.
Defined project-wide data contracts used by downstream contributors, including dataset schemas and serialized tensor formats.
Applied transformer-based NLP preprocessing techniques to convert unstructured advertising content into structured model inputs suitable for supervised fine-tuning.
Quantified Impact
Increased labeled dataset size by 430% while maintaining balanced binary classification labels across 15 compliance categories.
Produced tokenized datasets utilizing the full 512-token DistilBERT context window, enabling support for long-form advertising content.
Contributed across data engineering, NLP preprocessing, dataset curation, documentation, and ML infrastructure within a collaborative Git-based development environment.


AstraSign
Lead SWE
Feb 2026
https://astrasign-f8d8832c.aedify.ai/
https://github.com/AashnaAnand25/AstraSign

Header (always works)
AstraSign — Real-time bidirectional ASL ↔ speech translator
React · TypeScript · FastAPI · MediaPipe · TensorFlow.js · Three.js · Whisper · Gemini · ElevenLabs
~30 FPS dual-hand tracking · 21 landmarks · 262-sign DB · 10+ REST APIs

───

1. Full-stack software engineering

• Architected a full-stack web app with 2 translation modes, separating React/TS client pipelines from a modular FastAPI backend.
• Implemented 10+ REST endpoints across 6 route modules (transcribe, grammar, signs, speak, memory, recognize) with CORS-ready deploy config.
• Integrated camera, mic, and TTS streams into a single UX with mode switching, history, and settings.
• Delivered 30+ React components and reusable hooks for hand tracking, voice, and gesture pipelines in a Vite + TypeScript codebase.
• Shipped production-oriented structure: env-based API keys, health checks, OpenAPI docs, and deploy paths (Aedify / Modal / Procfile).

Keywords: full-stack, REST, React, TypeScript, Python, FastAPI, API design, system design

───

2. Frontend / UI engineering

• Built a responsive ASL product UI with React 18, TypeScript, Tailwind, and shadcn/ui (30+ feature components).
• Engineered real-time media UX: webcam + mic capture, live status feedback, and dual-mode navigation.
• Implemented accessibility-minded settings (focus modes, global accessibility provider) for inclusive UX.
• Rendered interactive 3D avatars with Three.js / React Three Fiber (3 avatars, 4 hand meshes, 8 GLB animations).
• Optimized client state with custom hooks (useHandTracking, useFastSignPipeline, useVoicePipeline) to keep UI responsive under continuous video inference.

Keywords: React, TypeScript, Three.js, real-time UI, accessibility, performance, component design

───

3. Computer vision / ML engineering

• Processed live video at ~30 FPS using MediaPipe HandLandmarker (GPU-preferred), tracking 2 hands and 21 landmarks × 3 (63) features per frame.
• Designed a browser TensorFlow.js classifier (68 inputs → 128/64/32 dense layers, dropout, softmax; 50 epochs, 20% val split).
• Stabilized predictions with landmark smoothing, temporal confidence accumulation (threshold 3.5), and context/bigram score fusion.
• Supported multi-frame recognition windows (5–90 frames/segment) for sequence-based sign classification.
• Added fallback classifiers so recognition degrades gracefully when model init fails.

Keywords: MediaPipe, TensorFlow.js, CV, landmarks, real-time inference, gesture recognition, ML systems

───

4. AI / NLP / applied LLMs

• Orchestrated a multi-model pipeline: Whisper STT → Gemini/GPT English→ASL gloss grammar → sign lookup → ElevenLabs TTS.
• Converted free-form English into ASL-style topic-comment structure for signing (e.g. spoken sentence → gloss sequence).
• Mapped recognized gloss words back to natural English for sign→speech.
• Integrated long-term vocabulary memory (Supermemory) for save/load of user sign vocab.
• Chained multimodal I/O (audio + text + landmarks) through one coherent translation flow.

Keywords: Whisper, LLMs, prompt pipelines, multimodal AI, STT/TTS, NLP, applied AI

───

5. Backend / API / systems

• Designed a FastAPI service layer with typed request/response models (Pydantic) for landmarks, batch signs, and gloss conversion.
• Exposed 10+ endpoints for speech, grammar, sign DB (262 entries), TTS, memory, and recognition.
• Validated landmark payloads (min 5 / max 90 frames; 21×3 shape) before inference.
• Configured concurrent request handling (Modal 10 concurrent inputs) and env-based secrets for multi-provider APIs.
• Structured backend into routes + services (OpenAI/Whisper, Gemini, ElevenLabs, Supermemory) for clean separation of concerns.

Keywords: FastAPI, Python, REST, validation, microservices-style modules, cloud deploy, concurrency

───

6. Real-time systems / performance

• Streamed hand inference on a requestAnimationFrame loop with ~33 ms target interval (~30 FPS).
• Reduced flicker via temporal smoothing and commit thresholds instead of single-frame decisions.
• Enabled on-device gesture paths for common signs to cut network latency vs full cloud round-trips.
• Balanced accuracy vs latency with GPU delegate + CPU fallback for MediaPipe WASM.
• Pipeline-split client capture from server AI so UI stays interactive during transcription/TTS.

Keywords: real-time, latency, streaming, client-side inference, performance optimization

───

7. Human–computer interaction (HCI) / accessibility

• Built an assistive communication tool enabling 2-way interaction between ASL users and spoken-language users.
• Designed dual modalities (camera signs + mic speech) so either party can initiate communication.
• Implemented accessibility settings and voice-guidance-oriented UX patterns.
• Visualized ASL via 3D avatars for learners who need visual, not only textual, feedback.
• Supported quick phrases, history, and simplified flows for lower cognitive load in live conversation.

Keywords: accessibility, assistive tech, HCI, inclusive design, multimodal interaction

───

8. Data / knowledge systems

• Curated a 262-sign backend index for O(1)-style word→sign lookup and batch queries.
• Structured ASL assets: 26-letter alphabet, word animations, gesture maps, and training landmark samples.
• Modeled signs as multi-representation data (landmarks, glosses, animations, HamNoSys-style encodings where used).
• Exposed single-word and batch sign APIs for efficient multi-token phrase resolution.
• Persisted user vocabulary via memory save/load endpoints for personalization.

Keywords: data modeling, lookup systems, APIs, knowledge base, personalization

───

9. 3D graphics / creative tech

• Rendered ASL with Three.js and React Three Fiber using 3 character models and dedicated left/right hand meshes.
• Animated 8+ sign GLBs and word-level motion sequences for visual translation.
• Bridged ML outputs (recognized gloss / spoken words) to avatar playback controls (speed, camera, selection).
• Loaded and managed GLB assets in a web runtime without a native game engine.

Keywords: Three.js, WebGL, 3D avatars, animation, creative coding, graphics

───

10. Product / systems design (SWE interviews)

• Defined end-to-end product flow: capture → recognize/transcribe → transform grammar → map signs → speak/animate.
• Decomposed the system into frontend ML, backend services, and third-party AI providers with clear interfaces.
• Chose hybrid architecture: on-device CV for low latency + cloud NLP/TTS for quality.
• Planned failure modes: missing API keys, MediaPipe init failure, unknown signs → fallbacks/UNKNOWN.
• Targeted a real accessibility use case (not demo-only UI) with dual conversation modes.

Keywords: system design, tradeoffs, modularity, reliability, product thinking

───

11. Mobile / cross-platform readiness (if you mention Android/CORS notes)

• Designed backend CORS and API contracts to support web + external clients (e.g. Android) against the same FastAPI surface.
• Kept recognition payload schema client-agnostic (landmark frames + handedness) so any client can stream features.
• Separated UI from ML services so the same pipeline can be re-skinned for mobile later.

Keywords: API-first design, multi-client, mobile-ready backend

───

12. DevOps / deployment (lighter, still valid)

• Containerized-ready / cloud-ready backend with Procfile, Modal app config, and Aedify deploy notes.
• Externalized secrets (GEMINI, OPENAI/Whisper, ELEVENLABS, SUPERMEMORY) via environment variables.
• Added /health and root status endpoints for uptime checks.
• Documented run scripts (run.sh / run.bat) for one-command local demo setup.

Keywords: deploy, env config, health checks, cloud (Modal), ops basics


CS

Resume Bullet Points — AI Career App
Project Title: AI-Powered Adaptive Learning Platform (Career & Skills)
https://aiceuiuc.vercel.app/

Dec 2025 - May 2026


AI-Powered Adaptive Learning Platform | Next.js, FastAPI, Python, Supabase, OpenAI API | Dec 2025 - May 2026
Architected a full-stack adaptive learning platform with a multi-agent backend orchestrating 7 specialized agents (Roadmap, Knowledge, Quiz, Conversation, Tasker, Memory Compactor, Orchestrator) that coordinate in real time to personalize the learning experience end-to-end
Implemented a Bayesian Knowledge Tracing (BKT) engine from scratch that models per-skill mastery probabilities across sessions using parameters for learning rate, guess rate, and slip rate; the engine selects the next question by maximizing expected information gain over the learner's current skill frontier
Built an adaptive placement system that seeds per-user, per-project skill priors at session start and updates durable Bayesian posteriors in Supabase after every quiz attempt, enabling the system to resume accurate knowledge state across sessions and projects
Designed a 4-layer orchestration pipeline (Next.js frontend, FastAPI agent API, orchestration runtime, Supabase persistence) with 10+ database tables tracking sessions, quiz attempts, skill observations, and memory compaction across users
Integrated OpenAI API across multiple agents to dynamically generate personalized learning roadmaps, adaptive quiz questions with answer keys, topic lesson plans, and conversational tutoring, while keeping knowledge estimation algorithmic and deterministic via BKT
Persisted session replay capability by storing full transcript, active quiz state, roadmap progress, and skill probabilities in Supabase, allowing users to close and reopen a session with full context restored

Architecture & Backend
Designed and built a multi-agent orchestration system using a custom ReAct (Reason + Act) loop with 7 specialized AI agents (Roadmap, Knowledge, Quiz, Conversation, Dungeon, Tasker, Memory) composed via a mixin-based architecture for modular, phase-driven learning workflows
Implemented a Bayesian Knowledge Tracing (BKT) engine from scratch — posterior updates, entropy-based information gain heuristics, and adaptive frontier selection — to sequence placement probes and personalize skill progression for each user
Built a FastAPI + Python REST backend with async request handling, Pydantic v2 validation, pluggable LLM provider routing (OpenAI, Gemini, OpenRouter), and a YAML-based config layer for model switching without code changes
Engineered quiz fingerprinting to deduplicate generated questions across placement sessions and prevent repetition, with answer keys persisted in Supabase and correctness evaluation feeding back into BKT state

Frontend & UX
Developed a Next.js 15 (App Router) frontend with TypeScript, Tailwind CSS, Radix UI, and Framer Motion — including a streaming-style chat interface, adaptive quiz modal, roadmap preview flow, and a post-lesson dungeon narrative experience
Built useChatSession, a custom React hook with polling and exponential backoff, to manage multi-turn session state, XP/level updates, and phase transitions without WebSockets
Integrated a Monaco Editor-based code playground supporting interactive p5.js sketches for visual coding lessons, alongside KaTeX math rendering and Prism.js syntax highlighting for rich technical content

AI & Data
Designed a sliding-window conversation memory manager with dynamic token budgeting (~8% of LLM context, 1600–24000 token range) to sustain coherent multi-turn teaching sessions across 200+ message transcripts
Implemented dual-scope knowledge state persistence — global per-user and local per-project skill probability tables in Supabase — enabling cross-roadmap skill transfer and fine-grained learning analytics
Integrated a dependency-free DuckDuckGo web scraper to enrich lesson content with fresh resources at inference time, without relying on third-party search APIs

Infrastructure & Deployment
Containerized the backend with Docker (Python 3.11-slim + Uvicorn), deployed to Google Cloud Run; frontend deployed to Vercel with SSR and auth middleware
Managed Supabase PostgreSQL with 11 incremental migrations, pgvector for semantic roadmap retrieval, Row-Level Security (RLS) policies for user data isolation, and anonymous auth for frictionless onboarding
Wired end-to-end gamification (XP, levels, streaks, milestones) with Supabase event sourcing for auditability and future analytics

One-liner for project header
AI-powered adaptive learning platform with Bayesian Knowledge Tracing, multi-agent orchestration, and personalized roadmap generation — full-stack Next.js / FastAPI / Supabase, deployed on Vercel + Cloud Run






CS 128 Honors Project
Urbana-Champaign, IL
Expected May 2028
neuro-rust | Feedforward Neural Network in Rust | github | Team: neuro-rust Spring 2026
• Built a feedforward neural network from scratch in Rust with zero ML libraries, using only ndarray for matrix math and rand for
weight initialization; implemented forward propagation, backpropagation, and online stochastic gradient descent across a
configurable layer architecture.
• Implemented Xavier/Glorot weight initialization, sigmoid activation with analytic derivative, MSE loss, and chain rule
backpropagation across all layers; network successfully learns XOR in 10,000 epochs with online SGD at learning rate 1.0.
• Owned project setup, Network struct and constructor, backpropagation implementation including delta computation and upstream
gradient propagation, final code cleanup, doc comments on all public structs and methods, and RUN.md from scratch.
• Wrote 15 unit tests across all modules covering sigmoid correctness, layer output shapes, forward pass cache consistency, exact
weight update verification via hand-computed gradients, loss decrease over 500 steps, and XOR convergence after 20k epochs.




Junior AI & NLP Lead Researcher and Intern, Exam Lounge May 2024 – August 2024
• Led cross-functional team of 31 interns using Agile methodology, improving exam model accuracy by 15%
• Designed and implemented data pipelines for processing large-scale educational datasets
• Developed optimization techniques that enhanced software performance by 20%
• Coordinated multiple bug detection teams, reducing critical production errors by 40%
• Awarded “Intern of the Month” for 3 out of 4 months for exceptional problem-solving and communication

Machine Learning Intern, IETE June 2023 – August 2023
• Developed and deployed full-stack AI chatbot with database integration, handling 200+ daily inquiries
• Built data pipeline using Python to process and analyze user interaction data in real-time
• Implemented Bidirectional LSTM model with 87% accuracy for misinformation detection
• Created customer sentiment analysis tool processing 10,000+ reviews using SQL databases
• Completed capstone price prediction project using regression models with <5% mean error

Lead Software Engineer, Project Harvest Dec 2025 – Present
• Developed a full-stack ecosystem for 4 dining halls, integrating React, Python scrapers, and Node.js API for real-time updates.
• Built a responsive dashboard for 1000+ daily users, showing calories, macros, allergens, and meal filtering.
• Engineered Python Selenium scrapers to collect daily menus automatically, ensuring 100% up-to-date data.
• Designed RESTful endpoints and Node.js backend, serving 100% of frontend requests efficiently from SQLite.
• Implemented CI/CD pipelines via GitHub Actions, automating daily scraping, validation, and deployment; cut manual main-
tenance by 90%.

Lead Software Engineer and Project Manager, SIGAIDA Campus Energy August 2025 – December 2025
• Led a 10-member team to architect and implement full-stack environmental monitoring platform using Next.js 14, TypeScript,
FastAPI, and SQLite, delivering real-time air quality, weather, vegetation, and transit analytics via RESTful services.
• Engineered PyTorch LSTM forecasting pipeline predicting PM2.5 levels 24 hours ahead, training on multi-year environmental
datasets and integrating scheduled inference directly into backend APIs.
• Built automated ETL pipelines integrating 4+ external data sources including OpenAQ, Open-Meteo, Google Earth Engine,
and GTFS, standardizing heterogeneous satellite and sensor data into unified schemas for scalable querying.
• Containerized backend services using Docker Compose and deployed production-ready FastAPI endpoints with interactive
geospatial and time-series visualizations for real-time and historical analysis.

Lead Software Engineer, Project Helix August 2025 – December 2025
• Built full-stack campus event aggregation platform scraping and unifying 1000+ events from 15+ university sources,
normalizing inconsistent HTML structures into centralized relational schema for dynamic querying and filtering.
• Engineered scalable multi-technique scraping pipeline combining BeautifulSoup and Playwright to handle static and JavaScript-
rendered sources, implementing deduplication logic and scheduled scraping workflows.
• Developed RESTful API layer and OAuth2-based Google Calendar integration enabling authenticated users to export aggregated
events directly to personal calendars using token-based secure access control.


Freelance Web Developer May 2023 - may 2025
Designed and developed 40+ websites (Wix, Squarespace, HTML/CSS)
Implemented SEO, responsive UI/UX, payment gateways, e-commerce, booking systems, and analytics
Managed complete project lifecycles, client consultation to launch

AI & ML Intern | YBI Foundation: 
 Intensive one-month program (practical AI/ML)

IIT Delhi IHFC - Rancho Labs (Summer):
 Among 20 students selected nationwide; Python fundamentals; linear regression projects; networking with IIT alumni









RESEARCH EXPERIENCE & PUBLICATIONS

Patent
IoT and Agriculture June 2024
• Designed and patented a comprehensive IoT-based precision agriculture system enabling real-time monitoring of soil,
crop, water, and environmental parameters to improve efficiency and reduce resource waste
• Integrated sensor networks, automated irrigation control, and predictive analytics for optimized yield, water usage, and
crop health management
• Developed scalable frameworks contributing to sustainable farming and smart agriculture initiatives in India


Published Research Papers
A Comparative Assessment of Advanced Conversational Agents: ChatGPT, Gemini, Perplexity, and Claude
International Journal of Emerging Technology and Advanced Engineering (IJETAE) June 2024
• Conducted comprehensive comparative analysis evaluating factual accuracy, relevance, completeness, coherence, creativity,
and bias across four leading conversational AI models using mixed-methods approach
• Performed quantitative and qualitative analysis across diverse question types including factual, open-ended, situational, hypothetical,
and creative questions to identify model strengths and weaknesses
• Revealed significant performance variations: ChatGPT excels in creative text generation, Gemini demonstrates superior factual accu-
racy, while Perplexity and Claude show varying interpretability and bias levels
Investigation of the Performance of ChatGPT in Answering Common Sense-Based Questionnaires
International Journal of Emerging Technology and Advanced Engineering (IJETAE) September 2023
• Developed comprehensive questionnaire evaluating ChatGPT’s common-sense reasoning abilities across diverse domains, identify-
ing high error rates and inconsistencies in fundamental factual knowledge
• Best Junior Author of the Year 2023 (awarded USD 1,000); most downloaded high school-authored research paper in journal
history
• Employed quantitative accuracy metrics and qualitative human assessor evaluation to analyze ChatGPT’s comprehension, reasoning
limitations, and contextual appropriateness in common-sense scenarios
Authored Books
IoT in Agriculture: Revolutionizing Indian Farming November 2024
ISBN: 978-9394351950
• Explored IoT applications in Indian agriculture, addressing challenges of climate change, water scarcity, soil degradation, and
crop productivity through comprehensive research and practical frameworks
• Developed and documented practical frameworks for smart farming, including sensor deployment strategies, crop monitoring systems,
predictive analytics models, and automated alert mechanisms
• Distributed 500+ copies to universities across India, integrated into academic libraries and research programs; recognized by the
Governor of Madhya Pradesh for significant contribution to agricultural innovation
Beyond the Black Box: Unlocking the Secrets of Explainable AI May 2025
ISBN: B0F38TX4ZR
• Investigated the black-box problem in AI systems, presenting comprehensive methods including post-hoc interpretability, coun-
terfactual reasoning, rule-based models, and surrogate modeling techniques
• Applied Explainable AI techniques to real-world domains including healthcare diagnostics, financial risk assessment, and autonomous
vehicle systems
• Highlighted ethical, regulatory, and fairness considerations in AI deployment, emphasizing transparency, trustworthiness, and account-
ability in algorithmic decision-making

Junior Editor-in-Chief | MetroVaartha (National Newspaper) August 2022 - August 2023
Authored the article “Artificial Intelligence: Blessing or Curse?”, analyzing technical, ethical, and societal implications of AI; reached 50,000+ readers and sparked community discussions on technology adoption.


Managed the technology section, supervising a team of junior editors and contributors; implemented content workflow improvements that boosted readership by 15% within six months.


Proofread, fact-checked, and edited 200+ articles, ensuring technical accuracy, clarity, and compliance with editorial standards.


Conducted industry interviews with tech professionals and startups, synthesizing insights into accessible, engaging content.


Developed comprehensive editorial guidelines, standardizing tone, style, and formatting across sections to improve consistency and quality.


Skills demonstrated: Editorial Leadership, Content Strategy, Technical & Research Writing, Fact-Checking, Proofreading, Interviewing, Team Supervision, Analytical Thinking, Publication Planning, Audience Engagement, Quality Assurance.





Book Writing Assistant / Freelance Editor & Proofreader March 2023 - May 2025
Assisted in 10+ book projects, conducting in-depth research, drafting content, providing developmental feedback, and editing for clarity, structure, and style.


Edited and proofread 300+ academic essays spanning technical, scientific, and academic topics; applied domain-specific knowledge to ensure accuracy and readability.


Developed custom style guides, formatting standards, and writing resources for authors and clients, ensuring consistent tone and adherence to publication guidelines.


Delivered detailed feedback on argumentation, structure, and content flow, helping authors enhance clarity, coherence, and logical progression in their writing.


Skills demonstrated: Developmental Editing, Technical & Academic Writing, Proofreading, Research & Fact-Checking, Style Guide Creation, Content Structuring, Author Mentorship, Critical Analysis, Communication, Attention to Detail, Project Management.


LEADERSHIP & PROJECT EXPERIENCE
CS Peer Mentor Siebel Center for Computer Science, UIUC — January 2026 – Present
Delivered 80+ one-on-one academic support sessions across multiple CS courses, resolving conceptual doubts, debugging code, and explaining foundational to intermediate programming concepts to students at varying levels of experience.
Guided students through doubt-clearing for courses spanning CS 124, CS 128, CS 173, and CS 225, adapting explanations in real time based on each student's specific point of confusion rather than delivering scripted walkthroughs.
Advised 80+ students on navigating the UIUC CS ecosystem — RSO discovery, internship sourcing and application strategy, research access, course sequencing, and how to build a competitive profile from freshman year onward.
Identified recurring patterns of confusion across students and proactively developed clearer explanation frameworks for high-friction topics, reducing the time needed to resolve common doubts in repeat sessions.
Maintained consistent session availability and follow-through, building ongoing relationships with returning students who came back across multiple weeks for continued support on evolving coursework challenges.

CS 124 Assistant Tutor University of Illinois Urbana-Champaign — January 2026 – Present
Delivered targeted tutoring sessions to CS 124 students on Kotlin syntax, object-oriented programming, type systems, control flow, and data structure fundamentals, meeting students at their exact point of confusion rather than re-teaching full lessons from scratch.
Supported students through homework problem sets and machine problems end-to-end — from understanding the prompt and decomposing the problem to identifying bugs, tracing logic errors, and understanding why a fix worked rather than just applying it.
Assisted with structured in-class lessons, providing real-time supplementary explanation to students who needed additional support during instruction and stepping in immediately when confusion surfaced rather than waiting for it to compound.
Developed a pattern recognition approach to tutoring, identifying the three to four conceptual misunderstandings that caused the majority of student errors in Kotlin assignments and building targeted explanations specifically designed to address each one.
Built student confidence alongside technical understanding by framing doubt-clearing sessions around guided questioning rather than direct answers, pushing students to reason through problems independently while providing scaffolding where needed.

Director of Board Development – SSUAB 		August 2025 - present
Planned, coordinated, and executed multiple skill-development events for the student board, increasing engagement and participation.
Designed and authored a comprehensive report identifying opportunities for undergraduate research and career services improvement.
Conducted data collection and analysis to inform actionable recommendations for enhancing student access to professional resources.
Built and maintained relationships with faculty, university departments, and external stakeholders to expand opportunities for board members.
Mentored peers in LinkedIn optimization, resume refinement, and professional communication skills.
Delivered workshops and one-on-one sessions to strengthen team collaboration and interpersonal skills.
Managed event logistics, scheduling, and participant engagement to ensure seamless execution and measurable impact.
Monitored and evaluated program outcomes, implementing improvements based on feedback and participation metrics.
Fostered a culture of continuous learning, professional development, and research-oriented thinking within the board.
Developed leadership, strategic planning, networking, mentorship, and communication skills through hands-on experience.

Panels Head | UI-CON | University of Illinois Urbana-Champaign | Oct 2025 – Feb 2026
• Led planning and execution for the panel programming division of a large-scale university comic convention attracting 2,000+ attendees over a multi-day event.
 • Managed and coordinated 60+ volunteers across panel operations, registration, crowd management, and guest coordination, maintaining smooth operations across 8+ event areas.
 • Oversaw the scheduling and execution of 20+ panels, workshops, and Q&A sessions, coordinating logistics for 40+ speakers, artists, and industry guests.
 • Designed and implemented operational workflows for panel scheduling, speaker communication, and room transitions, reducing delays and maintaining on-time panel starts.
 • Collaborated with 20+ executive board members, staff coordinators, and external vendors to manage programming logistics, AV setup, and venue coordination.
 • Directed volunteer shift planning covering 250+ total volunteer hours, ensuring consistent staffing for panel moderation, attendee check-in, and room management.
 • Managed real-time crowd flow for panel sessions, coordinating room capacity limits and line organization.
 • Developed standardized training materials and briefings for volunteers, improving coordination across teams and reducing operational issues during peak convention hours.
 • Handled live operational troubleshooting across 6+ simultaneous panels and performances, resolving scheduling conflicts, speaker delays, and technical issues under tight time constraints.
 • Implemented structured communication channels between panel teams, operations staff, and executive leadership to maintain efficient decision-making during high-traffic periods.
 • Ensured compliance with venue safety policies and capacity regulations while maintaining a high-quality attendee experience across all programming spaces.
 • Delivered a highly organized convention experience through strong leadership, operational planning, and cross-team coordination in a high-pressure, fast-paced event environment.



Management Head | Indian Graduate Student Association, Diwali on the Quad Event | October 2025
• Directed operational planning and execution for a large-scale campus Diwali festival attended by 1,000+ students and community members, one of the highest turnout cultural events of the semester.
 • Managed and coordinated a 30+ member volunteer team across logistics, event setup, guest coordination, and on-site operations to ensure smooth execution of a 4+ hour campus-wide celebration.
 • Designed and maintained a centralized scheduling and task-management system overseeing 50+ operational tasks and timelines, improving coordination across multiple planning teams.
 • Led outreach and promotion initiatives across 15+ student organizations and campus networks
 • Oversaw end-to-end logistics, including stage setup, performance coordination, vendor communication, and equipment allocation for 10+ cultural performances and activities.
 • Organized volunteer shift scheduling covering 80+ total volunteer hours, ensuring adequate staffing for event setup, guest management, and post-event teardown.
 • Managed real-time crowd flow and event operations for 1,000+ attendees, coordinating entry points, check-in processes, and activity transitions to maintain safe and efficient movement across the event area.
 • Coordinated with 5+ executive board members and campus partners to align programming, budgeting, and operational planning for the event.
 • Implemented structured tracking for participant inflow and operational resources, monitoring hundreds of check-ins and event interactions to support efficient event management.
 • Supervised setup and teardown operations involving 20+ logistical assets including staging, lighting, sound equipment, and cultural booths.



Founder & President | AI and STEM Club March 2023- March 2025
Established the city’s first AI & STEM lab and professional recording studio, providing students access to cutting-edge technologies including Raspberry Pi, Arduino, AI platforms, and audio production tools.


Built and led the school’s largest student club (80+ members), designing mentorship programs, project pipelines, and collaborative workshops to develop technical skills, teamwork, and leadership among members.


Developed an AI-powered chatbot to streamline school operations, enhancing communication, scheduling, and information accessibility; presented the project at the annual fest, winning “Best Club Exhibition” among 50+ clubs.


Secured $7,000+ annual funding from sponsors and school grants; managed bi-weekly executive meetings, drafted agendas, and maintained comprehensive digital documentation including project roadmaps, progress reports, and technical manuals.


Skills demonstrated: Leadership, Strategic Planning, Technical Project Development, AI & Machine Learning Implementation, Mentorship, Fundraising, Team Management, Workflow Optimization, Innovation, Communication, Organizational Design.


Founder & President | Project Uthaan  December 2022 - December 2025
Raised $24,000+ in funding through grant proposals, corporate partnerships, and social outreach; structured operational and financial frameworks to ensure accountability and transparency.


Directed 200+ volunteers across 6 cities, coordinating tasks, timelines, and regional leaders to ensure uniform program delivery and operational efficiency.


Oversaw construction of 8 classrooms, installation of 100+ computers, and partnership with Techno Global University, expanding educational access for underserved communities.


Designed and executed programs benefiting 700+ women, 600+ children, and 300+ senior citizens, directly educating 2,200+ participants through digital literacy, vocational skills, and community development workshops.


Maintained compliance reporting, internal communications, volunteer tracking, and documentation, ensuring operational transparency and measurable impact.


Skills demonstrated: Large-scale Project Management, Leadership, Fundraising, Volunteer Coordination, Strategic Planning, Operations Oversight, Stakeholder Engagement, Impact Assessment, Communication, Social Entrepreneurship.


Head of Operations | SBI Sustainability Drive  June 2023 - July 2023
Led and coordinated an 80-member team, liaising with SBI, BHEL, and local NGOs to execute a large-scale environmental initiative.


Developed detailed event agendas, logistics plans, and impact reports, ensuring tasks were clearly assigned and tracked.


Raised $10,000+ and oversaw the plantation of 18,000+ trees (including 100+ native species) across 6 acres, implementing sustainable practices for long-term environmental impact.


Managed media coverage, press releases, and community engagement, raising awareness and building partnerships for environmental sustainability.


Skills demonstrated: Operational Leadership, Environmental Management, Logistics Coordination, Stakeholder Collaboration, Fundraising, Strategic Execution, Team Management, Event Planning, Public Relations, Reporting & Documentation.


ICT Captain | TSVS Student Council	 August 2023- august 2024
Organized 15+ cybersecurity workshops for 900+ participants, teaching safe digital practices, ethical hacking basics, and privacy awareness.


Hosted Sanskaar TechFest, attracting 1,000+ nationwide participants, overseeing event scheduling, technical infrastructure, and on-site support.


Managed school website, internal networks, and cybersecurity protocols, implementing updates and solutions to prevent system vulnerabilities.


Recognized with “School Colour for ICT”, the only recipient in high school for contributions to technology advancement and student empowerment.


Skills demonstrated: Leadership, IT & Cybersecurity, Event Management, Technical Operations, Strategic Planning, Team Coordination, Problem-Solving, Digital Literacy Advocacy, Communication, Infrastructure Management.


Model United Nations (MUN)    Feb 2022 - Nov 2024
Chaired 8+ committees, enforcing parliamentary procedure, managing debate flow, and ensuring adherence to rules across sessions.


Served as Secretary General for 2 large-scale MUNs with 700+ delegates, developing conference agendas, documentation, and procedural frameworks for seamless execution.


Trained junior chairs and secretariat in minute-taking, roll calls, motions, and conflict resolution, building leadership capacity within the team.


Participated in 35+ MUNs, winning 17 Best Delegate awards, demonstrating excellence in negotiation, diplomacy, and policy analysis.


Skills demonstrated: Leadership, Public Speaking, Negotiation, Policy Analysis, Event Management, Mentorship & Training, Strategic Planning, Decision-Making, Documentation, Multicultural Collaboration, Conflict Resolution.


Teacher & Mentor | Bharat Scouts and Guides   March 2022 - march 2023
Mentored 400+ underprivileged children, providing educational materials, mentorship, and guidance to support academic and personal development.


Managed 90+ volunteers, organized community campaigns reaching 30,000+ individuals, and raised $1,500+ to fund education initiatives.


Participated in environmental drives including tree plantation campaigns and Green India initiatives, promoting sustainability and ecological awareness.


Skills demonstrated: Mentorship, Community Engagement, Volunteer Management, Fundraising, Educational Leadership, Environmental Stewardship, Organizational Planning, Strategic Implementation, Communication, Leadership Development.


Volunteer & Co-Management Roles 
Hira Nyas Trust: Designed and executed computer literacy workshops for underprivileged communities; organized fundraising via handmade product sales.


Lalitambha Social Welfare Society: Conducted workshops on computer basics and digital literacy; improved community access to educational resources.


S.H.E Foundation: Coordinated project management, operational strategy, and execution for social initiatives supporting education and community development.


Skills demonstrated: Project Coordination, Volunteer Leadership, Community Service, Fundraising, Educational Program Development, Strategic Planning, Communication, Problem-Solving, Social Impact, Training & Development.




