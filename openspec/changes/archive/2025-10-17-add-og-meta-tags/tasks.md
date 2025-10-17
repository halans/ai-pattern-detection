# Implementation Tasks: Add Open Graph Metadata

## 1. Asset & Setup
- [x] 1.1 Place `slopdetector_og.jpg` (1200x630 recommended) in the frontend public/static directory.
- [x] 1.2 Confirm the asset path resolves correctly in local and production builds.

## 2. HTML Metadata
- [x] 2.1 Update `frontend/index.html` to include Open Graph meta tags for title, description, type, url, image, and image alt text.
- [x] 2.2 Ensure meta tags work with existing title/description values and add sensible defaults if environment variables are missing.

## 3. Verification
- [x] 3.1 Run the build locally (`npm run build`) and inspect the output HTML for the new tags.
- [x] 3.2 Document the OG metadata in README or deployment notes for future reference (asset path, update process).
