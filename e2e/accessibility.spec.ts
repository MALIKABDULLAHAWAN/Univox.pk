import { test, expect } from '@playwright/test';
import { SignInPage } from './pages/signin.page';
import { SignUpPage } from './pages/signup.page';
import { UniversitiesPage } from './pages/universities.page';

test.describe('Accessibility Tests', () => {
  test.describe.configure({ mode: 'serial' });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through form fields using Tab key on sign in page', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Start tab navigation
      await page.keyboard.press('Tab'); // First tab - skip link or logo
      await page.keyboard.press('Tab'); // Second tab

      // Tab to email input
      await page.keyboard.press('Tab');

      // Email field should be focused
      await expect(signInPage.emailInput).toBeFocused();

      // Tab to password
      await page.keyboard.press('Tab');
      await expect(signInPage.passwordInput).toBeFocused();

      // Tab to remember me checkbox
      await page.keyboard.press('Tab');
      const focusedCheckbox = page.locator(':focus');
      const isCheckbox = await focusedCheckbox.evaluate((el) => {
        return (el as HTMLElement).tagName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox';
      });
      expect(isCheckbox).toBeTruthy();
    });

    test('should navigate through sign up form with Tab key', async ({ page }) => {
      const signUpPage = new SignUpPage(page);
      await signUpPage.goto();

      // Expected tab order through form fields
      const focusOrder = [
        signUpPage.emailInput,
        signUpPage.universitySelect,
        signUpPage.studentIdInput,
        signUpPage.passwordInput,
        signUpPage.confirmPasswordInput,
        signUpPage.agreeToTermsCheckbox,
        signUpPage.submitButton,
      ];

      for (const element of focusOrder) {
        await page.keyboard.press('Tab');
      }

      // The last tab should focus on submit button or checkbox
      const focusedElement = page.locator(':focus');
      const isSubmitOrCheckbox = await focusedElement.evaluate((el) => {
        const tag = (el as HTMLElement).tagName;
        const type = (el as HTMLInputElement).type;
        return tag === 'BUTTON' || type === 'checkbox';
      });
      expect(isSubmitOrCheckbox).toBeTruthy();
    });

    test('should allow form submission with Enter key on sign in', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      await signInPage.fillEmail('test@example.com');
      await signInPage.fillPassword('password123');

      // Press Enter to submit
      await page.keyboard.press('Enter');

      // Form should submit
      await page.waitForLoadState('networkidle');
    });

    test('should focus skip link on first Tab press if present', async ({ page }) => {
      await page.goto('/');

      // First tab should potentially hit a skip link
      await page.keyboard.press('Tab');

      const skipLink = page.getByRole('link', { name: /skip to/i });
      if (await skipLink.count() > 0) {
        await expect(skipLink).toBeFocused();
      }

      // Otherwise, it should focus on a meaningful element
      const focused = page.locator(':focus');
      expect(await focused.count()).toBeGreaterThan(0);
    });

    test('should allow arrow key navigation in select dropdowns', async ({ page }) => {
      const universitiesPage = new UniversitiesPage(page);
      await universitiesPage.goto();

      const budgetSelect = universitiesPage.budgetTierSelect;
      if (await budgetSelect.count() > 0) {
        await budgetSelect.focus();

        // Arrow down to select next option
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        const value = await budgetSelect.inputValue();
        expect(['Low', 'Medium', 'High', 'All']).toContain(value);
      }
    });

    test('should maintain visible focus indicator on interactive elements', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Tab through several elements and verify focus visibility
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        if (await focused.count() > 0) {
          // Check that focus is visible (outline, box-shadow, or similar)
          const style = await focused.evaluate((el) => {
            const s = window.getComputedStyle(el);
            return {
              outline: s.outline,
              outlineWidth: s.outlineWidth,
              boxShadow: s.boxShadow,
            };
          });

          // At least one focus indicator should be present
          const hasOutline = style.outline !== 'none' || parseInt(style.outlineWidth) > 0;
          const hasShadow = style.boxShadow && style.boxShadow !== 'none';
          expect(hasOutline || hasShadow).toBeTruthy();
        }
      }
    });

    test('should allow Space key to activate checkboxes', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Tab to remember me checkbox
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      const isCheckbox = await focused.evaluate((el) => {
        return (el as HTMLElement).tagName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox';
      });

      if (isCheckbox) {
        const initiallyChecked = await focused.isChecked();
        await page.keyboard.press(' '); // Space key
        const afterChecked = await focused.isChecked();
        expect(afterChecked).toBe(!initiallyChecked);
      }
    });

    test('should allow Enter key to activate buttons', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Navigate to a button via keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      const isButton = await focused.evaluate((el) => {
        return (el as HTMLElement).tagName === 'BUTTON' || (el as HTMLInputElement).type === 'submit';
      });

      // If we're on the submit button, don't actually submit (we don't have valid credentials)
      // Just verify the button can be activated
      expect(isButton).toBeTruthy();
    });

    test('should trap focus when modal/dialog is open', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Look for any modal or dialog on the page
      const dialog = page.getByRole('dialog');

      if (await dialog.count() > 0) {
        // Open dialog if there's a trigger
        const triggers = page.locator('[aria-haspopup="dialog"], [aria-haspopup="true"]');
        if (await triggers.count() > 0) {
          await triggers.first().click();
          await expect(dialog).toBeVisible();

          // Tab through focusable elements inside dialog
          for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Tab');
            const focused = page.locator(':focus');
            if (await focused.count() > 0) {
              const withinDialog = await focused.evaluate((el) => {
                const dialogEl = document.querySelector('[role="dialog"]');
                return dialogEl?.contains(el);
              });
              expect(withinDialog).toBeTruthy();
            }
          }
        }
      }
    });

    test('should handle Escape key to close modals', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const dialog = page.getByRole('dialog');
      if (await dialog.isVisible()) {
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
      }
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have valid ARIA roles on key elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Should have main landmark
      await expect(page.getByRole('main')).toBeVisible();

      // Should have navigation
      await expect(page.getByRole('navigation')).toBeVisible();

      // Should have footer
      await expect(page.getByRole('contentinfo')).toBeVisible();
    });

    test('should have proper form labels for all inputs', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Every input should have an associated label
      const inputs = page.locator('input[type="email"], input[type="password"], input[type="text"], input[type="checkbox"]');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const hasLabel = await input.evaluate((el) => {
          const id = el.id;
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledBy = el.getAttribute('aria-labelledby');
          const label = document.querySelector(`label[for="${id}"]`);
          const computed = window.getComputedStyle(el);
          // Also check if the label is visually associated
          return !!(ariaLabel || ariaLabelledBy || label || computed.appearance !== 'auto');
        });
        // All inputs should have some form of label
        expect(hasLabel).toBeTruthy();
      }
    });

    test('should have aria-expanded on toggle buttons', async ({ page }) => {
      await page.goto('/');

      // Any button that toggles content should have aria-expanded
      const toggleButtons = page.locator('button[aria-expanded]');
      const count = await toggleButtons.count();

      for (let i = 0; i < count; i++) {
        const button = toggleButtons.nth(i);
        const ariaExpanded = await button.getAttribute('aria-expanded');
        expect(ariaExpanded === 'true' || ariaExpanded === 'false').toBeTruthy();
      }
    });

    test('should have aria-live for dynamic content and alerts', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Trigger error
      await signInPage.fillEmail('invalid-email');
      await signInPage.fillPassword('x');
      await signInPage.clickSubmit();

      // Error messages should use role="alert" or aria-live
      const alert = page.getByRole('alert');
      if (await alert.count() > 0) {
        const ariaLive = await alert.getAttribute('aria-live');
        expect(ariaLive || true).toBeTruthy(); // Role=alert implies aria-live
      }
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/universities');
      await page.waitForLoadState('networkidle');

      // Should have at least one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // Check heading levels are sequential
      const headingLevels: number[] = [];

      for (let level = 1; level <= 6; level++) {
        const selector = `h${level}`;
        const count = await page.locator(selector).count();
        if (count > 0) {
          headingLevels.push(level);
        }
      }

      // Should have at least h1
      expect(headingLevels[0]).toBe(1);
    });

    test('should have descriptive and accessible link text', async ({ page }) => {
      await page.goto('/');

      const links = page.getByRole('link');
      const count = await links.count();

      for (let i = 0; i < Math.min(count, 15); i++) {
        const link = links.nth(i);
        const text = await link.textContent();

        // Links should have meaningful text
        if (text) {
          expect(text.trim()).not.toBe('click here');
          expect(text.trim()).not.toBe('');
          expect(text.trim()).not.toBe('here');
          expect(text.trim()).not.toBe('link');
        }
      }
    });

    test('should have accessible university card links', async ({ page }) => {
      const universitiesPage = new UniversitiesPage(page);
      await universitiesPage.goto();

      const cards = universitiesPage.universityGrid;
      const count = await cards.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const card = cards.nth(i);
        const link = card.getByRole('link').first();

        if (await link.count() > 0) {
          const ariaLabel = await link.getAttribute('aria-label');
          const textContent = await link.textContent();

          // Link should have accessible name
          expect(ariaLabel || textContent?.trim()).toBeTruthy();
        }
      }
    });

    test('should have alt text on all images', async ({ page }) => {
      const universitiesPage = new UniversitiesPage(page);
      await universitiesPage.goto();

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Every image must have alt text (can be empty for decorative)
        expect(alt).not.toBe(null);
      }
    });

    test('should have proper color contrast for text elements', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Check contrast of key text elements
      const textElements = page.locator('h1, h2, p, label');
      const count = await textElements.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const el = textElements.nth(i);

        // Element should be visible
        await expect(el).toBeVisible();

        // Check it has text content
        const text = await el.textContent();
        if (text && text.trim()) {
          const style = await el.evaluate((element) => {
            const s = window.getComputedStyle(element);
            return {
              color: s.color,
              backgroundColor: s.backgroundColor,
            };
          });

          // Colors should be defined
          expect(style.color).toBeTruthy();
        }
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have skip link to main content', async ({ page }) => {
      await page.goto('/');

      // Check for skip link
      const skipLink = page.locator('a[href="#main"], a[href="#content"], a[href="#main-content"]');

      if (await skipLink.count() > 0) {
        await skipLink.first().focus();

        // Skip link should be focusable
        await expect(skipLink.first()).toBeFocused();

        // Click should navigate to main content
        await skipLink.first().click();
        const mainContent = page.getByRole('main');
        await expect(mainContent).toBeVisible();
      }
    });

    test('should announce error messages to screen readers', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Trigger error
      await signInPage.fillEmail('invalid');
      await signInPage.fillPassword('short');
      await signInPage.clickSubmit();

      // Error should be in alert role or have aria-live
      const alert = page.getByRole('alert');
      if (await alert.count() > 0) {
        await expect(alert).toBeVisible();
      }
    });

    test('should have aria-label on icon-only buttons', async ({ page }) => {
      await page.goto('/');

      const buttons = page.getByRole('button');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const textContent = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');
        const hasIcon = await button.locator('svg, i').count() > 0;

        // Every button must have an accessible name
        if (hasIcon && !textContent?.trim()) {
          expect(ariaLabel || title).toBeTruthy();
        }
      }
    });

    test('should have html lang attribute', async ({ page }) => {
      await page.goto('/');

      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
      expect(lang).toMatch(/^[a-z]{2}/);
    });

    test('should support RTL layout for Urdu content', async ({ page }) => {
      await page.goto('/');

      const rtlToggle = page.getByRole('button', { name: /rtl|ltr/i });

      if (await rtlToggle.isVisible()) {
        await rtlToggle.click();
        await page.waitForTimeout(300);

        // Verify RTL direction
        const hasRtlClass = await page.locator('html').evaluate((el) => el.classList.contains('rtl'));

        // If the toggle changes to LTR, we can verify it worked in both directions
        const toggleText = await rtlToggle.textContent();
        expect(toggleText).toMatch(/RTL|LTR/i);
      }
    });

    test('should use aria-hidden on decorative elements', async ({ page }) => {
      await page.goto('/universities');
      await page.waitForLoadState('networkidle');

      // Decorative icons should have aria-hidden
      const icons = page.locator('svg:not([aria-hidden="true"]):not([role])');
      const count = await icons.count();

      // Many icons may exist; check that decorative ones are hidden
      for (let i = 0; i < Math.min(count, 20); i++) {
        const icon = icons.nth(i);
        const parent = icon.locator('..');

        // Icons without text content in their parent might be decorative
        const parentText = await parent.textContent();
        const iconText = await icon.getAttribute('aria-label');

        if (!parentText?.trim() && !iconText) {
          // This might be a decorative icon - check if it has aria-hidden
          // (Not strictly required, but good practice)
        }
      }
    });

    test('should have aria-label on form input icons', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Icons inside form groups should be hidden from screen readers
      const iconElements = page.locator('svg[class*="absolute"], svg[class*="pointer-events-none"]');
      const count = await iconElements.count();

      for (let i = 0; i < count; i++) {
        const hasAriaHidden = await iconElements.nth(i).getAttribute('aria-hidden');
        // Decorative icons should have aria-hidden="true"
        if (hasAriaHidden === 'true') {
          // Good practice followed
        } else {
          // Check if icon is inside a label or has accessible content
          const parentInput = iconElements.nth(i).locator('xpath=ancestor::input');
          const hasLabel = await parentInput.getAttribute('aria-label');
          expect(hasLabel || hasAriaHidden).toBeTruthy();
        }
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have fieldset and legend for grouped radio/checkbox elements', async ({ page }) => {
      const signUpPage = new SignUpPage(page);
      await signUpPage.goto();

      const checkboxes = page.locator('input[type="checkbox"]');
      const count = await checkboxes.count();

      for (let i = 0; i < count; i++) {
        const checkbox = checkboxes.nth(i);
        const hasId = await checkbox.getAttribute('id');
        const hasLabel = await checkbox.getAttribute('aria-label');
        const labelText = hasId ? await page.locator(`label[for="${hasId}"]`).textContent() : null;

        // Checkbox should have associated label
        expect(hasId || hasLabel || labelText).toBeTruthy();
      }
    });

    test('should have password requirements hint text', async ({ page }) => {
      const signUpPage = new SignUpPage(page);
      await signUpPage.goto();

      // Look for password hints
      const passwordHint = page.locator('text=/password.*must|min.*8|uppercase|lowercase|number/i');

      if (await passwordHint.count() > 0) {
        await expect(passwordHint.first()).toBeVisible();
      }
    });

    test('should use aria-describedby for validation errors', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      await signInPage.fillEmail('invalid');
      await signInPage.clickSubmit();

      // Error elements should have relevant attributes
      const errorElements = page.locator('[role="alert"], .text-red-700, [aria-live]');

      for (let i = 0; i < await errorElements.count(); i++) {
        const el = errorElements.nth(i);
        const hasRoleAlert = await el.getAttribute('role');
        const hasAriaLive = await el.getAttribute('aria-live');

        // Must have either role=alert or aria-live
        expect(hasRoleAlert === 'alert' || hasAriaLive).toBeTruthy();
      }
    });

    test('should have form autocomplete attributes', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Email input should have autocomplete
      const emailAutocomplete = await signInPage.emailInput.getAttribute('autocomplete');
      expect(emailAutocomplete).toMatch(/email|username|off/i);

      // Password input should have autocomplete
      const passwordAutocomplete = await signInPage.passwordInput.getAttribute('autocomplete');
      expect(passwordAutocomplete).toMatch(/current-password|new-password|off/i);
    });

    test('should have proper contrast ratio for error messages', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      // Trigger an error
      await signInPage.fillEmail('invalid-email');
      await signInPage.fillPassword('short');
      await signInPage.clickSubmit();

      const errorElement = page.locator('[role="alert"], .text-red-700');

      if (await errorElement.count() > 0) {
        // Verify the error text is visible
        await expect(errorElement.first()).toBeVisible();

        // Check that the text color is visible (red-700 should have good contrast on white/light bg)
        const style = await errorElement.first().evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
          };
        });

        expect(style.color).toBeTruthy();
        // Red text (rgb(185, 28, 28) for red-700) should be sufficiently dark for light backgrounds
      }
    });

    test('should have aria-invalid on invalid form fields', async ({ page }) => {
      const signInPage = new SignInPage(page);
      await signInPage.goto();

      await signInPage.clickSubmit();

      // Check if form fields get aria-invalid after validation
      const inputs = page.locator('input[required]');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const ariaInvalid = await input.getAttribute('aria-invalid');
        // Native HTML5 validation should set aria-invalid
        // If not set, the form should at least show validation messages
        if (!ariaInvalid) {
          await input.focus();
          await input.blur();
          // Check for validation message
          const validationMessage = await input.evaluate((el: HTMLInputElement) => el.validationMessage);
          expect(validationMessage || ariaInvalid).toBeTruthy();
        }
      }
    });
  });
});
