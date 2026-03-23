## Distum Anzures

Standalone real estate website built for Vercel.

### Stack

- Frontend: Vite + React + TypeScript in `src/frontend`
- Backend: Vercel serverless function in `api/backend.js`
- Persistence: `@vercel/kv`

### Run Locally

1. Install dependencies with `pnpm install`
2. Start the frontend with `pnpm --filter distum-anzures-frontend dev`
3. Use `vercel dev` when you want the local frontend and `/api/backend` to run together

### Deploy

1. Import the repository into Vercel
2. Keep the repo root as the project root so `vercel.json` is applied
3. Connect a Redis/KV-compatible store for the backend data layer
4. Deploy

### Notes

- The frontend keeps the existing `useActor` compatibility wrapper, but it now talks to the standalone `/api/backend` service instead of an ICP canister.
- In local frontend-only development, the app falls back to browser `localStorage` unless `VITE_USE_REAL_API=true` is set.
