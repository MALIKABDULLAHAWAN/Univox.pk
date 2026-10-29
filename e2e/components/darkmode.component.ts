import { Page, Locator, expect } from '@playwright/test';

/**
 * Component object for dark/light mode functionality.
 * Handles theme toggling and color contrast verification.
 */
export class DarkModeComponent {
  readonly page: Page;
  readonly themeToggle: Locator;
  readonly sunIcon: Locator;
  readonly moonIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.themeToggle = page.getByRole('button', { name: /dark|light|theme|moon|sun/i });
    this.sunIcon = page.locator('svg.lucide-sun, svg.h-6.w-6.text-yellow-400');
    this.moonIcon = page.locator('svg.lucide-moon, svg.h-6.w-6.text-gray-700');
  }

  async toggleTheme(): Promise<void> {
    if (await this.themeToggle.isVisible()) {
      await this.themeToggle.click();
    }
  }

  async setTheme(dark: boolean): Promise<void> {
    const isCurrentlyDark = await this.page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (dark !== isCurrentlyDark) {
      await this.toggleTheme();
    }
  }

  async isDarkMode(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.classList.contains('dark'));
  }

  async isLightMode(): Promise<boolean> {
    return !await this.isDarkMode();
  }

  async verifyContrast(element: Locator): Promise<void> {
    const isDark = await this.isDarkMode();
    const bgColor = await element.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    const textColor = await element.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.color;
    });

    // Verify text is visible against background
    expect(bgColor).not.toBe(textColor);
  }

  async getCSSVariable(name: string): Promise<string> {
    return this.page.evaluate((varName) => {
      return getComputedStyle(document.documentElement).getPropertyValue(varName);
    }, `--${name}`);
  }
}
