# Change Proposal: Chrome Extension for Slop Detector

## Why
- Users want to analyze live webpages without copying content into the web app.
- A browser-native integration streamlines the workflow for journalists, editors, and reviewers.
- Providing a Chrome extension opens new discovery channels and reuse of the existing backend API.

## What Changes
- Build a Chrome extension (Manifest V3) that can capture either the entire page text or a user-highlighted selection (enforcing the 100-character minimum already used by the analyzer).
- Add a sidebar (Chrome `sidePanel`) UI that submits text to the existing backend `/api/analyze` endpoint and renders the JSON results in a human-readable format (similar to the web app).
- Provide fallback messaging for short selections and loading/error states.
- Package extension assets (icon, manifest, background/service worker, content scripts, panel HTML/React bundle) within a new `browser-extension/` directory.

## Impact
- Frontend addition (extension UI built with React/Vite or lightweight vanilla approach).
- No backend changes (reuse existing API).
- Documentation updates covering installation, permissions, and development workflow.
- Work with Chrome permission requirements (activeTab, sidePanel) and ensure content script complies with CSP.
