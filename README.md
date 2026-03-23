## Distum Anzures - Vercel Independent Stack

This project is now configured to run independently on Vercel without ICP/Caffeine runtime services.

### Architecture

- Frontend: Vite + React (`src/frontend`)
- Backend API: Vercel serverless function (`api/backend.js`)
- Persistence: Vercel KV (`@vercel/kv`)

### Local Development

1. Install dependencies:
   - `pnpm install`
2. Run frontend locally:
   - `pnpm --filter @caffeine/template-frontend dev`
3. Run on Vercel (recommended for full API parity):
   - `vercel dev`

### Deploy to Vercel

1. Import the repository into Vercel.
2. Ensure `vercel.json` is used from the repo root.
3. Add KV integration in Vercel dashboard.
4. Set environment variables automatically via the KV integration.
5. Deploy.

### Notes

- Existing frontend behavior and data contract are preserved by keeping the same backend method names used by the UI.
- All lead and admin settings actions now flow through `/api/backend`.
