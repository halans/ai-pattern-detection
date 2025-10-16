# Implementation Tasks: Add Theme Toggle

## 1. Design & State Management
- [x] 1.1 Decide where theme state lives (React context or top-level App state).
- [x] 1.2 Implement persistence (localStorage) and initialization respect system preference.

## 2. UI Implementation
- [x] 2.1 Add accessible toggle button in the footer with clear label/tooltips.
- [x] 2.2 Ensure button works with keyboard and screen readers (aria-pressed, focus styles).
- [x] 2.3 Update colors to ensure both themes use new palette with proper contrast.

## 3. Integration & Testing
- [x] 3.1 Propagate theme class to root element so Tailwind dark mode responds.
- [ ] 3.2 Add unit/integration tests verifying persistence and toggle behavior.
- [ ] 3.3 Run manual accessibility and contrast checks in both themes.
