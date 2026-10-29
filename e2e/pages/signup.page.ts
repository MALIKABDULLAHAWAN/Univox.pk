import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page object for the Sign Up page.
 * Handles student registration with university selection.
 */
export class SignUpPage extends BasePage {
  // Form elements
  readonly emailInput: Locator;
  readonly universitySelect: Locator;
  readonly studentIdInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly agreeToTermsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly backToHomeLink: Locator;
  readonly signInLink: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email address');
    this.universitySelect = page.getByLabel('University');
    this.studentIdInput = page.getByLabel('Student ID');
    this.passwordInput = page.getByLabel('Password');
    this.confirmPasswordInput = page.getByLabel('Confirm Password');
    this.agreeToTermsCheckbox = page.getByLabel(/agree to the/i);
    this.submitButton = page.getByRole('button', { name: /create account/i });
    this.errorMessage = page.locator('[role="alert"], .bg-red-50');
    this.successMessage = page.getByText(/successfully|please check your email/i);
    this.backToHomeLink = page.getByRole('link', { name: /back to home/i });
    this.signInLink = page.getByRole('link', { name: /sign in/i });
    this.termsLink = page.getByRole('link', { name: /terms of service/i });
    this.privacyLink = page.getByRole('link', { name: /privacy policy/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/signup');
    await this.waitForLoadState('networkidle');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async selectUniversity(universityName: string): Promise<void> {
    await this.universitySelect.selectOption({ label: universityName });
  }

  async fillStudentId(studentId: string): Promise<void> {
    await this.studentIdInput.fill(studentId);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  async agreeToTerms(): Promise<void> {
    await this.agreeToTermsCheckbox.check();
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async signUp(userData: {
    email: string;
    university: string;
    studentId: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.fillEmail(userData.email);
    await this.selectUniversity(userData.university);
    await this.fillStudentId(userData.studentId);
    await this.fillPassword(userData.password);
    await this.fillConfirmPassword(userData.confirmPassword);
    await this.agreeToTerms();
    await this.clickSubmit();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectSuccess(message: string): Promise<void> {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText(message);
  }

  async isSubmitButtonDisabled(): Promise<boolean> {
    return this.submitButton.isDisabled();
  }

  async getAvailableUniversities(): Promise<string[]> {
    const options = await this.universitySelect.locator('option').allInnerTexts();
    return options.filter((o) => o !== 'Select your university');
  }
}
