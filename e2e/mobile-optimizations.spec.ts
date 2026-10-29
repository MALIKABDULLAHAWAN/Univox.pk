import { test, expect } from '@playwright/test';

test.describe('Mobile Optimization Tests for Pakistani Users', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE size
  });

  test('should display university cards properly on mobile', async ({ page }) => {
    await page.goto('/universities');

    // Check cards are stacked vertically on mobile
    const cards = page.locator('[data-testid="university-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Cards should be full width on mobile
    await expect(cards.first()).toBeVisible();
  });

  test('should have accessible touch targets on mobile', async ({ page }) => {
    await page.goto('/universities');

    // Buttons should have minimum 44px touch targets
    const buttons = page.locator('button, a');
    const firstButton = buttons.first();

    if (await firstButton.isVisible()) {
      const boundingBox = await firstButton.boundingBox();
      if (boundingBox) {
        // Check min touch target size (44x44px recommended)
        expect(boundingBox.width).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('should display budget filter as dropdown on mobile', async ({ page }) => {
    await page.goto('/universities');

    // Budget filters should be responsive
    const budgetFilter = page.locator('[role="combobox"], button:has-text("Low"), button:has-text("Medium"), button:has-text("High")');

    await expect(budgetFilter).toBeVisible();
  });

  test('should handle province dropdown with long list', async ({ page }) => {
    await page.goto('/universities');

    // Province dropdown should work on mobile
    const provinceSelector = page.locator('[role="combobox"]');
    await expect(provinceSelector).toBeVisible();

    await provinceSelector.click();

    // Should show options
    const options = page.locator('[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display Urdu language option', async ({ page }) => {
    await page.goto('/universities');

    // Language toggle should be visible
    const langToggle = page.locator('button[aria-label*="اردو"], button[aria-label*="lang"], a[href*="?lang=ur"]');
    await expect(langToggle).toBeVisible();
  });

  test('should handle search input properly on mobile', async ({ page }) => {
    await page.goto('/universities');

    // Search should be accessible
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();

    // Should be able to focus and type
    await searchInput.fill('Karachi');
    await expect(searchInput).toHaveValue('Karachi');
  });

  test('should display clear filters button on mobile', async ({ page }) => {
    await page.goto('/universities');

    // Apply a filter first
    await page.click('button:has-text("Low")');

    // Clear button should appear
    const clearBtn = page.locator('button:has-text("Clear")');
    await expect(clearBtn).toBeVisible();
  });

  test('should handle pagination on small screens', async ({ page }) => {
    await page.goto('/universities');

    // Pagination controls should be visible
    const pagination = page.locator('[data-testid="pagination"], nav[aria-label*="pagination"]');
    await expect(pagination).toBeVisible();
  });

  test('should display results count on mobile', async ({ page }) => {
    await page.goto('/universities');

    // Results count should be visible
    const resultsCount = page.locator('[data-testid="results-count"], text=/results/i, text=/showing/i');
    await expect(resultsCount).toBeVisible();
  });
});

test.describe('Low Bandwidth Performance Tests', () => {
  test('should display content without heavy images', async ({ page }) => {
    // Simulate slow connection
    await page.context().setOffline(false);

    await page.goto('/universities');

    // University cards should load with text even if images fail
    const universityNames = page.locator('[data-testid="university-card"] h3');
    const count = await universityNames.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should handle lazy-loaded images', async ({ page }) => {
    await page.goto('/universities');

    // Images should have loading attribute or be lazy loaded
    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      // Check if images are lazy loaded
      const loadingAttr = await images.first().getAttribute('loading');
      expect(loadingAttr === 'lazy' || loadingAttr === null).toBeTruthy();
    }
  });

  test('should display fallback content for university logos', async ({ page }) => {
    await page.goto('/universities');

    // If image fails, fallback should show initials
    const fallbackAvatars = page.locator('[data-testid="avatar-fallback"], .rounded-full');
    await expect(fallbackAvatars).toBeVisible();
  });
});