# PLAN.md - UniVox PK University Review Platform

**Current Phase:** ⚠️ Frontend Redesign Required
**Date:** 2026-10-29
**User Directive:** "this is the worse thing i ever see scrape the whole frontend build it again"

---

## Status Summary

| Aspect | Status |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ 0 errors |
| Auth System | ✅ Complete (all auth pages fixed) |
| Database | ✅ Seeded (5 universities, 12 students) |
| Design System Docs | ✅ Complete (59KB) |
| Motion Spec | ✅ Complete (21KB) |
| Accessibility Checklist | ✅ Complete (39 items) |
| E2E Tests | ✅ Complete (148 tests, 10 spec files) |
| Skills Installed | ✅ 23 skills |
| `src/styles/globals.css` | ✅ Complete (579 lines — created by codex worker) |
| `tailwind.config.js` | ✅ Updated (HSL tokens, design system) |
| Frontend Components | ❌ **OLD — needs complete rebuild** |
| Layout/Fonts/Theme Provider | ❌ **NOT created** |

---

## Phase 1: Project Foundation ✅ DONE

### Tasks Completed:
- [x] Initialize Next.js 14 project with TypeScript
- [x] Install and configure dependencies
- [x] Set up PostgreSQL database with Docker
- [x] Configure Prisma ORM (15 models)
- [x] Set up TailwindCSS
- [x] Create basic page structure
- [x] Configure ESLint and Prettier
- [x] Set up testing frameworks (Jest, Playwright)
- [x] Configure Claude Code permissions

### Accomplishments:
1. All npm dependencies installed and validated
2. PostgreSQL database running in Docker container
3. Next.js dev server starts and builds successfully
4. Universities discovery page accessible
5. Database connection established and tested

---

## Phase 2: Database Seeding ✅ DONE

### Goals:
- [x] Create seed data for 5 Pakistani universities
- [x] Add sample reviews with budget-adjusted rankings
- [x] Create test users (students, instructors)
- [x] Add departments and courses

### Priority Universities Seeded:
1. University of Punjab (Lahore)
2. Lahore University of Management Sciences (LUMS)
3. FAST University (Karachi/Lahore)
4. University of Karachi
5. Quaid-e-Azam University (Islamabad)

**Skills used:**
- `graphify` — Knowledge graph of Prisma schema relationships for seed data integrity

---

## Phase 3: Core Features Implementation

### 3.1 User Authentication ✅ DONE

- [x] Implement NextAuth with email/password
- [x] Add Google/GitHub social login
- [x] Create registration flow (`src/app/(auth)/signup/page.tsx`, `src/app/(auth)/signin/page.tsx`)
- [x] Implement email verification (`src/app/(auth)/verify-request/page.tsx`, `src/app/(auth)/error/page.tsx`)

**Skills used:**
- `vercel-react-best-practices` — NextAuth SSR/CSR patterns, session management
- `web-design-guidelines` — Auth form accessibility, WCAG 2.2 compliance
- `accessibility` — Color contrast, keyboard navigation, screen reader labels on auth forms

### 3.2 University Discovery ⚠️ PARTIAL — UI REBUILD IN PROGRESS

**Backend/API ✅:**
- [x] Budget-adjusted ranking algorithm (documented in `docs/design-system.md`)
- [x] University API (`src/app/api/universities/route.ts`)
- [x] University detail pages (component in `src/components/UniversityCard.tsx` — OLD version below)

**UI Rebuild ❌ (NEW SESSION MUST DO):**
- [ ] Create `src/styles/globals.css` — ✅ **Already done** (579 lines by codex worker)
- [ ] Update `tailwind.config.js` — ✅ **Already done** (HSL tokens)
- [ ] Create `src/app/layout.tsx` with fonts + theme provider + Navigation wrapper
- [ ] Create `src/components/theme-provider.tsx`
- [ ] Create `src/components/Navigation.tsx`
- [ ] Rebuild `src/components/UniversityCard.tsx` with design system
- [ ] Rebuild `src/components/UniversitySearch.tsx` with filters + motion
- [ ] Update `src/app/universities/page.tsx` with new components
- [ ] Search and filtering by province/city
- [ ] Comparison tool (Phase 4)

**Skills to use (in order):**
- `motionsites-web-builder` — Read SKILL.md + craft.md + techniques first
- `21st-ui-build` — Production UI with grounded design context
- `impeccable` — Visual polish, motion, layout quality floor
- `gsap-react` — GSAP animations in React/Next.js (OR use framer-motion per motion-spec)
- `emil-design-eng` — UI polish, invisible details
- `react-bits` — Animated components
- `accessibility` — WCAG 2.2 AA compliance
- `web-design-guidelines` — UI compliance review
- `vercel-react-best-practices` — Data fetching, bundle optimization

### 3.3 Review System ❌ NOT STARTED

- [ ] Create review forms for universities
- [ ] Implement rating system (1-5 stars)
- [ ] Add peer verification system
- [ ] Blockchain proof integration (Phase 3)

**Skills to use:**
- `accessibility` — Form validation, ARIA labels, keyboard navigation
- `web-design-guidelines` — Review form UI compliance
- `vercel-react-best-practices` — Form state management, client-side validation
- `21st-ui-build` — Rating component design
- `impeccable` — Review form polish

### 3.4 Urdu/Punjabi Support ❌ NOT STARTED

- [ ] Implement i18n routing
- [ ] Translate core UI elements
- [ ] Create language toggle
- [ ] Test RTL layout support

**Skills to use:**
- `accessibility` — RTL layout accessibility, bidirectional text
- `web-design-guidelines` — Internationalization UI patterns
- `vercel-react-best-practices` — i18n routing performance

---

## Phase 4: Advanced Features

### 4.1 Moderation System ❌ NOT STARTED
- [ ] Flag and report reviews
- [ ] Admin dashboard
- [ ] Peer verification incentives
- [ ] AI moderation

**Skills to use:**
- `21st-ui-build` — Admin dashboard UI design
- `impeccable` — Dashboard UX polish
- `accessibility` — Keyboard navigation for moderation tools

### 4.2 Polygon Blockchain Integration ❌ NOT STARTED
- [ ] Review NFT generation
- [ ] Verification tokens
- [ ] Wallet integration
- [ ] Smart contract deployment

**Skills to use:**
- `graphify` — Knowledge graph of smart contract codebase

### 4.3 AI Recommendations ❌ NOT STARTED
- [ ] OpenAI integration
- [ ] University matching algorithm
- [ ] Personalized recommendations
- [ ] Budget advisor

**Skills to use:**
- `vercel-react-best-practices` — Streaming data, caching strategies
- `21st-ui-build` — AI recommendation UI cards

---

## Phase 5: Production & Deployment

- [ ] Production database setup
- [ ] SSL certificate
- [ ] CDN configuration
- [ ] Monitoring and analytics
- [ ] SEO optimization

**Skills to use:**
- `web-design-guidelines` — Final UI compliance audit
- `accessibility` — Production WCAG 2.2 AA final audit
- `playwright-best-practices` — E2E test suite validation (148 test cases)

---

## Skills Registry — When to Use Each Installed Skill

### Design & UI Production
| Skill | Trigger | When to Apply |
|---|---|---|
| `motionsites-web-builder` | Auto/on design request | Cinematic hero sections, award-level landing pages |
| `21st-ui-build` | `/21st-ui-build` | Building production UI with professional design context |
| `impeccable` | Design polish | Any UI redesign, visual polish, motion, layout refinement |
| `emil-design-eng` | `/emil-design-eng` | UI polish, component design, invisible details |
| `react-bits` | Animated React components | Text effects, cursor effects, WebGL/canvas backgrounds |
| `gsap-core` | GSAP tweens | JavaScript animation, easing, stagger |
| `gsap-react` | React animation | GSAP with React/Next.js |

### Quality & Compliance
| Skill | Trigger | When to Apply |
|---|---|---|
| `accessibility` | `/accessibility` | WCAG 2.2 AA audits, a11y fixes |
| `web-design-guidelines` | `/web-design-guidelines` | UI review against Vercel's Web Interface Guidelines |
| `vercel-react-best-practices` | Performance | React/Next.js data fetching, bundle optimization |

### Architecture & Knowledge
| Skill | Trigger | When to Apply |
|---|---|---|
| `graphify` | `/graphify` | Knowledge graph of codebase, smart contracts |
| `promptmaster` | `/promptmaster` | Optimizing prompts |
| `find-skills` | `/find-skills` | Discovering new skills |

### Testing
| Skill | Trigger | When to Apply |
|---|---|---|
| `playwright-best-practices` | E2E testing | Writing/fixing Playwright tests, POM |

---

## Technical Decisions

1. **Database:** PostgreSQL 15 (containerized) — matches spec ✅
2. **ORM:** Prisma 5.16.0 — matches spec ✅
3. **Framework:** Next.js 14 App Router — matches spec ✅
4. **Styling:** TailwindCSS 3.4.1 — matches spec ✅
5. **Design System:** HSL tokens in CSS variables + Tailwind config ✅
6. **Motion Library:** `framer-motion@11` (per docs/motion-spec.json) — **NOT INSTALLED** ❌
7. **Animation Fallback:** GSAP available via `gsap-react` skill ✅

### Known Limitations:
- Prisma schema needs bidirectional relations fixed (optional)
- Claude Code permissions need interactive login
- `framer-motion` package needs `npm install`

### Documentation Created:
- `docs/design-system.md` — 1,600+ line comprehensive design system
- `docs/motion-spec.json` — 21KB motion design spec with easing curves, frame budgets
- `docs/accessibility-checklist.md` — 39-item WCAG 2.2 AA checklist
- `docs/AUDIT.md` — Pre-session audit report

### Success Criteria:
- Users can browse universities with budget-adjusted rankings
- Students can submit peer-verified reviews
- Platform supports Urdu and Punjabi languages
- Reviews are verified via Polygon blockchain
- UI is professional (not AI slop) — per user directive
- Real motion, colors, animations for both phone and PC
- All 148 E2E tests pass
- `tsc --noEmit` passes with 0 errors

---

## Codex Worker Status

The codex-worker (`ae2bf8587d916cefd`) was launched to implement the UI redesign but **FAILED** after ~1 hour. It was stopped at 15:10. The sandbox blocked its file-writing tool (`"unsupported call: write"`). It only created `src/styles/globals.css` before getting stuck. **NO DUPLICATE WORKERS NEEDED** — the new session should continue the work directly.

---
**Next Agent Should:**
1. `npm install framer-motion` (missing dependency for motion design)
2. Initialize 21st UI design context: `npx 21st init --design-context`
3. Rebuild all UI components per the design system and motion spec
4. Run: `npx tsc --noEmit` → `npm run lint` → `npm run build` → `npm run test:e2e`
5. Commit and push to GitHub