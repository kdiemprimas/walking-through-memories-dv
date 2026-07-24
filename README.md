# Walking Through Memories by Diem Vo

> Every concert is a chapter. Every memory deserves a place.

A cinematic personal concert archive built around an interactive memory
timeline. The first edition includes four clearly labeled demo chapters that
show how photos, tickets, favorite moments, and after-show reflections can live
together.

## Experience

- Editorial hero and “Afterglow Timeline” design direction
- Filterable memory timeline by year
- Expandable, keyboard-accessible concert chapters
- Responsive layouts for desktop and mobile
- Visible focus states and reduced-motion support
- No autoplay media, accounts, uploads, or external trackers

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Open the local URL printed by the development server.

## Validation

```bash
npm test
```

This runs a production build and verifies the rendered experience,
accessibility landmarks, filters, chapter structure, metadata, and reduced
motion rules.

## Personalizing the archive

The demo memories live in `app/page.tsx`. Replace their dates, cities, titles,
stories, and visual tones with Diem's real concert chapters. The product concept
and content model are documented in
`docs/product/walking-through-memories-concept.md`.
