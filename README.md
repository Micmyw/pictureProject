# pictureProject
图片生成项目
## Summary
This PR delivers the e-commerce image SaaS MVP end-to-end, including marketing/auth flows, protected app shell, AI task orchestration, generation/background workflows, credits, asset library, admin tools, smoke coverage, and setup docs.

## Included
- Auth UX hardening and safe redirects
- Protected app shell and dashboard
- Credit/task service layer
- AI provider registry + task runner + Inngest route
- Task APIs and image generation flow
- Upload signing + background removal flow
- Asset persistence + `/app/library`
- Admin console + admin credit/user APIs
- E2E smoke specs and Playwright stabilization
- README and `.env.example` setup/deployment guidance

## Verification
- `npm run lint` ✅
- `npm run typecheck` ✅
- `npm run test` ✅
- `npm run test:e2e -- e2e/auth-and-dashboard.spec.ts e2e/generate-flow.spec.ts e2e/background-flow.spec.ts` ✅
