# Gloomhaven Initiative Tracker

A static, single-page initiative tracker for Gloomhaven-style tabletop sessions. Dark-fantasy aesthetic, forward-facing perspective carousel, LocalStorage persistence. No backend — everything runs in the browser.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/gloomhaven-toolbox/`).

## Build & preview

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Push to a GitHub repo whose name matches the `base` in `vite.config.js` (default `gloomhaven-toolbox`).
2. In repo settings → **Pages**, set source to **GitHub Actions**.
3. Push to `main` — the included workflow at `.github/workflows/deploy.yml` builds and publishes automatically.

If your repo has a different name, either rename it or set `VITE_BASE` as a workflow env / change the default in `vite.config.js`.

## How to use

1. **Manage Library** — add each character, enemy group, or ally you might want to use. Pick a name, type, and image (from `public/assets/entities/`).
2. **Start a New Game** — pick which library entries are in this scenario. This is your "pool" — any of them can appear this game.
3. **Initiative** — at the start of each round, tap the entities in the order they act. Numbers `1, 2, 3…` appear as you tap. Anyone you don’t tap sits this round out.
4. **Carousel** — swipe / drag / arrow-keys through the round. The currently-acting entity is center-front, others recede into the background.
5. **Edit Round** (mid-round button) — opens a two-column dialog:
   - Left: current order, with insert-gap buttons between every row and an `✕` to remove anyone.
   - Right: pool entities not currently in the round.
   - Pick one on the right, click an insert gap on the left — it slots in. Repeat as needed.
6. **End Round** — shows reminders (decay elements, reshuffle modifier decks, etc.), then bumps the round and returns to the initiative tap screen.

## Adding your own entity images

1. Drop image files (PNG, transparent WebP, animated WebP, GIF) into `public/assets/entities/`.
2. Add their filenames to `public/assets/entities/manifest.json`.
3. The Library Manager image dropdown will pick them up on next load.

Transparent animated WebPs work great for idle animations on the carousel cards.

## Customizing reminders

End-of-round reminders are a single array in [`src/views/end-round.js`](src/views/end-round.js). Edit it.

## Tweaking the perspective stack

The Swiper coverflow config lives in [`src/views/carousel.js`](src/views/carousel.js) under `coverflowEffect`. Push `depth` higher for stronger recession, lower `scale` to shrink background slides faster, tweak `stretch` to overlap slides more or less.

## State storage

Everything persists to `localStorage` under the key `gloomhaven-game-v2` (active game) and `gloomhaven-lang` (language). Clear those keys to reset the whole app.

## Tech

- Vanilla JS + [Vite](https://vitejs.dev/)
- [Swiper.js](https://swiperjs.com/) for the carousel (`effect: coverflow`, `rotate: 0`)
- CSS variables for the dark-tavern palette
