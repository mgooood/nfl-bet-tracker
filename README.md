# NFL Bet Tracker

A simple, client-only React app to track NFL bets. Initial data loads from [public/bets.json](public/bets.json). Edits are saved only to `localStorage` on your device. Use “Export Data” to download the current list as JSON to update the official [bets.json](public/bets.json).

## Live Demo

- https://mgooood.github.io/nfl-bet-tracker/

## Features

- Load initial bets from [public/bets.json](public/bets.json)
- Local-only persistence (no backend)
- Add new bets (all fields required)
- Edit outcome and amount only (MVP scope)
- Total balance + opponent balance summary
- Export current data to JSON

## Data Model

Each bet has:

- week: number (positive integer)
- date: string (MM/DD/YYYY)
- description: string
- opponent: string
- outcome: "win" | "loss" | "pending"
- amount: number (absolute; sign is derived from `outcome` — win = +amount, loss = -amount, pending excluded)

Note: Existing data that may contain negative amounts will be interpreted using the absolute value together with the outcome, so you do not need to manually edit older entries.

## How Data Persistence Works

1. On first visit, if no local data exists, the app seeds from [public/bets.json](public/bets.json).
2. After that, all changes are written to `localStorage` (`nfl-bet-tracker:bets`).
3. Use Export Data to download current local data as JSON.
4. To update the official data for all visitors, replace [public/bets.json](public/bets.json) in the repo with the exported file and push.

## Getting Started

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## GitHub Pages (Project Page)

This repo auto-deploys to GitHub Pages on pushes to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The Vite base is set to `/nfl-bet-tracker/` in [vite.config.js](vite.config.js).

Deploy pipeline summary:

1. Push to `main`.
2. GitHub Actions builds the app (`npm ci && npm run build`).
3. The Pages artifact from `dist/` is deployed automatically.

If you rename the repo, update `base` in [vite.config.js](vite.config.js):

```js
export default defineConfig({
  base: '/your-repo-name/',
})
```
