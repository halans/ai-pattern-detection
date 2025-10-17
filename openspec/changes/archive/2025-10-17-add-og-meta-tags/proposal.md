# Change Proposal: Add Open Graph Metadata

## Why
- Social sharing previews currently lack branded imagery and descriptive metadata, resulting in low engagement.
- Marketing requested a dedicated `slopdetector_og.jpg` preview asset to improve link sharing on platforms such as X, Facebook, and LinkedIn.
- We need consistent SEO/Open Graph tags across the application shell.

## What Changes
- Inject Open Graph meta tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:image:alt`) into the HTML head.
- Reference the new branded asset `slopdetector_og.jpg` (served from the frontend public directory).
- Ensure sensible fallbacks for missing env vars and apply the same metadata to dark/light themes.

## Impact
- Frontend HTML template update (`index.html` via Vite).
- Add asset(s) to the public/static folder.
- Possible tweak to documentation explaining the OG metadata and preview image.
