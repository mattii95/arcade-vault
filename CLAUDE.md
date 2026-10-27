# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Arcade Vault: online games platform where players compete for the highest score. Currently a fresh Create Next App scaffold (only `app/layout.tsx`, `app/page.tsx`, `app/globals.css`). The README says development follows spec-driven design (`/spec` and `/spec-impl` skills from `Klerith/fernando-skills`, installed via `npx skills@latest add Klerith/fernando-skills`).

## Next.js version caveat

Next 16.4.3 / React 19.3 — APIs differ from training data. Per `AGENTS.md`, read the relevant guide in `node_modules/next/dist/docs/` (`01-app`, `02-pages`, `03-architecture`, `04-community`) before writing Next.js code, and heed deprecation notices.

## Skills

Usa siempre /frontend-design para diseñar la interfaz de usuario.

## Config notes

- `next.config.ts` enables `cacheComponents`, `partialPrefetching` and `experimental.agentFeedback`; `cacheComponents` changes caching/dynamic-rendering rules for App Router code, so check the docs before using data fetching or request APIs.
- Tailwind v4 is wired through Turbopack rules (`@tailwindcss/turbopack` loader for `*.css`), not PostCSS. Styling is via `@import "tailwindcss"` and `@theme inline` tokens in `app/globals.css`.
- Path alias: `@/*` maps to the repo root (not `src/`).
- `AGENTS.md` is auto-rewritten by `next dev`; leave it be.
