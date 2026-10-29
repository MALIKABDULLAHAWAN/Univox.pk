import { test, expect } from '@playwright/test';

test.describe('University Browsing Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/universities');
  });

  test('should display universities list on page load', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/universities/i);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Universities');

    // Check that university cards are displayed
    const universityCards = page.locator('[data-testid="university-card"]');
    await expect(universityCards.count()).toBeGreaterThan(0);
  });

  test('should filter universities by budget tier (Low)', async ({ page }) => {
    // Click on Low budget tier filter
    await page.click('button:has-text("Low")');

    // Verify that only Low budget universities are shown
    const cards = page.locator('[data-testid="university-card"]');
    for (const card of await cards.all()) {
      const budgetBadge = card.locator('[data-testid="budget-badge"]');
      const budgetText = await budgetBadge.textContent();
      expect(budgetText).toContain('Low');
    }
  });

  test('should filter universities by budget tier (Medium)', async ({ page }) => {
    // Click on Medium budget tier filter
    await page.click('button:has-text("Medium")');

    // Verify that only Medium budget universities are shown
    const cards = page.locator('[data-testid="university-card"]');
    for (const card of await cards.all()) {
      const budgetBadge = card.locator('[data-testid="budget-badge"]');
      const budgetText = await budgetBadge.textContent();
      expect(budgetText).toContain('Medium');
    }
  });

  test('should filter universities by budget tier (High)', async ({ page }) => {
    // Click on High budget tier filter
    await page.click('button:has-text("High")');

    // Verify that only High budget universities are shown
    const cards = page.locator('[data-testid="university-card"]');
    for (const card of await cards.all()) {
      const budgetBadge = card.locator('[data-testid="budget-badge"]');
      const budgetText = await budgetBadge.textContent();
      expect(budgetText).toContain('High');
    }
  });

  test('should filter universities by province', async ({ page }) => {
    // Click on province dropdown
    await page.click('[role="combobox"]');

    // Select a province (e.g., Punjab)
    await page.click('text=Punjab');

    // Verify that only universities from Punjab are shown
    const cards = page.locator('[data-testid="university-card"]');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const province = await cards.nth(i).locator('[data-testid="province"]').textContent();
      expect(province).toContain('Punjab');
    }
  });

  test('should search universities by name', async ({ page }) => {
    // Type in search box
    await page.fill('[placeholder*="Search"]', 'UET');

    // Verify results contain the search term
    const cards = page.locator('[data-testid="university-card"]');
    const count = await cards.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const name = await cards.nth(i).locator('h3').textContent();
      expect(name?.toLowerCase()).toContain('uet');
    }
  });

  test('should clear filters when clear button is clicked', async ({ page }) => {
    // Apply a filter
    await page.click('button:has-text("Low")');

    // Check that clear button is visible
    await expect(page.locator('button:has-text("Clear")')).toBeVisible();

    // Click clear button
    await page.click('button:has-text("Clear")');

    // Verify filter is cleared
    await expect(page.locator('[data-testid="university-card"]')).toBeVisible();
  });

  test('should display rating information', async ({ page }) => {
    const cards = page.locator('[data-testid="university-card"]');
    const firstCard = cards.first();

    // Check rating is displayed
    await expect(firstCard.locator('[data-testid="rating"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="rating"]')).toContainText('★');
  });

  test('should display tuition fee information', async ({ page }) => {
    const cards = page.locator('[data-testid="university-card"]');
    const firstCard = cards.first();

    // Check tuition fee is displayed
    await expect(firstCard.locator('[data-testid="tuition-fee"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="tuition-fee"]')).toContainText('PKR');
  });
});