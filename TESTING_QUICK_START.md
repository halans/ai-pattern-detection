# Testing Quick Start

## Running Tests

### From Root Directory
```bash
# Backend tests
cd backend
npm test

# Frontend unit tests
cd frontend
npm test

# Frontend e2e tests (Playwright)
cd frontend
npm run test:e2e
```

### If You're Already in Frontend Directory
```bash
# Run all e2e tests
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui

# View last test report
npm run test:e2e:report

# Update visual regression snapshots
npm run test:e2e -- --update-snapshots
```

---

## Common Issues

### Error: "Missing script: test:e2e"
**Problem**: You're trying to run the command from the wrong directory (root instead of frontend)

**Solution**:
```bash
cd frontend
npm run test:e2e
```

### Visual Regression Tests Fail
**Problem**: Baseline snapshots don't exist or UI changed

**Solution**:
```bash
cd frontend
npm run test:e2e -- --update-snapshots
```

### Tests Timeout
**Problem**: Backend or frontend not running

**Solution**: Playwright auto-starts the dev server. Just make sure the backend is running:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Run tests
cd frontend
npm run test:e2e
```

---

## Test Results

✅ **22/22 tests passing**
- 15 functional UI tests
- 7 visual regression tests

**Execution Time**: ~3-5 seconds

---

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm test                       # Unit tests

# E2E Testing (from frontend/)
npm run test:e2e              # Run all e2e tests
npm run test:e2e:ui           # Interactive mode
npm run test:e2e:report       # View HTML report

# Debugging
npx playwright test --debug   # Debug mode
npx playwright test --headed  # See browser
npx playwright test --ui      # Interactive UI mode

# Specific tests
npx playwright test ui-audit.spec.ts
npx playwright test -g "should toggle theme"
```

---

## Documentation

- **[Frontend README](frontend/README.md)** - Frontend setup and development
- **[Playwright Guide](frontend/PLAYWRIGHT_GUIDE.md)** - Detailed testing guide
- **[UI Improvements](frontend/UI_IMPROVEMENTS.md)** - Summary of fixes

---

**Pro Tip**: Use `npm run test:e2e:ui` for the best development experience. It shows you exactly what's happening in real-time!
