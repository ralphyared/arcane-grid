# Arcane Grid — D&D 5e Spell Puzzle

A daily "Immaculate Grid / PokéGrid" for D&D 5e spells: a 3×3 grid where each row and
column is a criterion, and every cell needs a spell matching **both**. Fully
client-side; deploys as a static site (no backend).

## Commands

- `npm run dev` — Vite dev server (http://localhost:5173)
- `npm run build` — typecheck (`tsc -b`) then production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm test` — run the Vitest suite once (`npm run test:watch` to watch)
- `npm run typecheck` — TypeScript only (no emit)
- `npm run lint` — ESLint · `npm run format` — Prettier write
- `npm run fetch-spells` — re-download the SRD spells and regenerate `src/data/spells.json`

Before committing, run: `npm run lint && npm run typecheck && npm test`.

## Architecture

Pure, framework-free logic lives in `src/lib/` so it is all unit-testable:

- `types.ts` — shared types (`Spell`, `Category`, `PuzzleGrid`, `GameState`).
- `spells.ts` — loads bundled `data/spells.json`; name search for the guess dialog.
- `categories.ts` — the catalog of grid criteria (school, level, class, damage type,
  saving throw, casting time, range, concentration, ritual, …) + precomputed
  "which spells match each category" sets.
- `gridGenerator.ts` — the **deterministic, seeded** generator.
  `generateGrid(seedKey)` always returns the same solvable 3×3 grid for a given seed.
- `rng.ts` — seeded PRNG (mulberry32) + FNV-1a string hash.
- `scoring.ts` · `dateSeed.ts` · `storage.ts` · `share.ts` · `theme.ts` — scoring,
  UTC daily-key helpers, localStorage wrappers, share text, category colours.

React layer:

- `hooks/useGame.ts` — per-seed game state, persistence, guess handling.
- `hooks/useStats.ts` — daily history, streaks, distribution (localStorage).
- `components/` — `Grid`, `Cell`, `AxisHeader`, `SpellSearch`, `ResultModal`,
  `HelpModal`, `StatsModal`, `Modal`, and `Header`/`Footer`.
- `App.tsx` — daily/practice modes and modal orchestration.

## Invariants — do not break these

- **Every generated grid is fully solvable**: each cell has ≥1 (target ≥2) valid
  spells. Enforced in `gridGenerator.ts`; asserted across 150+ seeds in
  `gridGenerator.test.ts`.
- **Daily grids are deterministic by UTC date** — identical for everyone, no backend.
  Seed = `daily-<YYYY-MM-DD>` (`dateSeed.ts`). Never introduce nondeterminism
  (`Math.random`, `Date.now`, locale) into generation.
- A spell may be used **once** per grid; 9 guesses total, one attempt per cell.

## Conventions

- TypeScript strict + `verbatimModuleSyntax` → use `import type` for type-only imports.
- `erasableSyntaxOnly` → no enums/namespaces; prefer union types + `const` objects.
- React 19 with the strict `react-hooks` rules: **never call `setState` inside an
  effect.** Use lazy `useState` initialisers or render-phase adjustments instead
  (see `useGame.ts` and `App.tsx` for the patterns already in use).
- Tailwind v4 (`@import "tailwindcss"`); theme tokens/colours live in `src/index.css`
  under `@theme`. Use **literal** class strings (no runtime string concatenation) so
  Tailwind's scanner keeps them — see `lib/theme.ts`.
- Vitest config is intentionally separate (`vitest.config.ts`) from `vite.config.ts`
  to avoid a Vite 8 / Vitest plugin-types clash.

## Data & licensing

Spells come from the **D&D 5e SRD 5.1** (the `5e-bits/5e-database` dataset that powers
dnd5eapi.co), released under the OGL 1.0a / CC-BY-4.0 and safe to redistribute.
`scripts/fetch-spells.mjs` downloads and trims it to `src/data/spells.json` (319 spells).

## Roadmap / v2

Global **rarity** scoring (the signature Immaculate Grid feature — the % of players who
picked your answer) needs a backend. The code is structured for a clean swap:
`scoring.cellRarityPoints()` is the single point to replace with crowd-sourced data
from a serverless function + KV/DB. Until then, "Arcane score" is a local difficulty
proxy (tighter cells are worth more).

## Deploying

Static `dist/` with a relative `base`, so it runs on any host or sub-path. See
`README.md` for Vercel / Netlify / Cloudflare Pages / GitHub Pages steps.
`.github/workflows/` contains CI (lint + typecheck + test + build) and an optional
GitHub Pages deploy.
