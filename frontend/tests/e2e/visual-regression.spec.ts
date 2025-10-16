import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should match homepage screenshot in light mode', async ({ page }) => {
    // Ensure light mode
    const html = page.locator('html');
    const hasDark = await html.evaluate((el) => el.classList.contains('dark'));

    if (hasDark) {
      await page.locator('button[aria-label*="theme"]').click();
      await page.waitForTimeout(300);
    }

    // Take screenshot
    await expect(page).toHaveScreenshot('homepage-light.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should match homepage screenshot in dark mode', async ({ page }) => {
    // Ensure dark mode
    const html = page.locator('html');
    const hasDark = await html.evaluate((el) => el.classList.contains('dark'));

    if (!hasDark) {
      await page.locator('button[aria-label*="theme"]').click();
      await page.waitForTimeout(300);
    }

    // Take screenshot
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should match results view screenshot', async ({ page }) => {
    // Mock API response
    await page.route('**/api/analyze', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          classification: 'Likely AI Slop',
          confidence_score: 85,
          patterns_detected: [
            {
              patternId: 'collaborative-phrases',
              patternName: 'Collaborative Phrases',
              severity: 'HIGH',
              count: 3,
              matches: [
                { text: 'I hope this helps', position: 10 },
                { text: 'let me know if', position: 50 },
                { text: 'would you like', position: 90 },
              ],
            },
            {
              patternId: 'significance-statements',
              patternName: 'Significance Statements',
              severity: 'MEDIUM',
              count: 2,
              matches: [
                { text: 'profound impact', position: 120 },
                { text: 'rich tapestry', position: 180 },
              ],
            },
          ],
          explanation: 'This text shows strong indicators of AI generation with multiple collaborative phrases and significance statements.',
          metadata: {
            character_count: 500,
            word_count: 100,
            pattern_engine_version: '1.3.0',
            analysis_duration: 35,
            timestamp: new Date().toISOString(),
            warnings: [],
          },
        }),
      });
    });

    // Fill textarea and analyze
    const textarea = page.locator('textarea#text-input');
    await textarea.fill('A'.repeat(200));
    await page.locator('button:has-text("Analyze Text")').click();

    // Wait for results
    await page.waitForSelector('text="Analysis Results"');

    // Take screenshot
    await expect(page).toHaveScreenshot('results-view.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });

    // Cleanup
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('should match mobile viewport screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should match error state screenshot', async ({ page }) => {
    // Mock API error
    await page.route('**/api/analyze', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    // Fill textarea and analyze
    const textarea = page.locator('textarea#text-input');
    await textarea.fill('A'.repeat(200));
    await page.locator('button:has-text("Analyze Text")').click();

    // Wait for error
    await page.waitForSelector('text="Error"');

    // Take screenshot
    await expect(page).toHaveScreenshot('error-state.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });

    // Cleanup
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('should match input focus states', async ({ page }) => {
    const textarea = page.locator('textarea#text-input');
    await textarea.click();

    // Screenshot with focused textarea
    await expect(page.locator('form')).toHaveScreenshot('textarea-focused.png', {
      maxDiffPixels: 50,
    });
  });

  test('should match theme toggle button states', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="theme"]');

    // Screenshot in light mode
    await expect(themeButton).toHaveScreenshot('theme-toggle-light.png', {
      maxDiffPixels: 10,
    });

    // Toggle to dark mode
    await themeButton.click();
    await page.waitForTimeout(300);

    // Screenshot in dark mode
    await expect(themeButton).toHaveScreenshot('theme-toggle-dark.png', {
      maxDiffPixels: 10,
    });
  });
});
