import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page object for the Sign In page.
 * Handles email/password input, OAuth, and forgot password flows.
 */
export class SignInPage extends BasePage {
  // Form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly googleSignInButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly backToHomeLink: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email address');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.rememberMeCheckbox = page.getByLabel(/remember me/i);
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot your password/i });
    this.googleSignInButton = page.getByRole('button', { name: /google/i });
    this.errorMessage = page.locator('[role="alert"], .bg-red-50');
    this.successMessage = page.locator('[role="alert"], .bg-green-50');
    this.backToHomeLink = page.getByRole('link', { name: /back to home/i });
    this.signUpLink = page.getByRole('link', { name: /create an account|sign up/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/signin');
    await this.waitForLoadState('networkidle');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async toggleRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.check();
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async signInWithGoogle(): Promise<void> {
    await this.googleSignInButton.click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).toBeHidden();
  }

  async isSubmitButtonDisabled(): Promise<boolean> {
    return this.submitButton.isDisabled();
  }

  async isSubmitting(): Promise<boolean> {
    return this.submitButton.locator('.animate-spin, .h-5').isVisible();
  }
}
