import { test, expect } from '@playwright/test';

test.describe('Student Verification Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin');
  });

  test('should display sign in form', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/sign|login/i);

    // Check email input
    await expect(page.locator('input[type="email"]')).toBeVisible();

    // Check password input
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'wrong-password');

    await page.click('button[type="submit"]');

    // Check for error message
    await expect(page.locator('[role="alert"], .error, .text-red')).toBeVisible();
  });

  test('should redirect to sign up page from sign in', async ({ page }) => {
    await page.click('text:has-text("Sign up"), "Create account", a[href*="signup"]');

    await expect(page).toHaveURL(/\/signup/i);
  });

  test('should display sign up form with required fields', async ({ page }) => {
    await page.goto('/auth/signup');

    // Check for required fields
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('select[name="universityId"]')).toBeVisible();

    // Check terms checkbox
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  });

  test('should prevent sign up without agreeing to terms', async ({ page }) => {
    await page.goto('/auth/signup');

    // Fill form but don't check terms
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');

    // Try to submit
    await page.click('button[type="submit"]');

    // Should show terms error or disable submit
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('should validate password confirmation match', async ({ page }) => {
    await page.goto('/auth/signup');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'different-password');

    await page.click('input[type="checkbox"]', { force: true }); // Agree to terms
    await page.click('button[type="submit"]');

    // Should show password mismatch error
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('should show Google sign in option', async ({ page }) => {
    await expect(page.locator('button:has-text("Google"), [aria-label*="Google"]')).toBeVisible();
  });

  test('should have proper form labels for accessibility', async ({ page }) => {
    await expect(page.locator('label[for*="email"], label:has("email")')).toBeVisible();
    await expect(page.locator('label[for*="password"], label:has("password")')).toBeVisible();
  });
});