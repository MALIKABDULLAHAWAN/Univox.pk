# TESTING.md

## How to Run Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests with Playwright
npm run test:e2e

# Debug specific test
npm run test:debug -- -t "Review Submission"
```

## What Is Covered

- ✅ **Unit Tests**: API endpoints, ranking algorithm, verification logic
- ✅ **Integration Tests**: Database operations, peer verification flow
- ✅ **E2E Tests**: User registration → review submission → blockchain hash
- ✅ **Accessibility**: Screen reader navigation, color contrast
- ✅ **Internationalization**: Urdu/English text rendering, RTL layout

## What Is NOT Covered

- ❌ Blockchain smart contract unit tests (requires Hardhat setup)
- ❌ AI model accuracy tests (requires labeled dataset)
- ❌ Load testing at 100K concurrent users (Phase 3)
- ❌ Mobile device compatibility (only responsive design)

## Pre-Commit Checklist

Before committing any changes:

- [ ] Run linting: `npm run lint`
- [ ] Fix all eslint errors
- [ ] Format code: `npm run format`
- [ ] Run unit tests: `npm run test`
- [ ] Check TypeScript: `npx tsc --noEmit`
- [ ] Update HANDOFF.md with changes made
- [ ] Sign-off with Co-Authored-By line

## Test Data

- Test universities seeded in `prisma/seeds/test-universities.ts`
- Mock wallet addresses in `__mocks__/blockchain.ts`
- Test student accounts in `prisma/seeds/test-students.ts`