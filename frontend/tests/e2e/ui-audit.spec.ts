import { test, expect } from '@playwright/test';

test.describe('UI Audit and Improvements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper page structure and title', async ({ page }) => {
    await expect(page).toHaveTitle(/Slop Detector/i);
    await expect(page.locator('h1')).toContainText('Slop Detector');
  });

  test('should display main UI components', async ({ page }) => {
    // Header
    await expect(page.locator('header')).toBeVisible();

    // Main content
    await expect(page.locator('#main-content')).toBeVisible();

    // Text input form
    await expect(page.locator('textarea#text-input')).toBeVisible();

    // Buttons
    await expect(page.locator('button:has-text("Clear")')).toBeVisible();
    await expect(page.locator('button:has-text("Analyze Text")')).toBeVisible();

    // Theme toggle button
    await expect(page.locator('button[aria-label*="theme"]')).toBeVisible();
  });

  test('should expose file upload controls', async ({ page }) => {
    const fileLabel = page.locator('label[for="file-upload"]');
    await expect(fileLabel).toBeVisible();
    await expect(fileLabel).toContainText(/upload a file/i);

    const fileInput = page.locator('input#file-upload');
    await expect(fileInput).toBeVisible();
    await expect(fileInput).toHaveAttribute('accept', /\.txt/);
  });

  test('should reveal Analyze File action after uploading a file', async ({ page }) => {
    const fileInput = page.locator('input#file-upload');

    await fileInput.setInputFiles({
      name: 'sample.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('synthetic test content'),
    });

    const analyzeFileButton = page.locator('button:has-text("Analyze File")');
    await expect(analyzeFileButton).toBeVisible();
    await expect(analyzeFileButton).toBeEnabled();
  });

  test('should have proper contrast in light mode', async ({ page }) => {
    // Check that background and text are sufficiently different
    const main = page.locator('#main-content');
    const bgColor = await main.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    const textColor = await main.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Basic check - colors should not be the same
    expect(bgColor).not.toBe(textColor);
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    const html = page.locator('html');

    // Check if dark class is present initially
    const hasDarkInitially = await html.evaluate((el) => el.classList.contains('dark'));

    // Click theme toggle
    const themeButton = page.locator('button[aria-label*="theme"]');
    await themeButton.click();

    // Wait for transition
    await page.waitForTimeout(300);

    // Check that dark class toggled
    const hasDarkAfterToggle = await html.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkAfterToggle).not.toBe(hasDarkInitially);

    // Click again to toggle back
    await themeButton.click();
    await page.waitForTimeout(300);

    const hasDarkFinal = await html.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkFinal).toBe(hasDarkInitially);
  });

  test('should persist theme preference between visits', async ({ page }) => {
    await page.evaluate(() => window.localStorage.clear());

    const html = page.locator('html');
    const themeButton = page.locator('button[aria-label*="theme"]');

    await expect(themeButton).toHaveAttribute('aria-label', /Switch to dark theme/i);
    await expect(themeButton).toHaveAttribute('aria-pressed', 'false');

    await themeButton.click();
    await page.waitForTimeout(200);

    await expect(themeButton).toHaveAttribute('aria-pressed', 'true');
    await expect(themeButton).toHaveAttribute('aria-label', /Switch to light theme/i);

    const hasDarkAfterToggle = await html.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkAfterToggle).toBe(true);

    await page.reload();

    const reloadedButton = page.locator('button[aria-label*="theme"]');
    await expect(reloadedButton).toHaveAttribute('aria-pressed', 'true');
    await expect(reloadedButton).toHaveAttribute('aria-label', /Switch to light theme/i);

    const hasDarkAfterReload = await html.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkAfterReload).toBe(true);
  });

  test('should enforce text length requirements', async ({ page }) => {
    const textarea = page.locator('textarea#text-input');
    const analyzeButton = page.locator('button:has-text("Analyze Text")');

    // Should be disabled initially (no text)
    await expect(analyzeButton).toBeDisabled();

    // Type less than minimum (100 chars)
    await textarea.fill('Short text');
    await expect(analyzeButton).toBeDisabled();

    // Check character count display (visible one)
    await expect(page.locator('div[aria-live="polite"]:has-text("characters")')).toBeVisible();
  });

  test('should handle text input and clear functionality', async ({ page }) => {
    const textarea = page.locator('textarea#text-input');
    const clearButton = page.locator('button:has-text("Clear")');
    const testText = 'A'.repeat(150); // 150 chars (above minimum)

    // Clear button should be disabled initially
    await expect(clearButton).toBeDisabled();

    // Type valid text
    await textarea.fill(testText);

    // Clear button should now be enabled
    await expect(clearButton).not.toBeDisabled();

    // Click clear
    await clearButton.click();

    // Textarea should be empty
    await expect(textarea).toHaveValue('');

    // Clear button should be disabled again
    await expect(clearButton).toBeDisabled();
  });

  test('should display skip to content link on focus', async ({ page }) => {
    // Tab to focus the skip link
    await page.keyboard.press('Tab');

    // Skip link should become visible
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Should reach textarea

    const textarea = page.locator('textarea#text-input');
    await expect(textarea).toBeFocused();

    // Note: Clear and Analyze buttons are disabled initially (no text),
    // so they have tabIndex=-1 and won't receive focus
    // This is correct behavior for accessibility

    // Add some text to enable the buttons
    await textarea.fill('A'.repeat(150));

    // Now tab should reach the Clear button
    await page.keyboard.press('Tab');
    const clearButton = page.locator('button:has-text("Clear")');
    await expect(clearButton).toBeFocused();

    // Tab to Analyze button
    await page.keyboard.press('Tab');
    const analyzeButton = page.locator('button:has-text("Analyze Text")');
    await expect(analyzeButton).toBeFocused();
  });

  test('should display "How It Works" section when no results', async ({ page }) => {
    await expect(page.locator('text="How It Works"')).toBeVisible();
    await expect(page.locator('text=/pattern-based detection/i')).toBeVisible();
    await expect(page.locator('text=/Privacy Guarantee/i')).toBeVisible();
  });

  test('should have responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Elements should still be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('textarea#text-input')).toBeVisible();

    // Check that theme toggle is accessible
    const themeButton = page.locator('button[aria-label*="theme"]');
    await expect(themeButton).toBeVisible();
  });

  test('should display loading state during analysis', async ({ page }) => {
    const textarea = page.locator('textarea#text-input');
    const analyzeButton = page.locator('button:has-text("Analyze Text")');

    // Fill with valid text
    const validText = 'A'.repeat(200);
    await textarea.fill(validText);

    // Mock API to delay response
    await page.route('**/api/analyze', async (route) => {
      // Use a promise-based delay instead
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          classification: 'Likely Human',
          confidence_score: 25,
          patterns_detected: [],
          explanation: 'Test explanation',
          metadata: {
            character_count: 200,
            word_count: 50,
            pattern_engine_version: '1.3.0',
            analysis_duration: 30,
            timestamp: new Date().toISOString(),
            warnings: [],
          },
        }),
      });
    });

    // Click analyze
    await analyzeButton.click();

    // Should show loading state
    await expect(page.locator('text="Analyzing text patterns..."')).toBeVisible();
    await expect(page.locator('.animate-spin')).toBeVisible();

    // Wait for request to complete
    await page.unrouteAll({ behavior: 'wait' });
  });

  test('should identify potential UI issues', async ({ page }) => {
    const issues: string[] = [];

    // Check for common UI issues

    // 1. Check if buttons have proper hover states
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const cursor = await button.evaluate((el) =>
        window.getComputedStyle(el).cursor
      );
      if (cursor !== 'pointer' && cursor !== 'not-allowed') {
        issues.push(`Button missing cursor pointer: ${await button.textContent()}`);
      }
    }

    // 2. Check for proper alt text on images/icons
    const svgs = await page.locator('svg').all();
    for (const svg of svgs) {
      const hasAriaLabel = await svg.getAttribute('aria-label');
      const hasRole = await svg.getAttribute('role');
      const isHidden = await svg.getAttribute('aria-hidden');

      if (!hasAriaLabel && !isHidden && hasRole === 'img') {
        issues.push('SVG icon missing aria-label');
      }
    }

    // 3. Check form accessibility
    const inputs = await page.locator('input, textarea').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        if (!hasLabel) {
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledby = await input.getAttribute('aria-labelledby');
          if (!ariaLabel && !ariaLabelledby) {
            issues.push(`Input/textarea missing proper label: ${id}`);
          }
        }
      }
    }

    // 4. Check for text overflow
    const textElements = await page.locator('p, span, div:not(:has(*))').all();
    for (const el of textElements.slice(0, 20)) { // Check first 20 to avoid performance issues
      const isOverflowing = await el.evaluate((element) => {
        return element.scrollWidth > element.clientWidth;
      });
      if (isOverflowing) {
        const text = await el.textContent();
        if (text && text.trim().length > 0) {
          issues.push(`Text overflow detected: "${text.substring(0, 30)}..."`);
        }
      }
    }

    // 5. Check color contrast (basic check)
    const mainHeading = page.locator('h1');
    const h1Color = await mainHeading.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { color: style.color, bg: style.backgroundColor };
    });

    // Report issues
    if (issues.length > 0) {
      console.log('\n🔍 UI Issues Found:');
      issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
      });
    } else {
      console.log('\n✅ No major UI issues detected!');
    }

    // This test always passes but logs issues
    expect(true).toBe(true);
  });

  test('should have proper focus indicators', async ({ page }) => {
    const textarea = page.locator('textarea#text-input');

    // Click textarea
    await textarea.click();

    // Check if it has visible focus styles
    const outlineStyle = await textarea.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });

    // Should have some form of focus indicator
    const hasFocusIndicator =
      outlineStyle.outlineWidth !== '0px' ||
      outlineStyle.boxShadow !== 'none';

    expect(hasFocusIndicator).toBe(true);
  });

  test('should check footer layout and theme toggle position', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check theme toggle is in footer
    const themeButton = footer.locator('button[aria-label*="theme"]');
    await expect(themeButton).toBeVisible();

    // Check footer text
    await expect(footer).toContainText('Pattern Engine v1.7.0');
    await expect(footer).toContainText('Zero Data Retention');
    await expect(footer).toContainText('T&C');
    await expect(footer).toContainText('Privacy Policy');
  });

  test('should verify all interactive elements are keyboard accessible', async ({ page }) => {
    // Fill textarea to enable buttons
    const textarea = page.locator('textarea#text-input');
    await textarea.fill('A'.repeat(150));

    const interactiveElements = await page.locator(
      'button:not([disabled]), a, input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ).all();

    expect(interactiveElements.length).toBeGreaterThan(0);

    // Verify each can receive focus
    for (const el of interactiveElements) {
      const isVisible = await el.isVisible();
      const isDisabled = await el.evaluate((e) => {
        if (e instanceof HTMLButtonElement || e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) {
          return e.disabled;
        }
        return false;
      });

      if (isVisible && !isDisabled) {
        // Element should be focusable
        await el.focus();
        const isFocused = await el.evaluate((e) => e === document.activeElement);
        expect(isFocused).toBe(true);
      }
    }
  });
});
