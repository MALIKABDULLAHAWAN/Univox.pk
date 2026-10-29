# PLAN.md - UniVox PK University Review Platform

**Current Phase:** ✅ Infrastructure Setup Complete
**Date:** 2026-10-29

## Phase 1: Project Foundation ✅ DONE

### Tasks Completed:
- [x] Initialize Next.js 14 project with TypeScript
- [x] Install and configure dependencies
- [x] Set up PostgreSQL database with Docker
- [x] Configure Prisma ORM
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

## Phase 2: Database Seeding (Next)

### Goals:
- [ ] Create seed data for 5-10 Pakistani universities
- [ ] Add sample reviews with budget-adjusted rankings
- [ ] Create test users (students, instructors)
- [ ] Add departments and courses

### Priority Universities to Seed:
1. University of Punjab (Lahore)
2. Lahore University of Management Sciences (LUMS)
3. Fast University (Karachi/Lahore)
4. University of Karachi
5. Quaid-e-Azam University (Islamabad)

## Phase 3: Core Features Implementation

### 3.1 User Authentication
- [ ] Implement NextAuth with email/password
- [ ] Add Google/GitHub social login
- [ ] Create registration flow
- [ ] Implement email verification

### 3.2 University Discovery
- [ ] Budget-adjusted ranking algorithm
- [ ] Search and filtering by province/city
- [ ] University detail pages
- [ ] Comparison tool

### 3.3 Review System
- [ ] Create review forms for universities
- [ ] Implement rating system (1-5 stars)
- [ ] Add peer verification system
- [ ] Blockchain proof integration (Phase 3)

### 3.4 Urdu/Punjabi Support
- [ ] Implement i18n routing
- [ ] Translate core UI elements
- [ ] Create language toggle
- [ ] Test RTL layout support

## Phase 4: Advanced Features

### 4.1 Moderation System
- [ ] Flag and report reviews
- [ ] Admin dashboard
- [ ] Peer verification incentives
- [ ] AI moderation

### 4.2 Polygon Blockchain Integration
- [ ] Review NFT generation
- [ ] Verification tokens
- [ ] Wallet integration
- [ ] Smart contract deployment

### 4.3 AI Recommendations
- [ ] OpenAI integration
- [ ] University matching algorithm
- [ ] Personalized recommendations
- [ ] Budget advisor

## Phase 5: Production & Deployment

- [ ] Production database setup
- [ ] SSL certificate
- [ ] CDN configuration
- [ ] Monitoring and analytics
- [ ] SEO optimization

## Session Notes

### Technical Decisions from Previous Session:
1. **Database:** PostgreSQL 15 (containerized) - matches spec
2. **ORM:** Prisma 5.16.0 - matches spec
3. **Framework:** Next.js 14 App Router - matches spec
4. **Styling:** TailwindCSS 3.4.1 - matches spec

### Known Limitations:
- Prisma schema needs bidirectional relations fixed
- Seed data must be added before reviews can be entered
- Claude Code permissions need interactive login

### Success Criteria:
- Users can browse universities with budget-adjusted rankings
- Students can submit peer-verified reviews
- Platform supports Urdu and Punjabi languages
- Reviews are verified via Polygon blockchain

---
**Next Agent Should:**
1. Login to Claude Code with `/login`
2. Grant Bash permissions when prompted
3. Enable auto mode with `/mode auto`
4. Add seed data to PostgreSQL
5. Fix Prisma schema bidirectional relations (optional)
