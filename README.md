# PixelForge Commerce

PixelForge Commerce is a Next.js SaaS starter for e-commerce sellers who need AI image generation, background cleanup, credit tracking, a shared asset library, and a lightweight admin console.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Start Supabase locally with `supabase start`.
3. Apply the schema with `supabase db reset`.
4. Install dependencies with `npm install`.
5. Start the app with `npm run dev`.
6. Start Inngest dev with `npx inngest-cli@latest dev -u http://localhost:3000/api/inngest`.

## Core routes

- `/`
- `/pricing`
- `/use-cases`
- `/sign-in`
- `/sign-up`
- `/app`
- `/app/generate`
- `/app/background`
- `/app/library`
- `/app/credits`
- `/app/settings`
- `/admin`

## Notes

- Supabase Auth creates a workspace, starter credits, and the related user record from the trigger defined in `supabase/migrations/202604141000_initial_schema.sql`.
- Inngest receives queued AI task events at `/api/inngest`.
- Playwright smoke specs live in `e2e/`, but local browser binaries may need `npx playwright install chromium` before they can run.
