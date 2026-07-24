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

## Memory Studio (local drafts only)

Memory Studio is a separate editing room that is never included in the public
website build. Draft text and selected media are stored in the current
browser's IndexedDB on this device.

On Windows, double-click `Open Memory Studio.cmd`.

Or start it from a terminal:

```bash
npm run studio
```

Then open `http://127.0.0.1:4317/studio`.

Use the studio to:

- Edit chapter details and journal sections with a live timeline preview.
- Add, caption, reorder, and remove local images, videos, and audio.
- Preview HTTPS video/audio links and privacy-enhanced YouTube embeds.
- Mark a draft as ready for review without publishing it.
- Export a JSON manifest for handoff. Media stays in the local browser until
  it is intentionally prepared for the public archive.

Closing the studio server does not delete the draft. Use the red reset action
inside Memory Studio only when you intentionally want to erase local content
and media.

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
