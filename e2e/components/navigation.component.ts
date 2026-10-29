import { Page, Locator, expect } from '@playwright/test';

/**
 * Component object for navigation/drawer menu.
 * Handles mobile drawer navigation, desktop nav, and language toggle.
 */
export class NavigationComponent {
  readonly page: Page;

  // Mobile drawer elements
  readonly mobileMenuButton: Locator;
  readonly drawer: Locator;
  readonly drawerCloseButton: Locator;
  readonly drawerOverlay: Locator;

  // Desktop nav elements
  readonly desktopNav: Locator;
  readonly navLinks: Locator;

  // Language / theme elements
  readonly languageToggle: Locator;
  readonly darkModeToggle: Locator;

  // Brand / logo
  readonly brandLogo: Locator;
  readonly homeLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Mobile drawer
    this.mobileMenuButton = page.getByRole('button', { name: /menu|open menu/i });
    this.drawer = page.getByRole('dialog', { name: /menu|navigation/i });
    this.drawerCloseButton = page.getByRole('button', { name: /close/i });
    this.drawerOverlay = page.locator('.fixed.inset-0.bg-black');

    // Desktop nav
    this.desktopNav = page.getByRole('navigation');
    this.navLinks = this.desktopNav.getByRole('link');

    // Theme
    this.darkModeToggle = page.getByRole('button', { name: /dark|light|theme|moon|sun/i });
    this.languageToggle = page.getByRole('button', { name: /lang|urdu|english/i });

    // Brand
    this.brandLogo = page.getByRole('link', { name: /univox/i });
    this.homeLink = page.getByRole('link', { name: /home/i });
  }

  async openDrawer(): Promise<void> {
    await this.mobileMenuButton.click();
    await expect(this.drawer).toBeVisible();
  }

  async closeDrawer(): Promise<void> {
    await this.drawerCloseButton.click();
    await expect(this.drawer).toBeHidden();
  }

  async closeDrawerWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(this.drawer).toBeHidden();
  }

  async closeDrawerByOverlay(): Promise<void> {
    await this.drawerOverlay.click();
    await expect(this.drawer).toBeHidden();
  }

  async navigateViaDrawer(linkName: string): Promise<void> {
    await this.openDrawer();
    await this.drawer.getByRole('link', { name: new RegExp(linkName, 'i') }).click();
  }

  async toggleDarkMode(): Promise<void> {
    if (await this.darkModeToggle.isVisible()) {
      await this.darkModeToggle.click();
    }
  }

  async isDarkMode(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.classList.contains('dark'));
  }

  async switchLanguage(lang: 'ur' | 'en'): Promise<void> {
    if (await this.languageToggle.isVisible()) {
      await this.languageToggle.click();
    }
  }

  async getNavLinksCount(): Promise<number> {
    return this.navLinks.count();
  }

  async isDrawerOpen(): Promise<boolean> {
    return this.drawer.isVisible();
  }
}
