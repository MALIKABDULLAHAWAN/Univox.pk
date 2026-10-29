import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page object for the University detail page with review submission form.
 * Handles university details display and review creation.
 */
export class ReviewPage extends BasePage {
  // University detail elements
  readonly universityTitle: Locator;
  readonly universityLocation: Locator;
  readonly universityBudgetBadge: Locator;
  readonly universityTuitionFee: Locator;
  readonly universityRating: Locator;
  readonly writeReviewButton: Locator;

  // Review form elements
  readonly reviewForm: Locator;
  readonly overallRating: Locator;
  readonly starRating: Locator;
  readonly teachingRating: Locator;
  readonly clarityRating: Locator;
  readonly engagementRating: Locator;
  readonly workloadRating: Locator;
  readonly difficultyRating: Locator;
  readonly commentTextarea: Locator;
  readonly anonymousToggle: Locator;
  readonly submitReviewButton: Locator;
  readonly cancelButton: Locator;
  readonly formErrorMessage: Locator;
  readonly formSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);

    // University detail
    this.universityTitle = page.locator('h1');
    this.universityLocation = page.locator('[data-testid="university-location"]');
    this.universityBudgetBadge = page.locator('[data-testid="budget-badge"]');
    this.universityTuitionFee = page.locator('[data-testid="tuition-fee"]');
    this.universityRating = page.locator('[data-testid="rating"]');
    this.writeReviewButton = page.getByRole('button', { name: /write review/i });

    // Review form elements
    this.reviewForm = page.locator('form');
    this.overallRating = page.getByLabel(/overall rating/i);
    this.starRating = page.locator('[role="radiogroup"][aria-label*="star"], [data-testid="rating-input"] input[type="range"], .rating-selector');
    this.teachingRating = page.getByLabel(/teaching/i);
    this.clarityRating = page.getByLabel(/clarity/i);
    this.engagementRating = page.getByLabel(/engagement/i);
    this.workloadRating = page.getByLabel(/workload/i);
    this.difficultyRating = page.getByLabel(/difficulty/i);
    this.commentTextarea = page.getByLabel(/comment|review|feedback/i);
    this.anonymousToggle = page.getByLabel(/anonymous/i);
    this.submitReviewButton = page.getByRole('button', { name: /submit review/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.formErrorMessage = page.locator('[role="alert"], .text-red-700');
    this.formSuccessMessage = page.locator('[role="alert"], .text-green-800, text=/success|submitted/i');
  }

  async goto(): Promise<void> {
    await this.page.goto('/universities');
    await this.waitForLoadState('networkidle');
    // Navigate to first university if available
    const firstCard = this.page.locator('[data-testid="university-card"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.getByRole('link').first().click().catch(() => firstCard.click());
      await this.waitForLoadState('networkidle');
    }
  }

  async gotoUniversity(slug: string): Promise<void> {
    await this.page.goto(`/universities/${slug}`);
    await this.waitForLoadState('networkidle');
  }

  async clickWriteReview(): Promise<void> {
    await this.writeReviewButton.click();
    await expect(this.reviewForm).toBeVisible();
  }

  async setStarRating(rating: number): Promise<void> {
    const stars = this.page.locator('[data-testid="star-rating"] input[type="radio"], [data-testid="rating-input"] [role="radio"]');
    if (await stars.count() > 0) {
      await stars.nth(rating - 1).click();
    } else {
      // Fallback for range input
      const range = this.page.locator('[data-testid="rating-input"] input[type="range"]');
      if (await range.count() > 0) {
        await range.fill(String(rating));
      }
    }
  }

  async setOverallRating(rating: number): Promise<void> {
    await this.overallRating.fill(String(rating));
  }

  async setSubRating(field: string, rating: number): Promise<void> {
    const fieldMap: Record<string, Locator> = {
      teaching: this.teachingRating,
      clarity: this.clarityRating,
      engagement: this.engagementRating,
      workload: this.workloadRating,
      difficulty: this.difficultyRating,
    };
    const locator = fieldMap[field];
    if (locator) {
      await locator.fill(String(rating));
    }
  }

  async fillComment(text: string): Promise<void> {
    await this.commentTextarea.fill(text);
  }

  async toggleAnonymous(): Promise<void> {
    await this.anonymousToggle.check();
  }

  async submitReview(): Promise<void> {
    await this.submitReviewButton.click();
  }

  async cancelReview(): Promise<void> {
    await this.cancelButton.click();
  }

  async submitCompleteReview(data: {
    overallRating: number;
    comment: string;
    anonymous?: boolean;
    teaching?: number;
    clarity?: number;
    engagement?: number;
    workload?: number;
    difficulty?: number;
  }): Promise<void> {
    await this.setStarRating(data.overallRating);
    await this.fillComment(data.comment);

    if (data.anonymous) {
      await this.toggleAnonymous();
    }

    if (data.teaching) await this.setSubRating('teaching', data.teaching);
    if (data.clarity) await this.setSubRating('clarity', data.clarity);
    if (data.engagement) await this.setSubRating('engagement', data.engagement);
    if (data.workload) await this.setSubRating('workload', data.workload);
    if (data.difficulty) await this.setSubRating('difficulty', data.difficulty);

    await this.submitReview();
  }

  async expectValidationError(message: string): Promise<void> {
    await expect(this.formErrorMessage).toBeVisible();
    await expect(this.formErrorMessage).toContainText(message);
  }

  async expectSuccessMessage(message: string): Promise<void> {
    await expect(this.formSuccessMessage).toBeVisible();
    await expect(this.formSuccessMessage).toContainText(message);
  }

  async isFormVisible(): Promise<boolean> {
    return this.reviewForm.isVisible();
  }

  async isAnonymousChecked(): Promise<boolean> {
    return this.anonymousToggle.isChecked();
  }
}
