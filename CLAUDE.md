# UniVox PK - University Review Platform

**What**: Student-first university review platform for Pakistani students with peer-verified reviews, budget-adjusted rankings, and Urdu/Punjabi language support.

**Tech Stack**: Next.js 14 (React) + TypeScript, Node.js/NestJS backend, PostgreSQL, Prisma ORM, Polygon blockchain, TailwindCSS.

**Setup**: `npm install && npx prisma db push && npm run dev`
**Test**: `npm run test` (Jest), `npm run test:e2e` (Playwright)
**Lint**: `npm run lint` (ESLint), `npm run format` (Prettier)
**Build**: `npm run build`

**Folder Structure**: `/src` (app), `/src/components`, `/src/pages/api`, `/prisma`, `/docs`

**Code Style**: Use TypeScript strict mode, prefer composition over inheritance, comment complex algorithms only.

**Never**: Use secrets in code (`process.env`), run destructive commands (`rm -rf`), modify files outside `/src`, commit without tests.

Read HANDOFF.md and PLAN.md at the start of each session.