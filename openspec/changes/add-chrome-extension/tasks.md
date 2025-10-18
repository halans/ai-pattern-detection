# Implementation Tasks: Chrome Extension Sidebar

## 1. Project Structure
- [x] 1.1 Scaffold `browser-extension/` with manifest, src, public assets, and build tooling (Vite or rollup).
- [x] 1.2 Add icons (16/32/48/128) and extension branding consistent with Slop Detector styling.
- [x] 1.3 Set up npm scripts for `dev`, `build`, and `lint` within the extension workspace.

## 2. Core Functionality
- [x] 2.1 Implement the service worker/background script that handles side panel opening and API requests.
- [x] 2.2 Inject a content script to capture page text or highlighted selection; enforce 100-character minimum.
- [x] 2.3 Build the side panel UI (React or vanilla) that displays analyzer JSON results in a human-readable format (similar to the web app), loading states, and errors.
- [x] 2.4 Wire the UI to call the existing backend `/api/analyze` endpoint (online at https://api.slopdetector.me) with the captured text.

## 3. Permissions & Manifest
- [x] 3.1 Configure Manifest V3 with `side_panel`, `activeTab`, `scripting`, and necessary host permissions.
- [x] 3.2 Ensure CSP complies with Vite output and Chrome policies (no inline scripts; use generated JS files).

## 4. Testing & QA
- [ ] 4.1 Manual test in Chrome (developer mode) on multiple sites for selection and full-page analysis.
- [ ] 4.2 Add unit/integration tests for business logic where feasible; document manual QA steps.
- [ ] 4.3 Verify error handling when the backend is unreachable or returns validation errors.

## 5. Documentation
- [x] 5.1 Create README/setup instructions for loading the extension in Chrome and running local dev builds.
- [x] 5.2 Document API usage specifics (rate limits, selection requirements) and troubleshooting tips.
