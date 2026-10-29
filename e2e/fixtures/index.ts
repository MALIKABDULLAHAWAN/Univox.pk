import { test as base, Page, expect } from '@playwright/test';
import { UniversitiesPage } from '../pages/universities.page';
import { SignInPage } from '../pages/signin.page';
import { SignUpPage } from '../pages/signup.page';
import { ReviewPage } from '../pages/review.page';
import { DashboardPage } from '../pages/dashboard.page';
import { NavigationComponent } from '../components/navigation.component';
import { DarkModeComponent } from '../components/darkmode.component';

type TestFixtures = {
  universitiesPage: UniversitiesPage;
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  reviewPage: ReviewPage;
  dashboardPage: DashboardPage;
  navigation: NavigationComponent;
  darkMode: DarkModeComponent;
};

/**
 * Custom test fixture with Page Object Model.
 * Each test gets fresh page objects, ensuring clean state.
 */
export const test = base.extend<TestFixtures>({
  // Page Objects
  universitiesPage: async ({ page }, use) => {
    const universitiesPage = new UniversitiesPage(page);
    await use(universitiesPage);
  },

  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await use(signInPage);
  },

  signUpPage: async ({ page }, use) => {
    const signUpPage = new SignUpPage(page);
    await use(signUpPage);
  },

  reviewPage: async ({ page }, use) => {
    const reviewPage = new ReviewPage(page);
    await use(reviewPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  // Component Objects
  navigation: async ({ page }, use) => {
    const navigation = new NavigationComponent(page);
    await use(navigation);
  },

  darkMode: async ({ page }, use) => {
    const darkMode = new DarkModeComponent(page);
    await use(darkMode);
  },
});

export { expect };

/**
 * Helper to generate random test data for unique test runs.
 */
export function generateTestData(prefix = 'test') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return {
    email: `${prefix}.${timestamp}.${random}@example.edu.pk`,
    password: 'TestPass123!',
    studentId: `STU-${timestamp}-${random}`,
    fullName: `Test User ${random}`,
    reviewComment: `This is a test review. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rating submitted at ${new Date().toISOString()}.`,
  };
}

/**
 * Helper to mock network responses.
 */
export async function mockApiResponse(page: Page, urlPattern: RegExp | string, response: any, status = 200) {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status,
      json: response,
    });
  });
}

/**
 * Helper to mock network failure.
 */
export async function mockNetworkFailure(page: Page, urlPattern: RegExp | string) {
  await page.route(urlPattern, (route) => {
    route.abort('failed');
  });
}

/**
 * Helper to mock slow response.
 */
export async function mockSlowResponse(page: Page, urlPattern: RegExp | string, delayMs = 2000) {
  await page.route(urlPattern, (route) => {
    setTimeout(() => {
      route.fulfill({
        status: 200,
        json: { data: 'success' },
      });
    }, delayMs);
  });
}
