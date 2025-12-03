# Nirakara Studio

Calm commerce experience for Nirakara — a slow jewelry house focused on *formless metal rituals*. Built with Vite, React, Tailwind, and shadcn primitives.

## Quick Start

```bash
npm install          # install dependencies (npm / pnpm / bun all work)
npm run dev          # start Vite dev server on http://localhost:8080
npm run build        # production build
npm run preview      # serve the production bundle locally
npm run lint         # run eslint
```

> Pick a single package manager per clone to avoid lockfile churn.

## Tech Stack

- React 18 + TypeScript
- Vite + SWC
- Tailwind CSS & shadcn/ui
- TanStack Query scaffolded for future API hooks

## Content & Configuration

All editable content lives inside `src/content/` as JSON so you can change copy, imagery, or structure without touching TSX:

| File | Purpose |
| --- | --- |
| `site.json` | Site name, tagline, slogan, socials, footer metadata. |
| `navigation.json` | Header + footer menus. |
| `products.json` | Catalog items shared between `/shop`, featured grids, and PDPs. |
| `home.json`, `shop.json`, `lookbook.json`, `journal.json`, `faq.json`, etc. | Page-specific hero copy, CTA text, filter labels, blog/FAQ entries, campaign cards, cookie policy text, and more. |

Every page imports from these JSON files; no user-facing text is hard-coded in components anymore.

## Structure Highlights

- `src/config/site.ts` and `src/config/navigation.ts` hydrate themselves from the content JSON files.
- `src/lib/data/products.ts` exposes catalog data to the shop and featured modules.
- `src/components/layout/Header.tsx` + `Footer.tsx` share navigation data and surface links to Account + Cookie Policy pages.
- `src/pages/Shop.tsx` renders the high-density matrix requested in the design reference.
- `src/pages/Account.tsx` lets visitors create a local-only profile stored in `localStorage`.
- `src/App.tsx` mounts the cookie banner globally so the consent notice appears on every route.

## Design Notes

- Vocabulary leans into “forms / rituals / signals / pulse” to support brand tone.
- Cookie Policy exposes actionable controls (reset consent + privacy email).
- Favicons were replaced with a bespoke monochrome `favicon.svg` so the Lovable placeholder is gone.

## Contribution Flow

1. Branch from `main`.
2. Update the relevant JSON files first, then adjust components if structure needs to change.
3. `npm run lint && npm run build`.
4. Open a PR describing the UX or storytelling impact of the change.
