# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page personal portfolio for Shubh Jain. Next.js 16 (App Router) + React 19 + TypeScript, Tailwind v4, shadcn/ui (new-york style), framer-motion, and three.js / react-three-fiber for 3D. Deployed as a static export to GitHub Pages.

## Commands

- `npm run dev` — dev server on :3000 (tees to `dev.log`)
- `npm run lint` — ESLint
- `npm run test:run` — Vitest once; `npm test` watches; `npx vitest run src/lib/utils.test.ts` for a single file, `-t "name"` for a single test
- `GH_PAGES=1 npx next build` — the build CI actually runs (static export to `out/`)
- `npm run build` — local standalone build; note it also does `cp` steps into `.next/standalone` and `npm start` runs the server via `bun`. This path is for local server preview, **not** deployment.

Tests are jsdom + Vitest (`vitest.config.mjs`, setup in `src/test/setup.ts`, `@` alias mirrored there). Only `src/lib/*.test.ts` exists so far — data-shape and util assertions, no component tests. `prototype-data.test.ts` guards the couplings that break silently: absolute résumé/link URLs, unique section ids and win ids, book ISBN prefixes, and that no win references a deleted screenshot.

Note the deploy workflow does **not** run lint or tests — run them locally before pushing to `source`, because nothing else will.

## Deploy

Pushing to the **`source`** branch triggers `.github/workflows/deploy.yml`, which runs `GH_PAGES=1 npx next build` and publishes `out/` to GitHub Pages. `source` is the working/source branch; the built site lives on the Pages branch. Site URL: `https://infoshubhjain.github.io`.

`next.config.ts` switches output on the `GH_PAGES` env var: `export` (static, for Pages) when set, `standalone` otherwise.

Two branches matter: **`source`** (this one — all work happens here) and **`gh-pages`** (build output, written by the workflow; never edit by hand). A third branch, `main`, held the pre-Next.js static export of the retired site and has been deleted.

## Architecture

**The `prototype-*` naming is counterintuitive — read this before editing.** It is historical: the F1 design started life as a prototype, then replaced the original site and kept its filenames. There is now only one site.

| Route | File | Content source |
|---|---|---|
| `/` | `src/app/page.tsx` | `src/lib/prototype-data.ts` |

So `prototype-*` files back the **live homepage**, and all its components live in `src/components/site/prototype/*`.

The original classic dark-theme site (`/prototype` route, `portfolio-data.ts`, `components/site/sections/*` and ~23 supporting components) was deleted — nothing linked to it, and its data file was still feeding the live site's sitemap and JSON-LD, publishing the wrong project list and dead `#about` / `#projects` anchors to search engines.

- **Content lives in the data file, never in components.** `prototype-data.ts` is the CV-sourced source of truth — the career re-told as a race weekend (driver → wins → directives → standings → setup → pit wall → radio → podium), race-flavored copy but factual. `fullcv.md` at the repo root is the raw CV it is derived from.
- **`SECTIONS`** (every section, in document order) lives in `prototype-data.ts` rather than `pit-nav.tsx` so `sitemap.ts`, a server module, can read it without pulling a client component into the server graph. `pit-nav.tsx` re-exports it.
- **SEO metadata is generated from the same data**: `layout.tsx` derives JSON-LD from `wins` (SoftwareApplication) and `directives` (ScholarlyArticle / Book), and `sitemap.ts` from `SECTIONS`. Adding a project or paper updates structured data automatically — but note `layout.tsx` parses a book's ISBN out of `directive.venue` with `replace("ISBN ", "")`, which `prototype-data.test.ts` pins.
- **`src/lib/prototype-theme.ts`** — the F1 theme's `PALETTES` (`ferrari` | `redbull`), exposed as `--pt-*` CSS vars (`--pt-primary`, `--pt-canvas`, `--pt-accent`…) that F1 components read. `prototype-fonts.ts` holds its display fonts (Anton, serif, grotesk), separate from layout fonts.
- **`src/components/ui/`** — shadcn primitives; add new ones with the shadcn CLI (config in `components.json`, lucide icons). Only `sonner` survives the old-site removal. **`src/components/site/prototype/`** — every bespoke component on the page.
- **`src/app/layout.tsx`** — fonts (Geist, Geist Mono, Space Grotesk), theme provider (`next-themes`), Toaster, and all SEO/OG metadata. `sitemap.ts` and `robots.ts` live in `src/app/`.
- Path alias `@/*` → `src/*`. `cn()` helper in `src/lib/utils.ts`; hooks in `src/lib/hooks/` (`use-media-query` exports `usePrefersReducedMotion` too, `use-smooth-scroll` wraps lenis).
- Styling is Tailwind v4 via CSS-first config in `src/app/globals.css` (no `tailwind.config`); theme tokens are oklch CSS variables (`--primary`, `--accent`, …).

## Notes

- Heavy client-side animation: framer-motion, `lenis` smooth scroll, three.js. The page sets `MotionConfig reducedMotion="user"` and components check `usePrefersReducedMotion()` — keep new animation behind the same guards.
- The résumé is an **external Google Drive link** (`driver.resumeUrl`), not a file in `public/`, so updating the PDF there needs no redeploy. There is no `public/resume.pdf`; don't reintroduce a relative path.
- `eslint.config.mjs` is deliberately permissive (most TS/React rules at `warn`, being tightened incrementally). Don't treat existing warnings as a mandate to refactor; do keep new code warning-free.
- CI uses `npm`; a `bun.lock` also exists but the workflow installs with npm — keep `package-lock.json` in sync when changing deps.
- `worklog.md` is a running changelog of design decisions; `README.md` / `CONTRIBUTING.md` are public-facing and were updated alongside this file when the old site was removed.
