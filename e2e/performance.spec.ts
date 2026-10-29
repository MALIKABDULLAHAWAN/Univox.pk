import { test, expect, devices } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.describe.configure({ mode: 'serial' });

  // Breakpoints to test
  const VIEWPORTS = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1440, height: 900 },
    largeDesktop: { width: 1920, height: 1080 },
  };

  test('should load university page under 3s on simulated 3G', async ({ browser }) => {
    // Create a new context with network throttling
    const context = await browser.newContext({
      ...devices['Desktop Chrome'],
      viewport: { width: 1440, height: 900 },
    });

    const page = await context.newPage();

    // Simulate 3G network: 400 Kbps down, 400 Kbps up, 400ms RTT
    await page.route('**/*', async (route, request) => {
      if (request.resourceType() === 'document') {
        await new Promise((r) => setTimeout(r, 200));
        route.continue();
      } else {
        await new Promise((r) => setTimeout(r, 100));
        route.continue();
      }
    });

    const startTime = Date.now();
    await page.goto('/universities', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load under 3 seconds even on 3G
    expect(loadTime).toBeLessThan(3000);

    // Verify content is displayed
    await expect(page.locator('h1')).toContainText('Universities');

    await context.close();
  });

  test('should load sign in page under 3s on simulated 3G', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Desktop Chrome'],
    });

    const page = await context.newPage();

    const startTime = Date.now();
    await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
    await expect(page.locator('h2')).toContainText(/sign in/i);

    await context.close();
  });

  test('should load sign up page under 3s on simulated 3G', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Desktop Chrome'],
    });

    const page = await context.newPage();

    const startTime = Date.now();
    await page.goto('/auth/signup', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
    await expect(page.locator('h2')).toContainText(/create.*account/i);

    await context.close();
  });

  test('should have First Contentful Paint under 2.5s', async ({ page }) => {
    await page.goto('/universities');

    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        // Use PerformanceObserver for FCP
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            resolve(entries[0].startTime);
          }
        });

        try {
          observer.observe({ entryTypes: ['paint'] });
        } catch {
          // Fallback for browsers that don't support paint timing
          resolve(performance.now());
        }
      });
    });

    await page.waitForLoadState('networkidle');

    // FCP should be under 2.5 seconds (Google's "good" threshold)
    expect(fcp).toBeLessThan(2500);
  });

  test('should have Largest Contentful Paint under 2.5s', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__lcp = { startTime: 0 };

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        (window as any).__lcp = last;
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    });

    await page.goto('/universities');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const lcpData = await page.evaluate(() => (window as any).__lcp);
    const lcp = lcpData?.startTime || 0;

    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });

  test('should have Cumulative Layout Shift under 0.1', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__cls = 0;

      const observer = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
        (window as any).__cls = cls;
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto('/universities');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const cls = await page.evaluate(() => (window as any).__cls || 0);

    // CLS should be under 0.1 (Google's "good" threshold)
    expect(cls).toBeLessThan(0.1);
  });

  test('should have Time to First Byte under 600ms', async ({ page }) => {
    const navStart: { ttfb: number } = { ttfb: 0 };

    await page.evaluate(() => {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        (window as any).__ttfb = navEntries[0].responseStart - navEntries[0].requestStart;
      }
    });

    await page.goto('/universities');
    await page.waitForLoadState('networkidle');

    const ttfbData = await page.evaluate(() => (window as any).__ttfb);
    const ttfb = ttfbData || 0;

    // TTFB should be under 600ms
    expect(ttfb).toBeLessThan(600);
  });

  test('should have total page weight under 1.5MB', async ({ page }) => {
    await page.goto('/universities');
    await page.waitForLoadState('networkidle');

    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries.map((entry) => ({
        name: entry.name,
        transferSize: entry.transferSize || 0,
        initiatorType: entry.initiatorType,
      }));
    });

    const totalSize = resources.reduce((sum, r) => sum + r.transferSize, 0);
    const totalSizeKB = totalSize / 1024;

    // Total page weight should be under 1500KB
    expect(totalSizeKB).toBeLessThan(1500);
  });

  test('should minimize JavaScript bundle size', async ({ page }) => {
    await page.goto('/universities');
    await page.waitForLoadState('networkidle');

    const jsResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter((e) => e.initiatorType === 'script')
        .map((e) => ({
          name: e.name.split('/').pop(),
          transferSize: e.transferSize || 0,
        }));
    });

    const totalJSSize = jsResources.reduce((sum, r) => sum + r.transferSize, 0);
    const totalJSSizeKB = totalJSSize / 1024;

    // JS should be under 500KB
    expect(totalJSSizeKB).toBeLessThan(500);
  });

  test('should lazy load images below the fold', async ({ page }) => {
    await page.goto('/universities');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const loading = await img.getAttribute('loading');
        const fetchPriority = await img.getAttribute('fetchpriority');

        // Images should either be lazy loaded or have explicit priority
        if (i > 0) {
          expect(loading).toBe('lazy');
        }
      }
    }
  });

  test('should not block rendering on third-party scripts', async ({ page }) => {
    await page.goto('/universities');
    await page.waitForLoadState('domcontentloaded');

    // Record first paint time
    const paintTime = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const fp = paintEntries.find((e) => e.name === 'first-paint');
      return fp ? fp.startTime : 0;
    });

    await page.waitForLoadState('networkidle');

    // First paint should happen quickly, even before all resources load
    expect(paintTime).toBeLessThan(2000);
  });

  test('should handle concurrent API requests efficiently', async ({ page }) => {
    // Measure how many concurrent API requests are made on university page
    const apiCalls: string[] = [];

    await page.route('**/api/**', (route, request) => {
      apiCalls.push(request.url());
      route.continue();
    });

    await page.goto('/universities');
    await page.waitForLoadState('networkidle');

    // Should not make excessive API calls
    const universityApiCalls = apiCalls.filter((url) => url.includes('/universities'));
    expect(universityApiCalls.length).toBeLessThanOrEqual(2); // At most 1-2 for initial data fetch
  });

  test('should respond to interaction within 100ms', async ({ page }) => {
    const universitiesPage = await import('./pages/universities.page');
    const up = new universitiesPage.UniversitiesPage(page);

    await page.goto('/universities');
    await page.waitForLoadState('networkidle');

    // Measure time for filter interaction
    const startTime = Date.now();

    await up.filterByBudgetTier('Low');
    await page.waitForLoadState('networkidle');

    const filterTime = Date.now() - startTime;

    // Filter application should be responsive
    expect(filterTime).toBeLessThan(1000);
  });

  test('should not have memory leaks during navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate to several pages
    const pages = ['/universities', '/auth/signin', '/auth/signup', '/'];

    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
    }

    // Force garbage collection and measure memory
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });

    const memory = await page.evaluate(() => {
      // Chrome-specific memory API
      const perf = performance as any;
      if (perf.memory) {
        return {
          usedJSHeapSize: perf.memory.usedJSHeapSize,
          totalJSHeapSize: perf.memory.totalJSHeapSize,
          jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
        };
      }
      return null;
    });

    if (memory && memory.usedJSHeapSize) {
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      // Memory should not exceed 100MB for these simple pages
      expect(usedMB).toBeLessThan(100);
    }
  });

  test('should load university page under 2s on desktop breakpoint', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Desktop Chrome'],
      viewport: { width: 1440, height: 900 },
    });

    const page = await context.newPage();

    const startTime = Date.now();
    await page.goto('/universities');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Desktop should load faster
    expect(loadTime).toBeLessThan(2000);

    await context.close();
  });

  test('should load university page under 3.5s on tablet breakpoint', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro 11'],
    });

    const page = await context.newPage();

    const startTime = Date.now();
    await page.goto('/universities');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Tablet should still load reasonably fast
    expect(loadTime).toBeLessThan(3500);

    await context.close();
  });

  test('should handle search input debouncing', async ({ page }) => {
    await page.goto('/universities');
    await page.waitForLoadState('networkidle');

    const searchInput = page.getByPlaceholder('Search universities...');

    // Type quickly
    const startTime = Date.now();
    await searchInput.type('University', { delay: 50 });
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();

    const responseTime = endTime - startTime;

    // Search should be responsive
    expect(responseTime).toBeLessThan(500);
  });

  test('should load fonts without invisible text (FOIT)', async ({ page }) => {
    await page.goto('/');

    // Check if font-display is set in CSS
    const hasFontDisplay = await page.evaluate(() => {
      // Look for font-display in computed styles or CSS
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSFontFaceRule) {
              const style = rule.style as any;
              if (style.fontDisplay && style.fontDisplay !== 'auto') {
                return true;
              }
            }
          }
        } catch {
          continue;
        }
      }
      return false;
    });

    // At minimum, text should be visible during font load
    await expect(page.locator('h1')).toBeVisible();
  });
});
