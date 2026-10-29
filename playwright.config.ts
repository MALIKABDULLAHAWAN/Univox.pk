import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for UniVox PK
 * E2E tests for university browsing, student verification, peer review submission,
 * accessiblity, performance, mobile navigation, and animations
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Use 1 worker for local, 4 for CI */
  workers: process.env.CI ? 4 : 1,
  /* Reporter to use */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  /* Shared settings for all tests */
  use: {
    /* Base URL to use in all tests */
    baseURL: 'http://localhost:3000',
    /* Collect trace on retry */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on retry */
    video: 'on-first-retry',
    /* Custom test ID attribute */
    testIdAttribute: 'data-testid',
  },

  /* Configure projects for different test scenarios */
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'iPhone 13',
      use: {
        ...devices['iPhone 13'],
      },
    },
    {
      name: 'iPad Pro 11',
      use: {
        ...devices['iPad Pro 11'],
        viewport: { width: 1024, height: 1366 },
      },
    },
    {
      name: 'Mobile Safari (Urdu Locale)',
      use: {
        ...devices['iPhone 12'],
        locale: 'ur-PK',
        permissions: ['geolocation'],
      },
    },
  ],

  /* Web server config for local development */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
