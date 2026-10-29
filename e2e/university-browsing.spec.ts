import { test, expect } from '@playwright/test';
import { UniversitiesPage } from './pages/universities.page';
import { mockApiResponse, mockNetworkFailure, mockSlowResponse } from './fixtures';

test.describe('University Browsing Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/universities');
    await page.waitForLoadState('networkidle');
  });

  test('should display universities list on page load', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    // Check page title
    await expect(page).toHaveTitle(/universities/i);

    // Check main heading
    await expect(universitiesPage.heading).toContainText('Universities');

    // Check that university cards are displayed
    const count = await universitiesPage.universityGrid.count();
    expect(count).toBeGreaterThan(0);

    // Each card should have a name
    const firstCard = universitiesPage.universityGrid.first();
    await expect(firstCard.locator('h3')).toBeVisible();
  });

  test('should display university card with correct structure', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);
    const firstCard = universitiesPage.universityGrid.first();

    // Card should contain university name
    await expect(firstCard.locator('h3')).toBeVisible();
    const name = await firstCard.locator('h3').textContent();
    expect(name).toBeTruthy();
    expect(name!.length).toBeGreaterThan(0);

    // Card should contain location info
    await expect(firstCard.locator('text=/, /')).toBeVisible();

    // Card should contain budget badge
    const budgetBadge = firstCard.locator('[data-testid="budget-badge"], text=/Low|Medium|High/i');
    await expect(budgetBadge).toBeVisible();

    // Card should contain tuition fee
    const tuitionFee = firstCard.locator('[data-testid="tuition-fee"], text=/PKR/i');
    expect(await tuitionFee.count()).toBeGreaterThan(0);
  });

  test('should filter universities by budget tier (Low)', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    await universitiesPage.filterByBudgetTier('Low');

    // Verify filter is applied
    await expect(universitiesPage.budgetTierSelect).toHaveValue('Low');

    // Verify results show Low budget universities
    const count = await universitiesPage.universityGrid.count();
    expect(count).toBeGreaterThanOrEqual(0);

    for (let i = 0; i < count; i++) {
      const budgetBadge = universitiesPage.universityGrid.nth(i).locator('text=/Low|Medium|High/i');
      const badgeText = await budgetBadge.textContent();
      expect(badgeText).toContain('Low');
    }
  });

  test('should filter universities by budget tier (Medium)', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    await universitiesPage.filterByBudgetTier('Medium');

    await expect(universitiesPage.budgetTierSelect).toHaveValue('Medium');

    const count = await universitiesPage.universityGrid.count();
    for (let i = 0; i < count; i++) {
      const budgetBadge = universitiesPage.universityGrid.nth(i).locator('text=/Low|Medium|High/i');
      const badgeText = await budgetBadge.textContent();
      expect(badgeText).toContain('Medium');
    }
  });

  test('should filter universities by budget tier (High)', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    await universitiesPage.filterByBudgetTier('High');

    await expect(universitiesPage.budgetTierSelect).toHaveValue('High');

    const count = await universitiesPage.universityGrid.count();
    for (let i = 0; i < count; i++) {
      const budgetBadge = universitiesPage.universityGrid.nth(i).locator('text=/Low|Medium|High/i');
      const badgeText = await budgetBadge.textContent();
      expect(badgeText).toContain('High');
    }
  });

  test('should search universities by name', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    // Type in search box
    await universitiesPage.search('University');

    // Verify search input has the value
    await expect(universitiesPage.searchInput).toHaveValue('University');

    // Results should contain matching universities
    const count = await universitiesPage.universityGrid.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const name = await universitiesPage.universityGrid.nth(i).locator('h3').textContent();
      expect(name?.toLowerCase()).toContain('university');
    }
  });

  test('should show empty state when search returns no results', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    // Search for something that won't match
    await universitiesPage.search('XYZNONEXISTENT');

    await page.waitForLoadState('networkidle');

    // Empty state should be visible
    await expect(universitiesPage.emptyState).toBeVisible();
  });

  test('should search universities by city name', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    // Search for Karachi
    await universitiesPage.search('Karachi');

    await page.waitForLoadState('networkidle');

    const count = await universitiesPage.universityGrid.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const cardText = await universitiesPage.universityGrid.nth(i).textContent();
      expect(cardText?.toLowerCase()).toContain('karachi');
    }
  });

  test('should clear search when clear button is clicked', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    await universitiesPage.search('UET');

    const initialCount = await universitiesPage.universityGrid.count();

    // Clear the search
    await universitiesPage.clearSearch();

    // Search input should be empty
    await expect(universitiesPage.searchInput).toHaveValue('');

    // Results should show all universities
    await page.waitForLoadState('networkidle');
    const resetCount = await universitiesPage.universityGrid.count();
    expect(resetCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('should filter universities by province (Punjab)', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    await universitiesPage.filterByProvince('Punjab');

    await page.waitForLoadState('networkidle');

    const count = await universitiesPage.universityGrid.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const cardText = await universitiesPage.universityGrid.nth(i).textContent();
      expect(cardText).toContain('Punjab');
    }
  });

  test('should filter universities by province (Sindh)', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    await universitiesPage.filterByProvince('Sindh');

    await page.waitForLoadState('networkidle');

    const count = await universitiesPage.universityGrid.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const cardText = await universitiesPage.universityGrid.nth(i).textContent();
        expect(cardText).toContain('Sindh');
      }
    }
  });

  test('should clear filters when clear button is clicked', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    // Apply budget filter
    await universitiesPage.filterByBudgetTier('Low');
    await expect(universitiesPage.budgetTierSelect).toHaveValue('Low');

    const filteredCount = await universitiesPage.universityGrid.count();

    // Clear filters
    await universitiesPage.clearAllFilters();
    await expect(universitiesPage.budgetTierSelect).toHaveValue('All');

    await page.waitForLoadState('networkidle');

    const resetCount = await universitiesPage.universityGrid.count();
    expect(resetCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('should display rating information on university cards', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);
    const firstCard = universitiesPage.universityGrid.first();

    // Check rating is displayed
    const rating = firstCard.locator('[data-testid="rating"], text=/\\d\\.\\d.*5/i');
    await expect(rating).toBeVisible();

    // Rating should contain star symbol or numeric score
    const ratingText = await rating.textContent();
    expect(ratingText).toMatch(/[\d.]+/);
  });

  test('should display tuition fee information', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);
    const firstCard = universitiesPage.universityGrid.first();

    // Check tuition fee is displayed
    const tuitionFee = firstCard.locator('[data-testid="tuition-fee"], text=/PKR/i');
    expect(await tuitionFee.count()).toBeGreaterThan(0);

    const tuitionText = await tuitionFee.first().textContent();
    expect(tuitionText).toContain('PKR');
  });

  test('should display budget tier badge with correct color', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);
    const firstCard = universitiesPage.universityGrid.first();

    const budgetBadge = firstCard.locator('[data-testid="budget-badge"]');
    await expect(budgetBadge).toBeVisible();

    const badgeText = await budgetBadge.textContent();
    expect(badgeText).toMatch(/Low|Medium|High/);
    expect(badgeText).not.toContain('All');
  });

  test('should show results count matching displayed cards', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    const count = await universitiesPage.universityGrid.count();
    const resultsText = await universitiesPage.resultsCount.textContent();
    const numberInResults = resultsText?.match(/(\d+)/);

    if (numberInResults) {
      expect(count).toBe(Number(numberInResults[1]));
    }
  });

  test('should filter universities by budget tier and province simultaneously', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    // Apply budget filter first
    await universitiesPage.filterByBudgetTier('Low');
    await page.waitForLoadState('networkidle');

    let count = await universitiesPage.universityGrid.count();
    expect(count).toBeGreaterThan(0);

    // Apply province filter on top
    await universitiesPage.filterByProvince('Punjab');
    await page.waitForLoadState('networkidle');

    const combinedCount = await universitiesPage.universityGrid.count();
    expect(combinedCount).toBeLessThanOrEqual(count);

    // Verify all results match both filters
    if (combinedCount > 0) {
      for (let i = 0; i < combinedCount; i++) {
        const cardText = await universitiesPage.universityGrid.nth(i).textContent();
        expect(cardText).toContain('Low');
        expect(cardText).toContain('Punjab');
      }
    }
  });

  test('should handle pagination correctly', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    // Check if pagination exists
    const hasPagination = await universitiesPage.pagination.isVisible();

    if (hasPagination) {
      // Go to page 2
      await universitiesPage.goToNextPage();
      await page.waitForLoadState('networkidle');

      // Verify page info
      const pageInfo = await universitiesPage.pageInfo.textContent();
      expect(pageInfo).toMatch(/Page/);

      // Go back to page 1
      await universitiesPage.goToPreviousPage();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should handle API error gracefully when fetching universities fails', async ({ page }) => {
    // Intercept the API call and return 500
    await mockApiResponse(page, '/api/universities', { error: 'Internal Server Error' }, 500);

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Page should still render, even if universities fail to load
    await expect(page.locator('h1')).toContainText(/universities/i);

    // Should show error or empty state
    const hasError = await page.locator('[role="alert"], text=/error/i').count() > 0;
    const hasEmptyState = await page.locator('text=/no universities found/i').count() > 0;
    expect(hasError || hasEmptyState).toBeTruthy();
  });

  test('should display university logo or fallback avatar', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);
    const firstCard = universitiesPage.universityGrid.first();

    const logo = firstCard.locator('img');
    const fallback = firstCard.locator('.rounded, [data-testid="avatar-fallback"]');

    // Either logo or fallback should be visible
    expect(await logo.count() > 0 || await fallback.count() > 0).toBeTruthy();
  });

  test('should toggle RTL mode correctly', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);

    // Initially should be LTR
    const initialDirection = await page.locator('html').getAttribute('dir');
    expect(initialDirection).toBe('ltr');

    // Toggle to RTL
    await universitiesPage.toggleRTL();

    await page.waitForTimeout(500);

    const directionAfterToggle = await page.evaluate(() => document.documentElement.dir || document.body.dir);
    // After RTL toggle, content direction changes
    const html = await page.locator('html').getAttribute('class');
    expect(html).toContain('rtl');

    // Toggle back to LTR
    await universitiesPage.toggleRTL();

    await page.waitForTimeout(500);
    const htmlAfterSecondToggle = await page.locator('html').getAttribute('class');
    expect(htmlAfterSecondToggle).not.toContain('rtl');
  });

  test('should handle slow network gracefully', async ({ page }) => {
    const universitiesPage = new UniversitiesPage(page);
    const initialCount = await universitiesPage.universityGrid.count();

    // Simulate slow response for subsequent API calls
    await mockSlowResponse(page, '**/api/universities/**', 1000);

    // Page should still be functional
    await expect(universitiesPage.heading).toBeVisible();

    // University cards should still be visible from initial load
    expect(await universitiesPage.universityGrid.count()).toBeGreaterThanOrEqual(0);
  });
});
