# HANDOFF.md - UniVox PK Project

**Last Updated:** 2026-10-29
**Next Session Date:** 2026-10-29
**Status:** ⚠️ UI Redesign Required — Frontend Scrape & Rebuild

## ⚠️ CRITICAL: What Happened in This Session

The user explicitly said: "this is the worse thing i ever see scrape the whole frontend build it again." The old UI was AI slop. The task is to **completely rebuild the frontend** using professionally installed design skills (motionsites-web-builder, 21st-ui-build, impeccable, gsap-react, etc.).

A codex-worker was dispatched to implement the redesign but **got stuck** after ~1 hour due to sandbox issues (`"unsupported call: write"` — the codex CLI's file-writing tool was blocked). It only managed to create **one file** (`src/styles/globals.css`) before failing.

## What's Already Done

### ✅ Completed in Previous Sessions
1. **Project Foundation** — Next.js 14, TypeScript, Prisma, TailwindCSS, PostgreSQL
2. **Auth System** — All auth pages working with NextAuth v4 (email/password, Google, verification)
3. **Database** — Prisma schema with 15 models, PostgreSQL connection
4. **Documentation** — Design system (59KB), motion spec (21KB), accessibility checklist
5. **E2E Tests** — 148 test cases across 10 spec files with POM architecture
6. **Skills Installed** — 23 skills including motionsites-web-builder, 21st-ui-build, impeccable, gsap-react

### ⚠️ Partially Done (by stuck codex-worker)
- `src/styles/globals.css` — ✅ Created (579 lines, high-quality with HSL tokens, glass effects, 40px radius, animations)
- `tailwind.config.js` — ✅ Updated with HSL tokens matching design system

### ❌ NOT Created (codex-worker failed)
- `src/components/Navigation.tsx`
- `src/components/theme-provider.tsx`
- `src/components/ReviewForm.tsx`
- Updated `src/app/layout.tsx` (still old version)
- Updated `src/components/UniversityCard.tsx` (still old, basic Tailwind)
- Updated `src/components/UniversitySearch.tsx` (still old)
- Updated `src/app/(auth)/signin/page.tsx` (still old)

## What New Session Must Do

### Step 1: Install Missing Dependencies
```bash
cd "/home/malik-abdullah-awan/Desktop/personal project"
npm install framer-motion  # Required for motion design (per docs/motion-spec.json)
```

### Step 2: Initialize 21st UI Design Context
```bash
npx 21st init --design-context
# Or create .21st/DESIGN.md manually from docs/design-system.md
```

### Step 3: Rebuild Core UI Files (in order)
1. **`src/app/layout.tsx`** — Add Inter font, Instrument Serif, JetBrains Mono; theme provider; import globals.css; Navigation wrapper
2. **`src/components/theme-provider.tsx`** — Theme context (light/dark toggle, persisted to localStorage)
3. **`src/components/Navigation.tsx`** — Desktop nav + mobile drawer (per motion-spec: burger→X, bottom sheet on mobile)
4. **`src/components/UniversityCard.tsx`** — Complete rebuild: 40px radius, glass effects, star ratings, budget badges, hover lift
5. **`src/components/UniversitySearch.tsx`** — Complete rebuild: filter chips, search input, province/city filtering
6. **`src/app/(auth)/signin/page.tsx`** — Complete rebuild: pill buttons, form validation, error states
7. **`src/components/ReviewForm.tsx`** — New component: star rating, budget tier, review text, validation
8. **`src/app/universities/page.tsx`** — Wire up rebuilt components with staggered animations

### Step 4: Apply Design System
- Use HSL tokens from `src/styles/globals.css` (already created)
- Apply 40px card radius everywhere
- Use glass/glass-quiet utility classes
- Use pill buttons (`.btn`, `.btn-primary`, `.btn-glass`, `.btn-ghost`)
- Apply staggered blur-rise animations on page load
- Respect `@media (prefers-reduced-motion: reduce)`
- Support RTL for Urdu/Punjabi

### Step 5: Motion Design
- Use `framer-motion@11` (per docs/motion-spec.json recommendations)
- Apply motion patterns from `docs/motion-spec.json`:
  - University card staggered entrance (80ms stagger, ease_out_quint)
  - Filter panel expand/collapse (400ms, ease_out_expo)
  - Page transitions (exit 300ms, enter 500ms)
  - Mobile drawer navigation (burger→X, bottom sheet)
  - Star rating hover/click (pop scale 1.2)
  - Button press feedback (scale transforms)
  - Form validation feedback (shake, error border)
- Honor `prefers-reduced-motion: reduce`

### Step 6: Validate
```bash
npx tsc --noEmit          # TypeScript must pass with 0 errors
npm run lint              # ESLint must pass
npm run build             # Production build must succeed
npm run test:e2e          # E2E tests must pass (148 tests)
```

### Step 7: Commit & Push
```bash
git add -A
git commit -m "feat: Complete frontend redesign with motionsites + 21st-ui design system

Redesign: professional UI with cinematic motion, glass effects, 40px radius,
HSL tokens, RTL support, reduced motion compliance. Addresses user feedback:
'scrape the whole frontend build it again'.

Components rebuilt: Navigation, UniversityCard, UniversitySearch, ReviewForm,
auth pages. CSS: globals.css with design system. Tailwind: HSL tokens.
Tests: 148 E2E cases across 10 spec files.

Skills used: motionsites-web-builder, 21st-ui-build, impeccable, gsap-react,
accessibility, web-design-guidelines, vercel-react-best-practices.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
git push origin master
```

## Design System References

- **Colors:** See `docs/design-system.md` Section 5 (color tokens)
- **Typography:** See `docs/design-system.md` Section 6 (scale, pairing)
- **Spacing:** 4px system (docs/design-system.md Section 7)
- **Components:** UniversityCard and UniversitySearch specs (docs/design-system.md Section 11)
- **Motion:** Full timing + easing curves in `docs/motion-spec.json`
- **Accessibility:** 39-item checklist in `docs/accessibility-checklist.md`
- **Tailwind config:** HSL tokens in `tailwind.config.js` and CSS variables in `src/styles/globals.css`

## Skills to Activate (in order)
1. `motionsites-web-builder` — Read SKILL.md first, then apply craft rules
2. `21st-ui-build` — If `.21st/` exists, read design.json and DESIGN.md first
3. `impeccable` — Apply quality floor to all UI work
4. `gsap-react` — For GSAP animations (or use framer-motion per motion-spec)
5. `accessibility` — Before final validation
6. `web-design-guidelines` — UI compliance review
7. `playwright-best-practices` — If E2E tests need fixing

## Environment Notes
- **RAM:** 7.1 GB total, ~1.5 GB available — be careful with builds
- **Node:** v22.23.4
- **Git:** Remote at `https://github.com/MALIKABDULLAHAWAN/Univox.pk.git` (master branch)
- **TypeScript:** Passes with 0 errors (`npx tsc --noEmit`)
- **Port:** Dev server typically runs on :3002 (3000/3001 in use)

## Files NOT to Touch (Already Working)
- `src/app/(auth)/error/page.tsx` — ✅ Fixed with Suspense
- `src/app/(auth)/verify-request/page.tsx` — ✅ Fixed with Suspense
- `src/app/(auth)/signup/page.tsx` — ✅ Fixed with Suspense
- `src/lib/auth-context.tsx` — ✅ Has `'use client'` directive
- `src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/use-auth.ts` — ✅ Working
- `src/app/api/*` — ✅ All API routes working
- `src/middleware.ts` — ✅ Working
- `prisma/schema.prisma` — ✅ 15 models, seeded
- `docs/*` — ✅ Design system, motion spec, accessibility checklist complete

## Success Criteria
The user said: "nothing should be ai slop, the whole system should be professional, real motion, colors, animations for both phone and pcs." The new frontend must:
- Pass visual inspection (no generic Tailwind components)
- Have real motion (staggered animations, hover states, transitions)
- Look professional on both mobile and desktop
- Support dark/light mode with smooth theme transitions
- Support RTL (Urdu/Punjabi) without breaking layout
- Pass all 148 E2E tests
- Pass `tsc --noEmit` with 0 errors
- Pass `npm run build` successfully

---
**Remember:** The old UI was "the worse thing i ever see." This is a complete frontend rebuild, not incremental changes. Use the design system docs and motion spec as the source of truth.
