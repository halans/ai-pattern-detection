# Playwright Testing Guide

Quick reference for running and writing Playwright tests for the Slop Detector.

---

## Running Tests

**Important**: All commands must be run from the `frontend/` directory.

```bash
cd frontend  # Make sure you're in the frontend directory!
```

### Basic Commands
```bash
# Run all e2e tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# View last test report
npm run test:e2e:report

# Run specific test file
npx playwright test ui-audit.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run in debug mode with Playwright Inspector
npx playwright test --debug

# Run specific test by name
npx playwright test -g "should toggle between light and dark themes"
```

### Visual Regression Tests
```bash
# Run visual tests and update snapshots
npx playwright test visual-regression.spec.ts --update-snapshots

# Run visual tests only
npx playwright test visual-regression.spec.ts

# View visual diff in report
npx playwright show-report
```

---

## Test Structure

### Test Files Location
```
frontend/
├── tests/
│   └── e2e/
│       ├── ui-audit.spec.ts         # Functional UI tests
│       └── visual-regression.spec.ts # Screenshot comparison tests
├── playwright.config.ts              # Playwright configuration
└── playwright-report/                # HTML reports (generated)
```

### Configuration (`playwright.config.ts`)
- **Base URL**: http://localhost:3000
- **Browser**: Chromium (Desktop Chrome)
- **Auto-start**: Dev server starts automatically
- **Retries**: 2 in CI, 0 locally
- **Screenshots**: On failure only
- **Traces**: On first retry

---

## Writing Tests

### Basic Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.locator('button:has-text("Click Me")');

    // Act
    await button.click();

    // Assert
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

### Common Selectors
```typescript
// By text content
page.locator('text="Analyze Text"')
page.locator('button:has-text("Clear")')

// By role and name
page.getByRole('button', { name: 'Analyze text' })
page.getByRole('textbox', { name: 'Enter text to analyze' })

// By test ID (recommended for dynamic content)
page.locator('[data-testid="results"]')

// By CSS selector
page.locator('textarea#text-input')
page.locator('.bg-primary')

// By ARIA label
page.locator('button[aria-label="Clear text"]')
```

### Common Assertions
```typescript
// Visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// State
await expect(button).toBeEnabled()
await expect(button).toBeDisabled()
await expect(checkbox).toBeChecked()

// Focus
await expect(element).toBeFocused()

// Text content
await expect(element).toContainText('Hello')
await expect(element).toHaveText('Exact text')

// Attributes
await expect(element).toHaveAttribute('aria-label', 'Clear text')
await expect(element).toHaveClass(/bg-primary/)

// Screenshots
await expect(page).toHaveScreenshot('homepage.png')
await expect(element).toHaveScreenshot('button.png')
```

### Testing Theme Toggle
```typescript
test('should toggle theme', async ({ page }) => {
  const html = page.locator('html');

  // Check initial state
  const hasDark = await html.evaluate((el) => el.classList.contains('dark'));

  // Toggle theme
  await page.locator('button[aria-label*="theme"]').click();
  await page.waitForTimeout(300); // Wait for transition

  // Verify change
  const newHasDark = await html.evaluate((el) => el.classList.contains('dark'));
  expect(newHasDark).not.toBe(hasDark);
});
```

### Mocking API Responses
```typescript
test('should handle API response', async ({ page }) => {
  // Mock the API
  await page.route('**/api/analyze', async (route) => {
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

  // Trigger API call
  await page.locator('textarea').fill('A'.repeat(200));
  await page.locator('button:has-text("Analyze Text")').click();

  // Verify UI shows response
  await expect(page.locator('text="Analysis Results"')).toBeVisible();

  // Clean up
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});
```

### Testing Keyboard Navigation
```typescript
test('should navigate with keyboard', async ({ page }) => {
  // Tab through elements
  await page.keyboard.press('Tab'); // Skip link
  await page.keyboard.press('Tab'); // Textarea

  const textarea = page.locator('textarea#text-input');
  await expect(textarea).toBeFocused();

  // Fill text to enable buttons
  await textarea.fill('A'.repeat(150));

  // Continue tabbing
  await page.keyboard.press('Tab'); // Clear button
  await page.keyboard.press('Tab'); // Analyze button

  const analyzeButton = page.locator('button:has-text("Analyze Text")');
  await expect(analyzeButton).toBeFocused();
});
```

### Testing Responsive Design
```typescript
test('should work on mobile', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  // Test mobile layout
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('textarea')).toBeVisible();

  // Take screenshot
  await expect(page).toHaveScreenshot('mobile-view.png');
});
```

---

## Debugging

### Visual Debugging
```bash
# Run with browser visible
npx playwright test --headed

# Run with slow motion (helps see what's happening)
npx playwright test --headed --slow-mo=1000

# Debug specific test
npx playwright test --debug -g "should toggle theme"
```

### Playwright Inspector
When running with `--debug`:
- **Pause**: Click pause icon or add `await page.pause()` in code
- **Step**: Execute commands one at a time
- **Pick Selector**: Click target icon to select elements
- **Console**: Run commands in the console
- **Screenshot**: Take screenshot at current state

### Adding Debug Breakpoints
```typescript
test('should debug issue', async ({ page }) => {
  await page.goto('/');

  // Pause execution here
  await page.pause();

  // Test continues after you resume in Inspector
  await page.click('button');
});
```

### Console Logging
```typescript
// Log element properties
const text = await element.textContent();
console.log('Element text:', text);

// Log page state
const title = await page.title();
console.log('Page title:', title);

// Log custom messages
console.log('About to click button...');
```

---

## Best Practices

### 1. Use Data Test IDs for Dynamic Content
```typescript
// In component:
<div data-testid="result-card">...</div>

// In test:
await page.locator('[data-testid="result-card"]').click()
```

### 2. Wait for Elements Properly
```typescript
// Good - Playwright auto-waits
await page.click('button')
await expect(element).toBeVisible()

// Avoid - Manual waits
await page.waitForTimeout(1000) // Only use for transitions/animations
```

### 3. Use Page Object Model for Complex Pages
```typescript
// pages/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}

  async analyze(text: string) {
    await this.page.locator('textarea').fill(text);
    await this.page.locator('button:has-text("Analyze")').click();
  }

  async getResult() {
    return await this.page.locator('.result').textContent();
  }
}

// In test:
const homePage = new HomePage(page);
await homePage.analyze('test text');
const result = await homePage.getResult();
```

### 4. Clean Up After Tests
```typescript
test.afterEach(async ({ page }) => {
  // Clear routes
  await page.unrouteAll({ behavior: 'ignoreErrors' });

  // Clear localStorage
  await page.evaluate(() => localStorage.clear());
});
```

### 5. Parallelize Tests
```typescript
// In playwright.config.ts
workers: process.env.CI ? 1 : undefined, // All workers locally

// Make tests independent
test.describe.configure({ mode: 'parallel' });
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run e2e tests
        run: npm run test:e2e

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## Troubleshooting

### Issue: "Error: Timeout 30000ms exceeded"
**Solution**: Element might not be visible or selector is wrong
```typescript
// Check if element exists
const count = await page.locator('button').count();
console.log('Button count:', count);

// Use more specific selector
await page.locator('button:has-text("Analyze Text"):visible').click();
```

### Issue: "Error: strict mode violation"
**Solution**: Multiple elements match the selector
```typescript
// Bad - multiple matches
await page.locator('button').click()

// Good - specific selector
await page.locator('button:has-text("Analyze Text")').first().click()
await page.locator('button[aria-label="Clear text"]').click()
```

### Issue: Tests pass locally but fail in CI
**Solution**: Increase timeout or add explicit waits
```typescript
// In playwright.config.ts
timeout: 60000, // Increase global timeout

// Or in specific test
test('slow test', async ({ page }) => {
  test.setTimeout(120000);
  // ...
});
```

### Issue: Screenshot comparison fails
**Solution**: Update snapshots or increase threshold
```typescript
// Update snapshots
// npx playwright test --update-snapshots

// Or increase diff tolerance
await expect(page).toHaveScreenshot('home.png', {
  maxDiffPixels: 100,
  threshold: 0.2,
});
```

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

## Quick Tips

1. **Use `--ui` mode** for interactive test development
2. **Add `.only`** to run single test: `test.only('my test', ...)`
3. **Skip tests** temporarily: `test.skip('broken test', ...)`
4. **Group related tests**: Use `test.describe()` blocks
5. **Use soft assertions** to continue after failures: `await expect.soft()`
6. **Generate tests** from user actions: `npx playwright codegen localhost:3000`
7. **Trace viewer**: `npx playwright show-trace trace.zip`

---

**Happy Testing! 🎭**
