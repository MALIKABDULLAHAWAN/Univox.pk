import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page object for the University browsing page.
 * Handles university listing, search, filtering, and sorting.
 */
export class UniversitiesPage extends BasePage {
  // Main page elements
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly budgetTierSelect: Locator;
  readonly provinceSelect: Locator;
  readonly citySelect: Locator;
  readonly clearFiltersButton: Locator;
  readonly resultsCount: Locator;
  readonly universityGrid: Locator;
  readonly pagination: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly pageInfo: Locator;
  readonly rtlToggle: Locator;
  readonly skeletonLoader: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /universities/i });
    this.searchInput = page.getByPlaceholder('Search universities...');
    this.clearSearchButton = page.locator('[aria-label="Clear search"]');
    this.budgetTierSelect = page.locator('select').filter({ hasText: 'Budget' });
    this.provinceSelect = page.locator('select').filter({ hasText: 'Province' });
    this.citySelect = page.locator('select').filter({ hasText: 'City' });
    this.clearFiltersButton = page.getByRole('button', { name: /clear filters/i });
    this.resultsCount = page.locator('[data-testid="results-count"], text=/universities? (found|found)/i');
    this.universityGrid = page.locator('[data-testid="university-card"]');
    this.pagination = page.locator('[data-testid="pagination"], nav[aria-label*="pagination"]');
    this.previousPageButton = page.getByRole('button', { name: /previous/i });
    this.nextPageButton = page.getByRole('button', { name: /next/i });
    this.pageInfo = page.locator('text=/Page \\d+ of \\d+/i');
    this.rtlToggle = page.getByRole('button', { name: /rtl|ltr/i });
    this.skeletonLoader = page.locator('[data-testid="skeleton"]');
    this.emptyState = page.locator('text=/no universities found/i');
  }

  async goto(): Promise<void> {
    await this.page.goto('/universities');
    await this.waitForLoadState('networkidle');
  }

  async getUniversityCards(): Promise<Locator> {
    return this.universityGrid;
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async clearSearch(): Promise<void> {
    if (await this.clearSearchButton.isVisible()) {
      await this.clearSearchButton.click();
    } else {
      await this.searchInput.clear();
    }
  }

  async filterByBudgetTier(tier: 'Low' | 'Medium' | 'High'): Promise<void> {
    await this.budgetTierSelect.selectOption(tier);
  }

  async filterByProvince(province: string): Promise<void> {
    await this.provinceSelect.selectOption(province);
  }

  async filterByCity(city: string): Promise<void> {
    await this.citySelect.selectOption(city);
  }

  async clearAllFilters(): Promise<void> {
    if (await this.clearFiltersButton.isVisible()) {
      await this.clearFiltersButton.click();
    }
  }

  async goToNextPage(): Promise<void> {
    await this.nextPageButton.click();
  }

  async goToPreviousPage(): Promise<void> {
    await this.previousPageButton.click();
  }

  async getResultsCount(): Promise<number> {
    const text = await this.resultsCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async toggleRTL(): Promise<void> {
    await this.rtlToggle.click();
  }

  async verifyBudgetTierFilterApplied(): Promise<void> {
    await expect(this.budgetTierSelect).not.toHaveValue('All');
  }

  async verifyBudgetTierFilterCleared(): Promise<void> {
    await expect(this.budgetTierSelect).toHaveValue('All');
  }

  async getFilteredUniversityCards(tier: 'Low' | 'Medium' | 'High'): Promise<Locator> {
    const cards = this.universityGrid;
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const badge = cards.nth(i).locator('[data-testid="budget-badge"]');
      const badgeText = await badge.textContent();
      expect(badgeText).toContain(tier);
    }

    return cards;
  }
}
