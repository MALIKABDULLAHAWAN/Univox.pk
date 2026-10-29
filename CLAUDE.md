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

---

## ⚠️ CURRENT SESSION CONTEXT (2026-10-29)

The frontend was completely rebuilt — the old UI was "the worse thing i ever see" (per user). A new professional UI is being built using:

### What's Already Done
- ✅ Auth system (all pages fixed with Suspense + force-dynamic)
- ✅ Database (Prisma, 5 universities seeded)
- ✅ Design docs: `docs/design-system.md` (59KB), `docs/motion-spec.json` (21KB), `docs/accessibility-checklist.md`
- ✅ E2E tests: 148 tests across 10 spec files
- ✅ `src/styles/globals.css` — Complete design system CSS (HSL tokens, glass effects, 40px radius, animations)
- ✅ `tailwind.config.js` — Updated with HSL tokens
- ✅ 23 skills installed (motionsites-web-builder, 21st-ui-build, impeccable, gsap-react, etc.)

### What Needs Doing NOW
- ❌ `src/app/layout.tsx` — Add fonts, theme provider, Navigation wrapper
- ❌ `src/components/theme-provider.tsx` — Theme context
- ❌ `src/components/Navigation.tsx` — Desktop nav + mobile drawer
- ❌ `src/components/UniversityCard.tsx` — REBUILD with design system (old version is slop)
- ❌ `src/components/UniversitySearch.tsx` — REBUILD with filters + motion
- ❌ `src/app/(auth)/signin/page.tsx` — REBUILD with design system
- ❌ `src/components/ReviewForm.tsx` — NEW component
- ❌ `src/app/universities/page.tsx` — Wire up rebuilt components
- ❌ `npm install framer-motion` — Missing dependency for motion design

### Design System References
- **Colors:** `docs/design-system.md` Section 5
- **Typography:** `docs/design-system.md` Section 6
- **Spacing:** 4px grid system (`docs/design-system.md` Section 7)
- **Motion:** Full spec in `docs/motion-spec.json` (easing curves, stagger formulas, 17ms frame budget)
- **Accessibility:** 39-item checklist in `docs/accessibility-checklist.md`
- **CSS tokens:** `src/styles/globals.css` (already created)

### Skills to Activate (in order)
1. `motionsites-web-builder` → Read `SKILL.md`, then `craft.md`, `techniques/`
2. `21st-ui-build` → Create `.21st/` design context
3. `impeccable` → Apply quality floor to all UI
4. `gsap-react` or `framer-motion` → Motion design
5. `accessibility` → WCAG 2.2 compliance
6. `web-design-guidelines` → UI review

Read HANDOFF.md and PLAN.md at the start of each session.
