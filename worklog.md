# Portfolio Worklog — Shubh Jain

---
Task ID: portfolio-build
Agent: Super Z (main)
Task: Build an Awwwards-level interactive portfolio website for Shubh Jain (CS @ UIUC) from attached CV. Premium dark theme, Three.js hero, Framer Motion, Lenis smooth scroll, command palette, custom cursor, filterable projects, research cards, leadership cards, skill constellation, achievements wall, contact form.

Work Log:
- Read complete CV (423 lines, ~33KB) covering education, 7 projects, 7 experiences, 2 research papers, 2 books, 1 patent, 12 leadership roles, 3 volunteer roles, 12 achievements.
- Installed three, @react-three/fiber v9, @react-three/drei v10, gsap, lenis, @types/three on top of the existing Next.js 16 / TypeScript / Tailwind 4 / shadcn/ui / framer-motion stack.
- Created structured data file `src/lib/portfolio-data.ts` containing every factual detail from the CV — no invention, copy rewritten for narrative clarity.
- Replaced default Tailwind theme with a dark-first premium design system in `globals.css`: emerald (#10d9a3) + violet (#a855f7) + cyan (#06b6d4) aurora accents on near-black canvas, glassmorphism utilities, animated grid, conic borders, spotlight hover, custom scrollbar, keyframes for aurora-pan / shimmer / float / pulse-glow / scroll-dot. Honored "no indigo/blue" rule.
- Built reusable primitives: `Magnetic` (magnetic button field), `TiltCard` (3D tilt + spotlight), `AnimatedText` + `FadeIn` (text reveals), `SectionHeading` + `SectionShell`.
- Built `CustomCursor` (spring-lagged ring + dot + contextual labels), `ScrollProgress` (top gradient bar), `LoadingScreen` (1.5s animated counter + monogram + aurora), `Navbar` (glass, hide-on-scroll-down, active section tracking, keyboard 1-9 nav, mobile drawer), `CommandPalette` (Cmd/Ctrl+K searching nav + projects + research + social links), `Footer` (sticky, ambient grid, back-to-top).
- Built `HeroScene` (R3F): distorted icosahedron core + wireframe overlays + 1400-particle sphere shell + 2 orbiting mouse-reactive point lights + fog. Lazy-loaded.
- Built 9 content sections: Hero (parallax, animated headline, HUD readout sidebar, 6-stat strip, 3 CTAs, scroll indicator), About (mission/vision cards, 6 animated stat counters, 6-item interactive timeline, languages, education), Projects (search + 6 sort modes + 11 tag chips + expandable cards with Problem/Solution/Impact/links + filter animations), Research (Papers/Books/Patent tabs + citation copy + abstract expand + editorial history), Experience (vertical timeline + always-visible metrics + expandable responsibilities + tech stack), Leadership (8 category filters + interactive cards + volunteer roles), Skills (interactive SVG constellation with 10 cluster nodes + 2-column category grid with hover sync), Achievements (12 cards with category icons + spotlight), Contact (premium CTA banner + 4 social cards + animated form with mailto handoff).
- Custom 404 page with aurora + grid + 404 in aurora-gradient text.
- Full SEO: metadataBase, OpenGraph, Twitter card, JSON-LD Person schema, robots, canonical, themeColor, Space Grotesk display font.
- Accessibility: semantic HTML, ARIA labels, keyboard navigation, focus rings, reduced-motion handling on every animated component, `prefers-reduced-motion` SSR-safe via useSyncExternalStore.
- Performance: lazy-loaded Three.js scene, dpr capped at 1.8, particle count tuned for integrated GPUs, Lenis disabled on touch/reduced-motion, custom cursor disabled on touch.

Verification:
- ESLint: 0 errors, 0 warnings.
- Dev server: HTTP 200, ~150ms compile, no runtime errors.
- Agent Browser end-to-end checks: hero renders, all 9 sections render, project filter narrows to AI-tagged entries, command palette (Ctrl+K) shows all nav + projects + research, project expand reveals Problem/Solution/Impact, contact form fills + submits + shows "Message ready" confirmation, mobile (390×844) responsive with no overflow, desktop (1440×900) premium across all sections.
- VLM visual review of hero + 5 section viewports + 2 mobile viewports: "premium design with no visible bugs" across the board.

Stage Summary:
- Single-route (`/`) portfolio at `src/app/page.tsx` composing 9 sections + navbar + footer + loading screen + custom cursor + scroll progress + command palette.
- All CV content represented: education, 7 projects, 7 experiences, 2 papers, 2 books, 1 patent, 12 leadership roles, 3 volunteer roles, 12 achievements, 10 skill categories with ~60 skills, 2 languages.
- Tech stack delivered: Next.js 16, TypeScript, Tailwind 4, shadcn/ui, framer-motion, three.js + R3F + drei, lenis, lucide-react. (GSAP installed but Framer Motion covered all animation needs — kept available for future use.)
- Files persisted: 17 new component files under `src/components/site/`, 1 data file under `src/lib/`, 2 hook files under `src/lib/hooks/`, custom 404 at `src/app/not-found.tsx`, updated `layout.tsx` + `globals.css` + `page.tsx`, favicon.svg at `public/favicon.svg`.

---

## Update 2 — F1 redesign + resume refresh (Jul 31, 2026)

Task: Rebuilt the portfolio as an F1 race-weekend theme (static export to GitHub Pages) and refreshed all content from the full résumé.

### Site structure
- **`/` — F1 homepage** (`src/app/page.tsx`, `src/lib/prototype-data.ts`, `src/components/site/prototype/*`): loading screen, 3D pit-wall scene (Ferrari/RB18, frameloop gated to hero visibility), scroll-driven telemetry HUD, Driver bio → Career Standings (experience) → Race Wins (projects) → Car Setup (skills) → Pit Wall (leadership) → R&D Bay (research) → timing tower → telemetry charts → strategy board → team radio (contact) → podium footer.
- **`/prototype` — classic page**: original premium dark theme, same content, same section order.
- Recruiter-optimized order on both pages: bio/education → experience → projects → skills → leadership → research → contact. All entries reverse-chronological with month–year spans.
- Deploy: `GH_PAGES=1 npx next build` → static `out/` → GitHub Pages (branch `gh-pages`); `source` branch holds the code. CI: `.github/workflows/deploy.yml`.

### Content changes
- **Experience** (F1 standings + classic): added HDF Group SWE (May–Aug 2026) and QuantHQ SWE intern (May–Aug 2026); every stint now has 3–4 bullet points (data: `Stint.points`); standings team names link out (HDF Group, QuantHQ, MLH).
- **Projects**: added QuantHQ Org Site (Astro 5) win; reordered all wins strictly newest-first (2026 ×5 → 2025 ×4).
- **Leadership**: added MLH × Transcend Commit Fellow (2.5% acceptance, founding cohort) and Diwali on the Quad (Management Head) to F1 pit wall + classic page; MLH added to strategy-board timeline and achievements.
- **Rancho Labs / YBI**: removed YBI Foundation entirely (classic experience entry deleted); Rancho Labs entry now reads "Rancho Labs · IIT Delhi" with IHFC mention (F1 standings + classic achievement).
- **Education**: all copy now says "University of Illinois Urbana-Champaign" with "a top-5 CS program in the U.S." added to the Driver bio (F1) and About mission (classic).

### Performance
- `TelemetryHud`: rAF loop (6 setState/frame) now runs only while scrolling + 1.2 s settle, instead of forever → biggest idle-CPU win.
- `AmbientParticles`: animation loop pauses when the tab is hidden (`visibilitychange`).
- (Already in place: 3D scene `frameloop` gated to hero visibility, dpr cap, reduced-motion handling.)

### Verification
- `npm run lint`: clean. `GH_PAGES=1 npx next build`: EXIT 0 (routes `/`, `/prototype`, `/robots.txt`, `/sitemap.xml`).
- Local preview: `python3 -m http.server 3000 --directory out`; both pages 200 with 0 console errors.
- Browser-audited both pages: section order, links, new entries, bullets, YBI absence all confirmed.
# November 21, 2026: CV and portfolio refresh

- Added Mega Service Solutions, ConvAI/GroundWorks, and OnCARE to current professional experience. Kept SIGMobile in projects and leadership, and added separate CS124/ENG177 teaching roles.
- Added RecallRush, ScrollEat, GeoCrop, and FloodSense to both presentations; made all projects, leadership/service, and awards accessible from the formal homepage.
- Updated the shared profile, skills, timeline, Llama Naturals dates, and current SWE resume PDF. Kept the raw CV ignored and retained the two deliberately excluded older roles.
- Labeled GroundWorks as an ICLR 2027 submission in visible copy and structured data. Corrected the explainable-AI book's ASIN so it is not emitted as an ISBN.
- Verified 31 tests, CI lint, static export, desktop/narrow-mobile layout, expandable content, and F1 rendering.

## November 21, 2026: full-site CV and mobile audit

- Reconciled project periods, added coursework and editorial work, corrected the explainable-AI book title, and linked the 2023 paper to its publisher PDF. Derived the project count from the actual project list and removed an unsupported retrieval complexity claim.
- Added the owner-provided agriculture title, record 202421028435, and June 21, 2024 date. Public search did not establish grant status, so the site does not label it granted.
- Made mobile navigation visible, increased formal-page text size/contrast and touch targets, separated teaching from employment, and exposed remaining experience bullets through disclosures. Added distinct project anchors to structured data.
- Stacked F1 project cards on narrow/short screens and with reduced motion; separated fixed mobile controls. Fixed card keyboard activation and debrief focus containment, Escape handling, focus restoration, and close-button size.
- Verified desktop and 320/390 px mobile rendering, publication wrapping, project debrief opening/closing and focus, and production export. Lint, TypeScript/static build, 34 tests, unique IDs, and internal anchors passed.
- Checked 23 external links: 21 returned successfully; LinkedIn blocks automated requests and OpenReview redirects to a verification challenge. Kept those valid destinations. ScrollEat remains private, so no inaccessible public source link was added. Raw CV remains ignored.

## November 21, 2026: recruiter-review fixes

- Replaced misleading email delivery confirmation, added named form controls, contained menu/game dialogs, focus restoration, accessible stat values, and focus-dependent navigation shortcuts.
- Brightened text colors, removed the reading vignette, increased small metadata, added motion guards, replaced the horizontal project lane, and added a recent-first mobile timeline with archived history.
- Moved primary contact actions above education on mobile, highlighted HDF5/GroundWorks/Meter, prioritized projects, added architecture flows, collapsed secondary work/awards/skills, and qualified metrics and role context.
- Corrected structured project/language/authorship data, removed unused scrolling code and cmdk, and updated dependencies. Audit reports zero known vulnerabilities; 36 tests, lint and static export pass.
- Tested the menu in IAB and Brave, including focus containment/restoration. Measured no page overflow at 320, 390, 768, 1024 and 1440 px in Brave. Actual Safari opening timed out; speech-output testing is not available through the tools.
- Checked public Meter, AstraSign and adaptive-learning flows. Adaptive-learning session creation fails; the portfolio labels its deployment limitation. No payment, camera/microphone, or authenticated provider operations were exercised. Full linked-project feature certification remains unavailable without required services/hardware/access.

- Final Slow 4G homepage audit: performance 98, accessibility 100, best practices 100, SEO 100. F1 audit: 97/100/100/92 before its self-canonical repair; deployed HTML now confirms the corrected canonical.
- Verified FloodSense synthetic analysis and zone highlighting; corrected its current Node.js/TypeScript/Turf stack and added its working demo link. GeoCrop sample analysis remained loading, and FloodSense download verification timed out. Neither is marked fully verified.
