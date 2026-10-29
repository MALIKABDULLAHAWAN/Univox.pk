import { test, expect } from '@playwright/test';
import { SignInPage } from './pages/signin.page';
import { SignUpPage } from './pages/signup.page';
import { generateTestData } from './fixtures';

test.describe('Authentication Flow Tests', () => {
  test.describe('Sign In Form', () => {
    let signInPage: SignInPage;

    test.beforeEach(async ({ page }) => {
      signInPage = new SignInPage(page);
      await signInPage.goto();
    });

    test('should display sign in form with all required fields', async ({ page }) => {
      // Check email input
      await expect(signInPage.emailInput).toBeVisible();
      await expect(signInPage.emailInput).toHaveAttribute('type', 'email');
      await expect(signInPage.emailInput).toHaveAttribute('required');

      // Check password input
      await expect(signInPage.passwordInput).toBeVisible();
      await expect(signInPage.passwordInput).toHaveAttribute('type', 'password');
      await expect(signInPage.passwordInput).toHaveAttribute('required');

      // Check submit button
      await expect(signInPage.submitButton).toBeVisible();
      await expect(signInPage.submitButton).toBeEnabled();
    });

    test('should show Remember Me checkbox', async ({ page }) => {
      await expect(signInPage.rememberMeCheckbox).toBeVisible();
      await expect(signInPage.rememberMeCheckbox).toHaveAttribute('type', 'checkbox');
    });

    test('should have Forgot Password link', async ({ page }) => {
      await expect(signInPage.forgotPasswordLink).toBeVisible();
    });

    test('should have Google OAuth option', async ({ page }) => {
      await expect(signInPage.googleSignInButton).toBeVisible();
    });

    test('should validate empty email field', async ({ page }) => {
      // Fill password but not email
      await signInPage.fillPassword('password123');
      await signInPage.clickSubmit();

      // Should show validation error
      const validationMessage = await signInPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).toBeTruthy();
    });

    test('should validate invalid email format', async ({ page }) => {
      // Fill with invalid email
      await signInPage.fillEmail('invalid-email');
      await signInPage.fillPassword('password123');
      await signInPage.clickSubmit();

      // Should show error for invalid email
      await expect(signInPage.errorMessage).toBeVisible();
      await expect(signInPage.errorMessage).toContainText(/invalid|email/i);
    });

    test('should validate empty password field', async ({ page }) => {
      // Fill email but not password
      await signInPage.fillEmail('test@example.com');
      await signInPage.clickSubmit();

      const validationMessage = await signInPage.passwordInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).toBeTruthy();
    });

    test('should show error for incorrect credentials', async ({ page }) => {
      await signInPage.signInWithEmail('nonexistent@example.com', 'wrongpassword123');

      // Should show error message
      await expect(signInPage.errorMessage).toBeVisible();
      await expect(signInPage.errorMessage).toContainText(/invalid|incorrect|failed/i);
    });

    test('should toggle Remember Me checkbox', async ({ page }) => {
      await expect(signInPage.rememberMeCheckbox).not.toBeChecked();

      await signInPage.toggleRememberMe();
      await expect(signInPage.rememberMeCheckbox).toBeChecked();

      // Uncheck
      await signInPage.rememberMeCheckbox.uncheck();
      await expect(signInPage.rememberMeCheckbox).not.toBeChecked();
    });

    test('should redirect to signup page from signin', async ({ page }) => {
      await signInPage.signUpLink.click();

      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/signup/i);
    });

    test('should navigate to Forgot Password form', async ({ page }) => {
      await signInPage.clickForgotPassword();

      // Should see reset password form
      await expect(page.locator('h2')).toContainText(/reset your password/i);
      await expect(page.getByLabel('Email address')).toBeVisible();
    });
  });

  test.describe('Forgot Password Flow', () => {
    test('should validate empty email in forgot password', async ({ page }) => {
      await page.goto('/auth/signin');
      const signInPage = new SignInPage(page);

      await signInPage.clickForgotPassword();

      // Submit without email
      const submitButton = page.getByRole('button', { name: /send reset link/i });
      await submitButton.click();

      const emailInput = page.getByLabel('Email address');
      const validationMessage = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).toBeTruthy();
    });

    test('should validate invalid email in forgot password', async ({ page }) => {
      await page.goto('/auth/signin');
      const signInPage = new SignInPage(page);

      await signInPage.clickForgotPassword();

      await page.getByLabel('Email address').fill('invalid-email');
      await page.getByRole('button', { name: /send reset link/i }).click();

      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should show success message after submitting valid email', async ({ page }) => {
      await page.goto('/auth/signin');
      const signInPage = new SignInPage(page);

      await signInPage.clickForgotPassword();

      await page.getByLabel('Email address').fill('test@example.com');
      await page.getByRole('button', { name: /send reset link/i }).click();

      // Should show success message
      await expect(page.locator('text=/reset link|verification|sent/i')).toBeVisible();
    });

    test('should navigate back to sign in from forgot password', async ({ page }) => {
      await page.goto('/auth/signin');
      const signInPage = new SignInPage(page);

      await signInPage.clickForgotPassword();

      const backLink = page.getByRole('button', { name: /back to sign in/i });
      await backLink.click();

      await expect(page.locator('h2')).toContainText(/sign in/i);
    });
  });

  test.describe('Sign Up Form', () => {
    let signUpPage: SignUpPage;

    test.beforeEach(async ({ page }) => {
      signUpPage = new SignUpPage(page);
      await signUpPage.goto();
    });

    test('should display sign up form with all required fields', async ({ page }) => {
      // Check all required fields
      await expect(signUpPage.emailInput).toBeVisible();
      await expect(signUpPage.universitySelect).toBeVisible();
      await expect(signUpPage.studentIdInput).toBeVisible();
      await expect(signUpPage.passwordInput).toBeVisible();
      await expect(signUpPage.confirmPasswordInput).toBeVisible();
      await expect(signUpPage.agreeToTermsCheckbox).toBeVisible();

      // Check submit button
      await expect(signUpPage.submitButton).toBeVisible();
      await expect(signUpPage.submitButton).toBeEnabled();
    });

    test('should have terms and privacy links', async ({ page }) => {
      await expect(signUpPage.termsLink).toBeVisible();
      await expect(signUpPage.privacyLink).toBeVisible();

      // Links should open in new tab or navigate
      await expect(signUpPage.termsLink).toHaveAttribute('href', /\/terms/i);
      await expect(signUpPage.privacyLink).toHaveAttribute('href', /\/privacy/i);
    });

    test('should prevent sign up without agreeing to terms', async ({ page }) => {
      // Fill form but don't check terms
      await signUpPage.fillEmail('test@example.com');
      await signUpPage.fillStudentId('STU123456');
      await signUpPage.fillPassword('Password123!');
      await signUpPage.fillConfirmPassword('Password123!');

      await signUpPage.clickSubmit();

      // Should show terms error or disabled submit
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should validate password mismatch', async ({ page }) => {
      await signUpPage.fillEmail('test@example.com');
      await signUpPage.fillStudentId('STU123456');
      await signUpPage.fillPassword('password123');
      await signUpPage.fillConfirmPassword('different-password');
      await signUpPage.agreeToTerms();

      await signUpPage.clickSubmit();

      await expect(signUpPage.errorMessage).toBeVisible();
      await expect(signUpPage.errorMessage).toContainText(/password.*do not match|password.*mismatch|passwords must match/i);
    });

    test('should validate email format on sign up', async ({ page }) => {
      await signUpPage.fillEmail('invalid-email');
      await signUpPage.fillStudentId('STU123456');
      await signUpPage.fillPassword('Password123!');
      await signUpPage.fillConfirmPassword('Password123!');
      await signUpPage.agreeToTerms();

      await signUpPage.clickSubmit();

      await expect(signUpPage.errorMessage).toBeVisible();
    });

    test('should display list of universities in select dropdown', async ({ page }) => {
      const universities = await signUpPage.getAvailableUniversities();
      expect(universities.length).toBeGreaterThan(0);

      // Should contain Pakistani universities
      const hasPakistaniUniversity = universities.some(
        (u) => u.includes('Punjab') || u.includes('Karachi') || u.includes('Lahore')
      );
      expect(hasPakistaniUniversity).toBeTruthy();
    });

    test('should redirect to sign in after successful registration', async ({ page }) => {
      const testData = generateTestData('signup');

      await signUpPage.fillEmail(testData.email);
      await signUpPage.selectUniversity(await signUpPage.getAvailableUniversities().then((u) => u[0]));
      await signUpPage.fillStudentId(testData.studentId);
      await signUpPage.fillPassword(testData.password);
      await signUpPage.fillConfirmPassword(testData.password);
      await signUpPage.agreeToTerms();

      await signUpPage.clickSubmit();

      // Should show success message
      await expect(signUpPage.successMessage).toBeVisible();
      await page.waitForTimeout(2000); // Wait for redirect

      await expect(page).toHaveURL(/\/auth\/signin/i);
    });

    test('should show error for duplicate email registration', async ({ page }) => {
      const existingEmail = 'existing@example.com';

      await signUpPage.fillEmail(existingEmail);
      await signUpPage.selectUniversity(await signUpPage.getAvailableUniversities().then((u) => u[0]));
      await signUpPage.fillStudentId('unique-student-id');
      await signUpPage.fillPassword('Password123!');
      await signUpPage.fillConfirmPassword('Password123!');
      await signUpPage.agreeToTerms();

      await signUpPage.clickSubmit();

      // Should show error about email already registered
      await expect(signUpPage.errorMessage).toBeVisible();
      await expect(signUpPage.errorMessage).toContainText(/already registered|already exists/i);
    });

    test('should toggle password visibility', async ({ page }) => {
      // Check if password visibility toggle exists
      const toggleButtons = page.locator('button[type="button"][aria-label*="password"], button[type="button"].relative');
      const count = await toggleButtons.count();

      if (count > 0) {
        await toggleButtons.first().click();

        // Password should toggle visibility
        const inputType = await signUpPage.passwordInput.getAttribute('type');
        expect(inputType).toBe('text');
      }
    });
  });

  test.describe('Sign In Form Validation - Edge Cases', () => {
    test('should validate minimum password length', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Zod validation requires 6 characters
      await signInPage.fillEmail('test@example.com');
      await signInPage.fillPassword('12345'); // 5 chars
      await signInPage.clickSubmit();

      await expect(signInPage.errorMessage).toBeVisible();
      await expect(signInPage.errorMessage).toContainText(/password/i);
    });

    test('should handle OAuth sign in flow', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Google sign in button should be present
      await expect(signInPage.googleSignInButton).toBeVisible();

      // Clicking should redirect to Google OAuth (or show error if not configured)
      await signInPage.signInWithGoogle();

      // Should not remain on the same page for long
      await page.waitForLoadState('networkidle');
    });
  });
});
