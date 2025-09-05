# NFL Bet Tracker

A simple, client-only React app to track NFL bets. Initial data loads from [public/bets.json](cci:7://file:///Users/markgood/Projects/nfl-bet-tracker/public/bets.json:0:0-0:0). Edits are saved only to `localStorage` on your device. Use “Export Data” to download the current list as JSON to update the official [bets.json](cci:7://file:///Users/markgood/Projects/nfl-bet-tracker/public/bets.json:0:0-0:0).

## Features

- Load initial bets from [public/bets.json](cci:7://file:///Users/markgood/Projects/nfl-bet-tracker/public/bets.json:0:0-0:0)
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

1. On first visit, if no local data exists, the app seeds from [public/bets.json](cci:7://file:///Users/markgood/Projects/nfl-bet-tracker/public/bets.json:0:0-0:0).
2. After that, all changes are written to `localStorage` (`nfl-bet-tracker:bets`).
3. Use Export Data to download current local data as JSON.
4. To update the official data for all visitors, replace [public/bets.json](cci:7://file:///Users/markgood/Projects/nfl-bet-tracker/public/bets.json:0:0-0:0) in the repo with the exported file and push.

## Getting Started

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## GitHub Pages (Project Page)

This repo is deployed as a project page. The Vite base is set to `/nfl-bet-tracker/` in [vite.config.js](cci:7://file:///Users/markgood/Projects/nfl-bet-tracker/vite.config.js:0:0-0:0).

1. Run `npm run build`.
2. Publish the `dist/` folder to the `gh-pages` branch using the GitHub UI (or a tool of your choice).
3. Ensure Pages is configured to serve from `gh-pages`.

If you change the repo name, update [vite.config.js](cci:7://file:///Users/markgood/Projects/nfl-bet-tracker/vite.config.js:0:0-0:0):

```js
export default defineConfig({
  base: '/your-repo-name/',
});
```
