# Builder Race — SoSoValue Buildathon Wave 3

Live leaderboard for the Wave 3 Builder Race. The Top 25 builders are ranked by the **builder fee revenue** their apps earn on SoDEX and the number of **authorized users** (wallets that approved their builder code).

Built with Next.js 16 (App Router, Cache Components), Tailwind CSS v4 and Motion. Deploys to Vercel with zero config.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Without any env vars the site runs in **preview mode**: deterministic sample numbers that slowly grow over time so the live behaviour (re-ranking, ticking totals) can be demoed. The UI does not label sample data, so avoid sharing the site publicly before going live; the OG image and share text never show sample rankings.

## Going live with the Builder Codes API

1. Add each team's SoDEX builder ID to `src/data/projects.ts` (`builderId: "123456"`). This is the numeric SoDEX account ID users approve a builder fee for.
2. Set `BUILDER_CODES_API_URL` (and `BUILDER_CODES_API_KEY` if needed) — see `.env.example`.
3. Check the field mapping in `src/lib/metrics/builder-codes.ts`. The adapter accepts a bare array or `{ data: [...] }`-style envelopes and reads fields through alias lists (`builderID`, `authorizedUsers`, `builderRevenue`, `volume`, …). Once the API docs are published, trim the aliases to the real names.

In live mode a failed API call shows "Live data unavailable" — it never falls back to sample numbers. Projects without a `builderId` are listed unranked as "Awaiting code".

### Refresh model

`getLeaderboard()` is cached with `"use cache"` and revalidates every 30 s (`REFRESH_SECONDS` in `src/lib/leaderboard.ts`). The page and `/api/leaderboard` are prerendered and refreshed in the background; the browser polls `/api/leaderboard` every 30 s (paused while the tab is hidden) and animates rank changes.

## Editing projects

All project data lives in `src/data/projects.ts`, sourced from the Akindo Top 25 export:

- `participating: false` hides a team that isn't in the Builder Race.
- `builder.name` / `builder.x` control the Builder column (X link optional). Names and X handles were taken from each team's public GitHub profile — teams may want to adjust them.
- `links` holds the app, GitHub, Akindo page and demo video (any YouTube URL format).

## Ranking

Rank by builder revenue (default) or users — ties broken by the other metric. Live rank reflects operational performance only; final overall rankings are confirmed after manual evaluation (stated on the page).

Deep links: `/?sort=users`, `/?project=bellwether` (opens the project panel).

## Deploying to Vercel

Push to GitHub, import the repo in Vercel, add the env vars from `.env.example`, deploy. No other configuration needed.

## Structure

```
src/
  app/                 page, layout, /api/leaderboard, OG image, icon
  components/race/     hero, podium, standings table, project sheet
  data/projects.ts     the 25 projects
  lib/
    leaderboard.ts     cached data entry point (mode switch)
    ranking.ts         totals + ranking logic
    metrics/           preview generator + Builder Codes adapter
```
