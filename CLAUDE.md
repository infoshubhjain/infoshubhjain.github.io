# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page personal portfolio for Shubh Jain. Next.js 16 (App Router) + React 19 + TypeScript, Tailwind v4, shadcn/ui (new-york style), framer-motion, and three.js / react-three-fiber for 3D. Deployed as a static export to GitHub Pages.

## Commands

- `npm run dev` — dev server on :3000 (tees to `dev.log`)
- `npm run lint` — ESLint
- `GH_PAGES=1 npx next build` — the build CI actually runs (static export to `out/`)
- `npm run build` — local standalone build; note it also does `cp` steps into `.next/standalone` and `npm start` runs the server via `bun`. This path is for local server preview, **not** deployment.

No test suite exists.

## Deploy

Pushing to the **`source`** branch triggers `.github/workflows/deploy.yml`, which runs `GH_PAGES=1 npx next build` and publishes `out/` to GitHub Pages. `source` is the working/source branch; the built site lives on the Pages branch. Site URL: `https://infoshubhjain.github.io`.

`next.config.ts` switches output on the `GH_PAGES` env var: `export` (static, for Pages) when set, `standalone` otherwise.

## Architecture

- **Content is centralized in `src/lib/portfolio-data.ts`** — the single source of truth for all copy, projects, research, experience, skills, etc. Edit content there, not in components. Comments in that file note facts are CV-sourced.
- **`src/app/page.tsx`** is the whole page: a client component that composes `src/components/site/sections/*` (hero, about, projects, research, experience, leadership, skills, contact) plus site-wide chrome (custom cursor, scroll progress, loading screen, navbar, command palette, ambient particles).
- **`src/components/site/`** — bespoke site components (animations, cursors, terminal, 3D hero scene under `hero/`). **`src/components/ui/`** — shadcn primitives; add new ones with the shadcn CLI (config in `components.json`, lucide icons).
- **`src/app/layout.tsx`** — fonts (Geist, Geist Mono, Space Grotesk), theme provider (`next-themes`), Toaster, and all SEO/OG metadata. `sitemap.ts` and `robots.ts` live in `src/app/`.
- Path alias `@/*` → `src/*`. `cn()` helper in `src/lib/utils.ts`.
- Styling is Tailwind v4 via CSS-first config in `src/app/globals.css` (no `tailwind.config`); theme tokens are oklch CSS variables (`--primary`, `--accent`, …).

## Notes

- Heavy client-side animation: framer-motion, `lenis` smooth scroll (`use-smooth-scroll`), three.js. Respect `MotionConfig reducedMotion="user"` already set in `page.tsx`.
- CI uses `npm`; a `bun.lock` also exists but the workflow installs with npm — keep `package-lock.json` in sync when changing deps.
