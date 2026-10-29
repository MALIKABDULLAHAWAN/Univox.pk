import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page object for the Dashboard page.
 * Handles user stats display, navigation, and sign out.
 */
export class DashboardPage extends BasePage {
  readonly header: Locator;
  readonly userName: Locator;
  readonly userEmail: Locator;
  readonly userUniversity: Locator;
  readonly credibilityScore: Locator;
  readonly reviewsCount: Locator;
  readonly messagesCount: Locator;
  readonly recentActivity: Locator;
  readonly signOutButton: Locator;
  readonly backToHomeLink: Locator;
  readonly editProfileButton: Locator;
  readonly changePasswordButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.locator('header');
    this.userName = page.locator('h1');
    this.userEmail = page.locator('text=/@.*\\.edu\\.pk|@example\\.com/i');
    this.userUniversity = page.getByText(/university:/i);
    this.credibilityScore = page.locator('text=/credibility/i').locator('..').locator('..');
    this.reviewsCount = page.locator('text=/reviews/i').locator('..').locator('..');
    this.messagesCount = page.locator('text=/messages/i').locator('..').locator('..');
    this.recentActivity = page.locator('text=/recent activity/i');
    this.signOutButton = page.getByRole('button', { name: /log (out|out)/i });
    this.backToHomeLink = page.getByRole('link', { name: /back to home/i });
    this.editProfileButton = page.getByRole('button', { name: /edit profile/i });
    this.changePasswordButton = page.getByRole('button', { name: /change password/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.waitForLoadState('networkidle');
  }

  async getUserId(): Promise<string> {
    const href = await this.header.locator('a').first().getAttribute('href');
    return href || '';
  }

  async signOut(): Promise<void> {
    await this.signOutButton.click();
    await this.waitForLoadState('networkidle');
  }

  async getCredibilityScore(): Promise<string> {
    const text = await this.credibilityScore.textContent();
    const match = text?.match(/[\d.]+/);
    return match ? match[0] : '';
  }

  async getReviewsCount(): Promise<number> {
    const text = await this.reviewsCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
